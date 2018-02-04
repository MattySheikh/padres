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

export let getPitchTypesFilter = (defaultPitch: string) => {
	return {
		multiple: true,
		selectable: true,
		types: {
			ChangeUp: {
				label: 'ChangeUp',
				selected: (defaultPitch === 'ChangeUp')
			},
			Curveball: {
				label: 'Curveball',
				selected: (defaultPitch === 'Curveball')
			},
			Cutter: {
				label: 'Cutter',
				selected: (defaultPitch === 'Cutter')
			},
			Fastball: {
				label: 'Fastball',
				selected: (defaultPitch === 'Fastball')
			},
			Other: {
				label: 'Other',
				selected: (defaultPitch === 'Other')
			},
			Sinker: {
				label: 'Sinker',
				selected: (defaultPitch === 'Sinker')
			},
			Slider: {
				label: 'Slider',
				selected: (defaultPitch === 'Slider')
			},
			Splitter: {
				label: 'Splitter',
				selected: (defaultPitch === 'Splitter')
			}
		}
	};
};
