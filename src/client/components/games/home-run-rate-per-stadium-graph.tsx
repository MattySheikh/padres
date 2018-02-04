import * as React from 'react';
import axios from 'axios';

import { PieChart } from '@components/graphs/pie-chart';

const API_ROUTE = '/api/games/hr-per-fly-ball';

interface Props {
	data: object;
}

interface State {
	isLoading: Boolean;
	config: Object;
}

interface GamesObject {
	stadium: string;
	hrCount: number;
	flyBallCount: number;
}

export class HomeRunRatePerStadiumGraph extends React.Component {
	constructor(props: Props) {
		super(props);
	}

	state: State = {
		isLoading: true,
		config: {}
	}

	public componentDidMount() {
		axios.get(`${API_ROUTE}?groupBy=stadium`).then((response) => {
			const config = this.formatConfig(response.data);
			this.setState({
				config,
				isLoading: false
			});
		});
	}

	private formatData = (data: GamesObject[]) => {
		const drilldown: object[] = [];
		const series: object[] = [];
		_.forEach(data, (d) => {
			series.push({
				name: d.stadium,
				drilldown: d.stadium,
				y: _.round(d.hrCount / d.flyBallCount, 2),
			});

			drilldown.push({
				id: d.stadium,
				name: d.stadium,
				data: [
					['Home Runs', d.hrCount],
					['Fly Balls', d.flyBallCount],
				]
			})
		});

		return {
			series: series,
			drilldown: drilldown
		};
	}

	private formatConfig = (data: GamesObject[]) => {
		const formatted = this.formatData(data);
		return {
			title: { text: 'Home Runs Per Fly Ball' },
			subtitle: { text: 'Click the slices to view counts of HRs and fly balls' },
			plotOptions: {
				series: {
					dataLabels: {
						enabled: true,
						format: '{point.name}: {point.y}'
					}
				}
			},
			tooltip: {
				headerFormat: '',
				pointFormat: '{point.name}: {point.y}'
			},
			series: [{
				colorByPoint: true,
				name: 'HR/FB',
				data: formatted.series
			}],
			drilldown: {
				series: formatted.drilldown
			}
		};
	}

	private getView = () => {
		if (this.state.isLoading) {
			return(<div className="loader"></div>);
		}

		return(<PieChart config={this.state.config} />);
	}

	render() {
		return(
			<div className="graph-wrapper">
				<div className="graph-container">
					{this.getView()}
				</div>
			</div>
		);
	}
}