import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { ReactNode } from "react";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col w-full selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}