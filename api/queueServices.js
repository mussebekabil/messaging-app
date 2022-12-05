import { rabbitConnect } from "./deps.js";

const url = 'amqp://guest:guest@rabbitmq:5672';
const messageQueueName = "message.queue";
const replyQueueName = "reply.queue";
const messageVoteQueueName = "message.vote.queue";
const replyVoteQueueName = "reply.vote.queue";

const connection = await rabbitConnect(url) 
const channel = await connection.openChannel();

await channel.declareQueue({ queue: messageQueueName });
await channel.declareQueue({ queue: replyQueueName });
await channel.declareQueue({ queue: messageVoteQueueName });
await channel.declareQueue({ queue: replyVoteQueueName });

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
  publisher(messageQueueName, { authorId, content })
};

export const publishNewReply = async (authorId, messageId, content) => {
  publisher(replyQueueName, { authorId, messageId, content })
};

export const publishMessageVote = async (messageId, vote) => {
  publisher(messageVoteQueueName, { messageId, vote })
};

export const publishReplyVote = async (replyId, vote) => {
  publisher(replyVoteQueueName, { replyId, vote })
};
