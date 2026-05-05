"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { ChatWindow } from "@/components/chat-window";
import { Loader2 } from "lucide-react";

function ChatPageContent() {
  const searchParams = useSearchParams();
  const partnerId = searchParams.get("partnerId");

  return (
    <div className="min-h-screen flex flex-col bg-[#1e1e1e]">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col max-w-7xl mx-auto w-full">
        <ChatWindow initialPartnerId={partnerId} />
      </main>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex flex-col"><Navbar /><div className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div></div>}>
      <ChatPageContent />
    </Suspense>
  );
}
