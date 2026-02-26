import { useState } from "react";
import type { Reminder } from "../types/reminder";
import { colors } from "../theme/colors";
import { Clock, MoreVertical, Copy, Trash2, AlertCircle } from "lucide-react";

interface ReminderCardProps {
  reminder: Reminder;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onViewNext?: (id: string) => void;
  isLoading?: boolean;
}

export function ReminderCard({
  reminder,
  onToggle,
  onDelete,
  onViewNext,
  isLoading,
}: ReminderCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isRecurring = !!reminder.rrule;
  const nextTrigger = reminder.triggerAt
    ? new Date(reminder.triggerAt).toLocaleString()
    : null;

  const formatRRuleDescription = (rrule: string) => {
    const parts = rrule.split(";");
    const freq = parts[0].replace("FREQ=", "");
    const byHour = parts.find((p) => p.startsWith("BYHOUR="))?.split("=")?.[1];
    const byMinute = parts
      .find((p) => p.startsWith("BYMINUTE="))
      ?.split("=")?.[1];
    const byDay = parts.find((p) => p.startsWith("BYDAY="))?.split("=")?.[1];

    let description = freq.toLowerCase();
    if (byDay) description = `Every ${byDay.toLowerCase()}`;
    if (byHour || byMinute) {
      const time =
        (byHour || "00").padStart(2, "0") +
        ":" +
        (byMinute || "00").padStart(2, "0");
      description += ` at ${time}`;
    }
    return description;
  };

  return (
    <>
      <div
        className={`p-5 rounded-2xl border transition-all ${
          !reminder.active ? "opacity-60" : ""
        }`}
        style={{
          borderColor: colors.border,
          backgroundColor: reminder.active ? colors.background : colors.muted,
        }}
      >
        <div className="flex gap-3">
          {/* Status Indicator */}
          <div className="flex-shrink-0">
            <button
              onClick={() => onToggle(reminder.id)}
              disabled={isLoading}
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all hover:scale-110 active:scale-95 disabled:opacity-50"
              style={{
                borderColor: reminder.active
                  ? colors.foreground
                  : colors.border,
                backgroundColor: reminder.active
                  ? colors.foreground
                  : "transparent",
              }}
              title={reminder.active ? "Deactivate" : "Activate"}
            >
              {reminder.active && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.background }}
                />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3
                  className={`font-semibold text-sm leading-tight ${
                    !reminder.active ? "line-through opacity-50" : ""
                  }`}
                >
                  {reminder.title}
                </h3>
                {reminder.body && (
                  <p className="text-xs opacity-60 mt-1 line-clamp-1">
                    {reminder.body}
                  </p>
                )}
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  disabled={isLoading}
                  className="p-1 rounded-lg hover:bg-black/5 transition-colors disabled:opacity-50"
                  aria-label="More options"
                >
                  <MoreVertical className="w-4 h-4 opacity-60" />
                </button>

                {showMenu && (
                  <div
                    className="absolute right-0 top-8 z-10 min-w-[180px] rounded-xl border shadow-lg animate-in fade-in slide-in-from-top-1"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    }}
                  >
                    {isRecurring && onViewNext && (
                      <>
                        <button
                          onClick={() => {
                            onViewNext(reminder.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-black/5 transition-colors rounded-t-lg flex items-center gap-2"
                        >
                          <Clock className="w-4 h-4 opacity-60" />
                          View Next
                        </button>
                        <div
                          style={{ borderColor: colors.border }}
                          className="border-b"
                        />
                      </>
                    )}

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${reminder.title} - ${reminder.body || ""}`,
                        );
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-black/5 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4 opacity-60" />
                      Copy
                    </button>
                    <div
                      style={{ borderColor: colors.border }}
                      className="border-b"
                    />

                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 transition-colors rounded-b-lg flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Timing Info */}
            <div className="flex flex-wrap gap-2 mt-3">
              {isRecurring ? (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: colors.muted,
                    color: colors.foreground,
                  }}
                >
                  <Clock className="w-3 h-3 opacity-60" />
                  {formatRRuleDescription(reminder.rrule!)}
                </span>
              ) : nextTrigger ? (
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full"
                  style={{
                    backgroundColor: colors.muted,
                    color: colors.foreground,
                  }}
                >
                  <Clock className="w-3 h-3 opacity-60" />
                  {nextTrigger}
                </span>
              ) : null}

              <span className="text-xs opacity-50">
                {reminder.timezone || "UTC"}
              </span>
            </div>

            {!reminder.active && (
              <div className="mt-3 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-yellow-50">
                <AlertCircle className="w-3 h-3 opacity-60" />
                <span className="text-xs font-medium">Inactive</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div
            className="rounded-2xl border shadow-xl p-6 max-w-sm w-full animate-in fade-in zoom-in-95"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <h3 className="text-lg font-semibold mb-2">Delete Reminder?</h3>
            <p className="text-sm opacity-60 mb-6">
              Are you sure you want to delete "{reminder.title}"? This action
              cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border font-medium text-sm transition-colors hover:bg-black/5"
                style={{ borderColor: colors.border }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(reminder.id);
                  setShowDeleteConfirm(false);
                }}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium text-sm transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
