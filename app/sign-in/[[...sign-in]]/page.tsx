import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="auth-shell">
      <div className="auth-brand">
        <div className="brand-mark">LMD</div>
        <div>
          <h1>LMD FAST Ops</h1>
          <p>Acesso restrito a usuários autorizados.</p>
        </div>
      </div>

      <SignIn routing="path" path="/sign-in" />
    </main>
  );
}
