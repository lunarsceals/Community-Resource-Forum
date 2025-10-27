import { db } from "~/server/db";
import { posts, profiles, events, flags } from "~/server/db/schema";
import { sql } from "drizzle-orm";

import Post from "~/components/Post";

export default async function AdminPage() {
  const results = await db.query.posts.findMany({
    with: {
      author: true,
      event: true,
      flags: true,
    },
    orderBy: sql`(SELECT COUNT(*) FROM flags WHERE flags.postId = ${posts.id}) DESC`,
  });

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-6">
      {results.length === 0 ? (
        <p className="max-w-prose text-center text-sm text-gray-600">
          There aren’t any posts to display yet. Try signing in and publishing
          some!
        </p>
      ) : (
        results.map(
          ({
            id,
            createdAt,
            updatedAt,
            content,
            authorId,
            eventId,
            event,
            flags,
            author,
          }) => (
            <Post
              key={id}
              post={{
                id,
                createdAt,
                updatedAt,
                content,
                authorId,
                eventId,
              }}
              profile={author}
              event={event!}
              vote={null}
              session={null}
            />
          ),
        )
      )}
    </div>
  );
}
