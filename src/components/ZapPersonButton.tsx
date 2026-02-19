import { useState } from 'react';
import { Zap, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ZapPersonButtonProps {
  lightningAddress: string;
  className?: string;
}

export function ZapPersonButton({ lightningAddress, className }: ZapPersonButtonProps) {
  const [amount, setAmount] = useState<string>('1000');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleZap = () => {
    // Create LNURL-pay URL
    const lnurlPayUrl = `lightning:${lightningAddress}?amount=${parseInt(amount) * 1000}`;
    window.open(lnurlPayUrl, '_self');
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(lightningAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className={className}>
          <Zap className="w-5 h-5 mr-2" />
          Support via Lightning
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-bitcoin" />
            Send a Zap
          </DialogTitle>
          <DialogDescription>
            Send a payment over the Lightning Network
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (sats)</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                min="1"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['100', '1000', '5000', '10000', '21000'].map((preset) => (
                <Button
                  key={preset}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(preset)}
                  className="flex-1"
                >
                  {parseInt(preset).toLocaleString()}
                </Button>
              ))}
            </div>
          </div>
          
          <Button onClick={handleZap} className="w-full gradient-bitcoin text-white">
            <Zap className="w-4 h-4 mr-2" />
            Zap {parseInt(amount).toLocaleString()} Sats
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or copy address</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              value={lightningAddress}
              readOnly
              className="flex-1"
            />
            <Button variant="outline" size="icon" onClick={copyAddress}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
