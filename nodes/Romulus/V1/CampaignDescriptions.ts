import { INodeProperties } from 'n8n-workflow';

export const campaignOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
			},
		},
		options: [
			{
				name: 'Create Call Tasks',
				value: 'createCallTasks',
				description: 'Create call tasks for a campaign with multiple recipients',
				action: 'Create call tasks',
			},
			{
				name: 'Terminate Call Tasks',
				value: 'terminateCallTasks',
				description: 'Terminate pending call tasks for a campaign by phone number',
				action: 'Terminate call tasks',
			},
		],
		default: 'createCallTasks',
	},
];

export const campaignFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                         campaign:createCallTasks                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign Name or ID',
		name: 'campaignId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCampaigns',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['createCallTasks'],
			},
		},
		default: '',
		description: 'Select the campaign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Import Source',
		name: 'import_source',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['createCallTasks'],
			},
		},
		options: [
			{
				name: 'Manual',
				value: 'MANUAL',
			},
			{
				name: 'File',
				value: 'FILE',
			},
			{
				name: 'API',
				value: 'API',
			},
		],
		default: 'API',
		description: 'Source from which contacts are being imported',
	},
	{
		displayName: 'Recipients',
		name: 'recipients',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['createCallTasks'],
			},
		},
		default: {},
		placeholder: 'Add Recipient',
		description: 'List of recipients to create call tasks for',
		options: [
			{
				name: 'recipient',
				displayName: 'Recipient',
				values: [
					{
						displayName: 'Phone Number',
						name: 'contact_phone_number',
						type: 'string',
						required: true,
						default: '',
						placeholder: '+1234567890',
						description: 'Phone number in E164 format',
					},
					{
						displayName: 'Name',
						name: 'contact_name',
						type: 'string',
						default: '',
						description: 'Contact name',
					},
					{
						displayName: 'Email',
						name: 'contact_email',
						type: 'string',
						default: '',
						placeholder: 'john@example.com',
						description: 'Contact email address',
					},
					{
						displayName: 'Timezone',
						name: 'contact_timezone',
						type: 'string',
						default: 'Europe/Rome',
						placeholder: 'Europe/Rome',
						description: 'Contact timezone (e.g., Europe/Rome, America/New_York)',
					},
				],
			},
		],
	},
	{
		displayName: 'Retry Configuration',
		name: 'retryConfiguration',
		type: 'collection',
		placeholder: 'Add Retry Settings',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['createCallTasks'],
			},
		},
		options: [
			{
				displayName: 'Enable Retry',
				name: 'enabled',
				type: 'boolean',
				default: false,
				description: 'Whether to enable automatic retry on failed calls',
			},
			{
				displayName: 'Max Attempts',
				name: 'max_attempts',
				type: 'number',
				displayOptions: {
					show: {
						enabled: [true],
					},
				},
				default: 3,
				description: 'Maximum number of retry attempts (including the first attempt)',
				typeOptions: {
					minValue: 1,
					maxValue: 10,
				},
			},
			{
				displayName: 'Interval (Minutes)',
				name: 'interval_minutes',
				type: 'number',
				displayOptions: {
					show: {
						enabled: [true],
					},
				},
				default: 60,
				description: 'Time to wait between retry attempts in minutes',
				typeOptions: {
					minValue: 1,
					maxValue: 1440,
				},
			},
		],
	},
	{
		displayName: 'Availability Configuration',
		name: 'availabilityConfiguration',
		type: 'collection',
		placeholder: 'Add Availability Settings',
		default: {},
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['createCallTasks'],
			},
		},
		options: [
			{
				displayName: 'Enable Availability Windows',
				name: 'enabled',
				type: 'boolean',
				default: false,
				description: 'Whether to restrict calls to specific days and times',
			},
			{
				displayName: 'Days of Week',
				name: 'days_of_week',
				type: 'multiOptions',
				displayOptions: {
					show: {
						enabled: [true],
					},
				},
				options: [
					{ name: 'Friday', value: 'FRIDAY' },
					{ name: 'Monday', value: 'MONDAY' },
					{ name: 'Saturday', value: 'SATURDAY' },
					{ name: 'Sunday', value: 'SUNDAY' },
					{ name: 'Thursday', value: 'THURSDAY' },
					{ name: 'Tuesday', value: 'TUESDAY' },
					{ name: 'Wednesday', value: 'WEDNESDAY' },
				],
				default: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
				description: 'Days when calls are allowed',
			},
			{
				displayName: 'Time Windows',
				name: 'time_windows',
				type: 'fixedCollection',
				displayOptions: {
					show: {
						enabled: [true],
					},
				},
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: 'Add Time Window',
				description: 'Time windows when calls are allowed',
				options: [
					{
						name: 'window',
						displayName: 'Time Window',
						values: [
							{
								displayName: 'Start Time',
								name: 'start',
								type: 'string',
								default: '09:00',
								placeholder: '09:00',
								description: 'Start time in HH:mm format (24-hour)',
							},
							{
								displayName: 'End Time',
								name: 'end',
								type: 'string',
								default: '17:00',
								placeholder: '17:00',
								description: 'End time in HH:mm format (24-hour)',
							},
						],
					},
				],
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                       campaign:terminateCallTasks                          */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Campaign Name or ID',
		name: 'campaignId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getCampaigns',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['terminateCallTasks'],
			},
		},
		default: '',
		description: 'Select the campaign. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Phone Number',
		name: 'phone_number',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['campaign'],
				operation: ['terminateCallTasks'],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number in E164 format to terminate all pending tasks for',
	},
];
