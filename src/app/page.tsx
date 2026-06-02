import Link from "next/link";
import {
  MessageSquare,
  Users,
  GitBranch,
  Radio,
  Zap,
  LayoutDashboard,
  ArrowRight,
  Check,
} from "lucide-react";
import type { Metadata } from "next";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

// La landing est la seule page publique : on l'autorise à l'indexation,
// alors que le reste de l'app reste en noindex (layout racine + dashboard).
export const metadata: Metadata = {
  robots: { index: true, follow: true },
};

// Page d'accueil publique (landing). Aucune dépendance Supabase — elle
// s'affiche pour tout le monde, connecté ou non. Le middleware ne protège
// pas la racine "/".

const FEATURES: { icon: typeof MessageSquare; title: string; text: string }[] = [
  {
    icon: MessageSquare,
    title: "Messagerie partagée",
    text: "Une seule boîte de réception WhatsApp pour toute l'équipe : attribution, statuts et notes par conversation.",
  },
  {
    icon: Users,
    title: "Contacts & étiquettes",
    text: "Centralisez vos contacts, segmentez avec des étiquettes et des champs personnalisés, importez en CSV.",
  },
  {
    icon: GitBranch,
    title: "Pipelines de vente",
    text: "Suivez vos affaires en Kanban, de « Nouveau prospect » à « Gagné », en Franc CFA.",
  },
  {
    icon: Radio,
    title: "Diffusions",
    text: "Envoyez des messages en masse via des modèles approuvés, avec suivi de livraison et de lecture.",
  },
  {
    icon: Zap,
    title: "Automatisations",
    text: "Réponses automatiques, mots-clés, relances : créez des scénarios sans écrire une ligne de code.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord",
    text: "Temps de réponse, volume de messages, valeur du pipeline — tout en temps réel.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* En-tête */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <MessageSquare className="h-5 w-5" />
          </div>
          <span className="text-base font-bold text-white">{BRAND_NAME}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
          >
            Se connecter
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Créer un compte
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-5 pb-16 pt-16 text-center sm:pt-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Conçu pour le Togo 🇹🇬 et l&apos;Afrique francophone
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {BRAND_TAGLINE}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Centralisez vos conversations WhatsApp, vos contacts et vos ventes
            au même endroit. Messagerie partagée, pipelines, diffusions et
            automatisations — en français, en Franc CFA.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
            >
              Commencer gratuitement
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-800 sm:w-auto"
            >
              J&apos;ai déjà un compte
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> API WhatsApp officielle
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Numéros +228
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-primary" /> Franc CFA
            </span>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-colors hover:border-slate-700"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Appel à l'action final */}
      <section className="mx-auto max-w-4xl px-5 pb-20">
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/10 to-transparent p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Prêt à vendre plus sur WhatsApp ?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-400">
            Créez votre compte en quelques secondes et connectez votre numéro
            WhatsApp Business.
          </p>
          <Link
            href="/signup"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Créer mon compte
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-6 text-xs text-slate-500 sm:flex-row">
          <span>
            © {new Date().getFullYear()} {BRAND_NAME}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-slate-300">
              Connexion
            </Link>
            <Link href="/signup" className="hover:text-slate-300">
              Inscription
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
