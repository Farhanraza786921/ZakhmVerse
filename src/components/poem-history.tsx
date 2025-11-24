
'use client';

import type { Poem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Trash2, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';

interface PoemHistoryProps {
  history: Poem[];
  onSelectPoem: (poem: Poem) => void;
  onClearHistory: () => void;
}

export function PoemHistory({ history, onSelectPoem, onClearHistory }: PoemHistoryProps) {
  const { open } = useSidebar();

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-between p-4 border-b h-[65px] flex-shrink-0">
            <h2 className={cn("font-headline text-lg font-semibold", !open && "hidden")}>History</h2>
            <Button variant="ghost" size="icon" onClick={onClearHistory} aria-label="Clear history">
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
        <ScrollArea className="flex-1">
            {history.length === 0 ? (
                 <div className="flex flex-col items-center justify-center text-center p-4 h-full">
                    <History className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className={cn("text-sm text-muted-foreground", !open && "hidden")}>No poems yet.</span>
                 </div>
            ) : (
                <div className="p-2 space-y-1">
                {history.map((poem) => (
                    <button
                        key={poem.id}
                        onClick={() => onSelectPoem(poem)}
                        className={cn(
                            "w-full flex items-center gap-3 text-left p-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            !open && "justify-center"
                        )}
                        title={open ? "" : poem.prompt}
                    >
                        <BookText className="h-5 w-5 flex-shrink-0" />
                        <div className={cn("overflow-hidden w-full", !open && "hidden")}>
                            <p className="font-medium truncate text-sm">{poem.prompt}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(poem.timestamp).toLocaleDateString()}
                            </p>
                        </div>
                    </button>
                ))}
                </div>
            )}
        </ScrollArea>
    </div>
  );
}
