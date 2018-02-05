/**
 * Handles generic ScatterPlot creation
 */

import * as React from 'react';
import { Graph } from '@components/graphs/graph';

interface BoxPlotProps {
	config: Object;
}

export class ScatterPlot extends React.Component {
	state = {
		config: {
			chart: {
				type: 'scatter'
			}
		}
	};

	constructor(props: BoxPlotProps) {
		super(props);
		this.state.config = _.merge(this.state.config, props.config);
	}

	render() {
		return(
			<Graph config={this.state.config} />
		);

	}
}