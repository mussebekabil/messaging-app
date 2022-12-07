import { executeQuery } from "./database.js";

/**
 * Message related queries
*/
export const getAllMessages = async (offset = 0) => {
  const result =   await executeQuery(
    "SELECT *, count(*) OVER() FROM messages ORDER BY created_at DESC LIMIT 20 OFFSET $offset;",
    { offset }
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

export const getRepliesByMessageId = async (messageId, offset = 0) => {
  const result =   await executeQuery(
    "SELECT *, count(*) OVER() FROM replies WHERE message_id=$messageId ORDER BY created_at DESC LIMIT 20 OFFSET $offset;",
    { messageId, offset },
  );

  return result.rows;
};
