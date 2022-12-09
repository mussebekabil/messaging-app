import * as messageServices from './database/messageServices.js';
import * as userServices from './database/userServices.js';
import * as queueServices from './queueServices.js';

export const handleGetRequests = async (request) => {
  const {pathname, search } = new URL(request.url);
  
  if(pathname.includes('messages')) {
    const params = pathname.split('/')
    const query = search.split('offset=')
    const messageId = params.includes('api') ? params[3] : params[2];
  
    if(messageId) {
      return await messageServices.getMessageById(messageId) || []
    }

    return await messageServices.getAllMessages(query[1]) || []
  }

  if(pathname.includes('replies')) {
    const params = pathname.split('/')
    const query = search.split('offset=')
    
    const messageId = params.includes('api') ? params[3] : params[2];
    if(messageId) {
      return await messageServices.getRepliesByMessageId(messageId, query[1]) || []
    }

    return [];
  }

  if(pathname.includes('users')) {
    const params = pathname.split('/')
    const userId = params.includes('api') ? params[3] : params[2];
    if(userId) {
      return await userServices.getUserById(userId) || {}
    }
    return await userServices.getAllUsers() || [];
  }
  return {};
}

export const handlePostRequests = async (request) => {
  const pathname = new URL(request.url).pathname;

  if(pathname.includes('messages')) {
    if(request.body) {
      try {
        const { authorId, content } = await request.json();
        queueServices.publishNewMessage(authorId, content);
        return new Response(200);
        
      } catch (error) {
        console.log(e)
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  }

  if(pathname.includes('replies')) {
    if(request.body) {
      try {
        const { authorId, content, messageId } = await request.json();
        queueServices.publishNewReply(authorId, messageId, content);
        return new Response(200);
        
      } catch (error) {
        console.log(e)
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  }

  if(pathname.includes('users')) {
    if(request.body) {
      try {
        const { userId } = await request.json();
        await userServices.saveUser(userId);
        return new Response(200);
        
      } catch (error) {
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  }

  return new Response("Internal Server Error - Path not found", { status: 500 })
}

export const handlePatchRequests = async (request) => {
  const pathname = new URL(request.url).pathname;

  if(pathname.includes('messages')) {
    if(request.body) {
      try {
        const { vote } = await request.json();
        const params = pathname.split('/')
        const messageId = params[3];
        queueServices.publishMessageVote(messageId, vote);
        return new Response(200);
        
      } catch (error) {
        console.log(error)
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  }

  if(pathname.includes('replies')) {
    if(request.body) {
      try {
        const { vote } = await request.json();
        const params = pathname.split('/')
        const replyId = params[3];
        queueServices.publishReplyVote(replyId, vote);
        return new Response(200);
        
      } catch (error) {
        console.log(error)
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  }

  return new Response("Internal Server Error - Path not found", { status: 500 })
}
