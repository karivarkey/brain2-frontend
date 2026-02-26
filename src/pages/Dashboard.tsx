import { colors } from "../theme/colors";

export default function Dashboard() {
    return (
        <div className="max-w-4xl mx-auto w-full px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <h1 className="text-3xl font-semibold" style={{ color: colors.foreground }}>
                    Dashboard
                </h1>
                <div className="flex gap-4">
                    <button
                        className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-black/5"
                        style={{ color: colors.foreground, borderColor: colors.border }}
                    >
                        Settings
                    </button>
                    <button
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        style={{ backgroundColor: colors.foreground, color: colors.background }}
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl border flex flex-col items-center justify-center text-center" style={{ borderColor: colors.border }}>
                    <div className="w-16 h-16 rounded-full mb-4 bg-gray-200" />
                    <h2 className="text-xl font-medium" style={{ color: colors.foreground }}>User Name</h2>
                    <p className="text-sm opacity-60 mt-1" style={{ color: colors.foreground }}>user@example.com</p>
                </div>

                <div className="md:col-span-2 grid grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl border" style={{ borderColor: colors.border, backgroundColor: colors.muted }}>
                        <p className="text-sm font-medium opacity-60 mb-2">Total Memories</p>
                        <p className="text-4xl font-semibold">1,024</p>
                    </div>
                    <div className="p-6 rounded-2xl border" style={{ borderColor: colors.border, backgroundColor: colors.muted }}>
                        <p className="text-sm font-medium opacity-60 mb-2">Active Sessions</p>
                        <p className="text-4xl font-semibold">3</p>
                    </div>
                    <div className="col-span-2 p-6 rounded-2xl border" style={{ borderColor: colors.border }}>
                        <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0" style={{ borderColor: colors.border }}>
                                    <span className="text-sm opacity-80">Synced data with cloud</span>
                                    <span className="text-xs opacity-50">2 hours ago</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
