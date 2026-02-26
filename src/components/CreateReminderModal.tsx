import { useState } from "react";
import { colors } from "../theme/colors";
import { X, Send } from "lucide-react";

interface CreateReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReminderData) => Promise<void>;
  isLoading?: boolean;
}

export interface CreateReminderData {
  naturalLanguage: string;
  timezone: string;
}

const DEFAULT_TIMEZONE = "UTC";
const COMMON_TIMEZONES = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Asia/Hong_Kong",
  "Australia/Sydney",
];

export function CreateReminderModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: CreateReminderModalProps) {
  const [naturalLanguage, setNaturalLanguage] = useState("");
  const [timezone, setTimezone] = useState(DEFAULT_TIMEZONE);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!naturalLanguage.trim()) {
      setError("Please enter a reminder description");
      return;
    }

    try {
      await onSubmit({
        naturalLanguage: naturalLanguage.trim(),
        timezone,
      });
      setNaturalLanguage("");
      setTimezone(DEFAULT_TIMEZONE);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create reminder",
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl border shadow-xl max-w-2xl w-full animate-in fade-in zoom-in-95"
        style={{
          backgroundColor: colors.background,
          borderColor: colors.border,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.border }}
        >
          <h2 className="text-xl font-semibold">Create Reminder</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Natural Language Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Reminder Description
            </label>
            <textarea
              value={naturalLanguage}
              onChange={(e) => setNaturalLanguage(e.target.value)}
              placeholder="E.g., 'Remind me every weekday at 9 AM for standup' or 'Remind me tomorrow at 3 PM to call mom'"
              className="w-full px-4 py-3 rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              style={{ borderColor: colors.border }}
              rows={4}
              disabled={isLoading}
            />
            <p className="text-xs opacity-50 mt-2">
              Describe when and what you want to be reminded about. Supports
              one-time and recurring reminders.
            </p>
          </div>

          {/* Timezone Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              style={{ borderColor: colors.border }}
              disabled={isLoading}
            >
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>

          {/* Examples */}
          <div
            className="p-4 rounded-lg"
            style={{ backgroundColor: colors.muted }}
          >
            <p className="text-xs font-medium mb-2 opacity-70">Examples:</p>
            <ul className="text-xs opacity-60 space-y-1">
              <li>• "Remind me in 30 minutes to take medicine"</li>
              <li>• "Remind me tomorrow at 2 PM for the meeting"</li>
              <li>• "Remind me every Monday at 9 AM for team standup"</li>
              <li>• "Remind me every weekday at 8 AM to check emails"</li>
              <li>• "Remind me every day at 6 PM to exercise"</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-lg border font-medium transition-colors hover:bg-black/5 disabled:opacity-50"
              style={{ borderColor: colors.border }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !naturalLanguage.trim()}
              className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: colors.foreground,
                color: colors.background,
                opacity: isLoading || !naturalLanguage.trim() ? 0.5 : 1,
              }}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Create Reminder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
