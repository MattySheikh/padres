/**
 * Handles the component rendered at /games
 */

import * as React from 'react';
import '@styles/index.scss';

import { RepeatableBreaksGraph } from '@components/pitchers/repeatable-breaks-graph';
import { VelocityPerInningGraph } from '@components/pitches/velocity-per-inning-graph';

export class Pitches extends React.Component {
	public componentDidMount() {
		document.title = 'Pitches';
	}

	render() {
		return(
			<div className="graphs-container">
				<RepeatableBreaksGraph />
				<VelocityPerInningGraph />
			</div>
		);
	}
}