import {
	type IHookFunctions,
	type IExecuteFunctions,
	type ILoadOptionsFunctions,
	type IHttpRequestMethods,
	type IDataObject,
	type IRequestOptions,
	NodeApiError,
	JsonObject,
} from 'n8n-workflow';

/**
 * Helper function to handle paginated API requests
 * Supports both 'returnAll' (fetch all pages) and 'limit' (fetch specific number)
 */
export async function handlePaginatedRequest(
	this: IExecuteFunctions,
	endpoint: string,
	i: number,
): Promise<IDataObject[]> {
	const returnAll = this.getNodeParameter('returnAll', i) as boolean;

	if (returnAll) {
		// Fetch all pages
		let hasMore = true;
		let page = 0;
		const allData: IDataObject[] = [];
		const pageSize = 100;

		while (hasMore) {
			const response = await romulusApiRequest.call(this, 'GET', endpoint, {}, { page, size: pageSize });
			const items = (response?.content ?? response?.results ?? []) as IDataObject[];
			allData.push(...items);

			// Check if there are more results
			// If we got a full page, there might be more
			hasMore = items.length === pageSize;
			page++;

			// Safety limit to prevent infinite loops
			if (page > 1000) {
				break;
			}
		}
		return allData;
	} else {
		// Fetch only up to limit
		const limit = this.getNodeParameter('limit', i) as number;
		const response = await romulusApiRequest.call(this, 'GET', endpoint, {}, { page: 0, size: limit });
		return (response?.content ?? response?.results ?? response ?? []) as IDataObject[];
	}
}

export async function romulusApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body: IDataObject = {},
	query: IDataObject = {},
	uri?: string,
): Promise<any> {
	const options = {
		method,
		qs: query,
		headers: {},
		uri: uri || `https://api.romulus.live/v1${endpoint}`,
		body,
		json: true,
		useQuerystring: true,
	} satisfies IRequestOptions;

	try {
		const credentialType = 'romulusApi';
		return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
	} catch (error: any) {
		// Provide more specific error messages based on HTTP status codes
		if (error.statusCode === 401 || error.httpCode === '401') {
			throw new NodeApiError(this.getNode(), {
				message: 'Authentication failed. Please check your API key in credentials.',
				description: 'The API key you provided is invalid or has expired.',
				httpCode: '401',
			} as JsonObject);
		} else if (error.statusCode === 404 || error.httpCode === '404') {
			throw new NodeApiError(this.getNode(), {
				message: `Resource not found at ${endpoint}`,
				description: 'The requested resource does not exist. Please verify the ID is correct.',
				httpCode: '404',
			} as JsonObject);
		} else if (error.statusCode === 429 || error.httpCode === '429') {
			throw new NodeApiError(this.getNode(), {
				message: 'Rate limit exceeded',
				description: 'You have made too many requests. Please try again later.',
				httpCode: '429',
			} as JsonObject);
		} else if (error.statusCode === 403 || error.httpCode === '403') {
			throw new NodeApiError(this.getNode(), {
				message: 'Access forbidden',
				description: 'You do not have permission to access this resource.',
				httpCode: '403',
			} as JsonObject);
		} else if (error.statusCode === 400 || error.httpCode === '400') {
			throw new NodeApiError(this.getNode(), {
				message: 'Bad request',
				description: error.message || 'The request was invalid. Please check your parameters.',
				httpCode: '400',
			} as JsonObject);
		}
		// Default error handling
		throw new NodeApiError(this.getNode(), error as JsonObject);
	}
}
