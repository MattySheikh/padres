/**
 * Handles generic LineChart creation
 */

import * as React from 'react';
import { Graph } from '@components/graphs/graph';

interface LineChartProps {
	config: Object;
}

export class LineChart extends React.Component {
	state = {
		config: {},
		tooltip: {
			shared: true
		}
	};

	constructor(props: LineChartProps) {
		super(props);
		this.state.config = _.merge(this.state.config, props.config);
	}

	render() {
		return(
			<Graph config={this.state.config} />
		);

	}
}