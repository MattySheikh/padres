import * as React from 'react';
import { Graph } from '@components/graphs/graph';

interface BoxPlotProps {
	config: Object;
}

export class BoxPlot extends React.Component {
	state = {
		config: {
			chart: {
				type: 'boxplot'
			}
		}
	};

	constructor(props: BoxPlotProps) {
		super(props);
		this.state.config = _.merge(this.state.config, props.config);
	}

	componentWillReceiveProps(newState: any) {
		this.setState(_.merge(this.state.config, newState.config));
	}

	render() {
		return(
			<Graph config={this.state.config} />
		);

	}
}