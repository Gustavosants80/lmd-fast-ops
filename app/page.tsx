import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";
import FastRequestForm from "./components/FastRequestForm";

const ALLOWED_DOMAIN = "livemode.com";

export default async function Home() {
  const user = await currentUser();
  const emails = user?.emailAddresses.map((e) => e.emailAddress.toLowerCase()) ?? [];
  const allowedEmail = emails.find((email) => email.endsWith(`@${ALLOWED_DOMAIN}`));

  if (!allowedEmail) {
    return (
      <main className="denied-shell">
        <section className="denied-card">
          <div className="brand">LMD</div>
          <h1>Acesso nao autorizado</h1>
          <p>Use uma conta Google corporativa @{ALLOWED_DOMAIN}.</p>
          <SignOutButton><button className="btn primary">Sair e trocar de conta</button></SignOutButton>
        </section>
      </main>
    );
  }

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div><div className="eyebrow">LMD</div><h1>LMD FAST Ops</h1><p>Solicitacao de criacao de canal FAST</p></div>
          <div className="user-actions"><span>{allowedEmail}</span><SignOutButton><button className="btn ghost">Sair</button></SignOutButton></div>
        </div>
      </header>
      <FastRequestForm signedEmail={allowedEmail} />
    </>
  );
}
