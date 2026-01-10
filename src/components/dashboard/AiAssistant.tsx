import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles,
  MessageSquare
} from "lucide-react";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
}

const suggestions = [
  "What should I prioritize today?",
  "Summarize my missed calls",
  "How can I improve recovery rate?",
];

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content: "Hey! I'm your AI assistant. I can help you understand your leads, suggest follow-ups, or answer questions about your business. What do you need?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: getAiResponse(input)
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const getAiResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes("prioritize") || q.includes("today")) {
      return "Based on your activity, I'd focus on these 2 high-intent leads first:\n\n1. **(786) 555-0456** — Asked about SUV pricing. Reply within 10 min = 3x more likely to book.\n\n2. **(954) 555-0789** — Browsed your site after AI call. Send a quick follow-up text.";
    }
    if (q.includes("missed") || q.includes("calls")) {
      return "Today you had **7 missed calls**. Here's the breakdown:\n\n• 3 converted to bookings ($540 est.)\n• 2 are waiting for response\n• 2 didn't reply to SMS\n\nYour recovery rate is 71% — above average!";
    }
    if (q.includes("recovery") || q.includes("improve")) {
      return "Your recovery rate is solid at 71%. To push it higher:\n\n1. **Respond faster** — leads contacted within 5 min are 9x more likely to convert\n2. **Personalize SMS** — mention their vehicle or service\n3. **Enable AI answering** — catch after-hours calls";
    }
    return "I can help you with lead prioritization, call summaries, performance insights, and follow-up suggestions. What would you like to know?";
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 lg:bottom-8 right-6 z-50 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25 ${isOpen ? 'hidden' : ''}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-success border-2 border-primary"></span>
        </span>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 lg:bottom-8 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl border border-border bg-card shadow-2xl shadow-black/50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/20 text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">AI Assistant</h3>
                    <p className="text-xs text-muted-foreground">Pro Feature</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-br-md' 
                      : 'bg-secondary text-foreground rounded-bl-md'
                  }`}>
                    <p className="text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Suggestions */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestion(suggestion)}
                    className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-border bg-card/80">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <Button 
                  size="icon" 
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
