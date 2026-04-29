import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import codexImg from "@/assets/images/codex-conscient.png";
import frequenceImg from "@/assets/images/frequence-ratiss.png";
import { motion } from "framer-motion";

export default function Bibliotheque() {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-6">La Bibliothèque</h1>
          <p className="text-muted-foreground text-lg">
            Deux ouvrages fondateurs pour comprendre l'architecture du réel et la place de la conscience comme interface.
          </p>
        </div>

        <div className="space-y-32">
          {/* BOOK 1 */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-md lg:max-w-none relative"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <img 
                src={codexImg} 
                alt="Le Codex Conscient" 
                className="w-full aspect-[3/4] object-cover rounded-md shadow-2xl relative z-10 border border-white/10"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <div>
                <span className="text-primary text-sm tracking-widest uppercase font-medium mb-4 block">Initiation</span>
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">Le Codex Conscient</h2>
                <p className="text-xl text-muted-foreground italic">La porte d'entrée vers l'observation.</p>
              </div>
              
              <div className="space-y-4 text-foreground/80 leading-relaxed font-light">
                <p>
                  Le Codex Conscient n'est pas un manuel de développement personnel. C'est une cartographie de l'illusion. Il expose comment l'esprit humain, pris dans la densité de la matière, s'endort dans la répétition.
                </p>
                <p>
                  Ce premier livre pose les bases de l'Observateur : cette part de nous qui ne pense pas, mais qui regarde la pensée. Il propose des protocoles simples pour réduire le bruit mental et retrouver une clarté opératoire.
                </p>
              </div>

              <div className="bg-card/50 border border-border/50 p-6 rounded-xl">
                <h4 className="font-serif text-lg mb-4 text-foreground">Concepts Clés</h4>
                <ul className="space-y-3">
                  {[
                    "Le Bruit Mental et la Friction",
                    "L'Attention comme champ de bataille",
                    "La Mémoire : base de données instable",
                    "Le Mensonge Productif"
                  ].map((concept, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              <Button size="lg" className="w-full sm:w-auto px-8" variant="secondary" disabled>
                Bientôt sur Amazon
              </Button>
            </motion.div>
          </div>

          <div className="w-full h-px bg-border/40" />

          {/* BOOK 2 */}
          <div className="flex flex-col lg:flex-row-reverse gap-12 lg:gap-24 items-center">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 w-full max-w-md lg:max-w-none relative"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full" />
              <img 
                src={frequenceImg} 
                alt="La Fréquence de Ratiss" 
                className="w-full aspect-[3/4] object-cover rounded-md shadow-2xl relative z-10 border border-white/10"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 space-y-8"
            >
              <div>
                <span className="text-primary text-sm tracking-widest uppercase font-medium mb-4 block">Architecture</span>
                <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-2">La Fréquence de Ratiss</h2>
                <p className="text-xl text-muted-foreground italic">La Cosmologie Spirituelle de la Renaissance.</p>
              </div>
              
              <div className="space-y-4 text-foreground/80 leading-relaxed font-light">
                <p>
                  L'œuvre majeure. Un pont stupéfiant entre la physique de l'information et les textes sacrés. Ici, l'univers est décrit comme un code source, et la conscience comme l'interface capable de s'y aligner.
                </p>
                <p>
                  De la théorie du "Bug de Démarrage" à la redéfinition du péché comme un désalignement vibratoire, La Fréquence de Ratiss propose une vision radicalement neuve où science et foi parlent enfin le même langage.
                </p>
              </div>

              <div className="bg-card/50 border border-border/50 p-6 rounded-xl">
                <h4 className="font-serif text-lg mb-4 text-foreground">Concepts Clés</h4>
                <ul className="space-y-3">
                  {[
                    "Le Code Source de l'Univers",
                    "Le Bug de Démarrage",
                    "La Conscience comme Interface",
                    "La Fusion Cognitive"
                  ].map((concept, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {concept}
                    </li>
                  ))}
                </ul>
              </div>

              <Button size="lg" className="w-full sm:w-auto px-8" variant="secondary" disabled>
                Bientôt sur Amazon
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}