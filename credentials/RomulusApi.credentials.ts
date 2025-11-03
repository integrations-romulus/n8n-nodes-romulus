import {
	IAuthenticateGeneric,
	ICredentialType,
	ICredentialTestRequest,
	INodeProperties,
} from 'n8n-workflow';

export class RomulusApi implements ICredentialType {
	name = 'romulusApi';
	displayName = 'Romulus API';
	documentationUrl =
		'https://developer.romulus.live/docs/#authentication';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your Romulus API key. See <a href="https://help.romulus.live/en/articles/12547432-how-to-use-the-ai-agent-with-third-party-software-via-api">documentation</a> for how to obtain it.',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Authorization': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'GET',
			baseURL: 'https://api.romulus.live/v1',
			url: '/me',
		},
	};
}
