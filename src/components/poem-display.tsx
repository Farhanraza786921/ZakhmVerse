
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from './ui/separator';

interface PoemDisplayProps {
  prompt: string;
  poem: string;
}

export function PoemDisplay({ prompt, poem }: PoemDisplayProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // This ensures the animation runs on mount
    const timer = setTimeout(() => setIsMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(poem)
      .then(() => toast({ title: 'Copied to clipboard!' }))
      .catch(() => toast({ title: 'Failed to copy', variant: 'destructive' }));
  };

  const handleShare = async () => {
    const shareData = {
      title: `A poem about "${prompt}"`,
      text: poem,
    };
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
        // If sharing fails, fall back to copying
        handleCopy();
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy();
    }
  };

  return (
    <Card className={`transition-opacity duration-1000 ease-out ${isMounted ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Your Verse</CardTitle>
        <CardDescription>Inspired by: "{prompt}"</CardDescription>
      </CardHeader>
      <CardContent>
        <Separator className="mb-6"/>
        <pre className="whitespace-pre-wrap font-body text-base leading-relaxed">
          {poem}
        </pre>
      </CardContent>
      <CardFooter className="gap-2 justify-end">
        <Button onClick={handleCopy} variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        {typeof navigator !== 'undefined' && navigator.share && (
          <Button onClick={handleShare} size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
