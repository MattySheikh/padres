import { models } from '@db/models';
import { Db } from '@db/db';

interface BreakRow {
	pitcherName: string;
	pitcherId: number;
	horzBreak?: number;
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

	public getRepeatableBreak = async (queryOptions: GenericObject): Promise<object[]> => {
		const type = queryOptions.breakType === 'vertical' ? 'vertBreak' : 'horzBreak';
		const config = {
			...queryOptions,
			model: this.pitchesModel,
			attributes: ['pitches.pitcherId', type],
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

			(res[row.pitcherId] as BreakPoints).breaks.push(row.horzBreak)
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

	private calculateMedian = (arr: number[]): number => {
		const half = Math.floor(arr.length/2);

		if (arr.length % 2){
			return arr[half];
		}

		return (arr[half - 1] + arr[half]) / 2;
	}
}