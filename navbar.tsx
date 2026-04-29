import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/miroir", label: "Le Miroir" },
  { href: "/question-du-jour", label: "Question du Jour" },
  { href: "/bibliotheque", label: "Bibliothèque" },
  { href: "/a-propos", label: "À Propos" },
];

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg md:text-xl font-medium tracking-wide text-primary">
          Le Miroir de Ratiss
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`text-sm tracking-wide transition-colors ${
                location === item.href 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button 
          className="md:hidden text-foreground"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-background border-b border-border/40 py-4 px-4 flex flex-col gap-4 shadow-lg">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-base py-2 ${
                location === item.href 
                  ? "text-primary font-medium" 
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}