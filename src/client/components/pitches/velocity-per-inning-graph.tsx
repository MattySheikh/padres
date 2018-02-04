import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { formatAvg, PitchObject, getPitchTypesFilter } from '@components/format-helper';

export class VelocityPerInningGraph extends React.Component {
	route = `/api/pitches/speed`;
	filters = {
		groupBy: {
			selectable: false,
			multiple: true,
			types: {
				pitcherId: {
					selected: true
				},
				inning: {
					selected: true
				}
			}
		},
		pitchType: getPitchTypesFilter(['Fastball'])
	};

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
				type: 'LineChart',
				filters: this.filters
			}} />
		);
	}
}