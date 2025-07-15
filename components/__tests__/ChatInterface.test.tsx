import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { ChatInterface } from '../ChatInterface';

const mockStore = configureStore([thunk]);

describe('ChatInterface', () => {
    let store;
    const mockOnClose = jest.fn();

    beforeEach(() => {
        store = mockStore({
            llm: {
                isLoading: false,
                error: null,
                lastResponse: null,
                chatHistory: []
            }
        });
    });

    it('renders correctly', () => {
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <ChatInterface onClose={mockOnClose} />
            </Provider>
        );

        expect(getByPlaceholderText('Ask Velo to help with your tasks...')).toBeTruthy();
        expect(getByText('Send')).toBeTruthy();
    });

    it('handles message input', () => {
        const { getByPlaceholderText } = render(
            <Provider store={store}>
                <ChatInterface onClose={mockOnClose} />
            </Provider>
        );

        const input = getByPlaceholderText('Ask Velo to help with your tasks...');
        fireEvent.changeText(input, 'Schedule a meeting tomorrow');
        expect(input.props.value).toBe('Schedule a meeting tomorrow');
    });

    it('shows loading state', () => {
        store = mockStore({
            llm: {
                isLoading: true,
                error: null,
                lastResponse: null,
                chatHistory: []
            }
        });

        const { getByTestId } = render(
            <Provider store={store}>
                <ChatInterface onClose={mockOnClose} />
            </Provider>
        );

        expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('displays error message', () => {
        store = mockStore({
            llm: {
                isLoading: false,
                error: 'Failed to connect',
                lastResponse: null,
                chatHistory: []
            }
        });

        const { getByText } = render(
            <Provider store={store}>
                <ChatInterface onClose={mockOnClose} />
            </Provider>
        );

        expect(getByText('Failed to connect')).toBeTruthy();
    });

    it('displays suggestions and handles acceptance', async () => {
        store = mockStore({
            llm: {
                isLoading: false,
                error: null,
                lastResponse: {
                    response: "I'll help you schedule that.",
                    suggested_actions: [{
                        action: 'create_task',
                        parameters: {
                            title: 'Meeting',
                            due_date: '2024-03-21T14:00:00'
                        }
                    }]
                },
                chatHistory: []
            }
        });

        const { getByText } = render(
            <Provider store={store}>
                <ChatInterface onClose={mockOnClose} />
            </Provider>
        );

        expect(getByText("I'll help you schedule that.")).toBeTruthy();
        
        const acceptButton = getByText('Accept');
        fireEvent.press(acceptButton);

        // Verify that the correct action was dispatched
        const actions = store.getActions();
        expect(actions).toContainEqual(
            expect.objectContaining({
                type: 'tasks/createTask'
            })
        );
    });

    it('handles message sending', async () => {
        const { getByPlaceholderText, getByText } = render(
            <Provider store={store}>
                <ChatInterface onClose={mockOnClose} />
            </Provider>
        );

        const input = getByPlaceholderText('Ask Velo to help with your tasks...');
        const sendButton = getByText('Send');

        fireEvent.changeText(input, 'Schedule a meeting tomorrow');
        fireEvent.press(sendButton);

        // Verify that the sendMessage action was dispatched
        const actions = store.getActions();
        expect(actions).toContainEqual(
            expect.objectContaining({
                type: 'llm/sendMessage/pending'
            })
        );
    });
}); 