import { type NostrEvent } from '@nostrify/nostrify';
import { SimplePool, type Event } from 'nostr-tools';
import { useQuery } from '@tanstack/react-query';
import { APP_RELAYS } from '@/lib/appRelays';

export interface Photo {
  event: NostrEvent;
  title: string;
  content: string;
  images: { url: string; mimeType: string; dimensions: string; alt: string }[];
  createdAt: number;
}

interface ImetaData {
  url: string;
  mimeType: string;
  dimensions: string;
  alt: string;
}

function parseImeta(tags: string[]): ImetaData {
  const data: ImetaData = { url: '', mimeType: '', dimensions: '', alt: '' };
  for (const part of tags.slice(1)) {
    if (part.startsWith('url ')) data.url = part.slice(4);
    else if (part.startsWith('m ')) data.mimeType = part.slice(2);
    else if (part.startsWith('dim ')) data.dimensions = part.slice(4);
    else if (part.startsWith('alt ')) data.alt = part.slice(4);
  }
  return data;
}

function extractPhotoData(event: Event): Photo {
  const titleTag = event.tags.find(([name]) => name === 'title');
  const imetaTags = event.tags.filter(([name]) => name === 'imeta');
  const images = imetaTags.map((tags) => parseImeta(tags)).filter((img) => img.url);

  return {
    event: event as NostrEvent,
    title: titleTag?.[1] || '',
    content: event.content || '',
    images,
    createdAt: event.created_at,
  };
}

let pool: SimplePool | null = null;

function getPool(): SimplePool {
  if (!pool) {
    pool = new SimplePool();
  }
  return pool;
}

function queryPhotos(relayUrls: string[], pubkey: string, limit: number): Promise<Event[]> {
  return new Promise((resolve) => {
    const p = getPool();
    const events: Event[] = [];
    const seen = new Set<string>();

    const sub = p.subscribeManyEose(relayUrls, {
      kinds: [20],
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

    setTimeout(() => {
      sub.close();
      resolve(events);
    }, 6000);
  });
}

export function usePhotos(pubkey: string | undefined, limit = 50) {
  const relayUrls = APP_RELAYS.relays.map((r) => r.url);

  return useQuery<Photo[]>({
    queryKey: ['nostr', 'photos', pubkey ?? '', limit],
    queryFn: async () => {
      if (!pubkey) return [];

      const events = await queryPhotos(relayUrls, pubkey, limit);

      return events
        .map(extractPhotoData)
        .filter((p) => p.images.length > 0)
        .sort((a, b) => b.createdAt - a.createdAt);
    },
    enabled: !!pubkey,
    staleTime: 2 * 60 * 1000,
  });
}
