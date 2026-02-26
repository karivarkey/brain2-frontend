import { colors } from "../theme/colors";
import { X, Calendar } from "lucide-react";
import type { NextOccurrencesResponse } from "../types/reminder";

interface NextOccurrencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: NextOccurrencesResponse | null;
  isLoading?: boolean;
}

export function NextOccurrencesModal({
  isOpen,
  onClose,
  data,
  isLoading,
}: NextOccurrencesModalProps) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div
        className="rounded-2xl border shadow-xl max-w-md w-full animate-in fade-in zoom-in-95"
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
          <div>
            <h2 className="text-lg font-semibold">{data.title}</h2>
            <p className="text-xs opacity-50 mt-1">{data.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-black/5 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {data.lastTriggered && (
                <div
                  className="mb-6 pb-6 border-b"
                  style={{ borderColor: colors.border }}
                >
                  <p className="text-xs font-medium opacity-50 mb-1">
                    Last Triggered
                  </p>
                  <p className="text-sm font-medium">
                    {new Date(data.lastTriggered).toLocaleString()}
                  </p>
                </div>
              )}

              <p className="text-xs font-medium opacity-50 mb-3">
                Next {data.nextOccurrences.length} Occurrences
              </p>
              <div className="space-y-2">
                {data.nextOccurrences.map((occurrence, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: colors.muted }}
                  >
                    <Calendar className="w-4 h-4 opacity-60 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {new Date(occurrence).toLocaleString()}
                      </p>
                      <p className="text-xs opacity-50">
                        {new Date(occurrence).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="p-6 border-t flex items-center justify-end gap-3"
          style={{ borderColor: colors.border }}
        >
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg font-medium transition-colors"
            style={{
              backgroundColor: colors.foreground,
              color: colors.background,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
