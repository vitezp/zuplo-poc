import { ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function (request: ZuploRequest, context: ZuploContext) {
  // Get the incoming body as an Object
  const obj = await request.json();

  // Modify the object as required
  obj.accessToken = request.user.data.AccessToken;
  obj.clientToken = request.user.data.ClientToken;
  

  // Stringify the object
  const body = JSON.stringify(obj);

  // Return a new request based on the
  // original but with the new body
  return new ZuploRequest(request, { body });
}