CREATE TABLE public.prompt_entries (
  id bigint generated always as identity primary key,
  name text NOT NULL CHECK (char_length(trim(name)) BETWEEN 1 AND 40),
  prompt text NOT NULL CHECK (char_length(prompt) BETWEEN 3 AND 2000),
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  helped boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.prompt_entries TO anon;
GRANT ALL ON public.prompt_entries TO service_role;

ALTER TABLE public.prompt_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read the board" ON public.prompt_entries
  FOR SELECT TO anon USING (true);

CREATE POLICY "anyone can submit an entry" ON public.prompt_entries
  FOR INSERT TO anon WITH CHECK (true);