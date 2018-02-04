import * as React from 'react';
import '@styles/index.scss';

import { HomeRunRatePerStadiumGraph } from '@components/games/home-run-rate-per-stadium-graph';
import { GameScoresGraph } from '@components/games/game-scores-graph';

export class Games extends React.Component {
	render() {
		return(
			<div className="graphs-container">
				<HomeRunRatePerStadiumGraph />
				<GameScoresGraph />
			</div>
		);
	}
}