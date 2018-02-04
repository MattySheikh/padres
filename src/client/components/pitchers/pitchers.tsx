import * as React from 'react';
import { PitchTypesThrownGraph } from '@components/pitchers/pitch-types-thrown-graph';

export class Pitchers extends React.Component {
	render() {
		return(
			<div className="graphs-container">
				<PitchTypesThrownGraph />
			</div>
		);
	}
}