import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { api } from "../lib/api";
import { FileText, Calendar, Folder, User, FileQuestion, ChevronLeft, Search, Edit3, Trash2, Check, X, Menu } from "lucide-react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";

// Interfaces
interface MemorySummary {
    id: string;
    filename: string;
    type?: string;
    last_updated: string;
    preview: string;
}

interface MemoryDetail {
    id: string;
    filename: string;
    metadata: {
        id: string;
        type: string;
        tags?: string[];
        roles?: string[];
        aliases?: string[];
        relationship_status?: string;
        emotional_dynamic?: string;
        stress_association?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
    content: string;
    created_at: string;
    updated_at: string;
}

const getIconForType = (type?: string, className: string = "w-5 h-5") => {
    switch (type) {
        case "note": return <FileText className={className} />;
        case "event": return <Calendar className={className} />;
        case "project": return <Folder className={className} />;
        case "person": return <User className={className} />;
        default: return <FileQuestion className={className} />;
    }
};

export default function Memory() {
    const navigate = useNavigate();
    const location = useLocation();

    // Data states
    const [memories, setMemories] = useState<MemorySummary[]>([]);
    const [loadingList, setLoadingList] = useState(false);

    // View states
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [selectedMemory, setSelectedMemory] = useState<MemoryDetail | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Edit states
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [editFilename, setEditFilename] = useState("");
    const [editType, setEditType] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    // Sidebar states
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 640);
    const [searchQuery, setSearchQuery] = useState("");

    // Sync Hash to Selected ID
    useEffect(() => {
        const hash = location.hash.replace('#', '');
        if (hash) {
            setSelectedId(hash);
        } else {
            setSelectedId(null);
        }
    }, [location.hash]);

    // Fetch memory list wrapper
    const fetchMemories = async () => {
        try {
            const response = await api.get("/api/memory");
            setMemories(response.data.memories || []);
        } catch (err) {
            console.error(err);
        }
    };

    // Initial List Fetch
    useEffect(() => {
        const load = async () => {
            setLoadingList(true);
            await fetchMemories();
            setLoadingList(false);
        };
        load();
    }, []);

    // Fetch details when selectedId changes
    useEffect(() => {
        if (!selectedId) {
            setSelectedMemory(null);
            setIsEditing(false);
            return;
        }
        const fetchDetail = async () => {
            setLoadingDetail(true);
            try {
                const response = await api.get(`/api/memory/${selectedId}`);
                const data = response.data;
                setSelectedMemory(data);

                // Set initial edit state based on fetched data
                setEditContent(data.content);
                setEditFilename(data.filename);
                setEditType(data.metadata?.type || "");
                setIsEditing(false);

                // Hide sidebar naturally on mobile
                if (window.innerWidth < 640) {
                    setIsSidebarOpen(false);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingDetail(false);
            }
        };
        fetchDetail();
    }, [selectedId]);

    // Derived filtered list for sidebar
    const filteredMemories = memories.filter(m =>
        m.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = async () => {
        if (!selectedId || !selectedMemory) return;
        setIsSaving(true);
        try {
            const payload = {
                filename: editFilename.trim(),
                metadata: {
                    ...selectedMemory.metadata,
                    type: editType.trim(),
                },
                content: editContent
            };
            await api.patch(`api/memory/${selectedId}`, payload);

            // Successfully updated
            setSelectedMemory(prev => prev ? { ...prev, ...payload } : null);
            setIsEditing(false);

            // Refresh list context in sidebar
            await fetchMemories();
        } catch (err) {
            console.error("Save failed", err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedId) return;
        const confirmDelete = window.confirm("Are you sure you want to delete this memory? This cannot be undone.");
        if (!confirmDelete) return;

        try {
            await api.delete(`api/memory/${selectedId}`);
            setMemories(prev => prev.filter(m => m.id !== selectedId));
            navigate("/memory", { replace: true });
        } catch (err) {
            console.error("Delete failed", err);
        }
    };

    return (
        <div className="flex h-screen bg-white relative w-full overflow-hidden">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/5 z-40 sm:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar List Component */}
            <div
                className={`fixed sm:relative z-50 h-full flex-shrink-0 transition-all duration-300 flex flex-col max-w-full ${isSidebarOpen ? "w-80 translate-x-0 border-r" : "w-0 -translate-x-full sm:translate-x-0 border-none opacity-0"
                    } overflow-hidden`}
                style={{ borderColor: colors.border, backgroundColor: colors.muted }}
            >
                {/* Sidebar Header Options */}
                <div className="p-4 flex flex-col gap-4 border-b shrink-0" style={{ borderColor: colors.border }}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm font-semibold flex items-center gap-2 transition-opacity hover:opacity-70"
                        >
                            <ChevronLeft className="w-4 h-4" /> Dashboard
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search memories..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border outline-none focus:ring-2 focus:ring-black/5 bg-white transition-all shadow-sm"
                            style={{ borderColor: colors.border, color: colors.foreground }}
                        />
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                    </div>
                </div>

                {/* Sidebar Items */}
                <div className="flex-1 overflow-y-auto px-2 py-2">
                    {loadingList ? (
                        <div className="flex justify-center py-8 opacity-50">
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filteredMemories.length === 0 ? (
                        <p className="text-center text-sm opacity-50 py-8">No memories found.</p>
                    ) : (
                        <div className="flex flex-col gap-1">
                            {filteredMemories.map(memory => (
                                <button
                                    key={memory.id}
                                    onClick={() => navigate(`/memory#${memory.id}`)}
                                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-start gap-3 ${selectedId === memory.id ? 'bg-black text-white' : 'hover:bg-black/5 text-black'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-lg shrink-0 ${selectedId === memory.id ? 'bg-white/20' : 'bg-black/5'}`}>
                                        {getIconForType(memory.type, "w-4 h-4")}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">{memory.filename}</p>
                                        <p className={`text-xs truncate mt-0.5 ${selectedId === memory.id ? 'opacity-80' : 'opacity-50'}`}>
                                            {memory.last_updated}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Details and Reading Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative bg-white">
                {/* Header Navbar */}
                <div className="h-14 flex items-center justify-between px-4 border-b shrink-0 bg-white/80 backdrop-blur-sm z-10" style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 bg-white rounded-lg shadow-sm border transition-colors hover:bg-black/5"
                            style={{ borderColor: colors.border }}
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                        {selectedMemory && !isEditing && (
                            <div className="hidden sm:flex items-center gap-2">
                                <span className="px-2 py-1 text-xs font-medium bg-black/5 rounded-md capitalize">
                                    {selectedMemory.metadata?.type || "unknown"}
                                </span>
                                <span className="text-sm font-medium opacity-80">{selectedMemory.filename}</span>
                            </div>
                        )}
                    </div>

                    {selectedMemory && (
                        <div className="flex items-center gap-2">
                            {isEditing ? (
                                <>
                                    <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg hover:bg-black/5 text-black/60 transition-colors" disabled={isSaving}>
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black text-white text-sm font-medium transition-transform hover:scale-105 active:scale-95 disabled:opacity-50" disabled={isSaving}>
                                        {isSaving ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Check className="w-4 h-4" />}
                                        Save
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-black/5 text-black/60 transition-colors" title="Edit">
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button onClick={handleDelete} className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors" title="Delete">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Content Viewer / Form Area */}
                <div className="flex-1 overflow-y-auto w-full px-4 sm:px-12 py-8 pb-32">
                    {!selectedId ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 text-center max-w-sm mx-auto">
                            <FileText className="w-12 h-12 mb-4 opacity-50" />
                            <h2 className="text-xl font-medium mb-2">No Memory Selected</h2>
                            <p className="text-sm leading-relaxed">Select a memory from the index on the left to view its contents, or open one directly from the dashboard view.</p>
                        </div>
                    ) : loadingDetail ? (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 text-center mx-auto">
                            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm font-medium">Retrieving memory...</p>
                        </div>
                    ) : selectedMemory ? (
                        <div className="max-w-3xl mx-auto">
                            {isEditing ? (
                                <div className="flex flex-col gap-6 animate-in fade-in duration-200">
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Filename</label>
                                            <input
                                                type="text"
                                                value={editFilename}
                                                onChange={(e) => setEditFilename(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                                                style={{ borderColor: colors.border }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Primary Type</label>
                                            <input
                                                type="text"
                                                value={editType}
                                                onChange={(e) => setEditType(e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-black/5 transition-shadow"
                                                style={{ borderColor: colors.border }}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold opacity-60 mb-1.5 uppercase tracking-wider">Memory Content (Markdown)</label>
                                        <textarea
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={20}
                                            className="w-full px-4 py-4 rounded-xl border outline-none focus:ring-2 focus:ring-black/5 font-mono text-sm leading-relaxed resize-y transition-shadow"
                                            style={{ borderColor: colors.border }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-200">
                                    <h1 className="text-3xl font-bold mb-4">{selectedMemory.filename}</h1>

                                    {/* Visual Metadata Display Array */}
                                    <div className="flex flex-wrap gap-2 mb-8">
                                        {selectedMemory.metadata?.type && (
                                            <span className="px-3 py-1 bg-black/5 rounded-full text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
                                                {getIconForType(selectedMemory.metadata.type, "w-3 h-3")} {selectedMemory.metadata.type}
                                            </span>
                                        )}
                                        {selectedMemory.metadata?.tags?.map?.((tag: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-black/5 rounded-full text-xs font-medium opacity-80">
                                                #{tag}
                                            </span>
                                        ))}
                                        {selectedMemory.metadata?.roles?.map?.((role: string, i: number) => (
                                            <span key={`role-${i}`} className="px-3 py-1 border rounded-full text-xs font-medium opacity-70" style={{ borderColor: colors.border }}>
                                                {role}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Render the markdown securely using our Tailwind Markdown Renderer setup */}
                                    <div className="bg-[#fbfcff] p-6 sm:p-10 rounded-3xl border shadow-sm" style={{ borderColor: colors.border }}>
                                        <MarkdownRenderer content={selectedMemory.content} className="text-[15px] leading-[1.8] text-black/80 break-words" />
                                    </div>

                                    <div className="mt-8 text-center text-xs opacity-40 font-medium">
                                        System Update Timestamp: {new Date(selectedMemory.updated_at || selectedMemory.created_at || Date.now()).toLocaleString()}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
