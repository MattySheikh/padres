/**
 * Calculates the Home Run per Fly Ball ratio split by stadium
 */

import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { GamesObject } from '@components/format-helper';

export class HomeRunRatePerStadiumGraph extends React.Component {
	route = '/api/games/hr-per-fly-ball'
	filters = {
		groupBy: {
			selectable: false,
			multiple: false,
			types: {
				stadium: {
					selected: true
				}
			}
		}
	};

	/**
	 * Creates the config for consumption by the scatterplot
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - https://www.highcharts.com/demo/pie-drilldown
	 */
	public formatConfig = (data: GamesObject[]) => {
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

	/**
	 * Formats the data for consumption by the scatterplot
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - the series and drilldown data
	 */
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
					['Fly Balls', d.flyBallCount - d.hrCount],
				]
			})
		});

		return {
			series: series,
			drilldown: drilldown
		};
	}

	render() {
		return(
			<GenericGraph {...{
				route: this.route,
				formatConfig: this.formatConfig.bind(this),
				type: 'PieChart',
				filters: this.filters
			}} />
		);
	}
}