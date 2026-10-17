export type Theme = 'dark' | 'light';
export type DataState = 'live' | 'empty' | 'error';
export type ScreenId = 'dashboard' | 'feed' | 'blockers' | 'states';
export type FeedFilter = 'all' | 'urgent' | 'blocked' | 'verified' | 'done' | 'snoozed';
export type ItemStatus = 'blocked' | 'at-risk' | 'on-track' | 'done';
export type SnoozeDuration = '2h' | '4h' | 'tomorrow';

export interface Citation {
  tool: string;
  badge: string;
  time: string;
  text: string;
}

export interface ActivityEntry {
  id: string;
  itemId: string;
  actor: string;
  action: string;
  detail: string;
  time: string;
}

export interface WorkItem {
  id: string;
  title: string;
  status: ItemStatus;
  statusLabel: string;
  urgency: number;
  category: 'urgent' | 'normal';
  blocked: boolean;
  verifiedOnly: boolean;
  owner: string;
  unblocker: string;
  why: string;
  verifiedFacts: string[];
  confidence: string;
  inferredText: string;
  citations: Citation[];
  nudgeDraft: string;
  done: boolean;
  snoozed: boolean;
  snoozedUntil?: string;
  blockerChain?: { from: string; artifact: string; to: string };
}

export interface Store {
  items: Record<string, WorkItem>;
  activity: ActivityEntry[];
}

const TEAM = ['Devin K.', 'Elena R.', 'Marcus V.', 'Sarah L.', 'Liam T.'];
export const TEAM_MEMBERS = TEAM;

function freshItem(base: Omit<WorkItem, 'done' | 'snoozed'>): WorkItem {
  return { ...base, done: false, snoozed: false };
}

export function freshStore(): Store {
  const items: Record<string, WorkItem> = {};
  const list: Omit<WorkItem, 'done' | 'snoozed'>[] = [
    {
      id: 'AUTH-104',
      title: 'OAuth2 Token Rotation & DB Schema Migration',
      status: 'blocked',
      statusLabel: 'Blocked 36h',
      urgency: 96,
      category: 'urgent',
      blocked: true,
      verifiedOnly: true,
      owner: 'Devin K.',
      unblocker: 'Sarah L.',
      why: 'Sprint deadline is tomorrow 5 PM. PR #402 has been open for 36h with 0 approvals, and Devin asked twice in #proj-auth for DB migration sign-off.',
      verifiedFacts: [
        'GitHub PR #402 opened 36h ago (+412 / -89 lines). CI passing, 0 approvals.',
        'Jira AUTH-104 marked P0 Blocker; due tomorrow at 5:00 PM.',
        'Branch protection requires 1 Staff Engineer approval on /db/migrations.',
      ],
      confidence: '92% Confidence',
      inferredText:
        'NLP analysis of #proj-auth indicates Sarah L. is bottlenecked writing the Q3 incident post-mortem and has not seen Devin\u2019s follow-up ping.',
      citations: [
        { tool: 'GitHub', badge: 'Verified Artifact', time: '36h ago', text: 'PR #402: feat(auth): add refresh_token_family table & rotation lock \u2014 Awaiting review from @sarah-staff.' },
        { tool: 'Slack #proj-auth', badge: 'AI-Inferred Blocker', time: 'Yesterday 4:18 PM', text: 'Devin K: "@Sarah any chance to peek at the migration table in PR #402? Blocked on merging before staging freeze."' },
        { tool: 'Slack #proj-auth', badge: 'AI-Inferred Context', time: 'Yesterday 5:02 PM', text: 'Sarah L: "Swamped with the VP incident review deck today, will try to look tomorrow morning."' },
      ],
      nudgeDraft:
        'Hey @Sarah \u2014 WorkRadar flagged that Devin is blocked on PR #402 (AUTH-104) ahead of tomorrow\u2019s sprint cutoff. Do you have 15m before standup to review the DB schema, or should we reassign to @Marcus?',
      blockerChain: { from: 'Devin K.', artifact: 'PR #402', to: 'Sarah L.' },
    },
    {
      id: 'PAY-209',
      title: 'Stripe Webhook Retry & Dead-Letter Queue',
      status: 'at-risk',
      statusLabel: 'Scope Risk',
      urgency: 84,
      category: 'urgent',
      blocked: false,
      verifiedOnly: false,
      owner: 'Elena R.',
      unblocker: 'Marcus V.',
      why: '19-message Slack debate in #proj-billing over whether Redis dead-letter queues belong in v1 MVP scope. Story points increased from 3 to 6.',
      verifiedFacts: [
        'Jira PAY-209 story point estimate increased from 3 pts to 6 pts yesterday.',
        'GitHub PR #405 is in Draft state with 3 WIP commits.',
      ],
      confidence: '88% Confidence',
      inferredText:
        'High risk of sprint carryover: Elena and PM Marcus disagree on whether exponential backoff alone satisfies the enterprise SLA.',
      citations: [
        { tool: 'Slack #proj-billing', badge: 'AI-Inferred Scope Risk', time: 'Yesterday 6:12 PM', text: 'Elena R: "If we add a full dead-letter replay UI right now, PAY-209 will slip past Friday."' },
        { tool: 'Jira History', badge: 'Verified Artifact', time: 'Yesterday 6:40 PM', text: 'Ticket PAY-209 Story Points updated: 3 \u2192 6 by @elena-dev.' },
      ],
      nudgeDraft:
        'Hi @Elena & @Marcus \u2014 saw the #proj-billing thread on PAY-209 scope. Let\u2019s lock on basic exponential backoff for Sprint 24 MVP and split the Dead-Letter UI into Sprint 25.',
    },
    {
      id: 'CORE-88',
      title: 'Redis Multi-Region Cache Invalidation Layer',
      status: 'on-track',
      statusLabel: 'On Track',
      urgency: 42,
      category: 'normal',
      blocked: false,
      verifiedOnly: true,
      owner: 'Marcus V.',
      unblocker: 'None',
      why: 'Moving smoothly. 4 verified commits pushed overnight and 3 QA bugs closed in Jira.',
      verifiedFacts: [
        '4 commits pushed to branch feat/redis-invalidation overnight.',
        'All 142 integration tests passing in GitHub Actions.',
        '3 linked QA subtasks marked Done in Jira.',
      ],
      confidence: '98% Confidence',
      inferredText: 'No conversational blockers detected across #eng-core. Expected to merge this afternoon.',
      citations: [
        { tool: 'GitHub Actions', badge: 'Verified Artifact', time: 'Today 6:15 AM', text: 'Workflow build-and-test #912 succeeded in 3m 12s on branch feat/redis-invalidation.' },
      ],
      nudgeDraft: 'Awesome progress on CORE-88 overnight @Marcus! Let me know when you are ready for final merge sign-off.',
    },
    {
      id: 'FE-112',
      title: 'Customer SSO SAML Configuration Portal',
      status: 'blocked',
      statusLabel: 'Blocked 14h',
      urgency: 79,
      category: 'urgent',
      blocked: true,
      verifiedOnly: true,
      owner: 'Liam T.',
      unblocker: '@DevOps-OnCall',
      why: 'Staging environment SSL certificate expired, failing automated E2E Cypress preview builds.',
      verifiedFacts: [
        'Vercel Preview Build #881 failed with ERR_CERT_DATE_INVALID.',
        'Jira FE-112 flagged as Blocked in workflow transition.',
      ],
      confidence: '95% Confidence',
      inferredText: 'Liam posted the SSL failure log in #eng-frontend waiting on DevOps cert renewal.',
      citations: [
        { tool: 'GitHub / Vercel CI', badge: 'Verified Artifact', time: 'Today 7:05 AM', text: 'Deployment preview-881 failed: SSL certificate expired on auth-staging.internal.' },
      ],
      nudgeDraft:
        'Hey @DevOps-OnCall \u2014 Liam is blocked on FE-112 E2E testing because the staging SSL cert expired (Build #881). Can someone rotate the cert this morning?',
      blockerChain: { from: 'Liam T.', artifact: 'SSL Cert', to: '@DevOps-OnCall' },
    },
  ];
  list.forEach((b) => {
    items[b.id] = freshItem(b);
  });

  const activity: ActivityEntry[] = [
    { id: 'a1', itemId: 'PAY-204', actor: 'Elena R.', action: 'merged', detail: 'PR #399 (Idempotency Key Header) into main', time: 'Today 7:42 AM' },
    { id: 'a2', itemId: 'CORE-88', actor: 'Marcus V.', action: 'resolved', detail: '3 QA regression tickets on CORE-88', time: 'Today 6:15 AM' },
    { id: 'a3', itemId: 'AUTH-104', actor: 'Sarah L.', action: 'discussed', detail: 'Postgres index locking in #proj-auth with Devin K.', time: 'Yesterday 8:30 PM' },
  ];

  return { items, activity };
}

const STORAGE_KEY = 'workradar-store-v1';

export function loadStore(): Store {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Store;
      if (parsed.items && parsed.activity) return parsed;
    }
  } catch {
    /* ignore */
  }
  const s = freshStore();
  saveStore(s);
  return s;
}

export function saveStore(s: Store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function resetStore(): Store {
  const s = freshStore();
  saveStore(s);
  return s;
}

let _idc = 0;
export function uid(prefix = 'a'): string {
  _idc += 1;
  return `${prefix}${Date.now().toString(36)}${_idc}`;
}
