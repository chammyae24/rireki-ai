"use client";

import { useChat } from "@ai-sdk/react";
import { useResumeData } from "@/lib/hooks/useResumeData";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Bot, User } from "lucide-react";
import { CVUpload } from "./CVUpload";

export interface GapAnalysis {
  missingFields: Array<{
    field: string;
    section: string;
    importance: "high" | "medium" | "low";
    question: string;
  }>;
  suggestions: string[];
  isComplete: boolean;
}

export const GapHunterSidebar = () => {
  const { resumeData } = useResumeData();
  const [gapAnalysis, setGapAnalysis] = useState<GapAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [input, setInput] = useState("");

  const { messages, status, sendMessage } = useChat({});

  const isLoading = status === "submitted" || status === "streaming";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput(""); // Clear input immediately

    await sendMessage(
      { text: userMessage },
      {
        body: {
          context: resumeData,
        },
      },
    );
  };

  const analyzeGaps = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-gaps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData }),
      });

      if (response.ok) {
        const analysis = await response.json();
        setGapAnalysis(analysis);
      }
    } catch (error) {
      console.error("Gap analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeData]);

  // Analyze gaps on mount
  useEffect(() => {
    analyzeGaps();
  }, [analyzeGaps]);

  return (
    <div className="flex flex-col h-full bg-gray-50 border-l w-full">
      {/* Upload Section */}
      <CVUpload />

      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI Assistant
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={analyzeGaps}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Rescan"
            )}
          </Button>
        </div>

        {/* Gap Summary */}
        {gapAnalysis && (
          <div className="mt-3 space-y-2">
            {gapAnalysis.isComplete ? (
              <Badge
                variant="default"
                className="bg-green-600 hover:bg-green-700"
              >
                Resume Complete!
              </Badge>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  {gapAnalysis.missingFields.length} fields need attention
                </p>
                <div className="flex gap-2">
                  <Badge variant="destructive">
                    {
                      gapAnalysis.missingFields.filter(
                        (f) => f.importance === "high",
                      ).length
                    }{" "}
                    High
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  >
                    {
                      gapAnalysis.missingFields.filter(
                        (f) => f.importance === "medium",
                      ).length
                    }{" "}
                    Medium
                  </Badge>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Welcome message */}
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 bg-blue-50 rounded-lg p-3">
              <p className="text-sm">
                Hi! I&apos;m here to help you complete your Japanese resume.
                I&apos;ll scan for missing information and help you fill it in.
              </p>
            </div>
          </div>

          {/* Gap highlights */}
          {gapAnalysis?.missingFields.slice(0, 3).map((gap, index) => (
            <div
              key={index}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-3"
            >
              <Badge
                variant={
                  gap.importance === "high" ? "destructive" : "secondary"
                }
                className={`mb-2 ${gap.importance === "medium" ? "bg-yellow-100 text-yellow-800" : ""}`}
              >
                {gap.importance.toUpperCase()}
              </Badge>
              <p className="text-sm font-medium">{gap.section}</p>
              <p className="text-sm text-gray-600 mt-1">{gap.question}</p>
            </div>
          ))}

          {/* Chat messages */}
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  message.role === "user" ? "bg-gray-200" : "bg-blue-100"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4 text-blue-600" />
                )}
              </div>
              <div
                className={`flex-1 rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">
                  {message.parts
                    .filter((part) => part.type === "text")
                    .map((part) => (part as { text: string }).text)
                    .join("")}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
              </div>
              <div className="flex-1 bg-gray-100 rounded-lg p-3">
                <p className="text-sm text-gray-500">Thinking...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about missing fields..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};
