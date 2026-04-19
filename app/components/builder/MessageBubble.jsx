import React from "react";
import { motion } from "framer-motion";
import { Bot, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex gap-3", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "shrink-0 h-7 w-7 rounded-full flex items-center justify-center mt-0.5",
          isUser ? "bg-primary text-primary-foreground border border-[#ffffff12]" : "bg-accent/10 text-accent border border-[#ffffff12]"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5" />}
      </div>
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-primary rounded-tl-sm"
        )}
      >
        <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
      </div>
    </motion.div>
  );
}