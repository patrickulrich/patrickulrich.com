import { useSeoMeta } from '@unhead/react';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ZapPersonButton } from '@/components/ZapPersonButton';
import { cn } from '@/lib/utils';

const PATRICK_HEX_PUBKEY = '0f563fe2cfdf180cb104586b95873379a0c1fdcfbc301a80c8255f33d15f039d';
const NOSTR_PROFILE_URL = `https://nostr.blue/profile/${PATRICK_HEX_PUBKEY}`;
const AVATAR_URL = 'https://relay.patrickulrich.com/8376dba8728c2672acc10b7a5fce3f7cbde9299a4c0151b34b6a431d48715652.png';
const BANNER_URL = 'https://m.primal.net/HhVD.jpg';
const LIGHTNING_ADDRESS = 'patrick@sats.love';
const UNDISCOVERED_WEB_URL = 'https://undiscoveredweb.com/';

const Index = () => {
  useSeoMeta({
    title: 'Patrick Ulrich | Bitcoin & Digital Sovereignty',
    description: 'Personal website of Patrick Ulrich - Bitcoin advocate, developer, and proponent of digital sovereignty and decentralized technologies.',
    ogTitle: 'Patrick Ulrich | Bitcoin & Digital Sovereignty',
    ogDescription: 'Personal website of Patrick Ulrich - Bitcoin advocate, developer, and proponent of digital sovereignty and decentralized technologies.',
    ogImage: BANNER_URL,
    twitterCard: 'summary_large_image',
    twitterTitle: 'Patrick Ulrich | Bitcoin & Digital Sovereignty',
    twitterDescription: 'Personal website of Patrick Ulrich - Bitcoin advocate, developer, and proponent of digital sovereignty and decentralized technologies.',
    twitterImage: BANNER_URL,
  });

  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <a href={NOSTR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="block">
              <Avatar className="w-40 h-40 md:w-52 md:h-52 border-4 border-background shadow-2xl relative z-10 cursor-pointer hover:scale-105 transition-transform duration-300">
                <AvatarImage src={AVATAR_URL} alt="Patrick Ulrich" className="object-cover" />
                <AvatarFallback className="text-4xl gradient-bitcoin text-white">PU</AvatarFallback>
              </Avatar>
            </a>
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span className="text-gradient-hero">Patrick Ulrich</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl text-foreground font-medium mb-4 max-w-2xl mx-auto">
            Bitcoin Advocate & Digital Sovereignty
          </p>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-xl mx-auto">
            Building tools for a decentralized future
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <ZapPersonButton 
              lightningAddress={LIGHTNING_ADDRESS}
              className="gradient-bitcoin text-white font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            />
            <Button 
              asChild
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg rounded-full border-2 hover:border-bitcoin hover:text-bitcoin transition-all duration-300"
            >
              <a href={NOSTR_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                </svg>
                View on Nostr
              </a>
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
                  I'm passionate about Bitcoin, Nostr, and the decentralized future. 
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
                        value="Advocate"
                        className="text-bitcoin"
                      />
                      <StatCard 
                        icon="⚡" 
                        label="Lightning" 
                        value="Developer"
                        className="text-gold"
                      />
                      <StatCard 
                        icon="🔮" 
                        label="Nostr" 
                        value="Contributor"
                        className="text-sovereign"
                      />
                      <StatCard 
                        icon="💻" 
                        label="Open Source" 
                        value="Creator"
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

      {/* Explore Section */}
      <section className="py-24 md:py-32 relative bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-foreground">Explore </span>
                <span className="text-gradient-bitcoin">More</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Connect and discover more about the decentralized ecosystem.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Nostr Profile Card */}
              <Card className="group hover:border-bitcoin/50 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <a href={NOSTR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full gradient-bitcoin flex items-center justify-center text-white text-2xl hover:opacity-90 transition-opacity">
                      🔮
                    </a>
                    <div>
                      <a href={NOSTR_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-xl hover:text-bitcoin transition-colors">
                        nostr.blue
                      </a>
                      <p className="text-sm text-muted-foreground">Follow me on Nostr</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Connect with me on the decentralized social network. View my posts, interactions, and more on nostr.blue.
                  </p>
                  <Button 
                    asChild
                    className="w-full gradient-bitcoin text-white"
                  >
                    <a href={NOSTR_PROFILE_URL} target="_blank" rel="noopener noreferrer">
                      View Profile on nostr.blue
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Undiscovered Web Card */}
              <Card className="group hover:border-sovereign/50 transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <a href={UNDISCOVERED_WEB_URL} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-sovereign flex items-center justify-center text-white text-2xl hover:opacity-90 transition-opacity">
                      🌐
                    </a>
                    <div>
                      <a href={UNDISCOVERED_WEB_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-xl hover:text-sovereign transition-colors">
                        Undiscovered Web
                      </a>
                      <p className="text-sm text-muted-foreground">Explore the decentralized web</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Discover the future of the internet. Learn about decentralized technologies, sovereign identity, and digital freedom.
                  </p>
                  <Button 
                    asChild
                    className="w-full bg-sovereign hover:bg-sovereign/90 text-white"
                  >
                    <a href={UNDISCOVERED_WEB_URL} target="_blank" rel="noopener noreferrer">
                      Learn More
                    </a>
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
            <a 
              href={NOSTR_PROFILE_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={AVATAR_URL} alt="Patrick Ulrich" />
                <AvatarFallback className="gradient-bitcoin text-white">PU</AvatarFallback>
              </Avatar>
              <span className="font-semibold text-lg">Patrick Ulrich</span>
            </a>

            <div className="flex items-center gap-6">
              <a 
                href="https://shakespeare.diy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-bitcoin transition-colors text-sm"
              >
                Built with Shakespeare
              </a>
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
