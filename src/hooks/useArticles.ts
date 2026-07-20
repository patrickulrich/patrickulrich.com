import { type NostrEvent } from '@nostrify/nostrify';
import { SimplePool, type Event } from 'nostr-tools';
import { useQuery } from '@tanstack/react-query';
import { APP_RELAYS } from '@/lib/appRelays';

export interface Article {
  event: NostrEvent;
  title: string;
  summary: string;
  image: string | undefined;
  publishedAt: number | undefined;
  identifier: string;
}

function extractArticleData(event: Event): Article {
  const titleTag = event.tags.find(([name]) => name === 'title');
  const summaryTag = event.tags.find(([name]) => name === 'summary');
  const imageTag = event.tags.find(([name]) => name === 'image');
  const publishedTag = event.tags.find(([name]) => name === 'published_at');
  const identifierTag = event.tags.find(([name]) => name === 'd');

  return {
    event: event as NostrEvent,
    title: titleTag?.[1] || 'Untitled',
    summary: summaryTag?.[1] || '',
    image: imageTag?.[1],
    publishedAt: publishedTag?.[1] ? parseInt(publishedTag[1], 10) : event.created_at,
    identifier: identifierTag?.[1] || '',
  };
}

// Shared pool — created once, reused across queries
let pool: SimplePool | null = null;

function getPool(): SimplePool {
  if (!pool) {
    pool = new SimplePool();
  }
  return pool;
}

function queryArticles(relayUrls: string[], pubkey: string, limit: number): Promise<Event[]> {
  return new Promise((resolve) => {
    const p = getPool();
    const events: Event[] = [];
    const seen = new Set<string>();

    const sub = p.subscribeManyEose(relayUrls, {
      kinds: [30023],
      authors: [pubkey],
      limit,
    }, {
      onevent(event: Event) {
        if (!seen.has(event.id)) {
          seen.add(event.id);
          events.push(event);
        }
      },
      onclose() {
        resolve(events);
      },
      maxWait: 5000,
    });

    // Safety timeout — resolve with whatever we have after 6 seconds
    setTimeout(() => {
      sub.close();
      resolve(events);
    }, 6000);
  });
}

function querySingleArticle(relayUrls: string[], pubkey: string, identifier: string, kind: number): Promise<Event | null> {
  return new Promise((resolve) => {
    const p = getPool();
    const events: Event[] = [];
    const seen = new Set<string>();

    const sub = p.subscribeManyEose(relayUrls, {
      kinds: [kind],
      authors: [pubkey],
      '#d': [identifier],
      limit: 1,
    }, {
      onevent(event: Event) {
        if (!seen.has(event.id)) {
          seen.add(event.id);
          events.push(event);
        }
      },
      onclose() {
        const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
        resolve(latest ?? null);
      },
      maxWait: 5000,
    });

    // Safety timeout
    setTimeout(() => {
      sub.close();
      const latest = events.sort((a, b) => b.created_at - a.created_at)[0];
      resolve(latest ?? null);
    }, 6000);
  });
}

export function useArticles(pubkey: string | undefined, limit = 20) {
  const relayUrls = APP_RELAYS.relays.map((r) => r.url);

  return useQuery<Article[]>({
    queryKey: ['nostr', 'articles', pubkey ?? '', limit],
    queryFn: async () => {
      if (!pubkey) return [];

      const events = await queryArticles(relayUrls, pubkey, limit);

      return events
        .map(extractArticleData)
        .sort((a, b) => (b.publishedAt ?? 0) - (a.publishedAt ?? 0));
    },
    enabled: !!pubkey,
    staleTime: 2 * 60 * 1000,
  });
}

/** Fetch a single article by its naddr coordinates using SimplePool */
export async function fetchArticle(pubkey: string, identifier: string, kind: number): Promise<NostrEvent | null> {
  const relayUrls = APP_RELAYS.relays.map((r) => r.url);
  const event = await querySingleArticle(relayUrls, pubkey, identifier, kind);
  return event as NostrEvent | null;
}
