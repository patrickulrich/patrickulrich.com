import { useState, useEffect } from 'react';
import { Zap, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
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
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/useToast';
import QRCode from 'qrcode';

interface ZapPersonButtonProps {
  lightningAddress: string;
  className?: string;
}

export function ZapPersonButton({ lightningAddress, className }: ZapPersonButtonProps) {
  const [amount, setAmount] = useState<string>('1000');
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [invoice, setInvoice] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!isOpen) {
      setInvoice(null);
      setQrCodeUrl('');
      setAmount('1000');
    }
  }, [isOpen]);

  // Generate QR code when invoice changes
  useEffect(() => {
    let isCancelled = false;

    const generateQR = async () => {
      if (!invoice) {
        setQrCodeUrl('');
        return;
      }

      try {
        const url = await QRCode.toDataURL(invoice.toUpperCase(), {
          width: 400,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        });

        if (!isCancelled) {
          setQrCodeUrl(url);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to generate QR code:', err);
        }
      }
    };

    generateQR();

    return () => {
      isCancelled = true;
    };
  }, [invoice]);

  const fetchInvoice = async () => {
    const satAmount = parseInt(amount);
    if (isNaN(satAmount) || satAmount <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount in sats',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Parse the lightning address (user@domain.com format)
      const [username, domain] = lightningAddress.split('@');
      if (!username || !domain) {
        throw new Error('Invalid lightning address format');
      }

      // Step 1: Fetch LNURL-pay metadata
      const lnurlPayUrl = `https://${domain}/.well-known/lnurlp/${username}`;
      const payResponse = await fetch(lnurlPayUrl);
      
      if (!payResponse.ok) {
        throw new Error('Failed to fetch LNURL-pay endpoint');
      }

      const payData = await payResponse.json();
      
      if (payData.status === 'ERROR') {
        throw new Error(payData.reason || 'LNURL-pay endpoint error');
      }

      // Step 2: Fetch invoice from callback URL
      const millisats = satAmount * 1000;
      const callbackUrl = `${payData.callback}?amount=${millisats}`;
      const invoiceResponse = await fetch(callbackUrl);

      if (!invoiceResponse.ok) {
        throw new Error('Failed to fetch invoice');
      }

      const invoiceData = await invoiceResponse.json();

      if (invoiceData.status === 'ERROR') {
        throw new Error(invoiceData.reason || 'Invoice generation error');
      }

      if (invoiceData.pr) {
        setInvoice(invoiceData.pr);
      } else {
        throw new Error('No invoice returned');
      }
    } catch (error) {
      console.error('Error fetching invoice:', error);
      toast({
        title: 'Failed to get invoice',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyInvoice = async () => {
    if (invoice) {
      await navigator.clipboard.writeText(invoice);
      setCopied(true);
      toast({
        title: 'Invoice copied',
        description: 'Lightning invoice copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyAddress = async () => {
    await navigator.clipboard.writeText(lightningAddress);
    toast({
      title: 'Address copied',
      description: 'Lightning address copied to clipboard',
    });
  };

  const openInWallet = () => {
    if (invoice) {
      const lightningUrl = `lightning:${invoice}`;
      window.open(lightningUrl, '_blank');
    }
  };

  const goBack = () => {
    setInvoice(null);
    setQrCodeUrl('');
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
            {invoice ? 'Lightning Payment' : 'Send a Zap'}
          </DialogTitle>
          <DialogDescription>
            {invoice 
              ? 'Scan the QR code or copy the invoice'
              : 'Send a payment over the Lightning Network'}
          </DialogDescription>
        </DialogHeader>

        {invoice ? (
          // Invoice view with QR code
          <div className="space-y-4 py-4">
            {/* Amount display */}
            <div className="text-center">
              <div className="text-2xl font-bold">{parseInt(amount).toLocaleString()} sats</div>
            </div>

            <Separator />

            {/* QR Code */}
            <div className="flex justify-center">
              <Card className="p-3">
                <CardContent className="p-0 flex justify-center">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Lightning Invoice QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  ) : (
                    <div className="w-64 h-64 bg-muted animate-pulse rounded" />
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Invoice input with copy */}
            <div className="space-y-2">
              <Label htmlFor="invoice">Lightning Invoice</Label>
              <div className="flex gap-2">
                <Input
                  id="invoice"
                  value={invoice}
                  readOnly
                  className="font-mono text-xs flex-1"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button variant="outline" size="icon" onClick={copyInvoice}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              <Button onClick={openInWallet} className="w-full">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in Wallet
              </Button>
              <Button variant="outline" onClick={goBack} className="w-full">
                Change Amount
              </Button>
            </div>
          </div>
        ) : (
          // Amount selection view
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
            
            <Button 
              onClick={fetchInvoice} 
              className="w-full gradient-bitcoin text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Getting Invoice...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Zap {parseInt(amount || '0').toLocaleString()} Sats
                </>
              )}
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
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
