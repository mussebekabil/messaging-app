import { rabbitConnect } from "./deps.js";
import * as messageServices from './database/messageServices.js';
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
await channel.consume({ queue: constants.MESSAGE_QUEUE_NAME }, async (args, props, data) => {
  const { authorId, content } = JSON.parse(new TextDecoder().decode(data));
  const response = await messageServices.saveMessage(authorId, content)
  
  if(!response || response.length === 0) return

  await fetch(`http://ws-messaging-service:7779`, {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
		body: JSON.stringify({ ...response[0], type: constants.MESSAGE_TYPE, authorId, content })
  });

  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: constants.REPLY_QUEUE_NAME });
await channel.consume({ queue: constants.REPLY_QUEUE_NAME }, async (args, props, data) => {
  const { authorId, messageId, content } = JSON.parse(new TextDecoder().decode(data));
  const response = await messageServices.saveMessageReply(authorId, messageId, content)
  
  if(!response || response.length === 0) return
  
  await fetch(`http://ws-messaging-service:7779`, {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
		body: JSON.stringify({ ...response[0], type: constants.REPLY_TYPE, authorId, messageId, content })
  });
  
  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: constants.MESSAGE_VOTE_QUEUE_NAME });
await channel.consume({ queue: constants.MESSAGE_VOTE_QUEUE_NAME }, async (args, props, data) => {
  const { messageId, vote } = JSON.parse(new TextDecoder().decode(data));
  await messageServices.updateMessageVote(messageId, vote);
  await fetch(`http://ws-messaging-service:7779`, {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
		body: JSON.stringify({ type: constants.MESSAGE_VOTE_TYPE, vote, messageId })
  });
  
  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: constants.REPLY_VOTE_QUEUE_NAME });
await channel.consume({ queue: constants.REPLY_VOTE_QUEUE_NAME }, async (args, props, data) => {
  const { replyId, vote } = JSON.parse(new TextDecoder().decode(data));
  await messageServices.updateReplyVote(replyId, vote);
  await fetch(`http://ws-messaging-service:7779`, {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
		body: JSON.stringify({ type: constants.REPLY_VOTE_TYPE, vote, replyId })
  });
  
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
