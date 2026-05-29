import type { AutomationTriggerType } from '@/types'

export interface TriggerMeta {
  label: string
  /** Tailwind classes for the Badge pill on the list row. */
  pillClass: string
}

export const TRIGGER_META: Record<AutomationTriggerType, TriggerMeta> = {
  new_message_received: {
    label: 'Nouveau message',
    pillClass: 'border-blue-500/30 bg-blue-500/10 text-blue-300',
  },
  first_inbound_message: {
    label: 'Premier message du contact',
    pillClass: 'border-teal-500/30 bg-teal-500/10 text-teal-300',
  },
  keyword_match: {
    label: 'Mot-clé détecté',
    pillClass: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  },
  new_contact_created: {
    label: 'Nouveau contact',
    pillClass: 'border-primary/30 bg-primary/10 text-primary',
  },
  conversation_assigned: {
    label: 'Conversation attribuée',
    pillClass: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  },
  tag_added: {
    label: 'Étiquette ajoutée',
    pillClass: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  },
  time_based: {
    label: 'Planifié',
    pillClass: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
  },
}

export function triggerMeta(t: AutomationTriggerType | string): TriggerMeta {
  return (
    TRIGGER_META[t as AutomationTriggerType] ?? {
      label: t,
      pillClass: 'border-slate-500/30 bg-slate-500/10 text-slate-300',
    }
  )
}

export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return 'jamais'
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return 'jamais'
  const diffSec = Math.round((Date.now() - then) / 1000)
  if (diffSec < 60) return "à l'instant"
  if (diffSec < 3600) return `il y a ${Math.floor(diffSec / 60)} min`
  if (diffSec < 86400) return `il y a ${Math.floor(diffSec / 3600)} h`
  if (diffSec < 2_592_000) return `il y a ${Math.floor(diffSec / 86400)} j`
  return new Date(iso).toLocaleDateString('fr-FR')
}
