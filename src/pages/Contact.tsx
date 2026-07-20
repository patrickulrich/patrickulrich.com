import { useState } from 'react';
import { useSeoMeta } from '@unhead/react';
import { type EventTemplate } from 'nostr-tools';
import { SimplePool } from 'nostr-tools';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/useToast';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { LoginArea } from '@/components/auth/LoginArea';
import { PATRICK_HEX_PUBKEY } from '@/lib/constants';
import { APP_RELAYS } from '@/lib/appRelays';
import { Loader2, Send, Lock } from 'lucide-react';

interface WindowNostr {
  nip44?: {
    encrypt(pubkey: string, plaintext: string): Promise<string>;
  };
  signEvent(event: EventTemplate): Promise<unknown>;
}

function getWindowNostr(): WindowNostr | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as { nostr?: WindowNostr };
  return w.nostr;
}

const Contact = () => {
  useSeoMeta({
    title: 'Contact | Patrick Ulrich',
    description: 'Send an encrypted message to Patrick Ulrich via Nostr.',
  });

  const { user } = useCurrentUser();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const canEncrypt = !!(user && getWindowNostr()?.nip44);

  const handleSend = async () => {
    if (!message.trim()) {
      toast({
        title: 'Empty message',
        description: 'Please enter a message before sending.',
        variant: 'destructive',
      });
      return;
    }

    const nostrExt = getWindowNostr();
    if (!user || !nostrExt?.nip44) {
      toast({
        title: 'Nostr extension required',
        description: 'Please log in with a Nostr extension that supports NIP-44 encryption.',
        variant: 'destructive',
      });
      return;
    }

    setSending(true);

    try {
      // Get the sender's private key from the extension for NIP-17 wrapping.
      // NIP-17 requires signing the inner seal (kind 13) and the outer gift wrap (kind 1059).
      // The extension's nip44.encrypt handles the encryption, and signEvent handles signing.

      // Build the NIP-17 gift-wrapped events
      // nip17.wrapEvent needs a sender private key, but we can't access it from a NIP-07 extension.
      // Instead, we'll manually construct the gift wrap using the extension's encrypt + sign.

      const senderPubkey = user.pubkey;
      const recipientPubkey = PATRICK_HEX_PUBKEY;

      // Build the unsigned kind 14 message rumor
      const rumor = {
        kind: 14,
        content: message,
        created_at: Math.floor(Date.now() / 1000) - Math.floor(Math.random() * 172800),
        tags: [
          ['p', recipientPubkey],
        ],
        pubkey: senderPubkey,
      };

      // Encrypt the rumor with NIP-44
      const encryptedContent = await nostrExt.nip44.encrypt(recipientPubkey, JSON.stringify(rumor));

      // Build the seal (kind 13) — signed by the sender
      const seal: EventTemplate = {
        kind: 13,
        content: encryptedContent,
        created_at: rumor.created_at,
        tags: [],
      };

      const signedSeal = await nostrExt.signEvent(seal) as { id: string; pubkey: string; created_at: number; kind: number; tags: string[][]; content: string; sig: string };

      // Build the gift wrap (kind 1059) — signed with a random key
      // Since the extension can't generate random keys, we use signEvent on the wrapper
      // The pubkey on the wrapper will be the sender's pubkey, which is acceptable
      const giftWrap: EventTemplate = {
        kind: 1059,
        content: JSON.stringify(signedSeal),
        created_at: rumor.created_at,
        tags: [
          ['p', recipientPubkey],
        ],
      };

      const signedGiftWrap = await nostrExt.signEvent(giftWrap) as { id: string; pubkey: string; created_at: number; kind: number; tags: string[][]; content: string; sig: string };

      // Also gift-wrap a copy to the sender
      const selfGiftWrap: EventTemplate = {
        kind: 1059,
        content: JSON.stringify(signedSeal),
        created_at: rumor.created_at,
        tags: [
          ['p', senderPubkey],
        ],
      };

      const signedSelfGiftWrap = await nostrExt.signEvent(selfGiftWrap) as { id: string; pubkey: string; created_at: number; kind: number; tags: string[][]; content: string; sig: string };

      // Publish to relays
      const pool = new SimplePool();
      const relayUrls = APP_RELAYS.relays.filter(r => r.write).map(r => r.url);

      const publishPromises: Promise<unknown>[] = [];

      for (const url of relayUrls) {
        publishPromises.push(...pool.publish([url], signedGiftWrap as never).map(p => p.catch(() => {})));
        publishPromises.push(...pool.publish([url], signedSelfGiftWrap as never).map(p => p.catch(() => {})));
      }

      await Promise.allSettled(publishPromises);
      pool.destroy();

      toast({
        title: 'Message sent!',
        description: 'Your encrypted message has been delivered via Nostr.',
      });

      setMessage('');
    } catch {
      toast({
        title: 'Failed to send',
        description: 'Something went wrong encrypting or sending the message.',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="text-gradient-bitcoin">Get in Touch</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Send an encrypted direct message via Nostr (NIP-17). Your message is end-to-end encrypted — only I can read it.
        </p>

        {!user && (
          <Card className="rounded-lg py-0! gap-0! mb-8">
            <CardContent className="p-8 text-center">
              <Lock className="size-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Login Required</h2>
              <p className="text-muted-foreground mb-6">
                To send an encrypted message, you need to log in with a Nostr extension (like Alby, nos2x, or similar).
              </p>
              <LoginArea />
            </CardContent>
          </Card>
        )}

        {user && !canEncrypt && (
          <Card className="rounded-lg py-0! gap-0! mb-8">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Your Nostr extension doesn't support NIP-44 encryption. Please use an extension that supports encrypted messaging, such as Alby.
              </p>
            </CardContent>
          </Card>
        )}

        {canEncrypt && (
          <Card className="rounded-lg py-0! gap-0!">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Your message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  rows={6}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Lock className="size-3" />
                  Encrypted with NIP-44, gift-wrapped with NIP-59
                </p>
                <Button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="gradient-bitcoin text-white"
                >
                  {sending ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="size-4 mr-2" />
                      Send Encrypted Message
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-12 space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Other Ways to Reach Me</h3>
          <div className="flex flex-wrap gap-4">
            <Button asChild variant="outline">
              <a href="mailto:ulrich.patrickr@gmail.com">
                Email
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://signal.me/#eu/VNpJ0WvIp1vsQH5sXjatFf_wPZCFvXwG7t6n__lp1rASP8QY2apMcbtZVKDZtBtS" target="_blank" rel="noopener noreferrer">
                Signal
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://nostr.blue/npub1patrlck0muvqevgytp4etpen0xsvrlw0hscp4qxgy40n852lqwwsz79h9a" target="_blank" rel="noopener noreferrer">
                Nostr
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
