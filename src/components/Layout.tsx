import type { ReactNode } from "react";
import Navigation from "./Navigation";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen font-sans antialiased text-black bg-white selection:bg-black/10">
            <Navigation />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
        </div>
    );
}
