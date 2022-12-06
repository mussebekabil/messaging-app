import { rabbitConnect } from "./deps.js";
import * as messageServices from './database/messageServices.js';
import * as constants from './constants.js'; 

const connection = await rabbitConnect(constants.URL) 
const channel = await connection.openChannel();

await channel.declareQueue({ queue: constants.MESSAGE_QUEUE_NAME });
await channel.consume({ queue: constants.MESSAGE_QUEUE_NAME }, async (args, props, data) => {
  const { authorId, content } = JSON.parse(new TextDecoder().decode(data));
  const response = await messageServices.saveMessage(authorId, content)
  console.log('response: ', response)
  await fetch(`http://ws-messaging-service:7779`, {
    method: 'POST',
    headers: { "Content-type": "application/json; charset=UTF-8" },
		body: JSON.stringify({ ...response, type: constants.MESSAGE_TYPE, authorId, content })
  });

  await channel.ack({ deliveryTag: args.deliveryTag });
});

await channel.declareQueue({ queue: constants.REPLY_QUEUE_NAME });
await channel.consume({ queue: constants.REPLY_QUEUE_NAME }, async (args, props, data) => {
  console.log(JSON.stringify(args.routingKey));
  console.log(JSON.stringify(props));
  console.log(new TextDecoder().decode(data));
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
