import { AppLayout } from "@/components/layout/app-layout";
import { useState, useRef, useEffect } from "react";
import {
  useListAnthropicConversations,
  useCreateAnthropicConversation,
  useListAnthropicMessages,
  useDeleteAnthropicConversation,
  getListAnthropicConversationsQueryKey,
  getListAnthropicMessagesQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MessageSquare, Trash2, Send, Brain } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Miroir() {
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: conversations, isLoading: isLoadingConvs } =
    useListAnthropicConversations();
  const createConv = useCreateAnthropicConversation();
  const deleteConv = useDeleteAnthropicConversation();

  const { data: messagesData, isLoading: isLoadingMessages } =
    useListAnthropicMessages(activeConvId || 0, {
      query: { enabled: !!activeConvId } as never,
    });

  const handleNewConversation = () => {
    createConv.mutate(
      { data: { title: "Nouvelle Réflexion" } },
      {
        onSuccess: (newConv) => {
          setActiveConvId(newConv.id);
          queryClient.invalidateQueries({
            queryKey: getListAnthropicConversationsQueryKey(),
          });
        },
      },
    );
  };

  const handleDeleteConversation = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConv.mutate(
      { id },
      {
        onSuccess: () => {
          if (activeConvId === id) setActiveConvId(null);
          queryClient.invalidateQueries({
            queryKey: getListAnthropicConversationsQueryKey(),
          });
        },
      },
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    let convId = activeConvId;
    if (!convId) {
      const newConv = await createConv.mutateAsync({
        data: { title: input.slice(0, 30) + "..." },
      });
      convId = newConv.id;
      setActiveConvId(convId);
      queryClient.invalidateQueries({
        queryKey: getListAnthropicConversationsQueryKey(),
      });
    }

    const userMessage = input;
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch(
        `/api/anthropic/conversations/${convId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: userMessage }),
        },
      );

      if (res.status === 429) {
        toast({
          variant: "destructive",
          title: "Le miroir demande une pause",
          description:
            "Tu as posé beaucoup de questions très vite. Reviens dans une minute.",
        });
        setIsStreaming(false);
        return;
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let assistantText = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(line.slice(6));
            if (payload.done) continue;
            if (payload.content) {
              assistantText += payload.content;
              setStreamingContent(assistantText);
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Le miroir est trouble. Impossible de répondre.",
      });
    } finally {
      setIsStreaming(false);
      setStreamingContent("");
      queryClient.invalidateQueries({
        queryKey: getListAnthropicMessagesQueryKey(convId),
      });
      queryClient.invalidateQueries({
        queryKey: getListAnthropicConversationsQueryKey(),
      });
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesData, streamingContent, isStreaming]);

  return (
    <AppLayout>
      <div className="flex-1 flex h-[calc(100dvh-64px)] overflow-hidden">
        <div className="w-72 border-r border-border/40 bg-card/30 hidden md:flex flex-col">
          <div className="p-4 border-b border-border/40">
            <Button
              onClick={handleNewConversation}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <Plus size={16} />
              Nouvelle réflexion
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              {isLoadingConvs ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full rounded-md" />
                ))
              ) : conversations?.length === 0 ? (
                <p className="text-sm text-muted-foreground p-4 text-center">
                  Aucune réflexion passée.
                </p>
              ) : (
                conversations?.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`group flex items-center justify-between p-3 rounded-md cursor-pointer text-sm transition-colors ${
                      activeConvId === conv.id
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <MessageSquare size={16} className="shrink-0" />
                      <span className="truncate">{conv.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col bg-background relative">
          <AnimatePresence mode="wait">
            {!activeConvId &&
            !isStreaming &&
            (!messagesData || messagesData.length === 0) ? (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="flex-1 flex flex-col items-center justify-center p-8 text-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 ring-1 ring-primary/20 ring-offset-4 ring-offset-background"
                >
                  <Brain size={36} strokeWidth={1.2} />
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-2xl font-serif text-foreground mb-4"
                >
                  Le Miroir de Ratiss
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed font-light"
                >
                  Ce miroir n'est pas fait pour donner des réponses faciles,
                  mais pour ajuster tes questions. Pose une question sur le
                  Code Source, la conscience, ou l'alignement.
                </motion.p>
              </motion.div>
            ) : (
              <ScrollArea key="chat" className="flex-1 p-4 md:p-8" ref={scrollRef}>
                <div className="max-w-3xl mx-auto space-y-8 pb-8">
                  {isLoadingMessages ? (
                    <div className="space-y-4">
                      <Skeleton className="h-20 w-3/4 ml-auto rounded-2xl rounded-tr-none" />
                      <Skeleton className="h-32 w-3/4 rounded-2xl rounded-tl-none" />
                    </div>
                  ) : (
                    messagesData?.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-5 whitespace-pre-wrap ${
                            msg.role === "user"
                              ? "bg-primary/10 text-foreground rounded-tr-none border border-primary/20"
                              : "bg-card border border-border/50 text-foreground rounded-tl-none prose prose-invert max-w-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </motion.div>
                    ))
                  )}

                  {isStreaming && (
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-2xl p-5 bg-primary/10 text-foreground rounded-tr-none border border-primary/20 opacity-50">
                        {input}
                      </div>
                    </div>
                  )}

                  {streamingContent && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl p-5 bg-card border border-border/50 text-foreground rounded-tl-none prose prose-invert max-w-none whitespace-pre-wrap">
                        {streamingContent}
                        <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </AnimatePresence>

          <div className="p-4 bg-background/80 backdrop-blur-md border-t border-border/40">
            <div className="max-w-3xl mx-auto relative">
              <form
                onSubmit={handleSubmit}
                className="relative flex items-center"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Interroger le miroir..."
                  className="pr-12 h-14 bg-card/50 border-border/50 focus-visible:ring-primary/30 rounded-xl"
                  disabled={isStreaming}
                />
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 text-primary hover:bg-primary/20 hover:text-primary"
                  disabled={!input.trim() || isStreaming}
                >
                  <Send size={18} />
                </Button>
              </form>
              <div className="text-center mt-2">
                <span className="text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                  RATISS v1.0 · Expérimental · L'Observateur reste juge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
