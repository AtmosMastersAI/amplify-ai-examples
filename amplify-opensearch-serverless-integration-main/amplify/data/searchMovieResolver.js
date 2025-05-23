import { util } from "@aws-appsync/utils";

/**
 * Searches for documents by using an input term
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the request
 */

export function request(ctx) {
 

  return {
    version: "2018-05-29",
    method: "GET",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        from: 0,
        size: 50,
        query: { match: { title: ctx.args.title } },
      },
    },
    resourcePath: `/movie/_search`,
  };
}
/**
 * Returns the fetched items
 * @param {import('@aws-appsync/utils').Context} ctx the context
 * @returns {*} the result
 */

export function response(ctx) {
  const { statusCode, body } = ctx.result;
  if (statusCode === 200) {
    return JSON.parse(body).hits.hits.map((hit) => hit._source);
  }
}
