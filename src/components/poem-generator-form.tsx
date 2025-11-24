
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wand2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

const formSchema = z.object({
  prompt: z.string().min(3, 'Prompt must be at least 3 characters long.').max(200, 'Prompt must be 200 characters or less.'),
  mood: z.string().optional(),
  language: z.string().optional(),
  style: z.string().optional(),
  length: z.string().optional(),
  keywords: z.string().optional(),
  rhyme: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PoemGeneratorFormProps {
  onSubmit: (values: FormValues) => void;
  isLoading: boolean;
}

const moods = ['Happy', 'Sad', 'Reflective', 'Romantic', 'Mysterious', 'Humorous'];
const styles = ['Sonnet', 'Haiku', 'Free Verse', 'Limerick', 'Ode', 'Ballad'];
const lengths = ['Short', 'Medium', 'Long'];
const rhymeSchemes = ['AABB', 'ABAB', 'Free Verse'];
const languages = ['Formal', 'Informal', 'Simple', 'Poetic'];

export function PoemGeneratorForm({ onSubmit, isLoading }: PoemGeneratorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      mood: '',
      language: '',
      style: '',
      length: 'medium',
      keywords: '',
      rhyme: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
            <CardContent className="p-6 space-y-6">
                <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel className="text-base font-semibold">Your Core Idea</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="e.g., a silent forest under a blanket of snow"
                        className="min-h-[100px] text-base"
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>This is the central theme for your poem.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="mood"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Mood</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a mood" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {moods.map(m => <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a style" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {styles.map(s => <SelectItem key={s} value={s.toLowerCase().replace(' ', '-')}>{s}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Length</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a length" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {lengths.map(l => <SelectItem key={l} value={l.toLowerCase()}>{l}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a language" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {languages.map(l => <SelectItem key={l} value={l.toLowerCase()}>{l}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="rhyme"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Rhyme Scheme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select a rhyme" /></SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {rhymeSchemes.map(r => <SelectItem key={r} value={r.toLowerCase().replace(' ', '-')}>{r}</SelectItem>)}
                        </SelectContent>
                        </Select>
                    </FormItem>
                    )}
                />
                
                <FormField
                    control={form.control}
                    name="keywords"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Keywords</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., winter, stars" {...field} />
                        </FormControl>
                    </FormItem>
                    )}
                />
                </div>
            </CardContent>
        </Card>

        <div className="flex justify-center">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto" size="lg">
                {isLoading ? (
                    'Conjuring...'
                ) : (
                    <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate Poem
                    </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
