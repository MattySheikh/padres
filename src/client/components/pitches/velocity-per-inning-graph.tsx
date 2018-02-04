import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { formatAvg, PitchObject } from '@components/format-helper';

export class VelocityPerInningGraph extends React.Component {
	route = `/api/pitches/speed?groupBy=pitcherId&groupBy=inning&pitchType=Fastball`;

	public formatConfig = (data: PitchObject[]) => {
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

	private formatData = (data: PitchObject[]) => {
		const innings = _.range(1, 10);
		const pitcherData = formatAvg(innings, data, 'inning', 'avgSpeed');
		return {
			data: pitcherData,
			xAxesValues: innings
		};
	}

	render() {
		return(
			<GenericGraph {...{
				route: this.route,
				formatConfig: this.formatConfig.bind(this),
				type: 'LineChart'
			}} />
		);
	}
}