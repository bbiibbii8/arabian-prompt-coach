import { supabase } from "@/integrations/supabase/client";

export type Entry = {
  id: number;
  name: string;
  prompt: string;
  score: number;
  helped: boolean;
  created_at: string;
};

export async function submitEntry(e: {
  name: string;
  prompt: string;
  score: number;
  helped: boolean;
}): Promise<number> {
  const { data, error } = await supabase
    .from("prompt_entries")
    .insert({
      name: e.name.trim().slice(0, 40),
      prompt: e.prompt.trim().slice(0, 2000),
      score: Math.round(e.score),
      helped: e.helped,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as number;
}

export async function fetchBoard(): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("prompt_entries")
    .select("id,name,prompt,score,helped,created_at")
    .order("score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as Entry[];
}
