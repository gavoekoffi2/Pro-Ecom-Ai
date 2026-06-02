"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { KeyRound, CheckCircle } from "lucide-react";

const MIN_PASSWORD = 8;

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD) {
      setError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères`);
      return;
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    // Client créé dans le handler (pas au rendu) — voir les autres pages auth.
    const supabase = createClient();

    // L'utilisateur arrive ici avec une session de récupération posée par
    // /auth/callback ; updateUser applique le nouveau mot de passe.
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      // Cas fréquent : lien expiré / déjà utilisé → pas de session valide.
      setError(
        error.message ||
          "Lien invalide ou expiré. Redemandez un lien de réinitialisation.",
      );
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    setTimeout(() => router.push("/dashboard"), 1500);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900">
          <CardHeader className="items-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl text-white">
              Mot de passe mis à jour
            </CardTitle>
            <CardDescription className="text-slate-400">
              Vous allez être redirigé vers votre tableau de bord…
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <Card className="w-full max-w-md border-slate-800 bg-slate-900">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <KeyRound className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-white">
            Nouveau mot de passe
          </CardTitle>
          <CardDescription className="text-slate-400">
            Choisissez un nouveau mot de passe pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-slate-300">
                Nouveau mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={`Au moins ${MIN_PASSWORD} caractères`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm" className="text-slate-300">
                Confirmer le mot de passe
              </Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Répétez le mot de passe"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-primary/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-2 h-10 w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Mise à jour…" : "Mettre à jour le mot de passe"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            <Link href="/login" className="text-primary hover:text-primary/80">
              Retour à la connexion
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
