import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

export default function ResearchChat() {
  const { user, isAuthenticated } = useAuth();
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: conversations } = trpc.chat.getConversations.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const { data: messages, refetch: refetchMessages } = trpc.chat.getMessages.useQuery(
    { conversationId: conversationId! },
    { enabled: conversationId !== null }
  );

  const createConversationMutation = trpc.chat.createConversation.useMutation({
    onSuccess: (data) => {
      setConversationId(data.id);
    },
    onError: (error) => {
      toast.error("Failed to create conversation: " + error.message);
    },
  });

  const sendMessageMutation = trpc.chat.sendMessage.useMutation({
    onSuccess: () => {
      refetchMessages();
      setMessage("");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  // Create initial conversation
  useEffect(() => {
    if (isAuthenticated && !conversationId && conversations && conversations.length === 0) {
      createConversationMutation.mutate({
        title: "Research Assistant Chat"
      });
    } else if (conversations && conversations.length > 0 && !conversationId) {
      setConversationId(conversations[0].id);
    }
  }, [isAuthenticated, conversations, conversationId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim() || !conversationId) return;

    sendMessageMutation.mutate({
      conversationId,
      message: message.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please log in to use the Research Assistant Chat.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const suggestedQuestions = [
    "What sample size do I need for my study?",
    "Should I use a t-test or Mann-Whitney U test?",
    "How do I write a strong research hypothesis?",
    "What are the key elements of informed consent?",
    "Explain the difference between RCT and cohort study",
    "How do I handle missing data in my analysis?"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Research Assistant Chat</h1>
          <p className="text-muted-foreground">
            Get expert guidance on research methodology, statistics, and study design
          </p>
        </div>

        <Card className="h-[calc(100vh-16rem)]">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 p-6" ref={scrollRef}>
              {!messages || messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Welcome to Research Assistant
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md">
                    I'm here to help with research methodology, study design, statistics, and proposal writing. Ask me anything!
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                    {suggestedQuestions.map((q, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        className="text-left h-auto py-3 px-4 whitespace-normal"
                        onClick={() => setMessage(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        msg.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {msg.role === "assistant" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm dark:prose-invert break-words overflow-hidden">
                            <Streamdown>{msg.content}</Streamdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        )}
                      </div>

                      {msg.role === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}

                  {sendMessageMutation.isPending && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask about research methodology, statistics, study design..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sendMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="icon"
                >
                  {sendMessageMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">What I Can Help With</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Study Design</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Choosing study types</li>
                  <li>• Randomization methods</li>
                  <li>• Blinding strategies</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Statistics</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Test selection</li>
                  <li>• Sample size calculation</li>
                  <li>• Data analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ethics & Writing</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• IRB requirements</li>
                  <li>• Informed consent</li>
                  <li>• Proposal writing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
