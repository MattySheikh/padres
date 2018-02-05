/**
 * Handles all functionality relevant to a pitch. There's probably some overlap between what services/pitchers
 * and services/pitches should do
 */

import { models } from '@db/models';
import { Sequelize } from 'sequelize';
import { Db } from '@db/db';

export class Pitches {
	private pitchesModel: any; // sequelize messed up their Model type so it's impossible to import it
	private Op: SequelizeOperators;
	private db: Db;

	constructor() {
		this.pitchesModel = models.pitches;
		this.Op = Sequelize.Op;
		this.db = new Db();
	}

	/**
	 * Generic function to determine what we want to get a pitch by
	 *
	 * @param {string} type - what to query a pitch by
	 * @param {GenericObject} queryOptions
	 *
	 * @returns {Promise<object>[]}
	 */
	public getBy = async (type: string, queryOptions: GenericObject): Promise<object[]> => {
		const func = `get${_.upperFirst(type)}`;
		return await (this as any)[func](queryOptions);
	}

	/**
	 * Aggregates the counts of a pitch type split by pitcher
	 *
	 * @param {GenericObject} queryOptions
	 *
	 * @returns {Promise<object>[]}
	 */
	public getType = async (queryOptions: GenericObject): Promise<object[]> => {
		const pitchTypeCount = [Sequelize.fn('COUNT', Sequelize.col('pitchType')), 'pitchTypeCount'];
		const config = {
			...queryOptions,
			model: this.pitchesModel,
			attributes: ['pitches.pitcherId', 'pitchType', pitchTypeCount],
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}]
		};

		return await this.db.findAll(config);
	};

	/**
	 * Calculates the average velocity of a pitcher split by inning and type
	 *
	 * @param {GenericObject} queryOptions
	 *
	 * @returns {Promise<object>[]}
	 */
	public getSpeed = async (queryOptions: GenericObject): Promise<object[]> => {
		const avgSpeed = [Sequelize.fn('AVG', Sequelize.col('relSpeed')), 'avgSpeed'];
		const where: GenericObject = {};
		if (queryOptions.pitchType) {
			where.pitchType = queryOptions.pitchType
		}

		const config = {
			...queryOptions,
			where: where,
			model: this.pitchesModel,
			attributes: ['pitcherId', 'inning', 'pitchType', avgSpeed],
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}]
		}

		return await this.db.findAll(config);
	}

	/**
	 * Calculates the avg number of pitches it takes a pitcher to get through a batter split by inning
	 *
	 * @param {GenericObject} queryOptions
	 *
	 * @returns {Promise<object>[]}
	 */
	public getAvgPaCount = async (queryOptions: GenericObject): Promise<object[]> => {
		const avgPitchOfPa = [Sequelize.fn('AVG', Sequelize.col('pitchOfPa')), 'avgPitchOfPa'];
		const where: GenericObject = {
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
		};

		const config = {
			...queryOptions,
			model: this.pitchesModel,
			attributes: ['pitcherId', 'inning', 'pitchType', avgPitchOfPa],
			where: where,
			include: [{
				model: models.pitchers,
				attributes: [['pitcher', 'pitcherName']]
			}]
		}

		return await this.db.findAll(config);
	};
}