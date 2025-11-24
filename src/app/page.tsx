
'use client';

import { useState } from 'react';
import { PoemGeneratorForm } from '@/components/poem-generator-form';
import { PoemDisplay } from '@/components/poem-display';
import { handleGeneratePoem } from '@/app/actions';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { Poem } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarTrigger, SidebarContent, SidebarInset } from '@/components/ui/sidebar';
import { PoemHistory } from '@/components/poem-history';
import { Logo } from '@/components/logo';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type PoemFormData = {
  prompt: string;
  mood?: string;
  language?: string;
  style?: string;
  length?: string;
  keywords?: string;
  rhyme?: string;
};

export default function Home() {
  const [history, setHistory] = useLocalStorage<Poem[]>('poem-history', []);
  const [currentPoem, setCurrentPoem] = useState<Poem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: PoemFormData) => {
    setIsLoading(true);
    setCurrentPoem(null);
    setError(null);

    const result = await handleGeneratePoem(data);
    
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.poem) {
      const newPoem: Poem = {
        id: new Date().toISOString(),
        prompt: data.prompt,
        poem: result.poem,
        timestamp: Date.now(),
      };
      setCurrentPoem(newPoem);
      setHistory(prevHistory => [newPoem, ...prevHistory].slice(0, 50)); // Keep latest 50
    }
  };

  const handleSelectPoem = (poem: Poem) => {
    setCurrentPoem(poem);
  };

  const handleClearHistory = () => {
    setHistory([]);
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <PoemHistory history={history} onSelectPoem={handleSelectPoem} onClearHistory={handleClearHistory} />
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-svh">
          <header className="sticky top-0 z-10 flex h-[65px] items-center justify-between p-4 border-b bg-background/80 backdrop-blur-sm">
            <Logo />
            <SidebarTrigger />
          </header>
          <main className="flex-1 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="text-center">
                <h1 className="text-4xl font-bold font-headline tracking-tight text-foreground sm:text-5xl">
                  Craft Your Verse
                </h1>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                  Let your thoughts flow into poetry. Describe a scene, a feeling, or a dream, and watch it transform.
                </p>
              </div>

              <PoemGeneratorForm onSubmit={onSubmit} isLoading={isLoading} />
              
              {isLoading && <LoadingState />}
              
              {error && (
                <Card className="border-destructive bg-destructive/10">
                  <CardContent className="p-6">
                    <p className="text-destructive-foreground text-center font-medium">{error}</p>
                  </CardContent>
                </Card>
              )}

              {currentPoem && !isLoading && (
                <PoemDisplay 
                  key={currentPoem.id} 
                  prompt={currentPoem.prompt}
                  poem={currentPoem.poem} 
                />
              )}

              {!isLoading && !currentPoem && !error && <WelcomeState />}
            </div>
          </main>
           <footer className="p-4 text-center text-sm text-muted-foreground">
              <Separator className="mb-4" />
              <p>Powered by AI & Imagination</p>
           </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

const LoadingState = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/4" />
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </CardContent>
  </Card>
);

const WelcomeState = () => (
    <Card className="text-center border-dashed">
        <CardContent className="p-12">
            <p className="text-muted-foreground">Your generated poem will appear here.</p>
        </CardContent>
    </Card>
);
