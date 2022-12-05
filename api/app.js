import { serve } from "./deps.js";
import { handleGetRequests, handlePostRequests, handlePatchRequests } from './handlers.js'

const handleRequest = async (request) => {
  switch(request.method){
    case 'POST':
      return handlePostRequests(request);
    case 'GET':
      return new Response(JSON.stringify(await handleGetRequests(request)));
    case 'PATCH': 
      return handlePatchRequests(request);
    default:
      return;
  }
};

await serve(handleRequest, { port: 7777 });
