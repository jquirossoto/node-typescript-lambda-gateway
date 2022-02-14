import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import { APIGatewayEvent, Callback, Context } from 'aws-lambda';
import middy from 'middy';
import AWS from 'aws-sdk';

import { BookRepository } from '/opt/nodejs/book.repository';

let dynamodb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1'
});

export const handler = middy(async (event: APIGatewayEvent, context: Context, callback: Callback) => {
  const repo = new BookRepository(dynamodb);
  const book = await repo.create(JSON.parse(event.body));
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'SUCCESS', result: book })
  };
}).use(doNotWaitForEmptyEventLoop());
