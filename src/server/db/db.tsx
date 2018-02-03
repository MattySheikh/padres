import { Sequelize } from 'sequelize';

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
			storage: 'database.sqlite',
			logging: false
		});
	}
}