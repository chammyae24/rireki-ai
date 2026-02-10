"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Wand2 } from "lucide-react";

export const KatakanaNameInput = () => {
  const { control, watch, setValue } = useFormContext();
  const [isTranslating, setIsTranslating] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const fullName = watch("personalInfo.fullName");

  const detectLanguage = (name: string): string => {
    // Simple heuristic - in production, use proper detection
    if (/^[\u1000-\u109F]/.test(name)) return "Myanmar";
    if (/^[\u0041-\u005A\u0061-\u007A]/.test(name)) return "English";
    if (/^[\u4E00-\u9FFF]/.test(name)) return "Chinese";
    return "English";
  };

  const transliterate = async () => {
    if (!fullName) return;

    setIsTranslating(true);

    try {
      const response = await fetch("/api/transliterate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          sourceLanguage: detectLanguage(fullName),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSuggestion(result.katakana);
      }
    } catch (error) {
      console.error("Transliteration error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const acceptSuggestion = () => {
    if (suggestion) {
      setValue("personalInfo.katakanaName", suggestion);
      setSuggestion(null);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Katakana Name (フリガナ)
      </label>

      <div className="flex gap-2">
        <Controller
          name="personalInfo.katakanaName"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              placeholder="e.g., ジョン・ドウ"
              className="flex-1"
            />
          )}
        />

        <Button
          type="button"
          variant="outline"
          onClick={transliterate}
          disabled={isTranslating || !fullName}
          title="Auto-transliterate to Katakana"
        >
          {isTranslating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4" />
          )}
        </Button>
      </div>

      {suggestion && (
        <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-md">
          <span className="text-sm">
            Suggestion: <strong>{suggestion}</strong>
          </span>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={acceptSuggestion}
            className="h-8 px-2 text-blue-600 hover:text-blue-700"
          >
            Use
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setSuggestion(null)}
            className="h-8 px-2 text-gray-500 hover:text-gray-700"
          >
            Dismiss
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Enter manually or click the magic wand to auto-convert from your full
        name
      </p>
    </div>
  );
};
