import { useSeoMeta } from '@unhead/react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ZapPersonButton } from '@/components/ZapPersonButton';
import { cn } from '@/lib/utils';

const PATRICK_PUBKEY = 'npub1patrlck0muvqevgytp4etpen0xsvrlw0hscp4qxgy40n852lqwwsz79h9a';
const AVATAR_URL = 'https://relay.patrickulrich.com/8376dba8728c2672acc10b7a5fce3f7cbde9299a4c0151b34b6a431d48715652.png';
const BANNER_URL = 'https://m.primal.net/HhVD.jpg';
const LIGHTNING_ADDRESS = 'patrick@sats.love';

const Index = () => {
  useSeoMeta({
    title: 'Patrick Ulrich | Bitcoin & Digital Sovereignty',
    description: 'Personal space of Patrick Ulrich - Bitcoin enthusiast, vibe coder, and advocate for digital sovereignty.',
    ogTitle: 'Patrick Ulrich | Bitcoin & Digital Sovereignty',
    ogDescription: 'Personal space of Patrick Ulrich - Bitcoin enthusiast, vibe coder, and advocate for digital sovereignty.',
    ogImage: BANNER_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: 'Patrick Ulrich | Bitcoin & Digital Sovereignty',
    twitterDescription: 'Personal space of Patrick Ulrich - Bitcoin enthusiast, vibe coder, and advocate for digital sovereignty.',
    twitterImage: BANNER_URL,
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const copyNostrAddress = () => {
    navigator.clipboard.writeText(PATRICK_PUBKEY);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden noise-overlay">
        {/* Animated background gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-bitcoin/20 blur-3xl animate-float"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div 
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-gold/20 blur-3xl animate-float-slow"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sovereign/10 blur-3xl animate-pulse-glow"
          />
        </div>

        {/* Banner Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${BANNER_URL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 text-center">
          {/* Avatar */}
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 gradient-bitcoin rounded-full blur-xl opacity-50 animate-pulse-glow scale-110" />
            <Avatar className="w-40 h-40 md:w-52 md:h-52 border-4 border-background shadow-2xl relative z-10">
              <AvatarImage src={AVATAR_URL} alt="Patrick Ulrich" className="object-cover" />
              <AvatarFallback className="text-4xl gradient-bitcoin text-white">PU</AvatarFallback>
            </Avatar>
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-4 tracking-tight">
            <span className="text-gradient-hero">Patrick Ulrich</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-8 max-w-2xl mx-auto font-light">
            <span className="text-bitcoin">@hodlbod's</span> #1 Vibe Coder
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-xl mx-auto">
            Bitcoin & Digital Sovereignty
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <ZapPersonButton 
              lightningAddress={LIGHTNING_ADDRESS}
              className="gradient-bitcoin text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
            <Button 
              variant="outline" 
              size="lg"
              onClick={copyNostrAddress}
              className="px-8 py-6 text-lg rounded-full border-2 hover:border-bitcoin hover:text-bitcoin transition-all duration-300"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
              </svg>
              Copy Nostr Address
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                  <span className="text-gradient-bitcoin">Building the</span>
                  <br />
                  <span className="text-foreground">Future of Freedom</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  I'm passionate about Bitcoin, Nostr, and the decentralized future. As a vibe coder, 
                  I believe in building tools that empower individuals and preserve digital sovereignty.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  My work focuses on creating seamless experiences at the intersection of 
                  <span className="text-bitcoin font-medium"> Bitcoin</span> and 
                  <span className="text-sovereign font-medium"> decentralized social protocols</span>.
                </p>
              </div>

              {/* Visual Element */}
              <div className="relative">
                <Card className="bg-card/50 backdrop-blur-gradient border-bitcoin/20 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6">
                      <StatCard 
                        icon="₿" 
                        label="Bitcoin" 
                        value="Maxi"
                        className="text-bitcoin"
                      />
                      <StatCard 
                        icon="⚡" 
                        label="Lightning" 
                        value="Native"
                        className="text-gold"
                      />
                      <StatCard 
                        icon="🔮" 
                        label="Nostr" 
                        value="Active"
                        className="text-sovereign"
                      />
                      <StatCard 
                        icon="💻" 
                        label="Vibe Coding" 
                        value="Daily"
                        className="text-bitcoin"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connections Section */}
      <section className="py-24 md:py-32 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-foreground">Find Me </span>
                <span className="text-gradient-bitcoin">On Nostr</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Connect with me on the decentralized social network built on freedom and censorship resistance.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Nostr Profile Card */}
              <Card className="group hover:border-bitcoin/50 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full gradient-bitcoin flex items-center justify-center text-white text-xl">
                      🔮
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Nostr Profile</h3>
                      <p className="text-sm text-muted-foreground">npub1patr...</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 overflow-x-auto">
                    <code className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                      {PATRICK_PUBKEY}
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-bitcoin group-hover:text-white transition-colors"
                    onClick={copyNostrAddress}
                  >
                    Copy Address
                  </Button>
                </CardContent>
              </Card>

              {/* Lightning Address Card */}
              <Card className="group hover:border-gold/50 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-white text-xl">
                      ⚡
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Lightning Address</h3>
                      <p className="text-sm text-muted-foreground">Zap me sats!</p>
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3 mb-4 overflow-x-auto">
                    <code className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
                      {LIGHTNING_ADDRESS}
                    </code>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-gold group-hover:text-white transition-colors"
                    onClick={() => navigator.clipboard.writeText(LIGHTNING_ADDRESS)}
                  >
                    Copy Address
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8">
              <span className="text-foreground">Digital </span>
              <span className="text-gradient-bitcoin">Sovereignty</span>
            </h2>
            
            <blockquote className="text-xl md:text-2xl lg:text-3xl text-muted-foreground italic leading-relaxed mb-8">
              "The ability to control your own data, your own identity, and your own financial destiny 
              is the foundation of true freedom in the digital age."
            </blockquote>

            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 rounded-full bg-bitcoin/10 text-bitcoin font-medium">Bitcoin</span>
              <span className="px-4 py-2 rounded-full bg-sovereign/10 text-sovereign font-medium">Nostr</span>
              <span className="px-4 py-2 rounded-full bg-gold/10 text-gold font-medium">Lightning</span>
              <span className="px-4 py-2 rounded-full bg-bitcoin/10 text-bitcoin font-medium">Open Source</span>
              <span className="px-4 py-2 rounded-full bg-sovereign/10 text-sovereign font-medium">Freedom</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={AVATAR_URL} alt="Patrick Ulrich" />
                <AvatarFallback className="gradient-bitcoin text-white">PU</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">Patrick Ulrich</span>
            </div>

            <div className="flex items-center gap-6">
              <a 
                href="https://shakespeare.diy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-bitcoin transition-colors text-sm"
              >
                Vibed with Shakespeare
              </a>
              <span className="text-muted-foreground/50">|</span>
              <span className="text-muted-foreground text-sm">
                Built with Bitcoin energy ⚡
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Stat Card Component
function StatCard({ 
  icon, 
  label, 
  value, 
  className 
}: { 
  icon: string; 
  label: string; 
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("text-center p-4 rounded-xl bg-muted/50", className)}>
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className={cn("font-semibold text-lg", className)}>{value}</div>
    </div>
  );
}

export default Index;
