import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Auth callback — échange le `code` PKCE (lien d'e-mail Supabase :
 * confirmation d'inscription, réinitialisation de mot de passe, magic
 * link) contre une session, puis redirige vers `next`.
 *
 * Sans cette route, tous les liens d'e-mail Supabase tombaient en 404
 * (récupération de mot de passe cassée). Voir (auth)/forgot-password.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/dashboard";

  // Protection anti-open-redirect : on n'autorise que des chemins
  // internes (commençant par "/" mais pas "//" ni "/\").
  const next =
    nextParam.startsWith("/") &&
    !nextParam.startsWith("//") &&
    !nextParam.startsWith("/\\")
      ? nextParam
      : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    console.error("[auth/callback] exchangeCodeForSession:", error.message);
  }

  // Code absent ou échange échoué → retour au login avec un indicateur.
  return NextResponse.redirect(`${origin}/login?error=auth_callback`);
}
