import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { api } from "../lib/api";
import { Settings, Plus, MessageSquare, ChevronLeft, Send, Sparkles } from "lucide-react";

interface Message {
    id?: string;
    conversation_id?: string;
    role: "user" | "assistant";
    content: string;
    created_at?: string;
    mutationsApplied?: number;
}

interface ReplyResponse {
    reply: string;
    mutationsApplied: number;
}

export default function Chat() {
    const { conv_id } = useParams<{ conv_id: string }>();
    const navigate = useNavigate();

    const [messages, setMessages] = useState<Message[]>([]);
    const [sessions, setSessions] = useState<{ id: string; snippet: string }[]>([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll to bottom whenever messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch Sidebar data
    useEffect(() => {
        const fetchSidebarData = async () => {
            try {
                const response = await api.get("/dashboard");
                // Extract basic info from the dashboard payload to list history
                // Realistically backend might need a /conversations endpoint but we use what we have
                if (response.data?.sessions?.all) {
                    const allSessions = response.data.sessions.all;
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    setSessions(allSessions.map((session: any) => {
                        const messages = session.recent_messages;
                        const lastMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "Recent Session...";
                        return {
                            id: session.conversation_id,
                            snippet: lastMsg.slice(0, 30)
                        };
                    }));
                }
            } catch (err) {
                console.error("Failed to load sessions:", err);
            }
        };
        fetchSidebarData();
    }, []);

    // Fetch Messages for active conv_id
    useEffect(() => {
        if (!conv_id) {
            setMessages([]);
            return;
        }
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/chat/${conv_id}`);
                setMessages(response.data);
            } catch (err) {
                console.error("Failed to load chat:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMessages();
    }, [conv_id]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const currentConvId = conv_id || `conv_${Date.now()}`;
        const userMessage: Message = { role: "user", content: inputMessage };

        // Optimistic UI update
        setMessages((prev) => [...prev, userMessage]);
        setInputMessage("");
        setLoading(true);

        try {
            const response = await api.post<ReplyResponse>("/chat", {
                conversation_id: currentConvId,
                message: userMessage.content,
            });

            const assistantMessage: Message = {
                role: "assistant",
                content: response.data.reply,
                mutationsApplied: response.data.mutationsApplied,
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // If this was a new conversation, navigate to the id
            if (!conv_id) {
                navigate(`/chat/${currentConvId}`, { replace: true });
                // Also add to sidebar optimistically
                setSessions((prev) => [{ id: currentConvId, snippet: userMessage.content.slice(0, 30) }, ...prev]);
            }
        } catch (err) {
            console.error("Failed to send message:", err);
            // Optional: Handle error by showing a toast or updating UI
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? "w-64" : "w-0 hidden sm:flex sm:w-16"} flex-shrink-0 border-r transition-all duration-300 flex flex-col`}
                style={{ borderColor: colors.border, backgroundColor: colors.muted }}
            >
                {/* Sidebar Header */}
                <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
                    {isSidebarOpen && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm font-semibold flex items-center gap-2 transition-opacity hover:opacity-70"
                        >
                            <ChevronLeft className="w-4 h-4" /> Back
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/chat')}
                        className={`p-2 rounded-lg transition-colors hover:bg-black/5 ${!isSidebarOpen && "mx-auto"}`}
                        title="New Chat"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-1 overflow-y-auto py-2">
                    {isSidebarOpen ? (
                        <div className="px-3">
                            <p className="text-xs font-medium opacity-50 px-2 mb-2 mt-4">Recent</p>
                            {sessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => navigate(`/chat/${session.id}`)}
                                    className={`w-full text-left px-3 py-2 rounded-xl text-sm truncate transition-colors ${conv_id === session.id ? 'bg-black text-white' : 'hover:bg-black/5'
                                        }`}
                                >
                                    <MessageSquare className={`inline w-4 h-4 mr-2 ${conv_id === session.id ? 'opacity-100' : 'opacity-50'}`} />
                                    {session.snippet}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 pt-4 hidden sm:flex">
                            {sessions.map((session) => (
                                <button
                                    key={session.id}
                                    onClick={() => navigate(`/chat/${session.id}`)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${conv_id === session.id ? 'bg-black text-white' : 'hover:bg-black/5'
                                        }`}
                                    title={session.id}
                                >
                                    <MessageSquare className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t" style={{ borderColor: colors.border }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full flex items-center gap-3 px-2 py-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
                        title={isSidebarOpen ? "Settings" : ""}
                    >
                        <Settings className="w-4 h-4 ml-1" />
                        {isSidebarOpen && "Dashboard Settings"}
                    </button>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Toggle Sidebar mobile */}
                <div className="sm:hidden absolute top-4 left-4 z-10">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-white rounded-lg shadow-sm border"
                        style={{ borderColor: colors.border }}
                    >
                        <MessageSquare className="w-4 h-4" />
                    </button>
                </div>

                {/* Header (optional, usually minimal in Gemini style) */}
                <div className="h-14 flex items-center justify-center border-b shrink-0 bg-white/80 backdrop-blur-sm z-10" style={{ borderColor: colors.border }}>
                    <span className="font-semibold text-sm opacity-60">
                        {conv_id ? `Chat Context: ${conv_id}` : 'New Conversation'}
                    </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto w-full px-4 sm:px-12 py-8 pb-32">
                    {messages.length === 0 && !loading && (
                        <div className="h-full flex flex-col items-center justify-center opacity-40 text-center max-w-sm mx-auto">
                            <Sparkles className="w-12 h-12 mb-4" />
                            <h2 className="text-xl font-medium mb-2">How can I assist?</h2>
                            <p className="text-sm">Enter a request to sync your events, fetch memories, or ask a question.</p>
                        </div>
                    )}

                    <div className="max-w-3xl mx-auto flex flex-col gap-6">
                        {messages.map((msg, idx) => (
                            <div
                                key={msg.id || idx}
                                className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                            >
                                <div
                                    className={`px-5 py-3.5 rounded-2xl text-base leading-relaxed ${msg.role === 'user'
                                        ? 'bg-black text-white rounded-br-sm'
                                        : 'bg-[#f4f4f4] text-black border shadow-sm rounded-bl-sm'
                                        }`}
                                    style={msg.role === 'assistant' ? { borderColor: colors.border } : {}}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>

                                {/* Assistant Metadata (Mutations) */}
                                {msg.role === "assistant" && msg.mutationsApplied !== undefined && (
                                    <div className="mt-2 flex items-center gap-1.5 px-1 opacity-50 text-xs font-medium">
                                        <Settings className="w-3 h-3" />
                                        <span>{msg.mutationsApplied} System Mutations</span>
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="self-start max-w-[85%] flex items-center gap-2 px-5 py-4 rounded-2xl bg-[#f4f4f4] border shadow-sm rounded-bl-sm" style={{ borderColor: colors.border }}>
                                <div className="w-2 h-2 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                                <div className="w-2 h-2 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                                <div className="w-2 h-2 rounded-full bg-black/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-10 pb-6 px-4">
                    <div className="max-w-3xl mx-auto relative group">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading}
                            placeholder="Message Brain..."
                            className="w-full pl-6 pr-14 py-4 rounded-[24px] border outline-none focus:ring-2 focus:ring-black/5 bg-white shadow-sm transition-all text-base disabled:opacity-50"
                            style={{ borderColor: colors.border, color: colors.foreground }}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || loading}
                            className={`absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center rounded-full transition-all ${inputMessage.trim() && !loading ? "bg-black text-white hover:scale-105 active:scale-95 shadow-md" : "bg-black/5 text-black/30"
                                }`}
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                    <p className="text-center text-[10px] sm:text-xs opacity-40 mt-3 max-w-2xl mx-auto hidden sm:block">
                        Brain can make mistakes. Check important information directly.
                    </p>
                </div>
            </div>
        </div>
    );
}
