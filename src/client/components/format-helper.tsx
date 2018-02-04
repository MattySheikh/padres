export interface PitchObject {
	pitcherId: number;
	avgSpeed?: number;
	pitcherName?: string;
	pitchTypeCount?: number;
}

export interface GamesObject {
	stadium?: string;
	hrCount?: number;
	flyBallCount?: number;
	pitcher?: string;
	pitcherId?: number;
	fastballPct?: number;
	score?: number;
}

export let formatAvg = (reducer: any[], data: PitchObject[], reducerKey: string, dataKey: string) => {
	const pitcherData: any = {};
	_.forEach(reducer, (val) => {
		const inningData = _.filter(data, { [reducerKey]: val });
		_.forEach(inningData, (point: PitchObject) => {
			pitcherData[point.pitcherId] = pitcherData[point.pitcherId] || {
				data: [],
				name: point.pitcherName
			};

			pitcherData[point.pitcherId].data.push(_.round((point as any)[dataKey], 2));
		});
	});

	return _.values(pitcherData);
};

export let getPitchTypesFilter = (defaultSelection: string[]) => {
	return {
		multiple: true,
		selectable: true,
		types: {
			ChangeUp: {
				label: 'ChangeUp',
				selected: _.includes(defaultSelection, 'ChangeUp')
			},
			Curveball: {
				label: 'Curveball',
				selected: _.includes(defaultSelection, 'Curveball')
			},
			Cutter: {
				label: 'Cutter',
				selected: _.includes(defaultSelection, 'Cutter')
			},
			Fastball: {
				label: 'Fastball',
				selected: _.includes(defaultSelection, 'Fastball')
			},
			Other: {
				label: 'Other',
				selected: _.includes(defaultSelection, 'Other')
			},
			Sinker: {
				label: 'Sinker',
				selected: _.includes(defaultSelection, 'Sinker')
			},
			Slider: {
				label: 'Slider',
				selected: _.includes(defaultSelection, 'Slider')
			},
			Splitter: {
				label: 'Splitter',
				selected: _.includes(defaultSelection, 'Splitter')
			}
		}
	};
};
