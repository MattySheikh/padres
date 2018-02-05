/**
 * Handles the component rendered at /games
 */

import * as React from 'react';
import '@styles/index.scss';

import { GameScoresGraph } from '@components/games/game-scores-graph';
import { HomeRunRatePerStadiumGraph } from '@components/games/home-run-rate-per-stadium-graph';

export class Games extends React.Component {
	public componentDidMount() {
		document.title = 'Games';
	}

	render() {
		return(
			<div className="graphs-container">
				<GameScoresGraph />
				<HomeRunRatePerStadiumGraph />
			</div>
		);
	}
}