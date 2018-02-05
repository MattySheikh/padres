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

/**
 * We calculate a lot of averages where just they key at the very bottom of the tree is different so
 * this takes that logic and generalizes it.
 *
 * @param {any[]} reducer - what we will use to iterate over the tree
 * @param {GenericObject[]} data - our data points
 * @param {string} reducerKey - the key that helps us identify where in the tree the relevant data is
 * @param {string} dataKey - tells us where to grab the data from at the bottom level
 *
 * @returns {object[]}
 */
export let formatAvg = (reducer: string[] | number[], data: GenericObject[], reducerKey: string, dataKey: string) => {
	const pitcherData: GenericObject = {};
	_.forEach(reducer, (val) => {
		const inningData = _.filter(data, { [reducerKey]: val });
		_.forEach(inningData, (point: GenericObject) => {
			pitcherData[point.pitcherId] = pitcherData[point.pitcherId] || {
				data: [],
				name: point.pitcherName
			};

			pitcherData[point.pitcherId].data.push(_.round(point[dataKey], 2));
		});
	});

	return _.values(pitcherData);
};

/**
 * Creates a generic Pitch Types filter
 *
 * @param {string[]} defaultSelection - which pitches to select by default
 * @param {boolean} multiple - whether or not multiple pitches can be selected
 *
 * @returns {object}
 */
export let getPitchTypesFilter = (defaultSelection: string[], multiple: boolean = true) => {
	return {
		multiple,
		selectable: true,
		types: {
			ChangeUp: {
				label: 'Change Up',
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
