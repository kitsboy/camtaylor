export interface NostrIdentity {
  id: string;
  name: string;
  role: string;
  nip05: string;
  avatar: string;
  profileUrl: string;
}

export const NOSTR_DOMAIN = 'giveabit.io';

export const NOSTR_IDENTITIES: NostrIdentity[] = [
  {
    id: 'cam',
    name: 'Cam Taylor',
    role: 'Founder · Sherpa',
    nip05: 'cam@giveabit.io',
    avatar: '/cam-profile.jpg',
    profileUrl: 'https://giveabit.io',
  },
  {
    id: 'kimi',
    name: 'Kimi',
    role: 'Orchestrator · Give A Bit',
    nip05: 'kimi@giveabit.io',
    avatar: '/kimi-profile.jpg',
    profileUrl: 'https://giveabit.io/kimi',
  },
];

export const NOSTR_NAMESPACE_URL = 'https://giveabit.io/namespace';
export const NOSTR_PAGE_URL = 'https://giveabit.io/nostr';
export const NOSTR_JSON_URL = `https://${NOSTR_DOMAIN}/.well-known/nostr.json`;

export function nip05LocalPart(nip05: string): string | null {
  const at = nip05.lastIndexOf('@');
  if (at < 1) return null;
  return nip05.slice(0, at);
}