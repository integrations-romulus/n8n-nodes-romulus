import {
	IDataObject,
	IHookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookFunctions,
	IWebhookResponseData,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { romulusApiRequest } from './V1/GenericFunctions';

export class RomulusTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Romulus Trigger',
		name: 'romulusTrigger',
		icon: 'file:romulus.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when a Romulus event occurs',
		defaults: {
			name: 'Romulus Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'romulusApi',
				required: true,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
				},
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Due to limitations, you can use just one Voxloud trigger for each workflow',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'API Key',
						value: 'apiKey',
					},
				],
				default: 'apiKey',
			},
			{
				displayName: 'Event',
				name: 'eventName',
				type: 'options',
				options: [
					{
						name: 'Robocall Started',
						value: 'robocall',
						description: 'Triggered when a Robocall is answered',
					},
					{
						name: 'Agent Call Completed',
						value: 'AGENT_CALL_COMPLETED',
						description: 'Triggered when a call with agent is completed',
					},
					{
						name: 'Agent Action Completed',
						value: 'AGENT_ACTION_COMPLETED',
						description: 'Triggered when a particular agent action is completed',
					},
				],
				default: 'AGENT_CALL_COMPLETED',
				required: true,
			},
			{
				displayName: 'Entity ID',
				description: 'Enter Entity ID if you want to attach webhook to a specific item',
				name: 'entityId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						eventName: ['AGENT_CALL_COMPLETED', 'AGENT_ACTION_COMPLETED'],
					},
				},
			},
			{
				displayName: 'Entity ID',
				description: 'Enter Entity ID if you want to attach webhook to a specific item',
				name: 'entityId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						eventName: ['robocall'],
					},
				},
			},
		],
	};
	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				this.logger.info('Checking if webhook already exists...');
				const webhookUrl = this.getNodeWebhookUrl('default');
				const endpoints = ['/webhook-subscriptions/search', '/call-tasks/webhook-subscriptions'];

				for (const endpoint of endpoints) {
					let response;
					try {
						response = await romulusApiRequest.call(this, 'GET', endpoint, {});
					} catch {
						this.logger.error(`Failed to check webhook at endpoint ${endpoint}`);
						continue;
					}

					const subscriptions = Array.isArray(response)
						? response
						: (response?.content ?? response?.results ?? []);
					if (subscriptions.some((sub: IDataObject) => sub.url === webhookUrl)) {
						return true;
					}
				}
				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				this.logger.info('Creating webhook...');
				let body: IDataObject = {};
				const webhookUrl = this.getNodeWebhookUrl('default');
				const eventType = this.getNodeParameter('eventName') as string;
				const entityId =
					(this.getNodeParameter('entityId') as string) === ''
						? null
						: this.getNodeParameter('entityId');
				let endpoint =
					eventType === 'robocall' ? '/call-tasks/webhook-subscriptions' : '/webhook-subscriptions';

				if (eventType === 'robocall') {
					body = {
						entity_type: eventType,
						url: webhookUrl,
					};
				} else {
					body = {
						event: eventType,
						entity_type: 'AGENT',
						url: webhookUrl,
					};
				}

				if (entityId) {
					body.entity_id = entityId;
				}

				if (this.logger) {
					this.logger.info(`trying to create webhook with: ${JSON.stringify(body)}`);
				}
				try {
					await romulusApiRequest.call(this, 'POST', endpoint, body);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Romulus webhook create error: ${error.message || error}`,
					);
				}
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				this.logger.info('Deleting webhook...');

				const webhookUrl = this.getNodeWebhookUrl('default');
				const endpoints = ['/webhook-subscriptions/search', '/call-tasks/webhook-subscriptions'];

				for (const endpoint of endpoints) {
					try {
						const response = await romulusApiRequest.call(this, 'GET', endpoint, {});
						const subs = Array.isArray(response)
							? response
							: (response?.content ?? response?.results ?? []);

						for (const sub of subs as IDataObject[]) {
							if (sub.url === webhookUrl && sub.id) {
								const deleteEndpoint =
									endpoint === '/call-tasks/webhook-subscriptions'
										? `/call-tasks/webhook-subscriptions/${sub.id}`
										: `/webhook-subscriptions/${sub.id}`;
								await romulusApiRequest.call(this, 'DELETE', deleteEndpoint, {});
								this.logger.info(`Deleted webhook: ${deleteEndpoint}`);
								return true;
							}
						}
					} catch {
						this.logger.error(
							`Failed to check or delete webhook at endpoint ${endpoint}. It may not exist.`,
						);
						continue;
					}
				}
				this.logger.info(`No webhook found with url: ${webhookUrl}`);
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData();
		return {
			workflowData: [
				[
					{
						json: body,
					},
				],
			],
		};
	}
}
