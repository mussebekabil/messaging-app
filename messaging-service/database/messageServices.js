import { executeQuery } from "./database.js";

/**
 * Message related queries
*/
export const saveMessage = async (authorId, content) => {
  let result = await executeQuery(
    "INSERT INTO messages (author_id, content) VALUES ($authorId, $content) RETURNING id, created_at, vote;",
    { authorId, content },
  );

  if(result.error && result.error.toString().includes('violates foreign key constraint "fk_author"')) {
    await executeQuery(
      "INSERT INTO users (id) VALUES ($userId);",
      { userId: authorId },
    );
    result = await executeQuery(
      "INSERT INTO messages (author_id, content) VALUES ($authorId, $content) RETURNING id, created_at, vote;",
      { authorId, content },
    );
  }
  return result?.rows;
};

export const updateMessageVote = async (messageId, vote) => {
  await executeQuery(
    "UPDATE messages SET vote=$vote WHERE id=$messageId;",
    { messageId, vote },
  );
};

export const saveMessageReply = async (authorId, messageId, content) => {
  let result = await executeQuery(
    "INSERT INTO replies (author_id, message_id, content) VALUES ($authorId, $messageId, $content) RETURNING id, created_at, vote;",
    { authorId, messageId, content },
  );

  if(result.error && result.error.toString().includes('violates foreign key constraint "fk_author"')) {
    await executeQuery(
      "INSERT INTO users (id) VALUES ($userId);",
      { userId: authorId },
    );
    result = await executeQuery(
      "INSERT INTO replies (author_id, message_id, content) VALUES ($authorId, $messageId, $content) RETURNING id, created_at, vote;",
      { authorId, messageId, content },
    );
  }

  return result?.rows;
};

export const updateReplyVote = async (replyId, vote) => {
  await executeQuery(
    "UPDATE replies SET vote=$vote WHERE id=$replyId;",
    { replyId, vote },
  );
};
