-- Ensure notes table has proper timestamp columns
ALTER TABLE IF EXISTS notes 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a note is updated
DROP TRIGGER IF EXISTS on_note_updated ON notes;
CREATE TRIGGER on_note_updated
  BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
