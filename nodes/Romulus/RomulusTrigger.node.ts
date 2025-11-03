import {
	IDataObject,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
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
				displayName: 'Scope',
				name: 'scope',
				type: 'options',
				options: [
					{
						name: 'All Agents',
						value: 'all',
						description: 'Monitor events from all agents',
					},
					{
						name: 'Specific Agent',
						value: 'specific',
						description: 'Monitor events from a specific agent',
					},
				],
				default: 'all',
				description: 'Choose whether to monitor all agents or a specific one',
				displayOptions: {
					show: {
						eventName: ['AGENT_CALL_COMPLETED', 'AGENT_ACTION_COMPLETED'],
					},
				},
			},
			{
				displayName: 'Agent Name or ID',
				name: 'agentId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAgents',
				},
				required: true,
				default: '',
				description: 'Select the specific agent to monitor for events. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				displayOptions: {
					show: {
						eventName: ['AGENT_CALL_COMPLETED', 'AGENT_ACTION_COMPLETED'],
						scope: ['specific'],
					},
				},
			},
			{
				displayName: 'Scope',
				name: 'robocallScope',
				type: 'options',
				options: [
					{
						name: 'All Robocalls',
						value: 'all',
						description: 'Monitor all robocall configurations',
					},
					{
						name: 'Specific Robocall',
						value: 'specific',
						description: 'Monitor a specific robocall configuration',
					},
				],
				default: 'all',
				description: 'Choose whether to monitor all robocalls or a specific configuration',
				displayOptions: {
					show: {
						eventName: ['robocall'],
					},
				},
			},
			{
				displayName: 'Robocall Configuration Name or ID',
				name: 'robocallId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getRobocalls',
				},
				required: true,
				default: '',
				description: 'Select the specific robocall configuration to monitor. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
				displayOptions: {
					show: {
						eventName: ['robocall'],
						robocallScope: ['specific'],
					},
				},
			},
		],
	};

	methods = {
		loadOptions: {
			// Load agents from Romulus API
			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					// Fetch multiple pages to ensure we get all agents
					let page = 0;
					let hasMore = true;
					const pageSize = 100;

					while (hasMore && page < 10) { // Safety limit of 10 pages (1000 items)
						const response = await romulusApiRequest.call(
							this,
							'GET',
							'/ai-agents/agents/search',
							{},
							{ page, size: pageSize },
						);

						const agents = response?.content ?? response?.results ?? response ?? [];
						for (const agent of agents) {
							returnData.push({
								name: agent.name || agent.id,
								value: agent.id,
								description: agent.description || `Agent ID: ${agent.id}`,
							});
						}

						// Check if there are more results
						hasMore = agents.length === pageSize;
						page++;
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load agents: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},

			// Load robocall configurations from Romulus API
			async getRobocalls(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					// Fetch multiple pages to ensure we get all robocalls
					let page = 0;
					let hasMore = true;
					const pageSize = 100;

					while (hasMore && page < 10) { // Safety limit of 10 pages (1000 items)
						const response = await romulusApiRequest.call(
							this,
							'GET',
							'/call-tasks/robocalls/configurations',
							{},
							{ page, size: pageSize },
						);

						const robocalls = response?.content ?? response?.results ?? response ?? [];
						for (const robocall of robocalls) {
							returnData.push({
								name: robocall.name || robocall.id,
								value: robocall.id,
								description: robocall.description || `Robocall ID: ${robocall.id}`,
							});
						}

						// Check if there are more results
						hasMore = robocalls.length === pageSize;
						page++;
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load robocall configurations: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},
		},
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

				if (eventType === 'robocall') {
					// Robocall webhook subscription
					const endpoint = '/call-tasks/webhook-subscriptions';
					body = {
						entity_type: 'robocall',
						url: webhookUrl,
					};

					// Add entity_id only if specific robocall is selected
					const robocallScope = this.getNodeParameter('robocallScope') as string;
					if (robocallScope === 'specific') {
						const robocallId = this.getNodeParameter('robocallId') as string;
						body.entity_id = robocallId;
					}

					if (this.logger) {
						this.logger.info(`Creating robocall webhook with: ${JSON.stringify(body)}`);
					}
					try {
						await romulusApiRequest.call(this, 'POST', endpoint, body);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`Romulus webhook create error: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				} else {
					// Agent webhook subscription
					const endpoint = '/webhook-subscriptions';
					body = {
						event: eventType,
						url: webhookUrl,
					};

					// Add entity_type and entity_id only if specific agent is selected
					const scope = this.getNodeParameter('scope') as string;
					if (scope === 'specific') {
						body.entity_type = 'AGENT';
						const agentId = this.getNodeParameter('agentId') as string;
						body.entity_id = agentId;
					}

					if (this.logger) {
						this.logger.info(`Creating agent webhook with: ${JSON.stringify(body)}`);
					}
					try {
						await romulusApiRequest.call(this, 'POST', endpoint, body);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`Romulus webhook create error: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
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
