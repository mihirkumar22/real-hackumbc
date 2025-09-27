import React from 'react'
import ReactDOM from 'react-dom/client'
import { StrictMode } from 'react'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { UserProvider } from './contexts/UserContext'
import 'bootstrap/dist/css/bootstrap.min.css';
import { PostingsProvider } from './contexts/PostingsContext'
import { NotificationProvider } from './contexts/NotificationContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
        <AuthProvider>
            <UserProvider>
                <NotificationProvider>
                    <PostingsProvider>
                        <App />
                    </PostingsProvider>
                </NotificationProvider>
            </UserProvider>
        </AuthProvider>
    </StrictMode>
)
