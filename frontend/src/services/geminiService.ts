export interface GeminiMessagePart {
  text: string;
}

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiMessagePart[];
}

export interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
    finishReason?: string;
  }[];
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

const GEMINI_MODEL = 'gemini-3.5-flash';

/**
 * Communicates directly with the Google Gemini API using browser fetch.
 * Uses the VITE_GEMINI_API_KEY from environment variables.
 * 
 * SAFETY CONSTRAINT: All error logs are sanitized to prevent leaking API credentials.
 */
export async function generateGeminiContent(
  systemPrompt: string,
  history: GeminiMessage[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key')) {
    throw new Error('Gemini API key is not configured or holds a placeholder.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload = {
    contents: history,
    systemInstruction: {
      parts: [
        {
          text: systemPrompt,
        },
      ],
    },
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Not JSON
      }

      const status = response.status;
      const statusText = response.statusText;
      const apiErrorMessage = errorData?.error?.message || '';

      // Throw a sanitized error without revealing the API key
      throw new Error(`Gemini API connection failed (${status} - ${statusText}): ${apiErrorMessage}`);
    }

    const data = (await response.json()) as GeminiResponse;

    if (data.error) {
      throw new Error(`Gemini API Error (${data.error.code}): ${data.error.message}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini API returned an empty or invalid content payload.');
    }

    return text;
  } catch (error: any) {
    // Sanitize any potential API key exposure in error logs
    const sanitizedMsg = error.message
      ? error.message.replace(/AIzaSy[A-Za-z0-9_-]{35}/g, '[REDACTED_API_KEY]')
      : 'Network connection failure';
    
    // Log sanitized error internally for developers
    console.error('Gemini Service caught a connection issue:', sanitizedMsg);
    throw new Error(sanitizedMsg);
  }
}
