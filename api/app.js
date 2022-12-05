import { serve } from "./deps.js";
import { handleGetRequests, handlePostRequests } from './handlers.js'

const handleRequest = async (request) => {
  switch(request.method){
    case 'POST':
      return handlePostRequests(request);
    case 'GET':
      return new Response(JSON.stringify(await handleGetRequests(request)));
    case 'PUT': 
      return;
    default:
      return;
  }
};

await serve(handleRequest, { port: 7777 });
