import { createRoot } from 'react-dom/client';
import App from './App';
import {WebSocketProvider} from "./context/WebSocketContext";
import {AuthProvider} from "./context/UserContext";
import {BrowserRouter as Router} from "react-router-dom";
import './i18n';
import {ImageProvider} from "./context/ImageContext";

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <ImageProvider>
            <WebSocketProvider>
                <Router>
                    <App />
                </Router>
            </WebSocketProvider>
        </ImageProvider>
    </AuthProvider>
);