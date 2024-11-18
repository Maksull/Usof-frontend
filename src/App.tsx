import { Footer, Header } from "./components"
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";

function App() {

    const user = {
        name: "John Doe",
        role: "Admin",
        avatarUrl: "/path/to/avatar.jpg"
    };

    const handleLogout = () => {
        // Implement logout logic
        console.log("Logging out");
    };

    const handleLogin = () => {
        // Implement login logic
        console.log("Opening login modal");
    };

    return (
        <LanguageProvider>
            <ThemeProvider>
                <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
                    <Header
                        currentUser={user}
                        onLogout={handleLogout}
                        onLogin={handleLogin}
                    />
                    <main className="flex-grow">
                        {/* Your content */}
                    </main>
                    <Footer />
                </div>
            </ThemeProvider>
        </LanguageProvider>
    )
}

export default App
