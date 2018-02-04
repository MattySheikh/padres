import * as React from 'react';
import { GenericGraph } from '@components/graphs/generic-graph';
import { PitchObject } from '@components/format-helper';

export class PitchTypesThrownGraph extends React.Component {
	route = '/api/pitches/type?groupBy=pitcherId&groupBy=pitchType';

	public formatConfig = (data: PitchObject[]) => {
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

	private formatData = (data: PitchObject[]) => {
		const pitcherData: any = {};
		const pitchTypes = _.union(_.map(data, 'pitchType'));
		const pitcherIds = _.union(_.map(data, 'pitcherId'));

		_.forEach(pitchTypes, (pitchType) => {
			if (!pitchType) return;
			let pitchData = _.filter(data, { pitchType });
			// Not every pitcher will have thrown every pitch type so we need to add them in
			const pitchersWhoHaveNotThrown = _.difference(pitcherIds, _.map(pitchData, 'pitcherId'));
			pitchData = [...pitchData, ..._.map(pitchersWhoHaveNotThrown, (id) =>{
				return { pitcherId: id,  pitchTypeCount: 0 };
			})];

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

	render() {
		return(
			<GenericGraph {...{
				route: this.route,
				formatConfig: this.formatConfig.bind(this),
				type: 'BarChart'
			}} />
		);
	}
}