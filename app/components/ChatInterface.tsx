import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Task } from '../store/taskSlice';
import { sendMessage } from '../store/llmSlice';

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
    const dispatch = useDispatch();
    const tasks = useSelector((state: RootState) => state.tasks.tasks);
    const { isLoading, lastResponse: response, error } = useSelector((state: RootState) => state.llm);

    const handleSend = async () => {
        if (!message.trim()) return;
        
        const context = {
            current_tasks: tasks.map((task: Task) => ({
                title: task.title,
                description: task.description,
                due_date: task.dueDate,
                completed: task.completed
            }))
        };

        dispatch(sendMessage({ message, context }));
        setMessage('');
    };

    const handleAcceptSuggestion = (suggestion: any) => {
        // TODO: Implement suggestion handling in Phase 4.2
        console.log('Accepting suggestion:', suggestion);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chat with Velo</Text>
                <TouchableOpacity onPress={onClose}>
                    <Text style={styles.closeButton}>×</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.responseContainer}>
                {error && (
                    <Text style={styles.errorText}>{error}</Text>
                )}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : response ? (
                    <View>
                        <Text style={styles.responseText}>{response.response}</Text>
                        {response.suggested_actions?.map((suggestion, index) => (
                            <View key={index} style={styles.suggestionContainer}>
                                <Text style={styles.suggestionText}>
                                    {suggestion.action}: {suggestion.parameters.title}
                                </Text>
                                <TouchableOpacity 
                                    style={styles.acceptButton}
                                    onPress={() => handleAcceptSuggestion(suggestion)}
                                >
                                    <Text style={styles.acceptButtonText}>Accept</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                ) : null}
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
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
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
    },
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
    responseContainer: {
        flex: 1,
        marginBottom: 16,
    },
    responseText: {
        fontSize: 16,
        marginBottom: 12,
    },
    errorText: {
        color: '#f44336',
        fontSize: 16,
        marginBottom: 12,
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
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