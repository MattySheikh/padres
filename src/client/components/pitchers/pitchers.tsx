import * as React from 'react';
import axios from 'axios';

import { PitchTypesThrownGraph } from '@components/pitchers/pitch-types-thrown-graph';

const API_ROUTE = '';

interface PitchersProps {
	data: object;
}

interface PitchersState {
	isLoading: Boolean,
	data: {
		points: Object[],
		keys: String[]
	}
}


export class Pitchers extends React.Component {
	render() {
		return(
			<div className="graphs-container">
				<PitchTypesThrownGraph />
			</div>
		);
	}
}