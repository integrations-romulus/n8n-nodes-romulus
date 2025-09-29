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
				name: 'List All Agents',
				value: 'listAllAgents',
				description: 'List all AI agents',
				action: 'List all agents',
			},
			{
				name: 'List All Agent Call Tasks',
				value: 'listAllAgentCallTasks',
				description: 'List all call tasks from a specific AI agents',
				action: 'List all agent call tasks',
			},
			{
				name: 'Start Agent Call',
				value: 'startAgentCall',
				description: 'Initiates an outbound agent call without further configurations',
				action: 'Start agent call',
			},
			{
				name: 'Start Agent Call Task',
				value: 'startAgentCallTask',
				description: 'Initiates an outbound agent with availability and retry configurations',
				action: 'Start agent call task',
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
		displayName: 'Page',
		name: 'page',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['listAllAgents'],
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
				resource: ['agent'],
				operation: ['listAllAgents'],
			},
		},
		default: 20,
	},
	/* -------------------------------------------------------------------------- */
	/*                         agent:listAllAgentCallTasks                        */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['listAllAgentCallTasks'],
			},
		},
		default: '',
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['listAllAgentCallTasks'],
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
				resource: ['agent'],
				operation: ['listAllAgentCallTasks'],
			},
		},
		default: 20,
	},

	/* -------------------------------------------------------------------------- */
	/*                       		    call:startAgentCall                           */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCall'],
			},
		},
		default: '',
	},
	{
		displayName: 'To Number',
		name: 'to',
		type: 'string',
		placeholder: '+390101010101',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCall'],
			},
		},
		default: '',
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
				placeholder: 'Europe/Rome',
				default: 'Europe/Rome',
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
		displayName: 'Agent ID',
		name: 'agentId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
		default: '',
		description: 'ID of the agent that will make the call',
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
		description: 'Phone number in E164 format which will be called by the agent',
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
		description: 'Contact email used in agent context',
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
		displayName: 'Additional Properties',
		name: 'properties',
		type: 'json',
		default: '',
		displayOptions: {
			show: {
				resource: ['agent'],
				operation: ['startAgentCallTask'],
			},
		},
	},
];
