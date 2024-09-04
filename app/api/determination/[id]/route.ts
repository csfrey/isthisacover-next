import { spotifyClient } from "@/lib/spotify";
import { openai, assistant, isInitialized, init } from "@/lib/openai";
import { parseTrack } from "@/lib/utils";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const result = await spotifyClient.tracks.get(params.id);
  const track = parseTrack(result);

  if (!isInitialized) {
    await init();
  }

  const thread = await openai.beta.threads.create();

  const message = await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: `"${track.name}" by ${track.artist}`,
  });
  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });
  if (run.status === "completed") {
    const messages = await openai.beta.threads.messages.list(run.thread_id);
    const content: any = messages.data[0].content[0];

    let unparsed: string = content.text.value;
    let parsed;

    try {
      parsed = JSON.parse(unparsed);
    } catch {
      const matches = unparsed.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      parsed = JSON.parse(matches?.[1] || "{}");
    }

    return Response.json(parsed);
  }

  return Response.error();
}
