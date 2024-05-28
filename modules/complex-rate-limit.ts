import {
  ZuploRequest,
  ZuploContext,
  CustomRateLimitDetails,
  CustomComplexRateLimitDetails,
  MemoryZoneReadThroughCache,
  environment,
} from "@zuplo/runtime";

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ronfifkuwiarwbgrcdlr.supabase.co'
const supabaseKey = environment.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export async function dynamicRateLimiting(
  request: ZuploRequest,
  context: ZuploContext
): Promise<CustomRateLimitDetails> {
  context.log.info('test');

try {
  
    const organizationId = request.user.data.Identifier;

    const limits = await getLimitForOrgId(organizationId, context);

    context.log.info(limits);

    return {
      key: `foop`,
      requestsAllowed: 1,
      timeWindowMinutes: 1
    };
  }
  catch (err) {
    context.log.error(err);
  }
}

// This one will be used with the complex dynamic rate
// limiting
export async function complexDynamicRateLimiting(
  request: ZuploRequest,
  context: ZuploContext
): Promise<CustomComplexRateLimitDetails> {

  const organizationId = request.user.data.Identifier;
  const limits = await getLimitForOrgId(organizationId, context);

  context.log.info(limits);

  return {
    key: `orgid-${organizationId}`,
    limits: {
      compute: limits
    },
  };
}

async function getLimitForOrgId(organizationId: string, context: ZuploContext) {

  context.log.info('inside getLimitForOrgId')

  const cache = new MemoryZoneReadThroughCache("org-id-cache", context);
  context.log.info(organizationId)

  const limit = await cache.get(organizationId);

  if (limit !== undefined) {
    return limit;
  }
  
  let { data: limits, error } = await supabase
    .from('limits')
    .select("*")
    // Filters

  context.log.info(limits)
  const newLimit = limits[0].limit;

  void cache.put(organizationId, newLimit, 10);

  return newLimit;
}