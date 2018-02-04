import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { GamesObject } from '@components/format-helper';
import * as regression from 'regression';

export class GameScoresGraph extends React.Component {
	route = '/api/games/scores'

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

	private calculateRegression = (data: object[]) => {
		const points = _.flatten(_.map(data, 'data'));
		const result = regression.linear(points);

		// Sort it because Highcharts requires it
		return result.points.sort();
	}

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