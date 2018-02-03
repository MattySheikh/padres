import { models } from '@db/models';
import { Sequelize } from 'sequelize';

interface QueryOptions {
	groupBy?: string[],
	pitchType?: string
}

interface Columns {
	[key: string]: string;
}

interface WhereClause {
	pitchType?: string;
}

const COLUMN_MAP: Columns = {
	pitcherId: 'pitches.pitcherId',
	inning: 'inning',
	pitchType: 'pitchType',
	pitcherName: 'pitcher.pitcherName'
}

export class Pitches {
	private pitchesModel: any; // sequelize messed up their Model type so it's impossible to import it

	constructor() {
		this.pitchesModel = models.pitches;
	}

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
}