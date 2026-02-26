import { colors } from "../theme/colors";

export default function Memory() {
    return (
        <div className="max-w-4xl mx-auto w-full px-6 py-12">
            <h1 className="text-3xl font-semibold mb-8" style={{ color: colors.foreground }}>
                Memory Viewer
            </h1>
            <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-lg"
                        style={{ borderColor: colors.border, backgroundColor: colors.background }}
                    >
                        <h3 className="text-lg font-medium mb-2" style={{ color: colors.foreground }}>
                            Memory Entry #{item}
                        </h3>
                        <p className="text-sm opacity-70 mb-4" style={{ color: colors.foreground }}>
                            This is a fragment of past context stored in the system. It helps maintain continuity across sessions.
                        </p>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 text-xs rounded-full" style={{ backgroundColor: colors.muted, color: colors.foreground }}>
                                Context
                            </span>
                            <span className="text-xs opacity-50" style={{ color: colors.foreground }}>
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
