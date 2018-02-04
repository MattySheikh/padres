import * as React from 'react';
import '@styles/index.scss';

import { PitchTypesThrownGraph } from '@components/pitchers/pitch-types-thrown-graph';
import { RepeatableBreaksGraph } from '@components/pitchers/repeatable-breaks-graph';

export class Pitchers extends React.Component {
	render() {
		return(
			<div className="graphs-container">
				<PitchTypesThrownGraph />
				<RepeatableBreaksGraph />
			</div>
		);
	}
}