import { INodeTypeBaseDescription, IVersionedNodeType, VersionedNodeType } from 'n8n-workflow';
import { RomulusV1 } from './V1/RomulusV1.node';

export class Romulus extends VersionedNodeType {

	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Romulus',
			name: 'romulus',
			icon: 'file:romulus.svg',
			group: ['output'],
			subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
			description: 'Consume Romulus API',
			defaultVersion: 1,
		};
		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new RomulusV1(baseDescription),
		}

		super(nodeVersions, baseDescription);
	}
}
