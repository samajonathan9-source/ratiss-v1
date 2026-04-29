import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useSubscribeNewsletter, useGetNewsletterCount } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
  name: z.string().optional(),
});

export function NewsletterForm() {
  const { toast } = useToast();
  const subscribe = useSubscribeNewsletter();
  const { data: countData } = useGetNewsletterCount();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", name: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    subscribe.mutate(
      { data: values },
      {
        onSuccess: () => {
          toast({
            title: "Inscription réussie",
            description: "Vous êtes maintenant connecté à la Fréquence.",
          });
          form.reset();
        },
        onError: () => {
          toast({
            variant: "destructive",
            title: "Erreur",
            description: "Une erreur est survenue lors de l'inscription.",
          });
        }
      }
    );
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-serif text-2xl text-foreground">Rejoindre la Fréquence</h3>
        <p className="text-sm text-muted-foreground">
          Recevez les réflexions, les nouvelles vidéos et les avancées du projet.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Votre prénom (optionnel)" className="bg-background/50 border-border/50 focus-visible:ring-primary/50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Votre adresse email" className="bg-background/50 border-border/50 focus-visible:ring-primary/50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={subscribe.isPending}>
            {subscribe.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            S'inscrire
          </Button>
        </form>
      </Form>

      {countData && (
        <p className="text-center text-xs text-muted-foreground/60 italic pt-2">
          Rejoint par {countData.count} chercheurs
        </p>
      )}
    </div>
  );
}