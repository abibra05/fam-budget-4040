
export const narrateText = async (text: string, apiKey: string): Promise<string | null> => {
  const aivoiceId = '21m00Tcm4TlvDq8ikWAM'; // Pre-selected voice ID from ElevenLabs
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${aivoiceId}`;

  const headers = {
    "Accept": "audio/mpeg",
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  };

  const data = {
    text: text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    },
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`ElevenLabs API request failed: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    return audioUrl;

  } catch (error) {
    console.error("Error calling ElevenLabs API:", error);
    throw error;
  }
};
