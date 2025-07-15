import React, { useRef, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { Task } from '../app/store/taskSlice';
import { sendMessage } from '../app/store/llmSlice';
import { addTask } from '../app/store/taskSlice';

interface ChatInterfaceProps {
    onClose: () => void;
}

interface LLMSuggestion {
    action: string;
    parameters: {
        title: string;
        description?: string;
        due_date?: string;
        [key: string]: any;
    };
}

interface LLMResponse {
    response: string;
    suggested_actions?: LLMSuggestion[];
    error?: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
    const [message, setMessage] = React.useState('');
    const [rejectedIndexes, setRejectedIndexes] = React.useState<number[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasks.items);
    const { isLoading, lastResponse: response, error, messages } = useSelector((state: RootState) => state.llm);
    const scrollViewRef = useRef<ScrollView>(null);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isLoading]);

    const handleSend = async () => {
        if (!message.trim()) return;
        
        const context = {
            current_tasks: tasks.map((task: Task) => ({
                title: task.title,
                description: task.description,
                due_date: task.scheduledDate,
                completed: task.completed
            }))
        };

        dispatch(sendMessage({ message, context }));
        setMessage('');
        setRejectedIndexes([]); // Reset rejected suggestions on new message
    };

    const handleAcceptSuggestion = (suggestion: LLMSuggestion) => {
        const { title, description = '', due_date } = suggestion.parameters;
        let startDate = due_date ? new Date(due_date) : new Date();
        let endDate = due_date ? new Date(new Date(due_date).getTime() + 60 * 60 * 1000) : new Date(Date.now() + 60 * 60 * 1000);
        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const taskPayload = {
            title: title || 'Untitled Task',
            description,
            startDate,
            endDate
        };
        console.log('Accepting suggestion:', suggestion, 'Task payload:', taskPayload);
        dispatch(addTask(taskPayload));
        // Hide suggestions after accept
        setRejectedIndexes(Array.from({ length: 100 }, (_, i) => i));
    };

    const handleRejectSuggestion = (index: number) => {
        setRejectedIndexes(prev => [...prev, index]);
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <Text style={styles.title}>Chat with Velo</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 8, paddingBottom: 16 }}
                keyboardShouldPersistTaps="handled"
            >
                {messages.map((msg, idx) => (
                    <View key={msg.id} style={{
                        flexDirection: 'row',
                        justifyContent: msg.response ? 'flex-start' : 'flex-end',
                        marginBottom: 8,
                    }}>
                        <View style={{
                            backgroundColor: msg.response ? '#f0f0f0' : '#2196F3',
                            borderRadius: 12,
                            padding: 10,
                            maxWidth: '80%',
                        }}>
                            <Text style={{ color: msg.response ? '#000' : '#fff' }}>
                                {msg.response ? (typeof msg.response.response === 'string' ? msg.response.response : '[No response text]') : msg.message}
                            </Text>
                            {msg.response && idx === messages.length - 1 && msg.response.suggested_actions && msg.response.suggested_actions.length > 0 && (
                                msg.response.suggested_actions.map((suggestion, index) => (
                                    rejectedIndexes.includes(index) ? null : (
                                        <View key={index} style={styles.suggestionContainer}>
                                            <Text style={styles.suggestionText}>
                                                {suggestion.action}: {suggestion.parameters.title}
                                            </Text>
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity 
                                                    style={styles.acceptButton}
                                                    onPress={() => handleAcceptSuggestion(suggestion)}
                                                >
                                                    <Text style={styles.acceptButtonText}>Accept</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    style={styles.rejectButton}
                                                    onPress={() => handleRejectSuggestion(index)}
                                                >
                                                    <Text style={styles.rejectButtonText}>Reject</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                ))
                            )}
                        </View>
                    </View>
                ))}
                {isLoading && (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 8 }} />
                )}
            </ScrollView>

            <View style={{ flexDirection: 'row', alignItems: 'flex-end', padding: 8 }}>
                <TextInput
                    style={[styles.input, { marginRight: 8 }]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Ask Velo to help with your tasks..."
                    multiline
                />
                <TouchableOpacity 
                    style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
                    onPress={handleSend}
                    disabled={!message.trim() || isLoading}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
    },
    suggestionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    suggestionText: {
        flex: 1,
        fontSize: 14,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    acceptButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    rejectButton: {
        backgroundColor: '#f44336',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    rejectButtonText: {
        color: '#fff',
        fontSize: 14,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#2196F3',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 8,
    },
    sendButtonDisabled: {
        backgroundColor: '#ccc',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
}); 