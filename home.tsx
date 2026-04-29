import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import heroImg from "@/assets/images/hero-cosmos.png";
import codexImg from "@/assets/images/codex-conscient.png";
import frequenceImg from "@/assets/images/frequence-ratiss.png";
import { BookOpen, Sparkles, Brain, PenTool } from "lucide-react";

export default function Home() {
  return (
    <AppLayout>
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Cosmos et fréquences" 
            className="w-full h-full object-cover opacity-40 mix-blend-screen"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/50" />
        </div>

        <div className="container relative z-10 px-4 py-24 mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6 max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs uppercase tracking-widest font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Manifeste Vivant
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-foreground">
              Le Code Source <br className="hidden md:block" />
              <span className="text-primary italic">de l'Univers</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
              "Ce livre ne vous demande pas de croire. Il vous demande seulement d'observer."
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/miroir" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 h-14 rounded-none bg-primary text-primary-foreground hover:bg-primary/90">
                  Entrer dans le Miroir
                </Button>
              </Link>
              <Link href="/bibliotheque" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 h-14 rounded-none border-border/50 hover:bg-white/5 hover:text-primary">
                  Découvrir les Livres
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section className="py-24 bg-card/20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-foreground mb-4">L'Observatoire</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Quatre piliers pour explorer la Fréquence de Ratiss et réveiller l'Observateur en vous.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Le Miroir", icon: Brain, desc: "Dialogue avec une conscience artificielle entraînée sur l'architecture de Ratiss.", href: "/miroir" },
              { title: "Question du Jour", icon: PenTool, desc: "Une réflexion quotidienne pour calibrer votre vibration et enregistrer votre journal.", href: "/question-du-jour" },
              { title: "Bibliothèque", icon: BookOpen, desc: "L'accès aux ouvrages fondateurs : Le Codex Conscient et La Fréquence de Ratiss.", href: "/bibliotheque" },
              { title: "La Fréquence", icon: Sparkles, desc: "La chaîne YouTube (en préparation) pour approfondir la fusion cognitive.", href: "#" },
            ].map((item, i) => (
              <Link key={i} href={item.href}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group p-8 rounded-2xl bg-background/50 border border-border/40 hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <item.icon size={24} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-serif mb-3 text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKS TEASER */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16 lg:gap-24">
            <div className="flex-1 space-y-8">
              <h2 className="text-3xl md:text-5xl font-serif text-foreground leading-tight">
                La science parle du comment,<br />
                <span className="text-primary italic">la conscience du pour quoi.</span>
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Découvrez la cosmologie spirituelle de la Renaissance. Une approche où l'humain n'est pas perdu, mais en apprentissage, invité à réécrire son propre code source pour atteindre l'Alignement.
              </p>
              <Link href="/bibliotheque">
                <Button variant="link" className="px-0 text-primary hover:text-primary/80 text-lg">
                  Explorer les ouvrages →
                </Button>
              </Link>
            </div>
            <div className="flex-1 flex gap-4 md:gap-8 justify-center relative">
              <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full" />
              <motion.img 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                src={codexImg} 
                alt="Le Codex Conscient" 
                className="w-40 md:w-56 rounded-sm shadow-2xl relative z-10 border border-white/10"
              />
              <motion.img 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 20 }}
                viewport={{ once: true }}
                src={frequenceImg} 
                alt="La Fréquence de Ratiss" 
                className="w-40 md:w-56 rounded-sm shadow-2xl relative z-10 border border-white/10 mt-12"
              />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}