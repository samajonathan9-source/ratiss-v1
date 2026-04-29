import { NewsletterForm } from "@/components/newsletter-form";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full bg-card/30 border-t border-border/20 py-16 mt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-2xl text-primary mb-4">Le Miroir de Ratiss</h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Un espace de réflexion et d'alignement conçu par Jonathan Patrick Evina. 
                "La science parle du comment, les Écritures du pourquoi, la conscience du pour quoi."
              </p>
            </div>
            
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/a-propos" className="hover:text-primary transition-colors">L'Auteur</Link>
              <Link href="/bibliotheque" className="hover:text-primary transition-colors">Ouvrages</Link>
              <a href="#" className="hover:text-primary transition-colors">YouTube (Bientôt)</a>
            </div>
          </div>
          
          <div className="bg-background/40 p-6 md:p-8 rounded-xl border border-border/30">
            <NewsletterForm />
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-border/20 text-center text-xs text-muted-foreground/60 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} EVINA Jonathan Patrick. Tous droits réservés.</p>
          <p>Conscience comme Interface.</p>
        </div>
      </div>
    </footer>
  );
}