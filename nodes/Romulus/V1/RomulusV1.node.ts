import {
	INodeTypeDescription,
	INodeTypeBaseDescription,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	NodeConnectionType,
	IDataObject,
	NodeOperationError,
	INodeType,
} from 'n8n-workflow';
import { romulusApiRequest, handlePaginatedRequest } from './GenericFunctions';
import { callFields, callOperations } from './CallDescriptions';
import { agentFields, agentOperations } from './AgentsDescriptions';
import { messengerFields, messengerOperations } from './MessengerDescriptions';
import { campaignFields, campaignOperations } from './CampaignDescriptions';
import { webhookFields, webhookOperations } from './WebhookDescriptions';
export class RomulusV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			group: ['output'],
			version: 1,
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			defaults: {
				name: 'Romulus',
			},
			inputs: [NodeConnectionType.Main],
			outputs: [NodeConnectionType.Main],
			credentials: [
				{
					name: 'romulusApi',
					required: true,
				},
			],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Agent',
							value: 'agent',
						},
						{
							name: 'Call',
							value: 'call',
						},
						{
							name: 'Campaign',
							value: 'campaign',
						},
						{
							name: 'Messenger',
							value: 'messenger',
						},
						{
							name: 'Webhook',
							value: 'webhook',
						},
					],
					default: 'agent',
				},
				// AGENT ACTIONS
				...agentOperations,
				...agentFields,
				// CALL ACTIONS
				...callOperations,
				...callFields,
				// CAMPAIGN ACTIONS
				...campaignOperations,
				...campaignFields,
				// MESSENGER ACTIONS
				...messengerOperations,
				...messengerFields,
				// WEBHOOK ACTIONS
				...webhookOperations,
				...webhookFields,
			],
		};
	}

	methods = {
		loadOptions: {
			// Load agents from Romulus API
			async getAgents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					const response = await romulusApiRequest.call(
						this,
						'GET',
						'/ai-agents/agents/search',
						{},
						{ page: 0, size: 100 },
					);

					const agents = response?.content ?? response?.results ?? response ?? [];
					for (const agent of agents) {
						returnData.push({
							name: agent.name || agent.id,
							value: agent.id,
							description: agent.description || `Agent ID: ${agent.id}`,
						});
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load agents: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},

			// Load robocall configurations
			async getRobocalls(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					const response = await romulusApiRequest.call(
						this,
						'GET',
						'/call-tasks/robocalls/configurations',
						{},
						{ page: 0, size: 100 },
					);

					const robocalls = response?.content ?? response?.results ?? response ?? [];
					for (const robocall of robocalls) {
						returnData.push({
							name: robocall.name || robocall.id,
							value: robocall.id,
							description: robocall.description || `Robocall ID: ${robocall.id}`,
						});
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load robocall configurations: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},

			// Load campaigns
			async getCampaigns(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					// Note: Adjust endpoint if there's a dedicated campaigns list endpoint
					const response = await romulusApiRequest.call(
						this,
						'GET',
						'/call-campaigns/search',
						{},
						{ page: 0, size: 100 },
					);

					const campaigns = response?.content ?? response?.results ?? response ?? [];
					for (const campaign of campaigns) {
						returnData.push({
							name: campaign.name || campaign.id,
							value: campaign.id,
							description: campaign.description || `Campaign ID: ${campaign.id}`,
						});
					}
				} catch (error) {
					// If campaigns endpoint doesn't exist yet, return empty with helpful message
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load campaigns: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},

			// Load WhatsApp bots
			async getWhatsappBots(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					const response = await romulusApiRequest.call(
						this,
						'GET',
						'/messengers/whatsapp/bots',
						{},
						{ page: 0, size: 100 },
					);

					const bots = response?.content ?? response?.results ?? response ?? [];
					for (const bot of bots) {
						returnData.push({
							name: bot.name || bot.id,
							value: bot.id,
							description: bot.phone_number || `Bot ID: ${bot.id}`,
						});
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load WhatsApp bots: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},

			// Load WhatsApp templates for a specific bot
			async getWhatsappTemplates(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const returnData: INodePropertyOptions[] = [];
				try {
					const botId = this.getCurrentNodeParameter('bot_id') as string;
					if (!botId) {
						return returnData;
					}

					const response = await romulusApiRequest.call(
						this,
						'GET',
						'/messengers/whatsapp/bots',
						{},
						{ page: 0, size: 100 },
					);

					const bots = response?.content ?? response?.results ?? response ?? [];
					const selectedBot = bots.find((bot: IDataObject) => bot.id === botId);

					if (selectedBot && selectedBot.templates) {
						for (const template of selectedBot.templates as IDataObject[]) {
							returnData.push({
								name: (template.name as string) || (template.id as string) || 'Unknown Template',
								value: (template.id as string) || '',
								description: (template.language as string) || `Template ID: ${template.id as string}`,
							});
						}
					}
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`Failed to load WhatsApp templates: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
				return returnData;
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData;

			// CALL RESOURCE
			if (resource === 'call') {
				if (operation === 'listRobocalls') {
					const endpoint = '/call-tasks/robocalls/configurations';
					responseData = await handlePaginatedRequest.call(this, endpoint, i);
				} else if (operation === 'startRobocall') {
					const body: Record<string, string> = {};
					body.robocall_configuration_id = this.getNodeParameter(
						'robocall_configuration_id',
						i,
					) as string;
					body.phone_number = this.getNodeParameter('phone_number', i) as string;
					const endpoint = '/call-tasks/robocalls';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'createWebhookSubscription') {
					const body: Record<string, any> = {};
					body.url = this.getNodeParameter('url', i) as string;
					body.entity_type = this.getNodeParameter('entity_type', i) as string;

					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
					if (additionalFields.entity_id) {
						body.entity_id = additionalFields.entity_id as string;
					}

					const endpoint = '/call-tasks/webhook-subscriptions';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'listWebhookSubscriptions') {
					const endpoint = '/call-tasks/webhook-subscriptions';
					responseData = await handlePaginatedRequest.call(this, endpoint, i);
				} else if (operation === 'deleteWebhookSubscription') {
					const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
					const endpoint = `/call-tasks/webhook-subscriptions/${webhookSubscriptionId}`;
					const response = await romulusApiRequest.call(this, 'DELETE', endpoint, {});
					// Ensure we always return something meaningful
					responseData = response || {
						success: true,
						id: webhookSubscriptionId,
						message: 'Webhook subscription deleted successfully',
					};
				}

				// AGENT RESOURCE
			} else if (resource === 'agent') {
				if (operation === 'listAllAgents') {
					const endpoint = '/ai-agents/agents/search';
					responseData = await handlePaginatedRequest.call(this, endpoint, i);
				} else if (operation === 'listAllAgentCallTasks') {
					const agentId = this.getNodeParameter('agentId', i) as string;
					const endpoint = `/ai-agents/agents/${agentId}/call-tasks`;
					responseData = await handlePaginatedRequest.call(this, endpoint, i);
				} else if (operation === 'startAgentCall') {
					const agentId = this.getNodeParameter('agentId', i) as string;

					const body: Record<string, any> = {};
					body.to = this.getNodeParameter('to', i) as string;
					const properties = this.getNodeParameter('properties', i, {}) as IDataObject;

					if (properties.email) {
						body.email = properties.email as string;
					}

					if (properties.name) {
						body.name = properties.name as string;
					}

					if (properties.timezone) {
						body.timezone = properties.timezone as string;
					}

					const endpoint = `/ai-agents/agents/${agentId}/call`;
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'startAgentCallTask') {
					const agentId = this.getNodeParameter('agentId', i) as string;

					const body: Record<string, any> = {};

					// Required fields
					body.contact_phone_number = this.getNodeParameter('contact_phone_number', i) as string;

					// Optional contact fields
					const contactEmail = this.getNodeParameter('contact_email', i, '') as string;
					if (contactEmail) {
						body.contact_email = contactEmail;
					}

					const contactName = this.getNodeParameter('contact_name', i, '') as string;
					if (contactName) {
						body.contact_name = contactName;
					}

					const contactTimezone = this.getNodeParameter('contact_timezone', i, '') as string;
					if (contactTimezone) {
						body.contact_timezone = contactTimezone;
					}

					// Optional fields collection
					const options = this.getNodeParameter('options', i, {}) as IDataObject;
					if (options.campaign_id) {
						body.campaign_id = options.campaign_id as string;
					}

					// Handle custom properties from JSON
					if (options.custom_properties) {
						try {
							const customProps = JSON.parse(options.custom_properties as string);
							Object.assign(body, customProps);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in custom_properties field: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					// Retry configuration
					const retryConfig = this.getNodeParameter('retryConfiguration', i, {}) as IDataObject;
					if (retryConfig.enabled) {
						body.retry_configuration = {
							max_attempts: retryConfig.max_attempts || 3,
							interval_minutes: retryConfig.interval_minutes || 60,
						};
					}

					// Availability configuration
					const availConfig = this.getNodeParameter(
						'availabilityConfiguration',
						i,
						{},
					) as IDataObject;
					if (availConfig.enabled) {
						const timeWindows = availConfig.time_windows as IDataObject;
						const windows = timeWindows?.window as IDataObject[];

						body.availability_configuration = {
							days_of_week: availConfig.days_of_week || [
								'MONDAY',
								'TUESDAY',
								'WEDNESDAY',
								'THURSDAY',
								'FRIDAY',
							],
							time_windows:
								windows?.map((w: IDataObject) => ({
									start: w.start,
									end: w.end,
								})) || [],
						};
					}

					const endpoint = `/ai-agents/agents/${agentId}/call-tasks`;
					if (this.logger) {
						this.logger.info(`start agent call task: ${JSON.stringify(body)}`);
					}
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'terminateCallTaskById') {
					const callTaskId = this.getNodeParameter('callTaskId', i) as string;
					const endpoint = `/ai-agents/agents/call-tasks/${callTaskId}/terminate`;
					responseData = await romulusApiRequest.call(this, 'PUT', endpoint, {});
				} else if (operation === 'terminateCallTasksByPhone') {
					const body: Record<string, string> = {};
					body.contact_phone_number = this.getNodeParameter('contact_phone_number', i) as string;
					const endpoint = '/ai-agents/agents/call-tasks/terminate';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				}

				// CAMPAIGN RESOURCE
			} else if (resource === 'campaign') {
				if (operation === 'createCallTasks') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const body: Record<string, any> = {};
					body.import_source = this.getNodeParameter('import_source', i) as string;

					// Get recipients from fixedCollection
					const recipientsData = this.getNodeParameter('recipients', i) as IDataObject;
					const recipientsList = recipientsData.recipient as IDataObject[];
					body.recipients = recipientsList || [];

					// Retry configuration
					const retryConfig = this.getNodeParameter('retryConfiguration', i, {}) as IDataObject;
					if (retryConfig.enabled) {
						body.retry_configuration = {
							max_attempts: retryConfig.max_attempts || 3,
							interval_minutes: retryConfig.interval_minutes || 60,
						};
					}

					// Availability configuration
					const availConfig = this.getNodeParameter(
						'availabilityConfiguration',
						i,
						{},
					) as IDataObject;
					if (availConfig.enabled) {
						const timeWindows = availConfig.time_windows as IDataObject;
						const windows = timeWindows?.window as IDataObject[];

						body.availability_configuration = {
							days_of_week: availConfig.days_of_week || [
								'MONDAY',
								'TUESDAY',
								'WEDNESDAY',
								'THURSDAY',
								'FRIDAY',
							],
							time_windows:
								windows?.map((w: IDataObject) => ({
									start: w.start,
									end: w.end,
								})) || [],
						};
					}

					const endpoint = `/call-campaigns/${campaignId}/tasks`;
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'terminateCallTasks') {
					const campaignId = this.getNodeParameter('campaignId', i) as string;
					const body: Record<string, string> = {};
					body.phone_number = this.getNodeParameter('phone_number', i) as string;
					const endpoint = `/call-campaigns/${campaignId}/tasks/terminate`;
					responseData = await romulusApiRequest.call(this, 'PUT', endpoint, body);
				}

				// MESSENGER RESOURCE
			} else if (resource === 'messenger') {
				if (operation === 'listAllWhatsappBots') {
					const endpoint = '/messengers/whatsapp/bots';
					responseData = await handlePaginatedRequest.call(this, endpoint, i);
				} else if (operation === 'sendWhatsappTemplateMessage') {
					const body: Record<string, any> = {};
					body.bot_id = this.getNodeParameter('bot_id', i) as string;
					body.template_id = this.getNodeParameter('template_id', i) as string;
					body.recipient = this.getNodeParameter('recipient', i) as string;

					// Build parameters array from fixedCollection
					const templateParamsData = this.getNodeParameter(
						'templateParameters',
						i,
						{},
					) as IDataObject;
					const paramsList = templateParamsData.parameter as IDataObject[];

					if (paramsList && paramsList.length > 0) {
						// Group parameters by component
						const componentParams: Record<string, any[]> = {};

						for (const param of paramsList) {
							const component = param.component as string;
							if (!componentParams[component]) {
								componentParams[component] = [];
							}

							const paramObj: Record<string, any> = {
								type: param.type,
							};

							// Add appropriate fields based on type
							if (param.type === 'text') {
								paramObj.text = param.text;
							} else if (param.type === 'currency') {
								paramObj.currency = {
									code: param.currency_code,
									amount_1000: param.currency_amount,
								};
							} else if (['image', 'document', 'video'].includes(param.type as string)) {
								paramObj[param.type as string] = {
									link: param.media_url,
								};
							}

							componentParams[component].push(paramObj);
						}

						// Build the parameters array in API format
						body.parameters = Object.keys(componentParams).map((component) => ({
							component,
							component_parameters: componentParams[component],
						}));
					}

					const endpoint = '/messengers/whatsapp/template-message';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				}

				// WEBHOOK RESOURCE
			} else if (resource === 'webhook') {
				if (operation === 'list') {
					const endpoint = '/webhook-subscriptions/search';
					responseData = await handlePaginatedRequest.call(this, endpoint, i);
				} else if (operation === 'get') {
					const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
					const endpoint = `/webhook-subscriptions/${webhookSubscriptionId}`;
					responseData = await romulusApiRequest.call(this, 'GET', endpoint, {});
				} else if (operation === 'create') {
					const body: Record<string, any> = {};
					body.event = this.getNodeParameter('event', i) as string;
					body.url = this.getNodeParameter('url', i) as string;

					const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;
					if (additionalFields.entity_type) {
						body.entity_type = additionalFields.entity_type as string;
					}
					if (additionalFields.entity_id) {
						body.entity_id = additionalFields.entity_id as string;
					}
					if (additionalFields.attempts) {
						body.attempts = additionalFields.attempts as number;
					}
					if (additionalFields.attempts_interval_seconds) {
						body.attempts_interval_seconds = additionalFields.attempts_interval_seconds as number;
					}
					if (additionalFields.specifications) {
						try {
							body.specifications = JSON.parse(additionalFields.specifications as string);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in specifications field: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					const endpoint = '/webhook-subscriptions';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				} else if (operation === 'update') {
					const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
					const body: Record<string, any> = {};
					body.status = this.getNodeParameter('status', i) as string;

					const updateFields = this.getNodeParameter('updateFields', i, {}) as IDataObject;
					if (updateFields.event) {
						body.event = updateFields.event as string;
					}
					if (updateFields.url) {
						body.url = updateFields.url as string;
					}
					if (updateFields.entity_type) {
						body.entity_type = updateFields.entity_type as string;
					}
					if (updateFields.entity_id) {
						body.entity_id = updateFields.entity_id as string;
					}
					if (updateFields.attempts) {
						body.attempts = updateFields.attempts as number;
					}
					if (updateFields.attempts_interval_seconds) {
						body.attempts_interval_seconds = updateFields.attempts_interval_seconds as number;
					}
					if (updateFields.specifications) {
						try {
							body.specifications = JSON.parse(updateFields.specifications as string);
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`Invalid JSON in specifications field: ${error instanceof Error ? error.message : String(error)}`,
							);
						}
					}

					const endpoint = `/webhook-subscriptions/${webhookSubscriptionId}`;
					responseData = await romulusApiRequest.call(this, 'PUT', endpoint, body);
				} else if (operation === 'delete') {
					const webhookSubscriptionId = this.getNodeParameter('webhookSubscriptionId', i) as string;
					const endpoint = `/webhook-subscriptions/${webhookSubscriptionId}`;
					const response = await romulusApiRequest.call(this, 'DELETE', endpoint, {});
					// Ensure we always return something meaningful
					responseData = response || {
						success: true,
						id: webhookSubscriptionId,
						message: 'Webhook subscription deleted successfully',
					};
				}
			}

			returnData.push({ json: responseData });
		}

		return this.prepareOutputData(returnData);
	}
}
