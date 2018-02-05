/**
 * Calculates the games scores split by pitcher and game on a scatterplot
 */

import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { GamesObject } from '@components/format-helper';
import * as regression from 'regression';

export class GameScoresGraph extends React.Component {
	route = '/api/games/scores'

	/**
	 * Creates the config for consumption by the scatterplot
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object} - https://www.highcharts.com/demo/scatter
	 */
	public formatConfig = (data: GamesObject[]) => {
		const formattedData = this.formatData(data);
		return {
			chart: {
			},
			title: { text: 'Game Scores and Fastball %' },
			xAxis: {
				title: {
					enabled: true,
					text: 'Fastball %'
				}
			},
			yAxis: {
				title: { text: 'Game Score' }
			},
			series: [
				...formattedData,
				{
					type: 'line',
					name: 'Regression',
					data: this.calculateRegression(formattedData),
					marker: { enabled: false },
					states: {
						hover: {
							lineWidth: 0
						}
					},
					enableMouseTracking: false
				}
			]
		};
	}

	/**
	 * Formats the data for consumption by the scatterplot
	 *
	 * @param {GamesObject} data - an array of datapoints
	 *
	 * @returns {object}[] - of data points
	 */
	private formatData = (data: GamesObject[]) => {
		const pitchersToGames: any = {};
		_.map(data, (d) => {
			pitchersToGames[d.pitcherId] = pitchersToGames[d.pitcherId] || {
				name: d.pitcher,
				data: []
			};

			pitchersToGames[d.pitcherId].data.push([d.fastballPct, d.score]);
		});

		return _.values(pitchersToGames);
	}

	/**
	 * Calculates point of regression line
	 *
	 * @param {GamesObject} data - an array of datapoints
	 */
	private calculateRegression = (data: GamesObject[]) => {
		const points = _.flatten(_.map(data, 'data'));
		const result = regression.linear(points);

		// Sort it because Highcharts requires it
		return result.points.sort();
	}

	render() {
		return(
			<GenericGraph {...{
				route: this.route,
				formatConfig: this.formatConfig.bind(this),
				type: 'ScatterPlot'
			}} />
		);
	}
}