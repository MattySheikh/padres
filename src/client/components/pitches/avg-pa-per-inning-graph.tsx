/**
 * Calculates how many pitches per plate appearance it takes for a pitcher to get through a batter
 * broken down by inning
 */

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

	/**
	 * Creates the config for consumption by the bar chart
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - https://www.highcharts.com/demo/bar-basic
	 */
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

	/**
	 * Formats the data for consumption by the bar chart
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - the series and drilldown data
	 */
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