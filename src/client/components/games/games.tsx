import * as React from 'react';
import axios from 'axios';

import { LineChart } from '@components/graphs/line-chart';

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
		return(<div>Games</div>)
	}
}