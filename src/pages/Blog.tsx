import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { Card, CardContent } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { PATRICK_HEX_PUBKEY } from '@/lib/constants';

const NOSTR_PROFILE_URL = 'https://nostr.blue/npub1patrlck0muvqevgytp4etpen0xsvrlw0hscp4qxgy40n852lqwwsz79h9a';

function formatDate(timestamp: number | undefined): string {
  if (!timestamp) return '';
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function articleNaddr(pubkey: string, identifier: string): string {
  return nip19.naddrEncode({
    kind: 30023,
    pubkey,
    identifier,
  });
}

const Blog = () => {
  useSeoMeta({
    title: 'Blog | Patrick Ulrich',
    description: 'Long-form articles by Patrick Ulrich on Bitcoin, Nostr, and digital sovereignty.',
  });

  const { data: articles, isLoading } = useArticles(PATRICK_HEX_PUBKEY);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient-bitcoin">Blog</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Articles on Bitcoin, Nostr, and the decentralized future.
        </p>

        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="rounded-lg py-0! gap-0!">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded animate-pulse mb-4 w-2/3" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && articles && articles.length === 0 && (
          <Card className="rounded-lg py-0! gap-0!">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No articles published yet. Check back soon!</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && articles && articles.length > 0 && (
          <div className="space-y-6">
            {articles.map((article) => {
              const naddr = articleNaddr(PATRICK_HEX_PUBKEY, article.identifier);
              return (
                <a key={article.event.id} href={`/${naddr}`} className="block group">
                  <Card className="overflow-hidden rounded-lg py-0! gap-0! transition-all duration-300 group-hover:border-bitcoin/50">
                    {article.image && (
                      <div className="w-full h-48 overflow-hidden bg-muted">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <h2 className="text-2xl font-bold mb-2 group-hover:text-bitcoin transition-colors">
                        {article.title}
                      </h2>
                      {article.summary && (
                        <p className="text-muted-foreground mb-3">{article.summary}</p>
                      )}
                      <p className="text-sm text-muted-foreground">
                        {formatDate(article.publishedAt)}
                      </p>
                    </CardContent>
                  </Card>
                </a>
              );
            })}
          </div>
        )}

        <div className="mt-16 text-center">
          <a
            href={NOSTR_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-bitcoin transition-colors text-sm"
          >
            Follow on Nostr for more →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Blog;
