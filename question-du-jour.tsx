import { AppLayout } from "@/components/layout/app-layout";
import { useGetDailyQuestion, useListJournalEntries, useCreateJournalEntry, useDeleteJournalEntry } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function QuestionDuJour() {
  const { data: dailyQ, isLoading: isLoadingQ } = useGetDailyQuestion();
  const { data: entries, isLoading: isLoadingEntries } = useListJournalEntries();
  const createEntry = useCreateJournalEntry();
  const deleteEntry = useDeleteJournalEntry();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [reflection, setReflection] = useState("");
  const [vibration, setVibration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyQ || !reflection.trim() || !vibration.trim()) return;

    createEntry.mutate(
      {
        data: {
          questionDay: dailyQ.day,
          question: dailyQ.question,
          reflection,
          vibration
        }
      },
      {
        onSuccess: () => {
          toast({ title: "Réflexion enregistrée", description: "Votre journal a été mis à jour." });
          setReflection("");
          setVibration("");
          queryClient.invalidateQueries({ queryKey: ["/api/journal"] }); // Using literal from hook gen
        }
      }
    );
  };

  const handleDelete = (id: number) => {
    deleteEntry.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
        }
      }
    );
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
        
        {/* TODAY'S QUESTION */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-widest uppercase font-medium mb-4 block">Protocole de Conscience</span>
            {isLoadingQ ? (
              <div className="h-24 flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>
            ) : dailyQ ? (
              <div className="space-y-6">
                <h1 className="text-3xl md:text-5xl font-serif text-foreground leading-tight">
                  {dailyQ.question}
                </h1>
                <p className="text-muted-foreground text-lg italic max-w-2xl mx-auto">
                  "{dailyQ.invitation}"
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">La question du jour n'est pas disponible.</p>
            )}
          </div>

          <form onSubmit={handleSubmit} className="bg-card/30 border border-border/50 p-6 md:p-8 rounded-2xl space-y-6 shadow-xl shadow-black/20">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Ta réflexion</label>
              <Textarea 
                placeholder="L'esprit qui observe..." 
                className="min-h-[150px] bg-background/50 border-border/50 resize-y text-base"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center justify-between">
              <div className="space-y-2 w-full sm:w-64">
                <label className="text-sm font-medium text-foreground">Vibration du jour</label>
                <Input 
                  placeholder="ex: alignée, trouble..." 
                  className="bg-background/50 border-border/50"
                  value={vibration}
                  onChange={(e) => setVibration(e.target.value)}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={!reflection.trim() || !vibration.trim() || createEntry.isPending}
              >
                {createEntry.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Enregistrer dans le Codex
              </Button>
            </div>
          </form>
        </section>

        {/* PAST ENTRIES */}
        <section>
          <div className="flex items-center gap-3 mb-8 border-b border-border/20 pb-4">
            <Calendar className="text-primary" size={20} />
            <h2 className="text-2xl font-serif text-foreground">Archives de l'Observateur</h2>
          </div>

          <div className="space-y-6">
            {isLoadingEntries ? (
              <div className="flex justify-center p-8"><Loader2 className="animate-spin text-muted-foreground" /></div>
            ) : entries?.length === 0 ? (
              <div className="text-center p-12 bg-card/10 rounded-xl border border-border/20 border-dashed">
                <p className="text-muted-foreground">Vos archives sont vides. Commencez aujourd'hui.</p>
              </div>
            ) : (
              entries?.map((entry) => (
                <div key={entry.id} className="group p-6 md:p-8 rounded-xl bg-background border border-border/40 hover:border-primary/30 transition-colors relative">
                  <div className="flex justify-between items-start mb-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Jour {entry.questionDay} • {format(new Date(entry.createdAt), "d MMMM yyyy", { locale: fr })}
                      </p>
                      <h3 className="font-serif text-lg text-primary">{entry.question}</h3>
                    </div>
                    <span className="shrink-0 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                      {entry.vibration}
                    </span>
                  </div>
                  
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap font-light">
                    {entry.reflection}
                  </p>

                  <button 
                    onClick={() => handleDelete(entry.id)}
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                    title="Supprimer l'entrée"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </AppLayout>
  );
}