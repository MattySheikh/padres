import * as React from 'react';

import { VelocityPerInningGraph } from '@components/pitches/velocity-per-inning-graph';


export class Pitches extends React.Component {
	constructor(props: object) {
		super(props);
	}

	public componentDidMount() {
		document.title = 'Pitches';
	}

	render() {
		return(
			<div>
				<VelocityPerInningGraph />
			</div>
		);
	}
}