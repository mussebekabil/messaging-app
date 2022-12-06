import { executeQuery } from "./database.js";

/**
 * Message related queries
*/
export const getAllMessages = async () => {
  const result =   await executeQuery(
    "SELECT * FROM messages ORDER BY created_at DESC;"
  );

  return result.rows;
};

export const getMessageById = async (messageId) => {
  const result =   await executeQuery(
    "SELECT * FROM messages WHERE id=$messageId;",
    { messageId },
  );

  return result.rows[0];
};

export const saveMessage = async (authorId, content) => {
  const result = await executeQuery(
    "INSERT INTO messages (author_id, content) VALUES ($authorId, $content) RETURNING id, created_at, vote;",
    { authorId, content },
  );
  
  return result.rows[0];
};

export const updateMessageVote = async (messageId, vote) => {
  await executeQuery(
    "UPDATE messages SET vote=$vote WHERE id=$messageId;",
    { messageId, vote },
  );
};

export const saveMessageReply = async (authorId, messageId, content) => {
  const result = await executeQuery(
    "INSERT INTO replies (author_id, message_id, content) VALUES ($authorId, $messageId, $content) RETURNING id, created_at, vote;",
    { authorId, messageId, content },
  );

  return result.rows[0];
};

export const updateReplyVote = async (replyId, vote) => {
  await executeQuery(
    "UPDATE replies SET vote=$vote WHERE id=$replyId;",
    { replyId, vote },
  );
};
