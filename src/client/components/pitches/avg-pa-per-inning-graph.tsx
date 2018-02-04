import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { formatAvg, PitchObject } from '@components/format-helper';

export class AvgPAPerInningGraph extends React.Component {
	route = `/api/pitches/avgPaCount`;
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
		}
	};

	public formatConfig = (data: PitchObject[]) => {
		const formatted = this.formatData(data);
		return {
			title: { text: 'Average Pitches Per Plate Appearance By Inning' },
			xAxis: {
				categories: formatted.xAxesValues,
				title: {
					text: 'Inning'
				}
			},
			yAxis: {
				title: {
					text: '# of Pitches'
				}
			},
			series: formatted.data
		};
	}

	private formatData = (data: PitchObject[]) => {
		const innings = _.range(1, 10);
		const pitcherData = formatAvg(innings, data, 'inning', 'avgPitchOfPa');
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
				type: 'BarChart',
				filters: this.filters
			}} />
		);
	}
}