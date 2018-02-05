/**
 * Handles generic PieChart creation
 */

import * as React from 'react';
import { Graph } from '@components/graphs/graph';

interface BarChartProps {
	config: Object;
}

export class PieChart extends React.Component {
	state = {
		config: {
			chart: {
				type: 'pie'
			}
		}
	};

	constructor(props: BarChartProps) {
		super(props);
		this.state.config = _.merge(this.state.config, props.config);
	}

	render() {
		return(
			<Graph config={this.state.config} />
		);

	}
}