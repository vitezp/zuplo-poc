import {ComplexRateLimitInboundPolicy, ZuploContext, ZuploRequest} from "@zuplo/runtime";

type MyPolicyOptionsType = {
  myOption: any;
};

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
  
  const body = await (request.clone()).text();
  var jsonBody = JSON.parse(body);

  context.log.info('deprecated endpoint, compute 20')
  context.log.info(ComplexRateLimitInboundPolicy.getIncrements(context))

  ComplexRateLimitInboundPolicy.setIncrements(context, { compute: 20 });

  if (jsonBody.Limitation?.Count == null){
      context.log.info('missing limitation, compute 20')
      ComplexRateLimitInboundPolicy.setIncrements(context, { compute: 20 });
  }
  if (jsonBody.Extent?.Items){
      context.log.info('using extents, compute 20')
      ComplexRateLimitInboundPolicy.setIncrements(context, { compute: 20 });
  }

  return request;
}
