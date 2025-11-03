import { INodeProperties } from 'n8n-workflow';

export const agentOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['agent'],
			},
		},
		options: [
			{
				name: 'List All Agent Call Tasks',
				value: 'listAllAgentCallTasks',
				description: 'List all call tasks from a specific AI agents',
				action: 'List all agent call tasks',
			},
			{
				name: 'List All Agents',
				value: 'listAllAgents',
				description: 'List all AI agents',
				action: 'List all agents',
			},
			{
				name: 'Start Agent Call',
				value: 'startAgentCall',
				description: 'Initiates an outbound agent without further configurations',
				action: 'Start agent call',
			},
			{
				name: 'Start Agent Call Task',
				value: 'startAgentCallTask',
				description: 'Initiates an outbound agent with availability and retry configurations',
				action: 'Start agent call task',
			},
			{
				name: 'Terminate Call Task by ID',
				value: 'terminateCallTaskById',
				description: 'Terminate a specific agent call task by its ID',
				action: 'Terminate call task by ID',
			},
			{
				name: 'Terminate Call Tasks by Phone',
				value: 'terminateCallTasksByPhone',
				description: 'Terminate all agent call tasks for a specific phone number',
				action: 'Terminate call tasks by phone',
			},
		],
		default: 'listAllAgents',
	},
];

export const agentFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                             agent:listAllAgents                            */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['listAllAgents'],
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
				resource: ['agent'],
				operation: ['listAllAgents'],
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
	/*                         agent:listAllAgentCallTasks                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Agent Name or ID',
		name: 'agentId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['listAllAgentCallTasks'],
			},
		},
		default: '',
		description: 'Select the agent to list call tasks for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['listAllAgentCallTasks'],
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
				resource: ['agent'],
				operation: ['listAllAgentCallTasks'],
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
	/*                       		    call:startAgentCall                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Agent Name or ID',
		name: 'agentId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCall'],
			},
		},
		default: '',
		description: 'Select the agent to make the call. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'To Phone Number',
		name: 'to',
		type: 'string',
		placeholder: '+1234567890',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCall'],
			},
		},
		default: '',
		description: 'Phone number to call in E.164 format (must start with + followed by country code)',
		typeOptions: {
			pattern: '\\+[1-9]\\d{1,14}',
			patternErrorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
		},
	},
	{
		displayName: 'Properties',
		name: 'properties',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: "User's Email",
				name: 'email',
				type: 'string',
				placeholder: 'name@email.com',
				default: '',
			},
			{
				displayName: "User's Name",
				name: 'name',
				type: 'string',
				default: '',
			},
			{
				displayName: "User's Timezone",
				name: 'timezone',
				type: 'string',
				placeholder: 'UTC',
				default: 'UTC',
				description: 'Timezone for the user (e.g., UTC, Europe/Rome, America/New_York)',
			},
		],
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCall'],
			},
		},
	},
	/* -------------------------------------------------------------------------- */
	/*                           agent:startAgentCallTask                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Agent Name or ID',
		name: 'agentId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAgents',
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		default: '',
		description: 'Select the agent that will make the call. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Contact Phone Number',
		name: 'contact_phone_number',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number in E.164 format which will be called by the agent (must start with + followed by country code)',
		typeOptions: {
			pattern: '\\+[1-9]\\d{1,14}',
			patternErrorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
		},
	},
	{
		displayName: 'Contact Email',
		name: 'contact_email',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		default: '',
		placeholder: 'contact@example.com',
		description: 'Contact email address used in agent context',
		typeOptions: {
			pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
			patternErrorMessage: 'Please enter a valid email address',
		},
	},
	{
		displayName: 'Contact Name',
		name: 'contact_name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		default: '',
		description: 'Contact name used in agent context',
	},
	{
		displayName: 'Contact Timezone',
		name: 'contact_timezone',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		default: 'UTC',
		placeholder: 'UTC',
		description: 'Timezone for the contact (e.g., UTC, Europe/Rome, America/New_York)',
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		options: [
			{
				displayName: 'Campaign ID',
				name: 'campaign_id',
				type: 'string',
				default: '',
				description: 'Optional campaign ID to associate this call task with',
			},
			{
				displayName: 'Custom Properties (JSON)',
				name: 'custom_properties',
				type: 'json',
				default: '{}',
				description: 'Additional custom properties to pass to the agent as JSON object',
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
				resource: ['agent'],
				operation: ['startAgentCallTask'],
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
				resource: ['agent'],
				operation: ['startAgentCallTask'],
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
	/*                        agent:terminateCallTaskById                         */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Call Task ID',
		name: 'callTaskId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['terminateCallTaskById'],
			},
		},
		default: '',
		description: 'ID of the call task to terminate',
	},
	/* -------------------------------------------------------------------------- */
	/*                      agent:terminateCallTasksByPhone                       */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Contact Phone Number',
		name: 'contact_phone_number',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['terminateCallTasksByPhone'],
			},
		},
		default: '',
		placeholder: '+1234567890',
		description: 'Phone number in E.164 format to terminate all pending tasks for (must start with + followed by country code)',
		typeOptions: {
			pattern: '\\+[1-9]\\d{1,14}',
			patternErrorMessage: 'Please enter a valid phone number in E.164 format (e.g., +1234567890)',
		},
	},
];
