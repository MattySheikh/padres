import { Sequelize } from 'sequelize';

interface Columns {
	[key: string]: string;
}

interface WhereClause {
	pitchType?: string;
}

interface QueryOptions {
	model: SequelizeModels;
	attributes: any;
	include?: object[];
	where?: WhereClause;
	groupBy?: string[];
	pitchType?: string;
}

const COLUMN_MAP: Columns = {
	pitcherId: 'pitches.pitcherId',
	inning: 'inning',
	pitchType: 'pitchType',
	pitcherName: 'pitcher.pitcherName'
}

export class Db {
	constructor() {}

	public static getConnection = () => {
		return new Sequelize('padresDb', '', '', {
			host: 'localhost',
			dialect: 'sqlite',
			pool: {
				max: 5,
				min: 0,
				acquire: 30000,
				idle: 10000
			},
			operatorsAliases: Symbol(1),
			storage: 'database.sqlite'
		});
	}

	public findAll = async (config: QueryOptions): Promise<object[]> => {
		const queryConfig = {
			attributes: config.attributes,
			group: this.mapGroupBy(config.groupBy),
			where: config.where,
			include: config.include,
			raw: true
		}

		const result = await config.model.findAll(queryConfig);
		return this.fixColumns(result);
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

	private mapGroupBy = (groupByOptions: string[]): null | string[] => {
		groupByOptions = _.filter(_.map(groupByOptions, (g: string) => COLUMN_MAP[g]));
		return _.isEmpty(groupByOptions) ? null : groupByOptions;
	}

	public rawSelect = async (query: string) => {
		const db = Db.getConnection();
		const result = await db.query(query, { type: db.QueryTypes.SELECT});

		return this.fixColumns(result);
	}
}