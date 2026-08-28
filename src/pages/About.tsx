import { useSeoMeta } from '@unhead/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ZapPersonButton } from '@/components/ZapPersonButton';

const AVATAR_URL = 'https://relay.patrickulrich.com/8376dba8728c2672acc10b7a5fce3f7cbde9299a4c0151b34b6a431d48715652.png';
const NOSTR_PROFILE_URL = 'https://nostr.blue/npub1patrlck0muvqevgytp4etpen0xsvrlw0hscp4qxgy40n852lqwwsz79h9a';
const GOOD_MORNING_BITCOIN_URL = 'https://goodmorningbitcoin.com/';
const LEXINGTON_BITCOIN_URL = 'https://lexingtonbitcoin.org/';
const LIGHTNING_ADDRESS = 'patrick@sats.love';

const About = () => {
  useSeoMeta({
    title: 'About | Patrick Ulrich',
    description: 'Bitcoin advocate, educator, and builder based in Lexington, Kentucky. ATMs, Lightning, meetups, radio, and freedom tech.',
    ogTitle: 'About | Patrick Ulrich',
    ogDescription: 'Bitcoin advocate, educator, and builder based in Lexington, Kentucky. ATMs, Lightning, meetups, radio, and freedom tech.',
    ogImage: AVATAR_URL,
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-24 max-w-3xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg shrink-0">
            <AvatarImage src={AVATAR_URL} alt="Patrick Ulrich" className="object-cover" />
            <AvatarFallback className="text-2xl gradient-bitcoin text-white">PU</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">
              <span className="text-gradient-hero">Patrick Ulrich</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Bitcoin advocate, educator, and builder
            </p>
            <p className="text-sm text-muted-foreground">Lexington, Kentucky</p>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-6 text-lg text-foreground/90">
          <p>
            Patrick Ulrich is a Bitcoin advocate, educator, and builder based in Lexington, Kentucky. He's spent the last decade working across the Bitcoin ecosystem — from operating ATMs and mining advisory to building Lightning Network applications and organizing one of the country's longest-running weekly Bitcoin meetups.
          </p>

          <h2 className="text-xl font-bold text-foreground pt-4">Bitcoin ATMs</h2>
          <p>
            His career in Bitcoin began on the ground floor. In 2014, Patrick launched Bluegrass Bitcoin, deploying the first Bitcoin ATM north of Atlanta and south of Chicago. What started with a single machine in Lexington grew to include Louisville, making it possible for people across Kentucky to buy Bitcoin in person for the first time. He spent years maintaining machines, educating first-time users face-to-face, and navigating the operational realities of running Bitcoin infrastructure in the real world.
          </p>

          <h2 className="text-xl font-bold text-foreground pt-4">Consulting & Operations</h2>
          <p>
            From there, Patrick moved deeper into the technical side. He served as CTO/COO of Lexington Bitcoin Consulting for seven years, helping individuals and businesses adopt self-custody, Lightning payments, and node infrastructure. He ran Lightning Network infrastructure with 3Speak, contributed to mining operations and advisory, and managed conference logistics for BitBlockBoom, one of the largest Bitcoin-only conferences in the US.
          </p>

          <h2 className="text-xl font-bold text-foreground pt-4">Lexington Bitcoin Meetup</h2>
          <p>
            On January 20, 2015, Patrick founded the Lexington Bitcoin Meetup — a weekly gathering that has been meeting consistently for over a decade, making it one of the longest-running Bitcoin meetups in the country. What started as a handful of people in a room has grown into a permanent community hub for Bitcoiners across Central Kentucky, focused on education, connection, and building local circular economies.
          </p>

          <h2 className="text-xl font-bold text-foreground pt-4">Building the Stack</h2>
          <p>
            Today, Patrick runs <a href={GOOD_MORNING_BITCOIN_URL} target="_blank" rel="noopener noreferrer" className="text-bitcoin font-medium hover:underline">Good Morning Bitcoin</a>, a 24/7 Bitcoin radio station streaming podcasts, news, and education with zero ads. He also builds and runs <a href="https://nostr.blue" target="_blank" rel="noopener noreferrer" className="text-sovereign font-medium hover:underline">nostr.blue</a>, one of the most complete Nostr clients available. He's focused on building tools that remove middlemen and restore individual sovereignty, and on demonstrating the Nostr and Lightning stack by building on it.
          </p>
        </div>

        {/* Connect */}
        <div className="mt-16 pt-8 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">Connect</h3>
          <div className="flex flex-wrap items-center gap-4">
            <ZapPersonButton
              lightningAddress={LIGHTNING_ADDRESS}
              className="gradient-bitcoin text-white font-semibold px-6! h-10! rounded-full"
            />
            <a
              href={NOSTR_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sovereign hover:underline font-medium"
            >
              Nostr
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href={GOOD_MORNING_BITCOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bitcoin hover:underline font-medium"
            >
              Good Morning Bitcoin
            </a>
            <span className="text-muted-foreground">·</span>
            <a
              href={LEXINGTON_BITCOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-bitcoin hover:underline font-medium"
            >
              Lexington Bitcoin
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
