/**
 * Calculates the amount of horizontal/vertical break by a pitcher split by pitch. This graph determines
 * which pitchers have the most 'repeatable' pitches and can control the ball based on the type of pitch.
 */

import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { PitchObject, getPitchTypesFilter } from '@components/format-helper';

export class RepeatableBreaksGraph extends React.Component {
	route = '/api/pitchers/repeatable-break';
	filters = {
		breakType: {
			selectable: true,
			types: {
				horizontal: {
					label: 'Horizontal Break'
				},
				vertical: {
					label: 'Vertical Break',
					selected: true
				}
			}
		},
		pitchType: getPitchTypesFilter(['Curveball'], false)
	}

	/**
	 * Creates the config for consumption by the bar chart
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - https://www.highcharts.com/demo/box-plot
	 */
	public formatConfig = (data: PitchObject[]) => {
		return {
			chart: {
				inverted: false
			},
			title: {
				text: 'Pitch Break Variance by Pitcher and Pitch'
			},
			legend: {
				enabled: false
			},
			xAxis: {
				categories: _.map(data, 'pitcherName'),
				title: { text: 'Pitcher' }
			},
			series: [{
				data: this.formatData(data),
				color: '#061540'
			}]
		};
	};

	/**
	 * Formats the data for consumption by the box plot
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - the series and drilldown data
	 */
	private formatData = (data: PitchObject[]) => {
		return _.map(data, (p: GenericObject) => {
			const ret = [p.min, p.lowerQuadrant, p.median, p.upperQuadrant, p.max];
			return _.map(ret, (a) => _.round(a, 3));
		});
	};

	render() {
		return(
			<GenericGraph {...{
				route: this.route,
				formatConfig: this.formatConfig.bind(this),
				filters: this.filters,
				type: 'BoxPlot'
			}} />
		);
	}
}