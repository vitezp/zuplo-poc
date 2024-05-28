import { ComplexRateLimitInboundPolicy, ZuploContext, ZuploRequest } from "@zuplo/runtime";

export default async function policy(
  response: Response,
  request: ZuploRequest,
  context: ZuploContext,
  options: never,
  policyName: string
) {
  // your policy code goes here, and can use the options to perform any
  // configuration
  // See the docs: https://www.zuplo.com/docs/policies/custom-code-inbound

  const isReadonly = request.url.includes('/get');

  if (response.status > 199 && response.status < 400) {
    const data = await response.json();

    ComplexRateLimitInboundPolicy.setIncrements(context, { compute: 1 });

    if (isReadonly) {
      ComplexRateLimitInboundPolicy.setIncrements(context, { get: 1 });
    } else {
      ComplexRateLimitInboundPolicy.setIncrements(context, { write: 5 });
    }
    return new Response(JSON.stringify(data), response);

  }
  
  return response;
}