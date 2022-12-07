import { serve } from "./deps.js";
import { handleGetRequests, handlePostRequests, handlePatchRequests } from './handlers.js'

const toJson = (data) => {
  if (data !== undefined) {
      return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? `${v}#bigint` : v)
          .replace(/"(-?\d+)#bigint"/g, (_, a) => a);
  }
}
const handleRequest = async (request) => {
  switch(request.method){
    case 'POST':
      return handlePostRequests(request);
    case 'GET':
      return new Response(toJson(await handleGetRequests(request)));
    case 'PATCH': 
      return handlePatchRequests(request);
    default:
      return;
  }
};

await serve(handleRequest, { port: 7777 });
