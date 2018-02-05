/**
 * Handles the component rendered at /pitchers
 */

import * as React from 'react';
import '@styles/index.scss';

import { PitchTypesThrownGraph } from '@components/pitchers/pitch-types-thrown-graph';
import { AvgPAPerInningGraph } from '@components/pitches/avg-pa-per-inning-graph';

export class Pitchers extends React.Component {
	public componentDidMount() {
		document.title = 'Pitches';
	}

	render() {
		return(
			<div className="graphs-container">
				<PitchTypesThrownGraph />
				<AvgPAPerInningGraph />
			</div>
		);
	}
}