import { motion } from "motion/react";
import type { ReactNode } from "react";

interface PageTransitionProps {
    children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(2px)" }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1], // Custom refined easing
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
