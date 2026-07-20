import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { nip19 } from 'nostr-tools';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { usePhotos } from '@/hooks/usePhotos';
import { PATRICK_HEX_PUBKEY } from '@/lib/constants';

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function photoNevent(pubkey: string, eventId: string): string {
  return nip19.neventEncode({
    id: eventId,
    author: pubkey,
    kind: 20,
  });
}

const Photos = () => {
  useSeoMeta({
    title: 'Photos | Patrick Ulrich',
    description: 'Photos by Patrick Ulrich.',
  });

  const { data: photos, isLoading } = usePhotos(PATRICK_HEX_PUBKEY);
  const [selected, setSelected] = useState<number | null>(null);

  const selectedPhoto = selected !== null ? photos?.[selected] : undefined;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-5xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient-bitcoin">Photos</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Captured moments from the journey.
        </p>

        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        )}

        {!isLoading && photos && photos.length === 0 && (
          <div className="text-center py-24">
            <p className="text-muted-foreground text-lg">No photos posted yet. Check back soon!</p>
          </div>
        )}

        {!isLoading && photos && photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {photos.map((photo, index) => {
              const image = photo.images[0];
              if (!image) return null;

              return (
                <button
                  key={photo.event.id}
                  onClick={() => setSelected(index)}
                  className="aspect-square overflow-hidden rounded-lg bg-muted group relative"
                >
                  <img
                    src={image.url}
                    alt={image.alt || photo.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <span className="text-white text-sm font-medium truncate">
                      {photo.title || formatDate(photo.createdAt)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden gap-0">
          {selectedPhoto && (
            <div className="flex flex-col">
              <div className="bg-black flex items-center justify-center max-h-[70vh]">
                <img
                  src={selectedPhoto.images[0]?.url}
                  alt={selectedPhoto.images[0]?.alt || selectedPhoto.title}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
              <div className="p-6 space-y-2">
                {selectedPhoto.title && (
                  <h2 className="text-xl font-bold">
                    <a
                      href={`/${photoNevent(PATRICK_HEX_PUBKEY, selectedPhoto.event.id)}`}
                      className="hover:text-bitcoin transition-colors"
                    >
                      {selectedPhoto.title}
                    </a>
                  </h2>
                )}
                {selectedPhoto.content && (
                  <p className="text-muted-foreground">{selectedPhoto.content}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formatDate(selectedPhoto.createdAt)}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Photos;
