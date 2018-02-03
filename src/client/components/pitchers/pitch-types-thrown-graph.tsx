import * as React from 'react';
import axios from 'axios';

import { BarChart } from '@components/graphs/bar-chart';

const API_ROUTE = '/api/pitches/type';

interface Props {
	data: object;
}

interface State {
	isLoading: Boolean;
	config: Object;
}

interface PitchObject {
	pitcherId: number;
	pitchTypeCount: number;
	pitcherName?: string;
}

export class PitchTypesThrownGraph extends React.Component {
	constructor(props: Props) {
		super(props);
	}

	state: State = {
		isLoading: true,
		config: {}
	}

	public componentDidMount() {
		axios.get(`${API_ROUTE}?groupBy=pitcherId&groupBy=pitchType`).then((response) => {
			const config = this.formatConfig(response.data);
			this.setState({
				config,
				isLoading: false
			});
		});
	}

	private formatData = (data: PitchObject[]) => {
		const pitcherData: any = {};
		const pitchTypes = _.union(_.map(data, 'pitchType'));
		const pitcherIds = _.union(_.map(data, 'pitcherId'));

		_.forEach(pitchTypes, (pitchType) => {
			let pitchData = _.filter(data, { pitchType });
			// Not every pitcher will have thrown every pitch type so we need to add them in
			const pitchersWhoHaveNotThrown = _.difference(pitcherIds, _.map(pitchData, 'pitcherId'));
			pitchData = pitchData.concat(_.map(pitchersWhoHaveNotThrown, (id) => ({ pitcherId: id,  pitchTypeCount: 0 })));
			_.forEach(pitchData, (data) => {
				pitcherData[data.pitcherId] = pitcherData[data.pitcherId] || {
					name: data.pitcherName,
					data: []
				}

				pitcherData[data.pitcherId].data.push(data.pitchTypeCount);
			});
		});

		return {
			data: _.values(pitcherData),
			xAxesValues: pitchTypes
		};
	}

	private formatConfig = (data: PitchObject[]) => {
		const formatted = this.formatData(data);
		return {
			title: { text: 'Number Of Pitch Types Thrown By Pitcher' },
			xAxis: {
				categories: formatted.xAxesValues,
				title: {
					text: 'Pitch Type'
				}
			},
			yAxis: {
				title: {
					text: 'Number of Times Thrown'
				}
			},
			series: formatted.data
		};
	}

	private getView = () => {
		if (this.state.isLoading) {
			return(<div className="loader"></div>);
		}

		return(<BarChart config={this.state.config} />);
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