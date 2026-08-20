import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "LMD FAST Ops",
  description: "Solicitacao de criacao de canais FAST"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider signInUrl="/sign-in">
      <html lang="pt-BR"><body>{children}</body></html>
    </ClerkProvider>
  );
}
