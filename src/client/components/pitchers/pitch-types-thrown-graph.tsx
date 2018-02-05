/**
 * Calculates the rate of pitch types thrown by a pitcher
 */

import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { PitchObject } from '@components/format-helper';

export class PitchTypesThrownGraph extends React.Component {
	route = '/api/pitches/type';
	filters = {
		groupBy: {
			selectable: false,
			multiple: true,
			types: {
				pitcherId: {
					selected: true
				},
				pitchType: {
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
			chart: {
				polar: true
			},
			title: { text: '% Of Pitches By Type' },
			xAxis: {
				categories: formatted.xAxesValues,
				tickmarkPlacement: 'on',
			},
			yAxis: {
				gridLineInterpolation: 'polygon'
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
		const pitcherData: GenericObject = {};
		const pitchTypes = _.union(_.map(data, 'pitchType'));
		const pitcherIds = _.union(_.map(data, 'pitcherId'));
		_.forEach(pitcherIds, (pitcherId) => {
			let pitchData = _.filter(data, { pitcherId });
			const totalPitches = _.sum(_.map(pitchData, 'pitchTypeCount'));
			_.forEach(pitchTypes, (pitchType) => {
				pitcherData[pitcherId] = pitcherData[pitcherId] || {
					name: pitchData[0].pitcherName,
					data: [],
					pointPlacement: 'on'
				};

				// Default to 0 if they haven't thrown this type of pitch
				let pct = 0;

				const point = _.find(pitchData, { pitchType })
				if (point) {
					pct = _.round(point.pitchTypeCount / totalPitches * 100, 2);
				}

				pitcherData[pitcherId].data.push(pct);
			})
		});

		return {
			data: _.values(pitcherData),
			xAxesValues: pitchTypes
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