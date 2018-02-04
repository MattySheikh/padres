import * as React from 'react';
import axios from 'axios';

import { BarChart } from '@components/graphs/bar-chart';
import { HomeRunRatePerStadiumGraph } from '@components/games/home-run-rate-per-stadium-graph';
const API_ROUTE = '';

interface GamesProps {
	data: object;
}

interface GamesState {
	isLoading: Boolean,
	data: {
		points: Object[],
		keys: String[]
	}
}


export class Games extends React.Component {
	render() {
		return(
			<div className="graphs-container">
				<HomeRunRatePerStadiumGraph />
			</div>
		);
	}
}