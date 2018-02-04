import * as React from 'react';
import '@styles/index.scss';

import { VelocityPerInningGraph } from '@components/pitches/velocity-per-inning-graph';
import { AvgPAPerInningGraph } from '@components/pitches/avg-pa-per-inning-graph';


export class Pitches extends React.Component {
	public componentDidMount() {
		document.title = 'Pitches';
	}

	render() {
		return(
			<div className="graphs-container">
				<VelocityPerInningGraph />
				<AvgPAPerInningGraph />
			</div>
		);
	}
}