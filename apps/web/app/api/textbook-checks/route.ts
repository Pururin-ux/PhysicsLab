import { projectTextbookCheckActivity } from "../../../lib/learning/textbook-check-activity.ts";
import { textbookChapterIds } from "../../../lib/learning/textbook-index.ts";
import { textbookChapters } from "../../../lib/learning/textbook.ts";

const knownChapterIds = new Set<string>(textbookChapterIds);
const chaptersById = new Map(textbookChapters.map((chapter) => [chapter.id, chapter]));

export function GET(request: Request) {
  const ids = new URL(request.url).searchParams.getAll("id");
  if (ids.length > textbookChapterIds.length) {
    return Response.json({ error: "Too many chapter IDs" }, { status: 400 });
  }

  const requested = [...new Set(ids.filter((id) => knownChapterIds.has(id)))];
  const definitions = requested.flatMap((id) => {
    const chapter = chaptersById.get(id);
    return chapter ? [projectTextbookCheckActivity(chapter)] : [];
  });
  return Response.json({ definitions }, { headers: { "Cache-Control": "no-store" } });
}
