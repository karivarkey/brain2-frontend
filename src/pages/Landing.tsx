import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { colors } from "../theme/colors";
import {
    Brain,
    Layers,
    Ban,
    LineChart,
    Settings2,
    Lightbulb,
    ArrowRight,
} from "lucide-react";
import type { ReactNode } from "react";

interface SectionProps {
    children: ReactNode;
    className?: string;
}

const FadeSection = ({ children, className = "" }: SectionProps) => (
    <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`py-24 md:py-32 flex flex-col items-start max-w-2xl mx-auto w-full px-6 ${className}`}
    >
        {children}
    </motion.section>
);

const ListItem = ({ children }: { children: ReactNode }) => (
    <li className="flex items-start gap-3 text-lg md:text-xl opacity-80 leading-relaxed">
        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
        <span>{children}</span>
    </li>
);

export default function Landing() {
    return (
        <div className="min-h-screen bg-white text-black selection:bg-black/10 pb-24">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="min-h-[85vh] flex flex-col justify-center max-w-3xl mx-auto px-6 pt-16"
            >
                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8">
                    A system that remembers who you are.
                </h1>
                <p className="text-xl md:text-2xl opacity-60 font-medium mb-12 max-w-xl">
                    Not a chatbot. <br />
                    Not a productivity tool. <br />
                    A cognitive mirror.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        to="/chat"
                        className="group flex items-center justify-center gap-2 px-8 py-4 rounded-full text-base font-medium transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        style={{ backgroundColor: colors.foreground, color: colors.background }}
                    >
                        Enter Chat
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        to="/memory"
                        className="flex items-center justify-center px-8 py-4 rounded-full text-base font-medium transition-colors hover:bg-black/5"
                        style={{ backgroundColor: colors.muted, color: colors.foreground }}
                    >
                        View Memory
                    </Link>
                </div>
            </motion.section>

            {/* Section 1 — What It Is */}
            <FadeSection>
                <div className="flex items-center gap-4 mb-8">
                    <Brain className="w-8 h-8" />
                    <h2 className="text-3xl font-semibold tracking-tight">What this actually does</h2>
                </div>
                <p className="text-xl font-medium mb-6">This system:</p>
                <ul className="flex flex-col gap-4 mb-10 pl-2">
                    <ListItem>Remembers people you mention</ListItem>
                    <ListItem>Tracks emotional patterns</ListItem>
                    <ListItem>Detects recurring stress triggers</ListItem>
                    <ListItem>Maps relational dynamics</ListItem>
                    <ListItem>Observes behavioural contradictions</ListItem>
                    <ListItem>Models long-term identity trends</ListItem>
                </ul>
                <p className="text-xl font-medium mt-auto">
                    It doesn’t just respond. <br />
                    <span className="opacity-50">It builds context.</span>
                </p>
            </FadeSection>

            {/* Section 2 — How It Works */}
            <FadeSection>
                <div className="flex items-center gap-4 mb-8">
                    <Layers className="w-8 h-8" />
                    <h2 className="text-3xl font-semibold tracking-tight">Structured cognition</h2>
                </div>
                <p className="text-xl font-medium mb-6">Every conversation feeds into:</p>
                <ul className="flex flex-col gap-4 mb-10 pl-2">
                    <ListItem>A persistent memory layer</ListItem>
                    <ListItem>A structured identity model</ListItem>
                    <ListItem>Cross-referenced relational files</ListItem>
                    <ListItem>Long-term pattern detection</ListItem>
                </ul>
                <p className="text-xl font-medium mb-6">It separates:</p>
                <ul className="flex flex-col gap-4 mb-10 pl-2">
                    <ListItem>Chat history</ListItem>
                    <ListItem>Working context</ListItem>
                    <ListItem>Identity memory</ListItem>
                </ul>
                <p className="text-xl font-medium">
                    Nothing is forgotten. <br />
                    <span className="opacity-50">Nothing is hidden.</span>
                </p>
            </FadeSection>

            {/* Section 3 — What It Is Not */}
            <FadeSection>
                <div className="flex items-center gap-4 mb-8">
                    <Ban className="w-8 h-8" />
                    <h2 className="text-3xl font-semibold tracking-tight">What this is not</h2>
                </div>
                <p className="text-xl font-medium mb-6">It is not:</p>
                <ul className="flex flex-col gap-4 mb-10 pl-2">
                    <ListItem>A motivational coach</ListItem>
                    <ListItem>A therapist</ListItem>
                    <ListItem>A social media clone</ListItem>
                    <ListItem>A productivity dashboard</ListItem>
                    <ListItem>An advice machine</ListItem>
                </ul>
                <p className="text-xl font-medium">
                    It does not tell you what to do. <br />
                    <span className="opacity-50">It reflects.</span>
                </p>
            </FadeSection>

            {/* Section 4 — Identity Modelling */}
            <FadeSection>
                <div className="flex items-center gap-4 mb-8">
                    <LineChart className="w-8 h-8" />
                    <h2 className="text-3xl font-semibold tracking-tight">Long-term pattern awareness</h2>
                </div>
                <p className="text-xl font-medium mb-6">Over time, the system observes:</p>
                <ul className="flex flex-col gap-4 mb-10 pl-2">
                    <ListItem>Attachment volatility</ListItem>
                    <ListItem>Authority conflict frequency</ListItem>
                    <ListItem>Emotional baseline shifts</ListItem>
                    <ListItem>Self-perception changes</ListItem>
                    <ListItem>Recurring internal contradictions</ListItem>
                </ul>
                <p className="text-xl font-medium">
                    Not to judge. <br />
                    <span className="opacity-50">To map.</span>
                </p>
            </FadeSection>

            {/* Section 5 — Control */}
            <FadeSection>
                <div className="flex items-center gap-4 mb-8">
                    <Settings2 className="w-8 h-8" />
                    <h2 className="text-3xl font-semibold tracking-tight">Full transparency</h2>
                </div>
                <p className="text-xl font-medium mb-6">You can:</p>
                <ul className="flex flex-col gap-4 mb-10 pl-2">
                    <ListItem>Inspect memory files</ListItem>
                    <ListItem>See which files were referenced</ListItem>
                    <ListItem>See what was updated</ListItem>
                    <ListItem>Search your own cognitive archive</ListItem>
                </ul>
                <p className="text-xl font-medium">
                    Nothing happens invisibly.
                </p>
            </FadeSection>

            {/* Section 6 — Philosophy */}
            <FadeSection>
                <div className="flex items-center gap-4 mb-8">
                    <Lightbulb className="w-8 h-8" />
                    <h2 className="text-3xl font-semibold tracking-tight">Why it exists</h2>
                </div>
                <p className="text-xl md:text-2xl leading-relaxed mb-8 max-w-xl opacity-80">
                    Humans forget patterns. <br />
                    We remember moments.
                </p>
                <p className="text-xl md:text-2xl leading-relaxed font-medium mb-12">
                    This system remembers patterns.
                </p>
                <p className="text-xl font-medium">
                    It is not meant to replace thought. <br />
                    <span className="opacity-50">It is meant to increase awareness.</span>
                </p>
            </FadeSection>

            {/* Footer */}
            <motion.footer
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="max-w-3xl mx-auto px-6 pt-32 pb-12 flex flex-col items-center justify-center text-center border-t"
                style={{ borderColor: colors.border }}
            >
                <p className="text-sm font-medium opacity-60 mb-2">
                    Built for long-term self-observation. Private. Persistent. Structured.
                </p>
                <p className="text-xs opacity-40">
                    Not smarter than you. Just more consistent.
                </p>
            </motion.footer>
        </div>
    );
}
