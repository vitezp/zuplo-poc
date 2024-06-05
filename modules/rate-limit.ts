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
  // your policy code goes here, and can use the options to perform any
  // configuration
  // See the docs: https://www.zuplo.com/docs/policies/custom-code-inbound
  const isReadonly = request.url.includes('/get');
  context.log.info(ComplexRateLimitInboundPolicy.getIncrements(context))


  ComplexRateLimitInboundPolicy.setIncrements(context, { compute: 1 });
  context.log.info('compute 1')


  if (isReadonly) {
    ComplexRateLimitInboundPolicy.setIncrements(context, { get: 1 });
    context.log.info('get 1')

  } else {
    ComplexRateLimitInboundPolicy.setIncrements(context, { write: 1 });
    context.log.info('write 1')
  }


  return request;
}
