import * as React from 'react';
import axios from 'axios';

import { LineChart } from '@components/graphs/line-chart';

const API_ROUTE = '/api/pitches/speed';

interface Props {
	data: object;
}

interface State {
	isLoading: Boolean;
	config: Object;
}

interface PitchObject {
	pitcherId: number;
	avgSpeed: number;
	pitcherName: string;
}

export class VelocityPerInningGraph extends React.Component {
	constructor(props: Props) {
		super(props);
	}

	state: State = {
		isLoading: true,
		config: {}
	}

	public componentDidMount() {
		axios.get(`${API_ROUTE}?groupBy=pitcherId&groupBy=inning&pitchType=Fastball`).then((response) => {
			const config = this.formatConfig(response.data);
			this.setState({
				config,
				isLoading: false
			});
		});
	}

	private formatData = (data: PitchObject[]) => {
		const pitcherData: any = {};
		const innings = _.range(1, 10);

		_.forEach(innings, (inning) => {
			const inningData = _.filter(data, { inning });
			_.forEach(inningData, (data: PitchObject) => {
				pitcherData[data.pitcherId] = pitcherData[data.pitcherId] || {
					name: data.pitcherName,
					data: []
				}

				pitcherData[data.pitcherId].data.push(+(data.avgSpeed.toFixed(3)));
			});
		});

		return {
			data: _.values(pitcherData),
			xAxesValues: innings
		};
	}

	private formatConfig = (data: PitchObject[]) => {
		const formatted = this.formatData(data);

		return {
			title: { text: 'Average Velocity By Inning' },
			xAxis: {
				categories: formatted.xAxesValues,
				title: {
					text: 'Inning'
				}
			},
			yAxis: {
				title: {
					text: 'Speed'
				}
			},
			series: formatted.data
		};
	}

	private getView = () => {
		if (this.state.isLoading) {
			return(<div className="loader"></div>);
		}

		return(<LineChart config={this.state.config} />);
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