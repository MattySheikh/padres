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

	public formatConfig = (data: PitchObject[]) => {
		return {
			chart: {
				inverted: false
			},
			title: {
				text: 'Pitcher Pitch Variance'
			},
			legend: {
				enabled: false
			},
			xAxis: {
				categories: _.map(data, 'pitcherName'),
				title: { text: 'Pitcher' }
			},
			series: [{
				data: this.formatData(data)
			}]
		};
	};

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