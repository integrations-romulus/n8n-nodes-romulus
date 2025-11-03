import { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new webhook subscription',
				action: 'Create webhook subscription',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a webhook subscription',
				action: 'Delete webhook subscription',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a webhook subscription by ID',
				action: 'Get webhook subscription',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all webhook subscriptions',
				action: 'List webhook subscriptions',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a webhook subscription',
				action: 'Update webhook subscription',
			},
		],
		default: 'list',
	},
];

export const webhookFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                              webhook:list                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['list'],
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
				resource: ['webhook'],
				operation: ['list'],
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
	/*                              webhook:get                                   */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Webhook Subscription ID',
		name: 'webhookSubscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'ID of the webhook subscription to retrieve',
	},

	/* -------------------------------------------------------------------------- */
	/*                              webhook:create                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Event',
		name: 'event',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				name: 'Agent Call Completed',
				value: 'AGENT_CALL_COMPLETED',
			},
			{
				name: 'Agent Action Completed',
				value: 'AGENT_ACTION_COMPLETED',
			},
		],
		default: 'AGENT_CALL_COMPLETED',
		description: 'Event type to trigger the webhook',
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'URL to send webhook notifications to (must be a valid HTTPS URL)',
		typeOptions: {
			pattern: '^https?://[^\\s/$.?#].[^\\s]*$',
			patternErrorMessage: 'Please enter a valid URL (e.g., https://example.com/webhook)',
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Attempts',
				name: 'attempts',
				type: 'number',
				default: 3,
				description: 'Number of retry attempts for failed webhook deliveries',
			},
			{
				displayName: 'Attempts Interval (Seconds)',
				name: 'attempts_interval_seconds',
				type: 'number',
				default: 60,
				description: 'Time interval between retry attempts in seconds',
			},
			{
				displayName: 'Entity ID',
				name: 'entity_id',
				type: 'string',
				default: '',
				description: 'ID of the entity this webhook is associated with',
			},
			{
				displayName: 'Entity Type',
				name: 'entity_type',
				type: 'string',
				default: '',
				description: 'Type of entity this webhook is associated with (e.g., AGENT)',
			},
			{
				displayName: 'Specifications',
				name: 'specifications',
				type: 'json',
				default: '{}',
				description: 'Additional specifications for the webhook in JSON format',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              webhook:update                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Webhook Subscription ID',
		name: 'webhookSubscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'ID of the webhook subscription to update',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				name: 'Active',
				value: 'ACTIVE',
			},
			{
				name: 'Inactive',
				value: 'INACTIVE',
			},
		],
		default: 'ACTIVE',
		description: 'Status of the webhook subscription',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Attempts',
				name: 'attempts',
				type: 'number',
				default: 3,
				description: 'Number of retry attempts for failed webhook deliveries',
			},
			{
				displayName: 'Attempts Interval (Seconds)',
				name: 'attempts_interval_seconds',
				type: 'number',
				default: 60,
				description: 'Time interval between retry attempts in seconds',
			},
			{
				displayName: 'Entity ID',
				name: 'entity_id',
				type: 'string',
				default: '',
				description: 'ID of the entity this webhook is associated with',
			},
			{
				displayName: 'Entity Type',
				name: 'entity_type',
				type: 'string',
				default: '',
				description: 'Type of entity this webhook is associated with',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				options: [
					{
						name: 'Agent Call Completed',
						value: 'AGENT_CALL_COMPLETED',
					},
					{
						name: 'Agent Action Completed',
						value: 'AGENT_ACTION_COMPLETED',
					},
				],
				default: 'AGENT_CALL_COMPLETED',
				description: 'Event type to trigger the webhook',
			},
			{
				displayName: 'Specifications',
				name: 'specifications',
				type: 'json',
				default: '{}',
				description: 'Additional specifications for the webhook in JSON format',
			},
			{
				displayName: 'URL',
				name: 'url',
				type: 'string',
				default: '',
				placeholder: 'https://example.com/webhook',
				description: 'URL to send webhook notifications to (must be a valid HTTPS URL)',
				typeOptions: {
					pattern: '^https?://[^\\s/$.?#].[^\\s]*$',
					patternErrorMessage: 'Please enter a valid URL (e.g., https://example.com/webhook)',
				},
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                              webhook:delete                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Webhook Subscription ID',
		name: 'webhookSubscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['delete'],
			},
		},
		default: '',
		description: 'ID of the webhook subscription to delete',
	},
];
