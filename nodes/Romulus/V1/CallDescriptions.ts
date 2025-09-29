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
				name: 'List Robocalls',
				value: 'listRobocalls',
				description: 'List all robocalls configurations',
				action: 'List all robocalls',
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
		displayName: 'Page',
		name: 'page',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['listRobocalls'],
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
				resource: ['call'],
				operation: ['listRobocalls'],
			},
		},
		default: 20,
	},
	/* -------------------------------------------------------------------------- */
	/*                             call:startRobocall                             */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Robocall Configuration ID',
		name: 'robocall_configuration_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['call'],
				operation: ['startRobocall'],
			},
		},
		default: '',
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
	},
];
