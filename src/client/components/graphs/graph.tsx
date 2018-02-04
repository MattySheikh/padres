import * as React from 'react';
import * as Highcharts from 'react-highcharts';
// Enable drilldown and more on charts
import * as drilldown from 'highcharts/modules/drilldown';
import * as HighChartsMore from 'highcharts-more';
HighChartsMore(Highcharts.Highcharts);
drilldown(Highcharts.Highcharts);

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

interface SeriesData {
	color?: string;
	data?: object[];
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
		return _.map(series, (s: SeriesData, idx: number) => {
			if (s.color || !_.isObject(s)) return s;
			s.color = this.getNextColor(idx);

			if (!_.isEmpty(s.data)) {
				s.data = this.colorSeries(s.data);
			}

			return s;
		})
	}

	private getNextColor = (idx: number) => {
		const nextIdx = idx % PALETTE.length

		return PALETTE[nextIdx];
	}

	render() {
		return(
			<div className="graph-container">
				<Highcharts config={this.state.config} />
			</div>
		);

	}
}