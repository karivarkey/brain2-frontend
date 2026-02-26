import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { useAuth } from "../contexts/AuthContext";
import { enablePush } from "../lib/firebase";
import { Copy, Check, ArrowLeft, Bell } from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const fcmToken = await enablePush();
        setToken(fcmToken);
      } catch (err) {
        console.error("Failed to get FCM token:", err);
        setError(
          "Failed to get messaging token. Make sure notifications are enabled.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  const copyToClipboard = async () => {
    if (!token) return;

    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
      {/* Header */}
      <div
        className="flex items-center gap-4 mb-12 border-b pb-8"
        style={{ borderColor: colors.border }}
      >
        <button
          onClick={() => navigate("/dashboard")}
          className="p-2 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Back to Dashboard"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ color: colors.foreground }}
        >
          Settings
        </h1>
      </div>

      {/* User Info Section */}
      <section
        className="mb-8 p-6 rounded-2xl border"
        style={{ borderColor: colors.border, backgroundColor: colors.muted }}
      >
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Account
        </h2>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center uppercase font-semibold text-xl"
            style={{
              backgroundColor: colors.background,
              color: colors.foreground,
            }}
          >
            {user?.email?.[0] || "?"}
          </div>
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-sm opacity-60">Signed in with Google</p>
          </div>
        </div>
      </section>

      {/* Firebase Messaging Token Section */}
      <section
        className="p-6 rounded-2xl border"
        style={{ borderColor: colors.border }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 opacity-60" />
          <h2 className="text-lg font-semibold">Firebase Messaging Token</h2>
        </div>

        <p className="text-sm opacity-70 mb-6 leading-relaxed">
          This token is used for push notifications. You can copy it for testing
          or debugging purposes.
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        ) : token ? (
          <div className="space-y-4">
            <div
              className="p-4 rounded-lg font-mono text-xs break-all border"
              style={{
                borderColor: colors.border,
                backgroundColor: colors.muted,
              }}
            >
              {token}
            </div>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto justify-center"
              style={{
                backgroundColor: colors.foreground,
                color: colors.background,
              }}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Token
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
            No messaging token available. Please enable notifications.
          </div>
        )}
      </section>

      {/* Additional Settings Info */}
      <div
        className="mt-8 p-4 rounded-lg text-xs opacity-60 text-center"
        style={{ backgroundColor: colors.muted }}
      >
        More settings coming soon
      </div>
    </div>
  );
}
