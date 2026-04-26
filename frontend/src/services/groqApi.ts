/**
 * Groq AI API Service
 * Sử dụng Groq API để generate gợi ý cho VSTEP Speaking
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = import.meta.env.VITE_GROQ_MODEL || 'llama-3.3-70b-versatile';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_TRANSCRIBE_URL = 'https://api.groq.com/openai/v1/audio/transcriptions';
const GROQ_WHISPER_MODEL = 'whisper-large-v3-turbo';

/**
 * Transcribe audio file -> text using Groq Whisper (free tier)
 * Hỗ trợ mp3/wav/m4a/webm/ogg... ≤ 25MB
 */
export const transcribeAudio = async (
  file: File,
  language: string = 'en'
): Promise<string> => {
  if (!GROQ_API_KEY) {
    throw new Error('Missing VITE_GROQ_API_KEY');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('model', GROQ_WHISPER_MODEL);
  formData.append('response_format', 'text');
  if (language) formData.append('language', language);

  const response = await fetch(GROQ_TRANSCRIBE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => response.statusText);
    throw new Error(`Groq transcribe error: ${errText}`);
  }

  // response_format=text returns plain text
  const text = await response.text();
  return text.trim();
};

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

/**
 * Gọi Groq API
 */
const callGroqAPI = async (messages: GroqMessage[]): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data: GroqResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
};

/**
 * Generate topic suggestions cho Part 1
 */
export const generatePart1Topics = async (): Promise<string[]> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate topic names for Part 1 (Social Interaction) of VSTEP Speaking test.',
    },
    {
      role: 'user',
      content: `Generate 5 diverse topic names for VSTEP Speaking Part 1 (Social Interaction).
      
Topics should be about familiar daily life subjects like:
- Free time activities
- Hobbies
- Career/Work
- Hometown
- Family
- Food & Cooking
- Shopping
- Travel
- Technology
- Health & Exercise

Return ONLY a JSON array of topic names, nothing else. Example format:
["Free time activities", "Travel experiences", "Food and cooking"]`,
    },
  ];

  const response = await callGroqAPI(messages);
  
  try {
    // Parse JSON response
    const topics = JSON.parse(response);
    return Array.isArray(topics) ? topics : [];
  } catch (error) {
    console.error('Failed to parse topics:', error);
    return [];
  }
};

/**
 * Generate questions cho một topic trong Part 1
 */
export const generatePart1Questions = async (topicName: string): Promise<string[]> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate SHORT questions for Part 1 (Social Interaction).',
    },
    {
      role: 'user',
      content: `Generate 3 SHORT questions for VSTEP Speaking Part 1 about: "${topicName}"

Requirements:
- Keep questions VERY SHORT (8-9 words each, max 10 words)
- Use simple, natural language
- Mix question types: Yes/No, Wh-questions
- Easy to understand and answer
- Follow this format style:
  * Question 1: Basic/factual (e.g., "What is your job?", "Do you play games daily?")
  * Question 2: Preference/habit (e.g., "Where do you work?", "What's your favorite game?")
  * Question 3: Opinion/reason (e.g., "Do you like your job?", "Why do you enjoy it?")

Return ONLY a JSON array of 3 questions, nothing else. Example format:
["What is your job?", "Where do you work?", "Do you like your job?"]`,
    },
  ];

  const response = await callGroqAPI(messages);
  
  try {
    const questions = JSON.parse(response);
    return Array.isArray(questions) ? questions.slice(0, 3) : [];
  } catch (error) {
    console.error('Failed to parse questions:', error);
    return [];
  }
};

/**
 * Generate situation + solutions cho Part 2
 */
export const generatePart2Content = async (): Promise<{
  situation: string;
  solutions: string[];
  question: string;
}> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate CONCISE content for Part 2 (Solution Discussion).',
    },
    {
      role: 'user',
      content: `Generate content for VSTEP Speaking Part 2 (Solution Discussion).

Requirements:
- Create a SHORT, realistic situation (2-3 sentences max)
- Situation should INCLUDE the 3 solutions naturally in the description
- Solutions should be brief phrases (3-5 words each)
- Common topics: advertising methods, improving skills, choosing options, solving problems, making decisions

Format style (like official VSTEP):
"You are thinking about ways to advertise your chain cafeteria. There are 3 options: using the Internet, TV ads, and brochures. Which is the best option and why?"

Return ONLY a JSON object with this exact format:
{
  "situation": "Complete situation description that includes all 3 options naturally (2-3 sentences)",
  "solutions": ["Option 1 (brief)", "Option 2 (brief)", "Option 3 (brief)"],
  "question": "Which is the best option and why?"
}

IMPORTANT: The situation should be ONE cohesive paragraph that mentions all 3 solutions, not separate pieces.`,
    },
  ];

  const response = await callGroqAPI(messages);
  
  try {
    const content = JSON.parse(response);
    return {
      situation: content.situation || '',
      solutions: Array.isArray(content.solutions) ? content.solutions.slice(0, 3) : ['', '', ''],
      question: content.question || 'Which is the best option and why?',
    };
  } catch (error) {
    console.error('Failed to parse Part 2 content:', error);
    return {
      situation: '',
      solutions: ['', '', ''],
      question: 'Which is the best option and why?',
    };
  }
};

/**
 * Generate main topic cho Part 3
 */
export const generatePart3MainTopic = async (): Promise<string> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate DIVERSE main topics for Part 3 (Topic Development) of VSTEP Speaking test.',
    },
    {
      role: 'user',
      content: `Generate 1 main topic for VSTEP Speaking Part 3 (Topic Development).

The topic should:
- Be broad enough for a 2-minute talk
- Be relatable to students
- Allow for personal experiences and opinions
- MUST be DIVERSE - avoid topics about "English" or "learning English"

DIVERSE topic categories (choose randomly):
- Daily life: hobbies, free time, routines, habits
- People: family, friends, role models, neighbors
- Places: hometown, favorite places, travel destinations
- Activities: sports, cooking, shopping, entertainment
- Technology: social media, smartphones, internet, apps
- Education: school life, studying methods, favorite subjects (NOT English learning)
- Work: jobs, careers, workplace, future plans
- Health: exercise, diet, wellness, lifestyle
- Environment: nature, pollution, recycling, climate
- Culture: festivals, traditions, customs, celebrations
- Food: cooking, restaurants, favorite dishes, eating habits
- Transportation: commuting, vehicles, public transport

Return ONLY the topic text (2-4 words), nothing else. Examples:
"Cooking at home"
"Your hometown"
"Social media use"
"Weekend activities"`,
    },
  ];

  const response = await callGroqAPI(messages);
  return response.trim().replace(/^["']|["']$/g, ''); // Remove quotes if any
};

/**
 * Generate suggested ideas cho Part 3
 */
export const generatePart3Ideas = async (mainTopic: string): Promise<string[]> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate suggested ideas for Part 3 (Topic Development) of VSTEP Speaking test.',
    },
    {
      role: 'user',
      content: `Generate 4-5 suggested ideas for VSTEP Speaking Part 3 about: "${mainTopic}"

These ideas should:
- Help students structure their 2-minute talk
- Cover different aspects (who, what, when, where, why, how)
- Be brief bullet points

Return ONLY a JSON array of 4-5 ideas, nothing else. Example format:
["Where you went", "When you went there", "Who you went with", "What you did there", "Why it was memorable"]`,
    },
  ];

  const response = await callGroqAPI(messages);
  
  try {
    const ideas = JSON.parse(response);
    return Array.isArray(ideas) ? ideas.slice(0, 5) : [];
  } catch (error) {
    console.error('Failed to parse ideas:', error);
    return [];
  }
};

/**
 * Generate follow-up questions cho Part 3
 */
export const generatePart3Questions = async (mainTopic: string): Promise<string[]> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate follow-up questions for Part 3 (Topic Development) of VSTEP Speaking test.',
    },
    {
      role: 'user',
      content: `Generate 2-3 follow-up questions for VSTEP Speaking Part 3 about: "${mainTopic}"

These questions should:
- Be deeper than the main topic
- Require analysis, comparison, or evaluation
- Be open-ended
- Relate to the main topic but expand beyond personal experience

Return ONLY a JSON array of 2-3 questions, nothing else. Example format:
["Do you think traveling is important for young people? Why?", "How has tourism changed in your country in recent years?"]`,
    },
  ];

  const response = await callGroqAPI(messages);
  
  try {
    const questions = JSON.parse(response);
    return Array.isArray(questions) ? questions.slice(0, 3) : [];
  } catch (error) {
    console.error('Failed to parse follow-up questions:', error);
    return [];
  }
};

/**
 * Generate ideas + questions based on existing main topic
 * Used when teacher already has a main topic and wants AI to suggest ideas + questions
 */
export const generatePart3FromTopic = async (mainTopic: string): Promise<{
  suggestedIdeas: string[];
  followUpQuestions: string[];
}> => {
  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: 'You are an expert VSTEP Speaking test creator. Generate ideas and questions for Part 3 based on a given main topic.',
    },
    {
      role: 'user',
      content: `Generate ideas and questions for VSTEP Speaking Part 3 based on this main topic: "${mainTopic}"

Requirements:
- 4 suggested ideas: SHORT phrases (2-4 words each) that relate to the main topic
  * These will be displayed in a mind map around the center
  * Keep them brief, clear, and diverse
  * Cover different aspects: benefits, challenges, personal experience, opinions
  * Examples: "Saves time", "More convenient", "Expensive", "Popular choice"
- 2 follow-up questions: Deeper analytical questions (10-15 words each)
  * Should expand beyond personal experience
  * Require comparison, evaluation, or analysis
  * Related to the main topic but broader perspective

Return ONLY a JSON object:
{
  "suggestedIdeas": ["Idea 1 (2-4 words)", "Idea 2", "Idea 3", "Idea 4"],
  "followUpQuestions": ["Question 1 (10-15 words)", "Question 2 (10-15 words)"]
}`,
    },
  ];

  const response = await callGroqAPI(messages);
  
  try {
    const content = JSON.parse(response);
    return {
      suggestedIdeas: Array.isArray(content.suggestedIdeas) ? content.suggestedIdeas.slice(0, 4) : ['', '', '', ''],
      followUpQuestions: Array.isArray(content.followUpQuestions) ? content.followUpQuestions.slice(0, 3) : ['', ''],
    };
  } catch (error) {
    console.error('Failed to generate ideas from topic:', error);
    return {
      suggestedIdeas: ['', '', '', ''],
      followUpQuestions: ['', ''],
    };
  }
};

/**
 * Enhance/rewrite existing Part 1 questions để đa dạng và tự nhiên hơn
 * Nhận vào topic + câu hỏi hiện có, trả về phiên bản cải thiện
 */
export const enhancePart1Questions = async (
  topicName: string,
  existingQuestions: string[]
): Promise<string[]> => {
  // Lọc câu hỏi có nội dung
  const filledQuestions = existingQuestions.filter(q => q.trim());

  const messages: GroqMessage[] = [
    {
      role: 'system',
      content: `You are an expert VSTEP Speaking test designer. Rewrite questions to be VERY SHORT and NATURAL.

Guidelines:
- Keep questions VERY SHORT (8-9 words, max 10 words)
- Use simple, conversational language
- Mix question types: Yes/No, Wh-questions
- Questions should feel natural and easy
- Appropriate for B1-B2 level
- Follow progression: Basic → Preference → Opinion`,
    },
    {
      role: 'user',
      content: `Topic: "${topicName}"

${filledQuestions.length > 0
  ? `Current questions (make them SHORTER - only 8-9 words each):
${filledQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`
  : `Generate 3 VERY SHORT questions (8-9 words each).`}

Requirements:
- Return exactly 3 questions
- Each question 8-9 words (max 10 words)
- Follow this progression:
  * Question 1: Basic/factual (e.g., "What is your job?")
  * Question 2: Preference/habit (e.g., "Where do you work?")
  * Question 3: Opinion/reason (e.g., "Do you like your job?")
- Keep them conversational and easy
- Suitable for VSTEP Speaking Part 1

Return ONLY a JSON array of exactly 3 strings, no explanation:
["Question 1", "Question 2", "Question 3"]`,
    },
  ];

  const response = await callGroqAPI(messages);

  try {
    // Try to extract JSON array from response
    const match = response.match(/\[[\s\S]*\]/);
    if (match) {
      const questions = JSON.parse(match[0]);
      if (Array.isArray(questions) && questions.length >= 3) {
        return questions.slice(0, 3);
      }
    }
    // Fallback: parse full response
    const questions = JSON.parse(response);
    return Array.isArray(questions) ? questions.slice(0, 3) : existingQuestions;
  } catch (err) {
    console.error('Failed to parse enhanced questions:', err);
    return existingQuestions;
  }
};
