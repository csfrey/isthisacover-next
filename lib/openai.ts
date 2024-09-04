import OpenAI from "openai";
export const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_SECRET_KEY,
});

export var assistant: OpenAI.Beta.Assistants.Assistant;
export var isInitialized = false; // I have no idea if this will actually work

export async function init() {
  console.log("Initializing assistant");
  assistant = await openai.beta.assistants.create({
    name: "Cover Detector",
    instructions:
      "You are a bot who's only job is to determine if a given song is a cover. If the song is a cover you should also determine the song's original artist. You should give your response only as a JSON object in the form `{ isCover: boolean, originalArtist: string }`.",
    model: "gpt-4o",
  });
  isInitialized = true;
  console.log("Assistant initialized");
}
