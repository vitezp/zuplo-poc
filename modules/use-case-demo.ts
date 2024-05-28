import {ZuploContext, ZuploRequest} from "@zuplo/runtime";

type MyPolicyOptionsType = {
  myOption: any;
};

export default async function policy(
  request: ZuploRequest,
  context: ZuploContext,
  options: MyPolicyOptionsType,
  policyName: string
) {
    
  var request2 = request.clone();
  const requestOptions: RequestInit = {
            method: 'POST', // or 'POST', 'PUT', etc.
            headers: {
                'Content-Type': 'application/json',
            },
            body: request.body
        };

  context.log.info(request.body)

  const reservations: Response = await fetch("https://api.mews-demo.com/api/connector/v1/reservations/getAll/2023-06-06", requestOptions);
  const data1: any = await reservations.json();
  context.log.info('Data from endpoint 1:', data1);

  const ids = data1.Reservations.map((item: any) => item.Id);
  context.log.info('Ids:', ids);

  const requestOptions2: RequestInit = {
            method: 'POST', // or 'POST', 'PUT', etc.
            headers: {
                'Content-Type': 'application/json',
            },
            body: request2.body//JSON.stringify({ ReservationIds: ids})
        };

  const companionships: Response = await fetch("https://api.mews-demo.com/api/connector/v1/companionships/getAll", requestOptions2);
  const data2: any = await companionships.json();
  context.log.info('Data from endpoint 2:', data2);

  data1.Reservations.forEach((res) => {
    const find = data2.Companionships.map(c => c.CustomerId);
    context.log.info(find)
    res.Customers = find
  })

  return new Response(JSON.stringify(data1), { status: 200 });
}
