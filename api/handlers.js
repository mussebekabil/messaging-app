import * as messageServices from './database/messageServices.js';
import * as userServices from './database/userServices.js';

export const handleGetRequests = async (request) => {
  const pathname = new URL(request.url).pathname;
  
  if(pathname.includes('messages')) {
    const params = pathname.split('/')
    console.log(params)
    const messageId = params[3];
    if(messageId) {
      return {
        message: await messageServices.getMessageById(messageId)
      }
    }
    return {
      messages: await messageServices.getAllMessages()
    };
  }

  if(pathname.includes('users')) {
    const params = pathname.split('/')
    const userId = params[3];
    if(userId) {
      return {
        user: await userServices.getUserById(userId)
      }
    }
    return {
      users: await userServices.getAllUsers()
    };
  }
  return {};
}

export const handlePostRequests = async (request) => {
  const pathname = new URL(request.url).pathname;

  if(pathname.includes('messages')) {
    if(request.body) {
      try {
        const { authorId, content } = await request.json();
        await messageServices.saveMessage(authorId, content);
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
        await messageServices.updateMessageVote(messageId, vote);
  
        return new Response(200);
        
      } catch (error) {
        console.log(error)
        return new Response("Internal Server Error", { status: 500 })
      }
    }
  }

  return new Response("Internal Server Error - Path not found", { status: 500 })
}
