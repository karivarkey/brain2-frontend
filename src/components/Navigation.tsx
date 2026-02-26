import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";

export default function Navigation() {
    const { user, signInWithGoogle } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 border-b z-50 backdrop-blur-md bg-white/80" style={{ borderColor: colors.border }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md" style={{ backgroundColor: colors.foreground }} />
                    <span className="font-semibold text-base sm:text-lg tracking-tight" style={{ color: colors.foreground }}>
                        Brain
                    </span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-2">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200"
                            style={{ backgroundColor: colors.foreground, color: colors.background }}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <button
                            onClick={() => signInWithGoogle()}
                            className="px-4 py-1.5 sm:px-6 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                            style={{ backgroundColor: colors.foreground, color: colors.background }}
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
