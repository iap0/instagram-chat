import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        axios.get('https://97c8-2409-40c1-1c-1947-b52c-8ed4-728f-1491.ngrok-free.app/conversations')
            .then(response => setConversations(response.data))
            .catch(error => console.error('Error fetching conversations:', error));
    }, []);

    const loadMessages = (id) => {
        axios.get(`https://97c8-2409-40c1-1c-1947-b52c-8ed4-728f-1491.ngrok-free.app/messages/${id}`)
            .then(response => {
                setMessages(response.data.reverse());  // No reverse() → Oldest to Newest order
                setSelectedConversation(id);
            })
            .catch(error => console.error('Error fetching messages:', error));
    };

    useEffect(() => {
        // Scroll to the latest message (bottom of chat) when messages update
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    return (
        <div className="chat-app">
            <div className="sidebar">
                <h3>Conversations</h3>
                {conversations.map((chat) => (
                    <div key={chat.id} className="chat-item" onClick={() => loadMessages(chat.id)}>
                        {chat.participants}
                    </div>
                ))}
            </div>

            <div className="chat-container">
                {selectedConversation !== null ? (
                    <>
                        <h2>Chat</h2>
                        <div className="messages">
                            {messages.map((msg, index) => (
                                <div key={index} className={`message ${msg.sender === 'avan.eesh' ? 'sent' : 'received'}`}>
                                    <div className="sender">{msg.sender}</div>
                                    <div className="content">{msg.text}</div>
                                    {msg.media && <a href={msg.media} target="_blank" rel="noopener noreferrer">[View Media]</a>}
                                    <div className="timestamp">{new Date(msg.timestamp).toLocaleString()}</div>
                                </div>
                            ))}
                            {/* Auto-scroll to bottom */}
                            <div ref={messagesEndRef}></div>
                        </div>
                    </>
                ) : (
                    <p>Select a conversation</p>
                )}
            </div>
        </div>
    );
}

export default App;
