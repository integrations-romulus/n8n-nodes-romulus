import { INodeProperties } from 'n8n-workflow';

export const messengerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
			},
		},
		options: [
			{
				name: 'List All WhatsApp Bots',
				value: 'listAllWhatsappBots',
				// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
				action: 'List all WhatsApp bots',
			},
			{
				name: 'Send WhatsApp Template Message',
				value: 'sendWhatsappTemplateMessage',
				action: 'List all messenger call tasks',
			},
		],
		default: 'listAllWhatsappBots',
	},
];

export const messengerFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                        messenger:listAllWhatsappBots                       */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['listAllWhatsappBots'],
			},
		},
		default: 0,
	},
	{
		displayName: 'Size',
		name: 'size',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['listAllWhatsappBots'],
			},
		},
		default: 20,
	},
	/* -------------------------------------------------------------------------- */
	/*                    messenger:sendWhatsappTemplateMessage                   */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Bot ID',
		name: 'bot_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: '',
	},
	{
		displayName: 'Template ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: '',
	},
	{
		displayName: 'Recipient',
		name: 'recipient',
		type: 'string',
		placeholder: '+3901201923232',
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: '',
	},
	{
		displayName: 'Parameters',
		name: 'parameters',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: '',
	},
];
