import * as fs from 'fs';
import * as path from 'path';
import { Db } from '@db/db';
import * as _ from 'lodash';

interface DbModels {
	[key: string]: object
}

let db: DbModels = {};
const sequelize = Db.getConnection();
fs.readdirSync(__dirname).forEach((file) => {
	if (file === 'index.tsx') return;

	const model = sequelize.import(path.join(__dirname, file));
	db[model.name] = model;
});

_.forOwn(db, function(model: SequelizeModels) {
	if (model.associate) {
		model.associate(db);
	}
});

sequelize.sync();

export let models = db;