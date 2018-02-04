import * as React from 'react';

import { HomeRunRatePerStadiumGraph } from '@components/games/home-run-rate-per-stadium-graph';

export class Games extends React.Component {
	render() {
		return(
			<div className="graphs-container">
				<HomeRunRatePerStadiumGraph />
			</div>
		);
	}
}