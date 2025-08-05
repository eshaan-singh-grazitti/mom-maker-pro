import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export const generateMeetingMinutes = async (transcript: string, meetingTitle?: string, meetingDate?: string) => {
  const { data, error } = await supabase.functions.invoke('generate-meeting-minutes', {
    body: {
      transcript,
      meetingTitle,
      meetingDate
    }
  })

  if (error) {
    throw new Error(error.message || 'Failed to generate meeting minutes')
  }

  return data
}