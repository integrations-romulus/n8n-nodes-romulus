import {
	INodeTypeDescription,
	INodeTypeBaseDescription,
	IExecuteFunctions,
	INodeExecutionData,
	NodeConnectionType,
	IDataObject,
} from 'n8n-workflow';
import { romulusApiRequest } from './GenericFunctions';
import { callFields, callOperations } from './CallDescriptions';
import { agentFields, agentOperations } from './AgentsDescriptions';
import { messengerFields, messengerOperations } from './MessengerDescriptions';
import { INodeType } from 'n8n-workflow';
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
					displayOptions: {
						show: {
							authentication: ['apiKey'],
						},
					},
				},
			],
			properties: [
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
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Call',
							value: 'call',
						},
						{
							name: 'Agent',
							value: 'agent',
						},
						{
							name: 'Messenger',
							value: 'messenger',
						},
					],
					default: 'call',
				},
				// CALL ACTIONS
				...callOperations,
				...callFields,
				// AGENT ACTIONS
				...agentOperations,
				...agentFields,
				// MESSENGER ACTIONS
				...messengerOperations,
				...messengerFields,
			],
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		// const length = items.length;

		for (let i = 0; i < items.length; i++) {
			const resource = this.getNodeParameter('resource', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			let responseData;

			// CALL RESOURCE
			if (resource === 'call') {
				if (operation === 'listRobocalls') {
					const qs: Record<string, number> = {};
					qs.page = this.getNodeParameter('page', i) as number;
					qs.size = this.getNodeParameter('size', i) as number;
					const endpoint = '/call-tasks/robocalls/configurations';
					responseData = await romulusApiRequest.call(this, 'GET', endpoint, {}, qs);
				} else if (operation === 'startRobocall') {
					const body: Record<string, string> = {};
					body.robocall_configuration_id = this.getNodeParameter(
						'robocall_configuration_id',
						i,
					) as string;
					body.phone_number = this.getNodeParameter('phone_number', i) as string;
					const endpoint = '/call-tasks/robocalls';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				}

				// AGENT RESOURCE
			} else if (resource === 'agent') {
				if (operation === 'listAllAgents') {
					const qs: Record<string, number> = {};
					qs.page = this.getNodeParameter('page', i) as number;
					qs.size = this.getNodeParameter('size', i) as number;
					const endpoint = '/ai-agents/agents/search';
					responseData = await romulusApiRequest.call(this, 'GET', endpoint, {}, qs);
				} else if (operation === 'listAllAgentCallTasks') {
					const qs: Record<string, number> = {};
					qs.page = this.getNodeParameter('page', i) as number;
					qs.size = this.getNodeParameter('size', i) as number;
					const agentId = this.getNodeParameter('agentId', i) as string;
					const endpoint = `/ai-agents/agents/${agentId}/call-tasks`;
					responseData = await romulusApiRequest.call(this, 'GET', endpoint, {}, qs);
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

					let body: Record<string, any> = {};

					body.contact_phone_number = this.getNodeParameter('contact_phone_number', i) as string;
					this.getNodeParameter('contact_email', i) &&
						(body.contact_email = this.getNodeParameter('contact_email', i) as string);
					this.getNodeParameter('contact_name', i) &&
						(body.contact_name = this.getNodeParameter('contact_name', i) as string);

					const propertiesJson = this.getNodeParameter('properties', i, '') as string;

					if (propertiesJson) {
						const properties = JSON.parse(propertiesJson) as Record<string, any>;
						Object.assign(body, properties);
					}

					const endpoint = `/ai-agents/agents/${agentId}/call-tasks`;
					if (this.logger) {
						this.logger.info(`start agent call task: ${JSON.stringify(body)}`);
					}
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				}
				// MESSENGER RESOURCE
			} else if (resource === 'messenger') {
				if (operation === 'listAllWhatsappBots') {
					const qs: Record<string, number> = {};
					qs.page = this.getNodeParameter('page', i) as number;
					qs.size = this.getNodeParameter('size', i) as number;
					const endpoint = '/messengers/whatsapp/bots';
					responseData = await romulusApiRequest.call(this, 'GET', endpoint, {}, qs);
				} else if (operation === 'sendWhatsappTemplateMessage') {
					let body: Record<string, any> = {};
					body.bot_id = this.getNodeParameter('bot_id', i) as string;
					body.template_id = this.getNodeParameter('template_id', i) as string;
					body.recipient = this.getNodeParameter('recipient', i) as string;
					Object.assign(body, this.getNodeParameter('parameters', i) || {});
					const endpoint = '/messengers/whatsapp/template-message';
					responseData = await romulusApiRequest.call(this, 'POST', endpoint, body);
				}
			}

			returnData.push({ json: responseData });
		}

		return this.prepareOutputData(returnData);
	}
}
