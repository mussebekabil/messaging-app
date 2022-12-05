import { executeQuery } from "./database.js";

/**
 * Message related queries
*/
export const getAllMessages = async () => {
  const result =   await executeQuery(
    "SELECT * FROM messages;"
  );

  return result.rows;
};

export const getMessageById = async (messageId) => {
  const result =   await executeQuery(
    "SELECT * FROM messages WHERE id=$messageId;",
    { messageId },
  );

  return result.rows;
};

export const saveMessage = async (authorId, content) => {
  await executeQuery(
    "INSERT INTO messages (author_id, content) VALUES ($authorId, $content);",
    { authorId, content },
  );
};

export const updateMessageVote = async (messageId, vote) => {
  await executeQuery(
    "UPDATE messages SET vote=$vote WHERE id=$messageId;",
    { messageId, vote },
  );
};
