import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export function SiteNav() {
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', to: '/' },
    { label: 'Blog', to: '/blog' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-md shadow-md hover:bg-background/90"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 mt-6">
          {links.map((link) => (
            <Button
              key={link.to}
              variant="ghost"
              className="justify-start text-lg font-medium py-3"
              asChild
            >
              <Link
                to={link.to}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            </Button>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
