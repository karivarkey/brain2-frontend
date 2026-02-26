import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";

import Navigation from "./components/Navigation";
import { AuthGuard } from "./components/AuthGuard";
import PageTransition from "./components/PageTransition";

import Landing from "./pages/Landing";
import Chat from "./pages/Chat";
import Memory from "./pages/Memory";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="min-h-screen font-sans antialiased text-black bg-white selection:bg-black/10">
      {/* Navigation is only shown on the Landing Page as requested */}
      {isLandingPage && <Navigation />}

      <main className={isLandingPage ? "pt-16 min-h-screen" : "min-h-screen"}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public route */}
            <Route path="/" element={<PageTransition><Landing /></PageTransition>} />

            {/* Guarded routes without the landing Navigation header */}
            <Route path="/chat" element={<AuthGuard><PageTransition><Chat /></PageTransition></AuthGuard>} />
            <Route path="/chat/:conv_id" element={<AuthGuard><PageTransition><Chat /></PageTransition></AuthGuard>} />
            <Route path="/memory" element={<AuthGuard><PageTransition><Memory /></PageTransition></AuthGuard>} />
            <Route path="/dashboard" element={<AuthGuard><PageTransition><Dashboard /></PageTransition></AuthGuard>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}
