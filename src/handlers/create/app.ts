import doNotWaitForEmptyEventLoop from '@middy/do-not-wait-for-empty-event-loop';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';
import httpResponseSerializer from '@middy/http-response-serializer';
import { Callback, Context, Handler, APIGatewayEvent } from 'aws-lambda';
import middy from '@middy/core';

import BookRepository from '/opt/nodejs/book.repository';
import Book from '../../layers/common/book.interface';
import { buildSuccessReponse } from '/opt/nodejs/api.utils';
import Errors from '/opt/nodejs/errors.enum';
import { CustomAPIGatewayEvent } from '../../layers/common/custom-event.type';
import logger from '/opt/nodejs/logger';

export const handler: Handler = middy(
    async (event: CustomAPIGatewayEvent<Book>, context: Context, callback: Callback) => {
        const book: Book = await BookRepository.create(event.body);
        return buildSuccessReponse(book);
    }
).use([
    doNotWaitForEmptyEventLoop(),
    httpJsonBodyParser(),
    httpErrorHandler({ fallbackMessage: Errors.GENERAL_ERROR }),
    httpResponseSerializer({
        serializers: [
            {
                regex: /^application\/json$/,
                serializer: ({ body }) => JSON.stringify(body)
            }
        ],
        default: 'application/json'
    })
]);
