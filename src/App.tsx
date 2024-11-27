import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User } from './models/User';
import {
    ChangeEmailPage,
    ChangePasswordPage,
    CreatePostPage,
    Footer,
    Header,
    LoginPage,
    MainPage,
    PostPage,
    ProfilePage,
    NotificationModal
} from './components';
import { AuthService, UsersService } from './services';
import { mapDtoToUser } from './utils/mapping';
import { Loader2 } from 'lucide-react';
import { UserComments } from './components/Profile/UserComments';
import { UserPosts } from './components/Profile/UserPosts';

const LoadingSpinner = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin" />
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                Loading...
            </p>
        </div>
    </div>
);

const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

function App() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showNotification, setShowNotification] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            if (AuthService.isAuthenticated()) {
                try {
                    const userProfile = mapDtoToUser(await UsersService.getUserProfile());
                    setUser(userProfile);
                } catch (error) {
                    console.error('Failed to fetch user profile:', error);
                    await handleLogout();
                    setError('Session expired. Please login again.');
                    setShowNotification(true);
                }
            }
            setIsLoading(false);
            setIsInitialized(true);
        };

        initializeAuth();
    }, []);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const userProfile = mapDtoToUser(await UsersService.getUserProfile());
            setUser(userProfile);
        } catch (error) {
            console.error('Failed to fetch user profile after login:', error);
            setUser(null);
            setError('Failed to load user profile. Please try again.');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            await AuthService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
            setError('Failed to logout. Please try again.');
            setShowNotification(true);
        } finally {
            setIsLoading(false);
        }
    };

    // Show loading spinner while checking authentication
    if (!isInitialized) {
        return <LoadingSpinner />;
    }

    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
                <Header
                    currentUser={user}
                    onLogout={handleLogout}
                    onLogin={() => window.location.href = '/login'}
                />
                <main className="flex-grow relative">
                    {isLoading && <LoadingSpinner />}
                    <div className="container mx-auto px-4 py-6">
                        <Routes>
                            <Route
                                path="/login"
                                element={user ? <Navigate to="/" replace /> : <LoginPage onLogin={handleLogin} />}
                            />
                            <Route path="/" element={<MainPage />} />
                            <Route
                                path="/profile"
                                element={user ? <ProfilePage user={user} onUserUpdate={setUser} /> : <Navigate to="/login" replace />}
                            />
                            <Route
                                path="/create-post"
                                element={user ? <CreatePostPage /> : <Navigate to="/login" replace />}
                            />
                            <Route path="/post/:id" element={<PostPage />} />
                            <Route
                                path="/my-comments"
                                element={user ? <UserComments user={user} /> : <Navigate to="/login" replace />}
                            />
                            <Route
                                path="/my-posts"
                                element={user ? <UserPosts user={user} /> : <Navigate to="/login" replace />}
                            />
                            <Route path="/reset-password/:token" element={<ChangePasswordPage />} />
                            <Route path="/change-email/:token" element={<ChangeEmailPage />} />
                            {!user && <Route path="*" element={<Navigate to="/login" replace />} />}
                        </Routes>
                    </div>
                </main>
                <Footer />
                <NotificationModal
                    isOpen={showNotification}
                    onClose={() => setShowNotification(false)}
                    status="error"
                    message={error || ''}
                />
            </div>
        </Router>
    );
}

export default App;