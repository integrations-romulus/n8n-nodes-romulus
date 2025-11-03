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
				description: 'Get a list of all WhatsApp bots',
				action: 'List all whats app bots',
			},
			{
				name: 'Send WhatsApp Template Message',
				value: 'sendWhatsappTemplateMessage',
				description: 'Send a template message via WhatsApp',
				action: 'Send whats app template message',
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
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['listAllWhatsappBots'],
			},
		},
		default: true,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['listAllWhatsappBots'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	/* -------------------------------------------------------------------------- */
	/*                    messenger:sendWhatsappTemplateMessage                   */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'WhatsApp Bot Name or ID',
		name: 'bot_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappBots',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: '',
		description: 'Select the WhatsApp bot to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Template Name or ID',
		name: 'template_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getWhatsappTemplates',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: '',
		description: 'Select the message template to send. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
		displayName: 'Template Parameters',
		name: 'templateParameters',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['messenger'],
				operation: ['sendWhatsappTemplateMessage'],
			},
		},
		default: {},
		placeholder: 'Add Parameter',
		description: 'Parameters to fill in the template placeholders',
		options: [
			{
				name: 'parameter',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Component',
						name: 'component',
						type: 'options',
						options: [
							{
								name: 'Header',
								value: 'header',
							},
							{
								name: 'Body',
								value: 'body',
							},
							{
								name: 'Button',
								value: 'button',
							},
						],
						default: 'body',
						description: 'Which component of the template this parameter belongs to',
					},
					{
						displayName: 'Currency Amount',
						name: 'currency_amount',
						type: 'number',
						default: 0,
						description: 'Amount in the smallest currency unit (e.g., cents)',
					},
					{
						displayName: 'Currency Code',
						name: 'currency_code',
						type: 'string',
						default: 'USD',
						placeholder: 'USD',
						description: 'Currency code (e.g., USD, EUR, GBP)',
					},
					{
						displayName: 'Media URL',
						name: 'media_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/media.jpg',
						description: 'URL of the media file',
					},
					{
						displayName: 'Text Value',
						name: 'text',
						type: 'string',
						default: '',
						description: 'Text value for the parameter',
					},
					{
						displayName: 'Type',
						name: 'type',
						type: 'options',
						options: [
							{
								name: 'Currency',
								value: 'currency',
							},
							{
								name: 'Date Time',
								value: 'date_time',
							},
							{
								name: 'Document',
								value: 'document',
							},
							{
								name: 'Image',
								value: 'image',
							},
							{
								name: 'Text',
								value: 'text',
							},
							{
								name: 'Video',
								value: 'video',
							},
						],
						default: 'text',
						description: 'Type of parameter value',
					},
			],
			},
		],
	},
];
