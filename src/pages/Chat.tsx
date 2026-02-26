import { colors } from "../theme/colors";

export default function Chat() {
    return (
        <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto w-full p-4">
            <div className="flex-1 overflow-y-auto mb-4 p-4 rounded-2xl" style={{ backgroundColor: colors.muted }}>
                <div className="flex flex-col gap-4">
                    <div className="self-start max-w-[80%] px-5 py-3 rounded-2xl bg-white shadow-sm border" style={{ borderColor: colors.border }}>
                        <p style={{ color: colors.foreground }}>Hello! How can I help you today?</p>
                    </div>
                    <div className="self-end max-w-[80%] px-5 py-3 rounded-2xl" style={{ backgroundColor: colors.foreground, color: colors.background }}>
                        <p>I need some help setting up a modern frontend.</p>
                    </div>
                </div>
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full px-6 py-4 rounded-full border outline-none focus:ring-2 focus:ring-black/5 transition-all"
                    style={{ borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }}
                />
                <button
                    className="absolute right-2 top-2 bottom-2 px-6 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: colors.foreground, color: colors.background }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
