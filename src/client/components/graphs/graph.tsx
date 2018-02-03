import * as React from 'react';
import * as Highcharts from 'react-highcharts';

import '@styles/graphs.scss';

const PALETTE = [
	'#462425', '#E35625', '#9C92A3', '#628395', '#96897B'
];

interface GraphState {
	config: {
		series: object[];
		xAxis?: string[] | number[];
		chart?: object;
		title?: Object;
		credits?: Boolean;
		tooltip?: Object;
	};

}

export class Graph extends React.Component<any, any> {
	public state: GraphState = {
		config: {
			series: [],
			credits: false,
			tooltip: {
				shared: true
			}
		}
	};

	constructor(props: GraphState) {
		super(props);

		this.state.config = _.merge(this.state.config, props.config);

		this.state.config.series = this.colorSeries(props.config.series);
	}

	private colorSeries = (series: object[]) => {
		return _.map(series, (s: any, idx: number) => {
			if (s.color) return s;
			s.color = this.getNextColor(idx);
			return s;
		})
	}

	private getNextColor = (idx: number) => {
		const nextIdx = idx % PALETTE.length

		return PALETTE[nextIdx];
	}

	render() {
		return(
			<Highcharts config={this.state.config} />
		);

	}
}