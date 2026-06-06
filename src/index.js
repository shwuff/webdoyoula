import { createRoot } from 'react-dom/client';
import App from './app/App';
import {WebSocketProvider} from "./app/providers/WebSocketContext";
import {AuthProvider} from "./app/providers/UserContext";
import {BrowserRouter as Router} from "react-router-dom";
import './i18n';
import { Provider } from 'react-redux';
import store from './app/store/store';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import theme from './app/config/theme';
import {OnboardingProvider} from "./app/providers/onboardingStore";
import { CustomThemeProvider } from "./app/providers/ThemeContext";
import ThemeTransition from './components/theme/ThemeTransition';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <AuthProvider>
        <OnboardingProvider>
            <Provider store={store}>
                <WebSocketProvider>
                    <CustomThemeProvider>
                        <Router>
                            <MUIThemeProvider theme={theme}>
                                <CssBaseline />
                                <ThemeTransition>
                                    <App />
                                </ThemeTransition>
                            </MUIThemeProvider>
                        </Router>
                    </CustomThemeProvider>
                </WebSocketProvider>
            </Provider>
        </OnboardingProvider>
    </AuthProvider>
);