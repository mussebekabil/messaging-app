import { rabbitConnect } from './deps.js';
import * as constants from './constants.js'; 

const getConnectionString = () => {
  const host = Deno.env.get("RABBIT_HOST");
  const port = Deno.env.get("RABBIT_PORT");
  const user = Deno.env.get("RABBIT_USER");
  const password = Deno.env.get("RABBIT_PASS");

  if(!host || !port || !user || !password) return constants.URL;

  return `amqp://${user}:${password}@${host}:${port}`
}

const connection = await rabbitConnect(getConnectionString()) 
const channel = await connection.openChannel();

await channel.declareQueue({ queue: constants.MESSAGE_QUEUE_NAME });
await channel.declareQueue({ queue: constants.REPLY_QUEUE_NAME });
await channel.declareQueue({ queue: constants.MESSAGE_VOTE_QUEUE_NAME });
await channel.declareQueue({ queue: constants.REPLY_VOTE_QUEUE_NAME });

export const publisher = async (queueName, payload) => {
  try { 
    await channel.publish(
      { routingKey: queueName },
      { contentType: "application/json" },
      new TextEncoder().encode(JSON.stringify({ ...payload })),
    );
  } catch (e) {
    console.error(`Error in publishing ${queueName}`, e);
  }
};

export const publishNewMessage = async (authorId, content) => {
  publisher(constants.MESSAGE_QUEUE_NAME, { authorId, content })
};

export const publishNewReply = async (authorId, messageId, content) => {
  publisher(constants.REPLY_QUEUE_NAME, { authorId, messageId, content })
};

export const publishMessageVote = async (messageId, vote) => {
  publisher(constants.MESSAGE_VOTE_QUEUE_NAME, { messageId, vote })
};

export const publishReplyVote = async (replyId, vote) => {
  publisher(constants.REPLY_VOTE_QUEUE_NAME, { replyId, vote })
};
