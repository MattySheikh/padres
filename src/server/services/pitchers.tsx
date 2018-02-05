/**
 * Handles all functionality relevant to a game
 */

import { models } from '@db/models';
import { Db } from '@db/db';

interface BreakRow {
	pitcherName: string;
	pitcherId: number;
	break?: number;
}

interface BreakPoints {
	pitcherName: string;
	pitcherId: number;
	breaks: number[]
}

export class Pitchers {
	private pitchesModel: any; // sequelize messed up their Model type so it's impossible to import it
	private db: Db;

	constructor() {
		this.pitchesModel = models.pitches;
		this.db = new Db();
	}

	/**
	 * Calculates the amount of horizontal/vertical break by a pitcher split by pitch. This graph determines
	 * which pitchers have the most 'repeatable' pitches and can control the ball based on the type of pitch.
	 *
	 * @param {GenericObject} queryOptions
	 *
	 * @returns {Promise<object[]>} - calculated quadrants and mix/man/median for a pitcher
	 */
	public getRepeatableBreak = async (queryOptions: GenericObject): Promise<object[]> => {
		const type = queryOptions.breakType === 'vertical' ? 'vertBreak' : 'horzBreak';
		const where: GenericObject = {};
		if (queryOptions.pitchType) {
			where.pitchType = queryOptions.pitchType
		}

		const config = {
			...queryOptions,
			model: this.pitchesModel,
			where: where,
			attributes: ['pitches.pitcherId', [type, 'break']],
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}]
		};

		const rows = await this.db.findAll(config);

		const pitcherHorzBreaks = _.reduce(rows, (res: GenericObject, row: BreakRow) => {
			res[row.pitcherId] = res[row.pitcherId] || {
				pitcherName: row.pitcherName,
				pitcherId: row.pitcherId,
				breaks: []
			};

			(res[row.pitcherId] as BreakPoints).breaks.push(row.break)
			return res;
		}, {});

		return _.map(pitcherHorzBreaks, (p: BreakPoints) => {
			p.breaks.sort();
			const length = p.breaks.length;
			return {
				lowerQuadrant: p.breaks[Math.floor(length * .25) - 1],
				upperQuadrant: p.breaks[Math.floor(length * .75) - 1],
				min: Math.min.apply(null, p.breaks),
				max: Math.max.apply(null, p.breaks),
				median: this.calculateMedian(p.breaks),
				pitcherName: p.pitcherName,
				pitcherId: p.pitcherId
			};
		});
	};

	/**
	 * Finds the median of an array of values
	 *
	 * @param {number[]}
	 *
	 * @returns {number}
	 */
	private calculateMedian = (arr: number[]): number => {
		const half = Math.floor(arr.length/2);

		if (arr.length % 2){
			return arr[half];
		}

		return (arr[half - 1] + arr[half]) / 2;
	}
}