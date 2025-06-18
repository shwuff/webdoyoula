import { createRoot } from 'react-dom/client';
import App from './App';
import {WebSocketProvider} from "./context/WebSocketContext";
import {AuthProvider} from "./context/UserContext";
import {BrowserRouter as Router} from "react-router-dom";
import './i18n';
import { Provider } from 'react-redux';
import store from './redux/store';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <Provider store={store}>
            <WebSocketProvider>
                <Router>
                    <ThemeProvider theme={theme}>
                        <CssBaseline />
                        <App />
                    </ThemeProvider>
                </Router>
            </WebSocketProvider>
        </Provider>
    </AuthProvider>
);