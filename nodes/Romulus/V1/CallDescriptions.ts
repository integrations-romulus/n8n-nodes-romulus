import { INodeProperties } from 'n8n-workflow';

export const callOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['call'],
			},
		},
		options: [
			{
				name: 'Create Webhook Subscription',
				value: 'createWebhookSubscription',
				description: 'Create a webhook subscription for robocall events',
				action: 'Create webhook subscription',
			},
			{
				name: 'Delete Webhook Subscription',
				value: 'deleteWebhookSubscription',
				description: 'Delete a robocall webhook subscription',
				action: 'Delete webhook subscription',
			},
			{
				name: 'List Robocalls',
				value: 'listRobocalls',
				description: 'List all robocalls configurations',
				action: 'List all robocalls',
			},
			{
				name: 'List Webhook Subscriptions',
				value: 'listWebhookSubscriptions',
				description: 'List all robocall webhook subscriptions',
				action: 'List webhook subscriptions',
			},
			{
				name: 'Start a Robocall',
				value: 'startRobocall',
				description: 'Starts robocall task to specified phone number',
				action: 'Start a robocall',
			},
		],
		default: 'listRobocalls',
	},
];

export const callFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                             call:listRobocalls                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['listRobocalls'],
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
				resource: ['call'],
				operation: ['listRobocalls'],
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
	/*                             call:startRobocall                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Robocall Configuration Name or ID',
		name: 'robocall_configuration_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getRobocalls',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['startRobocall'],
			},
		},
		default: '',
		description: 'Select the robocall configuration to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['startRobocall'],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number in E.164 format (must start with + followed by country code)',
		typeOptions: {
			pattern: '\\+[1-9]\\d{1,14}',
			patternErrorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                      call:createWebhookSubscription                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createWebhookSubscription'],
			},
		},
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'URL to receive webhook notifications (must be a valid HTTPS URL)',
		typeOptions: {
			pattern: '^https?://[^\\s/$.?#].[^\\s]*$',
			patternErrorMessage: 'Please enter a valid URL (e.g., https://example.com/webhook)',
		},
	},
	{
		displayName: 'Entity Type',
		name: 'entity_type',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createWebhookSubscription'],
			},
		},
		default: 'ROBOCALL',
		description: 'Type of entity for the webhook subscription',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['createWebhookSubscription'],
			},
		},
		options: [
			{
				displayName: 'Entity ID',
				name: 'entity_id',
				type: 'string',
				default: '',
				description: 'ID of the specific entity to subscribe to (optional)',
			},
		],
	},
	/* -------------------------------------------------------------------------- */
	/*                      call:listWebhookSubscriptions                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['listWebhookSubscriptions'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	/* -------------------------------------------------------------------------- */
	/*                      call:deleteWebhookSubscription                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Webhook Subscription ID',
		name: 'webhookSubscriptionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['deleteWebhookSubscription'],
			},
		},
		default: '',
		description: 'ID of the webhook subscription to delete',
	},
];
