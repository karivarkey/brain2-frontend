import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../theme/colors";
import { api } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Onboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "form">("intro");

  const [formData, setFormData] = useState({
    fullName: "",
    preferredName: "",
    occupation: "",
    interests: "",
    aiPersonality: "",
    expectations: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTimezone = () => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Format the onboarding data as an array of strings
      const onboardingData = [
        `Full Name: ${formData.fullName}`,
        `Preferred Name: ${formData.preferredName}`,
        `Occupation: ${formData.occupation}`,
        `Interests: ${formData.interests}`,
        `AI Personality Preferences: ${formData.aiPersonality}`,
        `Expectations from AI: ${formData.expectations}`,
      ].filter((item) => !item.endsWith(": ")); // Filter out empty fields

      const response = await api.post("/onboard", {
        userId: user?.uid,
        timezone: getTimezone(),
        data: onboardingData,
      });

      if (response.status === 200 || response.status === 201) {
        // Success - redirect to dashboard
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error("Onboarding error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to complete onboarding",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: colors.background }}
    >
      {step === "intro" ? (
        // Intro Screen
        <div className="max-w-xl w-full text-center">
          <div className="mb-8 flex justify-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: colors.muted }}
            >
              <Sparkles
                className="w-8 h-8"
                style={{ color: colors.foreground }}
              />
            </div>
          </div>

          <h1
            className="text-4xl font-bold mb-4 tracking-tight"
            style={{ color: colors.foreground }}
          >
            Welcome to Brain
          </h1>

          <p className="text-lg opacity-70 mb-8 leading-relaxed">
            Before we get started, we'd love to know more about you. This helps
            us personalize your experience and make your AI assistant truly
            yours.
          </p>

          <div
            className="space-y-4 mb-12 text-left bg-white p-6 rounded-2xl border"
            style={{ borderColor: colors.border }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
                style={{
                  backgroundColor: colors.muted,
                  color: colors.foreground,
                }}
              >
                1
              </div>
              <div>
                <p className="font-medium">Tell us about yourself</p>
                <p className="text-sm opacity-60">
                  Share your name, what you do, and your interests
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
                style={{
                  backgroundColor: colors.muted,
                  color: colors.foreground,
                }}
              >
                2
              </div>
              <div>
                <p className="font-medium">Define how we should interact</p>
                <p className="text-sm opacity-60">
                  Set preferences for AI behavior and communication style
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold"
                style={{
                  backgroundColor: colors.muted,
                  color: colors.foreground,
                }}
              >
                3
              </div>
              <div>
                <p className="font-medium">Start your journey</p>
                <p className="text-sm opacity-60">
                  Chat, store memories, and stay organized
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setStep("form")}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full text-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: colors.foreground,
              color: colors.background,
            }}
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-sm opacity-50 mt-6">
            You can update this information anytime in your settings
          </p>
        </div>
      ) : (
        // Form Screen
        <div className="max-w-xl w-full">
          <button
            onClick={() => setStep("intro")}
            className="mb-8 text-sm opacity-60 hover:opacity-100 transition-opacity"
          >
            ← Back
          </button>

          <div className="mb-8">
            <h2
              className="text-3xl font-bold mb-2"
              style={{ color: colors.foreground }}
            >
              Let's personalize Brain
            </h2>
            <p className="opacity-60">
              Help us understand who you are and how you'd like to interact
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                placeholder="What's your full name?"
                className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 bg-white transition-all"
                style={{ borderColor: colors.border, color: colors.foreground }}
                required
              />
            </div>

            {/* Preferred Name */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                What should I call you?
              </label>
              <input
                type="text"
                value={formData.preferredName}
                onChange={(e) =>
                  handleInputChange("preferredName", e.target.value)
                }
                placeholder="e.g., Alex, Boss, Chief"
                className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 bg-white transition-all"
                style={{ borderColor: colors.border, color: colors.foreground }}
                required
              />
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                What do you do? (Occupation/Role)
              </label>
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  handleInputChange("occupation", e.target.value)
                }
                placeholder="e.g., Software Engineer, Manager, Student"
                className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 bg-white transition-all"
                style={{ borderColor: colors.border, color: colors.foreground }}
                required
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                What are your interests?
              </label>
              <textarea
                value={formData.interests}
                onChange={(e) => handleInputChange("interests", e.target.value)}
                placeholder="e.g., Technology, Music, Cooking, Travel"
                className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 bg-white transition-all resize-none"
                style={{ borderColor: colors.border, color: colors.foreground }}
                rows={2}
              />
            </div>

            {/* AI Personality */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                How should the AI behave? (Communication style)
              </label>
              <textarea
                value={formData.aiPersonality}
                onChange={(e) =>
                  handleInputChange("aiPersonality", e.target.value)
                }
                placeholder="e.g., Professional but friendly, Concise and direct, Detailed and explanatory, Humorous and casual"
                className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 bg-white transition-all resize-none"
                style={{ borderColor: colors.border, color: colors.foreground }}
                rows={2}
              />
            </div>

            {/* Expectations */}
            <div>
              <label className="block text-sm font-medium mb-2 opacity-80">
                What are your expectations from this AI?
              </label>
              <textarea
                value={formData.expectations}
                onChange={(e) =>
                  handleInputChange("expectations", e.target.value)
                }
                placeholder="e.g., Help with productivity, Creative brainstorming, Learning, Task management"
                className="w-full px-4 py-3 rounded-lg border outline-none focus:ring-2 focus:ring-black/10 bg-white transition-all resize-none"
                style={{ borderColor: colors.border, color: colors.foreground }}
                rows={2}
              />
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={
                loading ||
                !formData.fullName ||
                !formData.preferredName ||
                !formData.occupation
              }
              className="w-full px-6 py-4 rounded-full text-lg font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: colors.foreground,
                color: colors.background,
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating your profile...
                </div>
              ) : (
                "Complete Setup"
              )}
            </button>

            <p className="text-xs opacity-50 text-center">
              All information is stored securely and used only to personalize
              your experience
            </p>
          </form>
        </div>
      )}
    </div>
  );
}
