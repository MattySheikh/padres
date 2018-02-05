/**
 * This file handles all of our actuao database interactions. If we wanted to swap out a database
 * we would just need to change this file.
 */

import { Sequelize } from 'sequelize';

interface Columns {
	[key: string]: string;
}

interface WhereClause {
	pitchType?: string | object;
}

interface QueryOptions {
	model: SequelizeModels;
	attributes: (string | any[])[];
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

	/**
	 * Intentionally static. Creates and returns a connection to the database.
	 *
	 * @returns {Sequelize} - a connection to the Db
	 */
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

	/**
	 * Grabs all of the rows in a database based on a query
	 *
	 * @param {QueryOptions} config
	 *
	 * @returns {Promise<object>[]>} - rows from the DB after they've been 'fixed'
	 */
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

	/**
	 * Due to sequelize aliasing our columns and returning them in our data, we want to map our data so
	 * that it's a bit easier to handle on the front-end
	 *
	 * @param {object[]} rows
	 *
	 * @returns {object[]}
	 */
	private fixColumns = (rows: object[]): object[] => {
		// Due to the join, Sequelize adds the alias to the joined columns so we want to clean that up
		return _.map(rows, (pitch: GenericObject) => {
			_.forOwn(COLUMN_MAP, (v, k) => {
				// TODO - figure out pitcherId
				if (v === k || k === 'pitcherId') return;
				pitch[k] = pitch[v];
				delete pitch[v];
			});

			return pitch;
		});
	}

	/**
	 * Due to sequelize aliasing our columns and returning them in our data, we want to map our config
	 * options to match what sqlite has set up as our aliases.
	 *
	 * @param {object[]} rows
	 *
	 * @returns {object[]}
	 */
	private mapGroupBy = (groupByOptions: string[]): null | string[] => {
		groupByOptions = _.filter(_.map(groupByOptions, (g: string) => COLUMN_MAP[g]));
		return _.isEmpty(groupByOptions) ? null : groupByOptions;
	}

	/**
	 * Passes a hand-written query for selection to sqlite
	 *
	 * @param {string} query
	 *
	 * @returns {object[]}
	 */
	public rawSelect = async (query: string) => {
		const db = Db.getConnection();
		const result = await db.query(query, { type: db.QueryTypes.SELECT});

		return this.fixColumns(result);
	}
}