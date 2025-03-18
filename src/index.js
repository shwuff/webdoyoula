import { createRoot } from 'react-dom/client';
import App from './App';
import {WebSocketProvider} from "./context/WebSocketContext";
import {AuthProvider} from "./context/UserContext";
import {BrowserRouter as Router} from "react-router-dom";

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <WebSocketProvider>
            <Router>
                <App />
            </Router>
        </WebSocketProvider>
    </AuthProvider>
);