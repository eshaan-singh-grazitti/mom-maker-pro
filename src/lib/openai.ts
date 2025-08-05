export const generateMeetingMinutes = async (
  transcript: string, 
  meetingTitle?: string, 
  meetingDate?: string,
  apiKey?: string
) => {
  const openaiApiKey = apiKey || localStorage.getItem('openai_api_key');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key is required. Please set it in the settings.');
  }

  const prompt = `Please analyze the following meeting transcript and extract structured information to create professional meeting minutes. Return ONLY a valid JSON object with the following structure:

{
  "attendees": ["Name (Role)", ...],
  "agenda": ["Agenda item 1", ...],
  "summary": "Comprehensive summary of the meeting discussion",
  "decisions": ["Decision 1", ...],
  "actionItems": [
    {
      "id": "unique_id",
      "task": "Task description",
      "owner": "Person Name",
      "deadline": "YYYY-MM-DD"
    }, ...
  ]
}

Meeting Transcript:
${transcript}

Instructions:
- Extract actual attendee names and roles if mentioned
- Identify key discussion points for the agenda
- Provide a comprehensive summary of what was discussed
- List clear decisions that were made
- Extract actionable items with owners and deadlines (if not specified, suggest reasonable deadlines within 1-2 weeks)
- Ensure all JSON is properly formatted and valid`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openaiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4.1-2025-04-14',
      messages: [
        {
          role: 'system',
          content: 'You are an expert meeting minutes generator. Extract structured information from meeting transcripts and return only valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} ${errorData.error?.message || response.statusText}`);
  }

  const openaiResponse = await response.json();
  const content = openaiResponse.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from OpenAI');
  }

  // Parse the JSON response from OpenAI
  let meetingData;
  try {
    meetingData = JSON.parse(content);
  } catch (parseError) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Invalid JSON response from OpenAI');
  }

  // Add the meeting title and date
  meetingData.meetingTitle = meetingTitle || 'Meeting Minutes';
  meetingData.meetingDate = meetingDate || new Date().toISOString().split('T')[0];

  return meetingData;
};