import * as React from 'react';
import { Graph } from '@components/graphs/graph';

import '@styles/graphs.scss';

interface BarChartProps {
	config: Object;
}

export class BarChart extends React.Component<any, any> {
	state = {
		config: {
			chart: {
				type: 'column'
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