import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider, ThemeProvider } from "./contexts";
import { User } from './models/User';
import { ChangeEmailPage, ChangePasswordPage, Footer, Header, LoginPage, ProfilePage } from './components';
import { AuthService, UsersService } from './services';
import { mapDtoToUser } from './utils/mapping';

function App() {
    const [user, setUser] = React.useState<User | null>(null);

    useEffect(() => {
        const initializeUser = async () => {
            if (AuthService.isAuthenticated()) {
                try {
                    const userProfile = mapDtoToUser(await UsersService.getUserProfile());
                    setUser(userProfile);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    await AuthService.logout();
                    setUser(null);
                }
            }
        };

        initializeUser();
    }, []);

    const handleLogin = async (userData: { name: string; role: string; avatarUrl?: string }) => {
        try {
            const userProfile = mapDtoToUser(await UsersService.getUserProfile());
            setUser(userProfile);
        } catch (error) {
            console.error('Failed to fetch user profile after login:', error);
            setUser(null);
        }
    };

    const handleLogout = async () => {
        try {
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <LanguageProvider>
            <ThemeProvider>
                <Router>
                    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                        <Header
                            currentUser={user}
                            onLogout={handleLogout}
                            onLogin={() => window.location.href = '/login'}
                        />
                        <main className="flex-grow">
                            <Routes>
                                <Route
                                    path="/login"
                                    element={user ? <Navigate to="/" /> : <LoginPage onLogin={handleLogin} />}
                                />
                                <Route path="/" element={<div>Home Page</div>} />
                                <Route
                                    path="/profile"
                                    element={user ? (
                                        <ProfilePage
                                            user={user}
                                            onUserUpdate={setUser}
                                        />
                                    ) : (
                                        <Navigate to="/login" />
                                    )}
                                />
                                <Route path="/reset-password/:token" element={<ChangePasswordPage />} />
                                <Route path="/change-email/:token" element={<ChangeEmailPage />} />
                                {!user && <Route path="*" element={<Navigate to="/login" />} />}
                            </Routes>
                        </main>
                        <Footer />
                    </div>
                </Router>
            </ThemeProvider>
        </LanguageProvider>
    );
}

export default App;