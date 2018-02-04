interface Global {
	_: object;
}

/**
 * Sequelize Types are all kinds of messed up so we're going to define our own
 */
interface SequelizeType {
	define: (modelName: string, config: object) => SequelizeModels;
	query: (query: string, queryType: object) => object[];
	QueryTypes: SequelizeQueryTypes;
}

interface SequelizeQueryTypes {
	SELECT: symbol;
}

interface SequelizeDataTypes {
	STRING: symbol;
	DATE: symbol;
	TINYINT: symbol;
	ENUM: (...args: string[]) => void;
	DOUBLE: number;
	TIME: Date;
}

interface SequelizeModels {
	[key: string]: object;
	associate?: (model: SequelizeModels) => void;
	findAll?: (options: object) => object[];
	hasMany?: (model: SequelizeModels | object, options: object) => void;
	belongsTo?: (model: SequelizeModels | object, options: object) => void;
}

interface SequelizeOperators {
	ne: symbol;
	or: symbol;
}

// We use a lot of dynamic-keyed objects so just define it here and use it everywhere
interface GenericObject {
	[key: string]: any;
}

declare module 'csvtojson';
declare module 'sequelize';
declare module 'react-highcharts';
declare module 'highcharts';
declare module 'highcharts-more';
declare module 'highcharts/modules/drilldown';
