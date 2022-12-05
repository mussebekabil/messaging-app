import { rabbitConnect } from "./deps.js";
import * as messageServices from './database/messageServices.js';

const url = 'amqp://guest:guest@rabbitmq:5672';
const messageQueueName = "message.queue";
const replyQueueName = "reply.queue";
const messageVoteQueueName = "message.vote.queue";
const replyVoteQueueName = "reply.vote.queue";

const connection = await rabbitConnect(url) 
const channel = await connection.openChannel();

await channel.declareQueue({ queue: messageQueueName });
await channel.consume({ queue: messageQueueName }, async (args, props, data) => {
  const { authorId, content } = JSON.parse(new TextDecoder().decode(data));
  await messageServices.saveMessage(authorId, content)
  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: replyQueueName });
await channel.consume({ queue: replyQueueName }, async (args, props, data) => {
  console.log(JSON.stringify(args.routingKey));
  console.log(JSON.stringify(props));
  console.log(new TextDecoder().decode(data));
  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: messageVoteQueueName });
await channel.consume({ queue: messageVoteQueueName }, async (args, props, data) => {
  const { messageId, vote } = JSON.parse(new TextDecoder().decode(data));
  await messageServices.updateMessageVote(messageId, vote);
  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: replyVoteQueueName });
await channel.consume({ queue: replyVoteQueueName }, async (args, props, data) => {
  console.log(JSON.stringify(args.routingKey));
  console.log(JSON.stringify(props));
  console.log(new TextDecoder().decode(data));
  
  await channel.ack({ deliveryTag: args.deliveryTag });
});

connection
  .closed()
  .then(() => {
    console.log("Closed peacefully");
  })
  .catch((error) => {
    console.error("Connection closed with error");
    console.error(error.message);
  });
