import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { type NostrEvent } from '@nostrify/nostrify';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { SimplePool, type Event } from 'nostr-tools';
import { APP_RELAYS } from '@/lib/appRelays';
import { fetchArticle } from '@/hooks/useArticles';
import NotFound from './NotFound';

interface NAddrData {
  kind: number;
  pubkey: string;
  identifier: string;
  relays?: string[];
}

interface NEventData {
  id: string;
  author?: string;
  kind?: number;
  relays?: string[];
}

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// --- Shared pool for nevent queries ---
let pool: SimplePool | null = null;
function getPool(): SimplePool {
  if (!pool) pool = new SimplePool();
  return pool;
}

function fetchEventById(eventId: string, author?: string, kind?: number): Promise<Event | null> {
  return new Promise((resolve) => {
    const p = getPool();
    const relayUrls = APP_RELAYS.relays.map((r) => r.url);
    const events: Event[] = [];
    const seen = new Set<string>();

    const filter: { ids: string[]; authors?: string[]; kinds?: number[]; limit: number } = {
      ids: [eventId],
      limit: 1,
    };
    if (author) filter.authors = [author];
    if (kind !== undefined) filter.kinds = [kind];

    const sub = p.subscribeManyEose(relayUrls, filter, {
      onevent(event: Event) {
        if (!seen.has(event.id)) {
          seen.add(event.id);
          events.push(event);
        }
      },
      onclose() {
        resolve(events[0] ?? null);
      },
      maxWait: 5000,
    });

    setTimeout(() => {
      sub.close();
      resolve(events[0] ?? null);
    }, 6000);
  });
}

// --- Photo detail view ---
function PhotoView({ data }: { data: NEventData }) {
  const { data: event, isLoading } = useQuery<NostrEvent | null>({
    queryKey: ['nostr', 'event', data.id],
    queryFn: async () => {
      const ev = await fetchEventById(data.id, data.author, data.kind);
      return ev as NostrEvent | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const title = event?.tags.find(([name]) => name === 'title')?.[1] || '';
  const imetaTags = event?.tags.filter(([name]) => name === 'imeta') ?? [];
  const imageUrl = imetaTags[0]?.find((a: string) => a.startsWith('url '))?.replace('url ', '');
  const imageAlt = imetaTags[0]?.find((a: string) => a.startsWith('alt '))?.replace('alt ', '') || title;
  const timestamp = event?.created_at;

  useSeoMeta({
    title: event ? `${title || 'Photo'} | Patrick Ulrich` : 'Photo | Patrick Ulrich',
    description: event?.content || 'Photo by Patrick Ulrich',
    ogImage: imageUrl,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-64 h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!event || !imageUrl) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Photo not found</h1>
          <Link to="/photos" className="text-bitcoin hover:underline">← Back to Photos</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        <Link to="/photos" className="text-sm text-muted-foreground hover:text-bitcoin transition-colors mb-8 inline-block">
          ← Back to Photos
        </Link>

        <div className="bg-black rounded-xl overflow-hidden flex items-center justify-center mb-6">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>

        {title && <h1 className="text-2xl md:text-3xl font-bold mb-3">{title}</h1>}
        {event.content && (
          <p className="text-muted-foreground mb-3">{event.content}</p>
        )}
        {timestamp && (
          <p className="text-sm text-muted-foreground mb-6">{formatDate(timestamp)}</p>
        )}
      </div>
    </div>
  );
}

// --- Article view (unchanged) ---
function ArticleView({ data }: { data: NAddrData }) {
  const { nip19: naddr } = useParams<{ nip19: string }>();

  const { data: event, isLoading } = useQuery({
    queryKey: ['nostr', 'article', data.pubkey, data.identifier],
    queryFn: () => fetchArticle(data.pubkey, data.identifier, data.kind),
    staleTime: 5 * 60 * 1000,
  });

  const title = event?.tags.find(([name]) => name === 'title')?.[1] || 'Untitled';
  const summary = event?.tags.find(([name]) => name === 'summary')?.[1];
  const image = event?.tags.find(([name]) => name === 'image')?.[1];
  const publishedAt = event?.tags.find(([name]) => name === 'published_at')?.[1];
  const timestamp = publishedAt ? parseInt(publishedAt, 10) : event?.created_at;

  useSeoMeta({
    title: event ? `${title} | Patrick Ulrich` : 'Article | Patrick Ulrich',
    description: summary || 'Long-form article by Patrick Ulrich',
    ogTitle: title,
    ogDescription: summary,
    ogImage: image,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24 max-w-3xl">
          <div className="h-12 bg-muted rounded animate-pulse mb-6 w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse mb-2 w-1/4" />
          <div className="h-96 bg-muted rounded animate-pulse mt-8" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Article not found</h1>
          <p className="text-muted-foreground mb-6">This article may have been deleted or is not available on the configured relays.</p>
          <Link to="/blog" className="text-bitcoin hover:underline">← Back to Blog</Link>
        </div>
      </div>
    );
  }

  const html = marked.parse(event.content, { async: false }) as string;

  return (
    <div className="min-h-screen bg-background">
      <article className="container mx-auto px-4 py-24 max-w-3xl">
        <Link to="/blog" className="text-sm text-muted-foreground hover:text-bitcoin transition-colors mb-8 inline-block">
          ← Back to Blog
        </Link>

        {image && (
          <img src={image} alt={title} className="w-full h-64 md:h-96 object-cover rounded-xl mb-8" />
        )}

        <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">{title}</h1>

        {timestamp && (
          <p className="text-muted-foreground mb-8">
            {new Date(timestamp * 1000).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {summary && (
          <p className="text-lg text-muted-foreground mb-8 italic border-l-4 border-bitcoin/30 pl-4">
            {summary}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <div className="mt-16 pt-8 border-t text-center">
          <a
            href={`https://nostr.blue/${naddr}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-bitcoin transition-colors"
          >
            View on nostr.blue →
          </a>
        </div>
      </article>
    </div>
  );
}

export function NIP19Page() {
  const { nip19: identifier } = useParams<{ nip19: string }>();

  if (!identifier) {
    return <NotFound />;
  }

  let decoded;
  try {
    decoded = nip19.decode(identifier);
  } catch {
    return <NotFound />;
  }

  const { type, data } = decoded;

  switch (type) {
    case 'npub':
    case 'nprofile':
      return <div>Profile placeholder</div>;

    case 'note':
      return <div>Note placeholder</div>;

    case 'nevent': {
      const evData = data as NEventData;
      if (evData.kind === 20) {
        return <PhotoView data={evData} />;
      }
      return <div>Event placeholder</div>;
    }

    case 'naddr': {
      const addrData = data as NAddrData;
      if (addrData.kind === 30023) {
        return <ArticleView data={addrData} />;
      }
      return <div>Addressable event placeholder</div>;
    }

    default:
      return <NotFound />;
  }
}
