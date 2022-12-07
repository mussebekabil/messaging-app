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

  return result.rows;
};

export const getRepliesByMessageId = async (messageId) => {
  const result =   await executeQuery(
    "SELECT * FROM replies WHERE message_id=$messageId ORDER BY created_at DESC;",
    { messageId },
  );

  return result.rows;
};
