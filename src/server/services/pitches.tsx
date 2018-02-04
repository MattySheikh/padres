import { models } from '@db/models';
import { Sequelize } from 'sequelize';

interface QueryOptions {
	groupBy?: string[],
	pitchType?: string
}

interface WhereClause {
	pitchType?: string;
}

const COLUMN_MAP: GenericObject = {
	pitcherId: 'pitches.pitcherId',
	inning: 'inning',
	pitchType: 'pitchType',
	pitcherName: 'pitcher.pitcherName'
}

export class Pitches {
	private pitchesModel: any; // sequelize messed up their Model type so it's impossible to import it
	private Op: SequelizeOperators;

	constructor() {
		this.pitchesModel = models.pitches;
		this.Op = Sequelize.Op;
	}

	public getBy = async (type: string, queryOptions: QueryOptions): Promise<object[]> => {
		const func = `get${_.upperFirst(type)}`;
		return await (this as any)[func](queryOptions);
	}

	public getType = async (queryOptions: QueryOptions): Promise<object[]> => {
		const pitchTypeCount = [Sequelize.fn('COUNT', Sequelize.col('pitchType')), 'pitchTypeCount'];
		const pitches = await this.pitchesModel.findAll({
			attributes: ['pitches.pitcherId', 'pitchType', pitchTypeCount],
			group: this.mapGroupBy(queryOptions.groupBy),
			where: this.buildWhere(queryOptions),
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}],
			raw: true
		});

		return this.fixColumns(pitches);
	};

	public getSpeed = async (queryOptions: QueryOptions): Promise<object[]> => {
		const avgSpeed = [Sequelize.fn('AVG', Sequelize.col('relSpeed')), 'avgSpeed'];

		const pitches = await this.pitchesModel.findAll({
			attributes: ['pitcherId', 'inning', 'pitchType', avgSpeed],
			group: this.mapGroupBy(queryOptions.groupBy),
			where: this.buildWhere(queryOptions),
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}],
			raw: true
		});

		return this.fixColumns(pitches);
	}

	public getAvgPaCount = async (queryOptions: QueryOptions): Promise<object[]> => {
		const avgPitchOfPa = [Sequelize.fn('AVG', Sequelize.col('pitchOfPa')), 'avgPitchOfPa'];
		const pitches = await this.pitchesModel.findAll({
			attributes: ['pitcherId', 'inning', 'pitchType', avgPitchOfPa],
			group: this.mapGroupBy(queryOptions.groupBy),
			where: {
				[this.Op.or]: [
					{
						kOrBB: {
							[this.Op.ne]: null
						}
					},
					{
						playResult: {
							[this.Op.ne]: null
						}
					}
				]
			},
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}],
			raw: true
		});

		return this.fixColumns(pitches);
	};


	private fixColumns = (pitches: object[]): object[] => {
		// Due to the join, Sequelize adds the alias to the joined columns so we want to clean that up
		return _.map(pitches, (pitch: GenericObject) => {
			_.forOwn(COLUMN_MAP, (v, k) => {
				// TODO - figure out pitcherId
				if (v === k || k === 'pitcherId') return;
				pitch[k] = pitch[v];
				delete pitch[v];
			});

			return pitch;
		});
	}

	private buildWhere = (queryOptions: QueryOptions): WhereClause => {
		const where: WhereClause = {};
		if (queryOptions.pitchType) {
			where.pitchType = queryOptions.pitchType;
		}

		return where;
	}

	private mapGroupBy = (groupByOptions: string[]): null | string[] => {
		groupByOptions = _.filter(_.map(groupByOptions, (g: string) => COLUMN_MAP[g]));
		return _.isEmpty(groupByOptions) ? null : groupByOptions;
	}
}