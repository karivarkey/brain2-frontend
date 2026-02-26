import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { isFirstTimeUser } from "../lib/userUtils";
import {
  FileText,
  Calendar,
  Folder,
  User,
  FileQuestion,
  MessageSquare,
  Clock,
  Settings,
  Plus,
  Bell,
  CheckCircle2,
} from "lucide-react";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { ReminderCard } from "../components/ReminderCard";
import {
  CreateReminderModal,
  type CreateReminderData,
} from "../components/CreateReminderModal";
import { NextOccurrencesModal } from "../components/NextOccurrencesModal";
import type { Reminder, NextOccurrencesResponse } from "../types/reminder";

interface DashboardData {
  memories: {
    total: number;
    byType: Record<string, number>;
    recent: Array<{
      id: string;
      filename: string;
      type?: string;
      preview: string;
      last_updated: string;
    }>;
  };
  sessions: {
    total: number;
    all: Array<{
      conversation_id: string;
      message_count: number;
      last_message_at: string;
      recent_messages: Array<{
        role: string;
        content: string;
        created_at: string;
      }>;
    }>;
  };
}

const getIconForType = (type?: string) => {
  switch (type) {
    case "note":
      return <FileText className="w-5 h-5" />;
    case "event":
      return <Calendar className="w-5 h-5" />;
    case "project":
      return <Folder className="w-5 h-5" />;
    case "person":
      return <User className="w-5 h-5" />;
    default:
      return <FileQuestion className="w-5 h-5" />;
  }
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<DashboardData | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNextModal, setShowNextModal] = useState(false);
  const [nextModalData, setNextModalData] =
    useState<NextOccurrencesResponse | null>(null);
  const [nextModalLoading, setNextModalLoading] = useState(false);
  const [creatingReminder, setCreatingReminder] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashboardRes, remindersRes] = await Promise.all([
          api.get("/dashboard"),
          api.get(`/api/reminders/${user?.uid}`),
        ]);

        setData(dashboardRes.data);
        setReminders(remindersRes.data.reminders || []);

        // Check if this is a first-time user
        const firstTime = await isFirstTimeUser();
        if (firstTime) {
          navigate("/onboard", { replace: true });
          return;
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchDashboard();
    }
  }, [navigate, user?.uid]);

  const handleCreateReminder = async (data: CreateReminderData) => {
    if (!user?.uid) return;

    setCreatingReminder(true);
    try {
      const response = await api.post("/api/reminders", {
        userId: user.uid,
        fcmToken: "", // TODO: Get FCM token from Firebase
        naturalLanguage: data.naturalLanguage,
        timezone: data.timezone,
      });

      setReminders([response.data, ...reminders]);
    } finally {
      setCreatingReminder(false);
    }
  };

  const handleToggleReminder = async (reminderId: string) => {
    try {
      const response = await api.post(`/api/reminders/${reminderId}/toggle`);
      setReminders(
        reminders.map((r) => (r.id === reminderId ? response.data : r)),
      );
    } catch (err) {
      console.error("Failed to toggle reminder:", err);
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    try {
      await api.delete(`/api/reminders/${reminderId}`);
      setReminders(reminders.filter((r) => r.id !== reminderId));
    } catch (err) {
      console.error("Failed to delete reminder:", err);
    }
  };

  const handleViewNextOccurrences = async (reminderId: string) => {
    setNextModalLoading(true);
    try {
      const response = await api.get(
        `/api/reminders/${reminderId}/next?count=5`,
      );
      setNextModalData(response.data);
      setShowNextModal(true);
    } catch (err) {
      console.error("Failed to fetch next occurrences:", err);
    } finally {
      setNextModalLoading(false);
    }
  };

  const activeReminders = reminders.filter((r) => r.active);
  const inactiveReminders = reminders.filter((r) => !r.active);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xl mb-4 text-red-600">
          {error || "No data available."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-full bg-black text-white text-sm font-medium transition-transform hover:scale-105"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b pb-8"
        style={{ borderColor: colors.border }}
      >
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ color: colors.foreground }}
        >
          Dashboard
        </h1>
        <div className="flex gap-4 items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 uppercase font-semibold text-lg"
              style={{
                backgroundColor: colors.muted,
                color: colors.foreground,
              }}
            >
              {user?.email?.[0] || "?"}
            </div>
            <p className="text-sm font-medium opacity-60 truncate max-w-[140px] sm:max-w-none">
              {user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/settings")}
              className="p-2.5 rounded-full border transition-all hover:bg-black/5 active:scale-95 shrink-0"
              style={{ borderColor: colors.border }}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/chat")}
              className="flex items-center gap-2 px-5 py-2.5 sm:py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95 shrink-0"
              style={{
                backgroundColor: colors.foreground,
                color: colors.background,
              }}
            >
              <MessageSquare className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Chat Now</span>
              <span className="sm:hidden">Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <div
          className="p-6 rounded-2xl border flex flex-col items-center text-center justify-center"
          style={{ borderColor: colors.border, backgroundColor: colors.muted }}
        >
          <p className="text-xs sm:text-sm font-medium opacity-60 mb-2">
            Total Memories
          </p>
          <p className="text-3xl sm:text-4xl font-semibold">
            {data?.memories.total || 0}
          </p>
        </div>
        <div
          className="p-6 rounded-2xl border flex flex-col items-center text-center justify-center"
          style={{ borderColor: colors.border, backgroundColor: colors.muted }}
        >
          <p className="text-xs sm:text-sm font-medium opacity-60 mb-2">
            Sessions
          </p>
          <p className="text-3xl sm:text-4xl font-semibold">
            {data?.sessions.total || 0}
          </p>
        </div>
        <div
          className="p-6 rounded-2xl border flex flex-col items-center text-center justify-center"
          style={{ borderColor: colors.border, backgroundColor: colors.muted }}
        >
          <p className="text-xs sm:text-sm font-medium opacity-60 mb-2">
            Total Reminders
          </p>
          <p className="text-3xl sm:text-4xl font-semibold">
            {reminders.length}
          </p>
        </div>
        <div
          className="p-6 rounded-2xl border flex flex-col items-center text-center justify-center"
          style={{ borderColor: colors.border, backgroundColor: colors.muted }}
        >
          <p className="text-xs sm:text-sm font-medium opacity-60 mb-2">
            Active
          </p>
          <p className="text-3xl sm:text-4xl font-semibold">
            {activeReminders.length}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        {/* Reminders Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 opacity-60" />
              Reminders
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95"
              style={{
                backgroundColor: colors.foreground,
                color: colors.background,
              }}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Reminder</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {reminders.length === 0 ? (
            <div
              className="p-12 rounded-2xl border text-center flex flex-col items-center justify-center gap-4"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.muted,
              }}
            >
              <Bell className="w-12 h-12 opacity-20" />
              <div>
                <p className="font-medium mb-1">No reminders yet</p>
                <p className="text-sm opacity-60">
                  Create your first reminder to stay on top of your tasks
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-2 px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colors.foreground,
                  color: colors.background,
                }}
              >
                Create Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Active Reminders */}
              {activeReminders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-4 h-4 opacity-60" />
                    <span className="text-xs font-medium opacity-60">
                      ACTIVE ({activeReminders.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeReminders.map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onToggle={handleToggleReminder}
                        onDelete={handleDeleteReminder}
                        onViewNext={() =>
                          handleViewNextOccurrences(reminder.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Inactive Reminders */}
              {inactiveReminders.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3 mt-6">
                    <Clock className="w-4 h-4 opacity-60" />
                    <span className="text-xs font-medium opacity-60">
                      INACTIVE ({inactiveReminders.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {inactiveReminders.map((reminder) => (
                      <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        onToggle={handleToggleReminder}
                        onDelete={handleDeleteReminder}
                        onViewNext={() =>
                          handleViewNextOccurrences(reminder.id)
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Recent Memories Column */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 opacity-60" />
            Recent Memories
          </h2>
          <div
            className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {data?.memories?.recent?.length ? (
              data.memories.recent.map((memory) => (
                <Link
                  to={`/memory#${memory.id}`}
                  key={memory.id}
                  className="group p-5 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md min-w-[280px] snap-center flex-shrink-0"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-black/5 group-hover:bg-black group-hover:text-white transition-colors">
                      {getIconForType(memory.type)}
                    </div>
                    <div>
                      <h3 className="font-medium text-sm leading-tight group-hover:underline">
                        {memory.filename}
                      </h3>
                      <p className="text-xs opacity-50 mt-0.5">
                        {memory.last_updated}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm opacity-70 line-clamp-2 leading-relaxed">
                    <MarkdownRenderer content={memory.preview} />
                  </div>
                </Link>
              ))
            ) : (
              <div
                className="w-full p-6 rounded-2xl border text-center opacity-60 text-sm font-medium"
                style={{ borderColor: colors.border }}
              >
                No recent memories found.
              </div>
            )}
          </div>
        </section>

        {/* Latest Session Column */}
        <section>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 opacity-60" />
            Latest Session
          </h2>
          {data?.sessions?.all?.length ? (
            <div
              className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {data.sessions.all.map((session) => (
                <div
                  key={session.conversation_id}
                  className="p-6 rounded-3xl border cursor-pointer transition-all hover:border-black/30 hover:shadow-md min-w-[320px] max-w-[400px] snap-center flex-shrink-0"
                  style={{
                    borderColor: colors.border,
                    backgroundColor: colors.muted,
                  }}
                  onClick={() => navigate(`/chat/${session.conversation_id}`)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="text-xs font-medium px-3 py-1 bg-white rounded-full shadow-sm border"
                      style={{ borderColor: colors.border }}
                    >
                      Chat ID: {session.conversation_id}
                    </span>
                    <span className="text-xs opacity-60 font-medium">
                      {session.message_count} messages
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {session.recent_messages.slice(-3).map((msg, i) => (
                      <div
                        key={i}
                        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === "user"
                            ? "self-end bg-black text-white"
                            : "self-start bg-white border"
                        }`}
                        style={
                          msg.role === "assistant"
                            ? {
                                borderColor: colors.border,
                                color: colors.foreground,
                              }
                            : {}
                        }
                      >
                        <div className="line-clamp-4">
                          {msg.role === "assistant" ? (
                            <MarkdownRenderer content={msg.content} />
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                        <span
                          className={`text-[10px] mt-2 block opacity-50 ${msg.role === "user" ? "text-right" : ""}`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div
                    className="mt-6 pt-4 border-t flex items-center justify-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ borderColor: colors.border }}
                  >
                    Continue Conversation
                    <span className="font-serif">→</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-6 rounded-2xl border text-center opacity-60 text-sm font-medium"
              style={{ borderColor: colors.border }}
            >
              No recent sessions found.
            </div>
          )}
        </section>
      </div>

      {/* Modals */}
      <CreateReminderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateReminder}
        isLoading={creatingReminder}
      />

      <NextOccurrencesModal
        isOpen={showNextModal}
        onClose={() => setShowNextModal(false)}
        data={nextModalData}
        isLoading={nextModalLoading}
      />
    </div>
  );
}
