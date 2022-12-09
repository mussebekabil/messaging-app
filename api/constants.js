
export const MESSAGE_TYPE = 'message';
export const REPLY_TYPE = 'reply';
export const MESSAGE_VOTE_TYPE = 'message.vote';
export const REPLY_VOTE_TYPE = 'reply.vote'

export const MESSAGE_QUEUE_NAME = `${MESSAGE_TYPE}.queue`;
export const REPLY_QUEUE_NAME = `${REPLY_TYPE}.queue`;
export const MESSAGE_VOTE_QUEUE_NAME = `${MESSAGE_VOTE_TYPE}.queue`;
export const REPLY_VOTE_QUEUE_NAME = `${REPLY_VOTE_TYPE}.queue`;

// minikube should take from env
export const URL = 'amqp://guest:guest@rabbitmq:5672';
