"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingBackground from "@/components/FloatingBackground";
import ThreeDCard from "@/components/ThreeDCard";
import { ChatMessage, tutorReply } from "@/lib/study-assistant";

type Mode = "homework" | "test-prep" | "concept";

export default function AIChatPage() {
  const [mode, setMode] = useState<Mode>("homework");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! I'm your smart tutor. Ask anything." }
  ]);
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    const user: ChatMessage = { role: "user", text: value };
    const ai: ChatMessage = { role: "assistant", text: tutorReply(mode, value) };
    setMessages((prev) => [...prev, user, ai]);
    setValue("");
  };

  return (
    <main className="min-h-screen">
      <FloatingBackground />
      <div className="mobile-shell">
        <Navbar />
        <ThreeDCard>
          <h1 className="text-2xl font-extrabold text-slate-900">AI Chat Tutor</h1>
          <p className="mt-2 text-sm text-slate-600">Context-aware study chat with homework help, test prep, and concept explanations.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["homework", "test-prep", "concept"] as Mode[]).map((item) => (
              <button
                key={item}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${mode === item ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-700"}`}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="mt-4 h-[48vh] space-y-2 overflow-y-auto rounded-2xl bg-slate-50 p-3">
            {messages.map((m, i) => (
              <div key={`${m.role}-${i}`} className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "ml-auto bg-blue-500 text-white" : "bg-white text-slate-700"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Ask follow-up questions, request quiz, or summary..."
              className="w-full rounded-xl border border-blue-200 px-3 py-2 text-sm outline-none"
            />
            <button onClick={send} className="touch-btn rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white">
              Send
            </button>
          </div>
        </ThreeDCard>
      </div>
    </main>
  );
}
