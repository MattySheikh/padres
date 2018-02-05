import { Db } from '@db/db';
import { models } from '@db/models';
import * as csvtojson from 'csvtojson';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

interface Model {
	destroy: (options: object) => void;
	upsert: (updates: object) => void;
	rawAttributes: object;
}

interface ColumnsMap {
	[key: string]: string;
}

const csvFilePath = process.argv[2];
if (!csvFilePath) {
	throw new Error('Please provide a path to the file');
}

const file = path.resolve(csvFilePath);
if (!fs.existsSync(file)) {
	throw new Error('Specified file does not exist');
}

(async () => {
	// Ignore the linter so we can keep column order here to match the CSV
	/* tslint:disable:object-literal-sort-keys */
	const csvColumnsToSqlColumns: ColumnsMap = {
		gameid: 'gameId',
		game_date: 'gameDate',
		stadium: 'stadium',
		pitchno: 'pitchNo',
		time: 'time',
		inning: 'inning',
		topbottom: 'topBottom',
		outs: 'outs',
		strikes: 'strikes',
		balls: 'balls',
		pa_of_inning: 'paOfInning',
		pitch_of_pa: 'pitchOfPa',
		pitcher: 'pitcher',
		pitcherid: 'pitcherId',
		pitcherthrows: 'pitcherThrows',
		pitcherset: 'pitcherSet',
		batterside: 'batterSide',
		pitchtype: 'pitchType',
		pitchcall: 'pitchCall',
		korbb: 'kOrBb',
		hittype: 'hitType',
		playresult: 'playResult',
		outsonplay: 'outsOnPlays',
		runsscored: 'runsScored',
		relspeed: 'relSpeed',
		zonespeed: 'zoneSpeed',
		relheight: 'relHeight',
		relside: 'relSide',
		vertrelangle: 'vertRelAngle',
		horzrelangle: 'horzRelAngle',
		spinrate: 'spinRate',
		spinaxis: 'spinAxis',
		tilt: 'tilt',
		extension: 'extension',
		vertbreak: 'vertBreak',
		horzbreak: 'horzBreak',
		platelocheight: 'plateLocHeight',
		platelocside: 'plateLocSide',
		zonetime: 'zoneTime',
		exitspeed: 'exitSpeed',
		hitangle: 'hitAngle',
		hitdirection: 'hitDirection',
		distance: 'distance',
		bearing: 'bearing',
		hangtime: 'hangtime'
	};
	/* tslint:enable:object-literal-sort-keys */
	const sqlColumnsToCsvColumns = _.invert(csvColumnsToSqlColumns);

	// Clear the tables if we have imported before
	await Promise.all(_.map(models, async (model: Model) => {
		return await model.destroy({ truncate: true });
	}));

	csvtojson({ ignoreEmpty: true }).fromFile(file).on('json', async (obj: object) => {
		_.forEach(models, async (model: Model) => {
			const columnKeys = _.values(_.pick(sqlColumnsToCsvColumns, _.keys(model.rawAttributes)));
			const values = _.pick(obj, columnKeys);

			// Convert to keys
			const newVals = _.mapKeys(values, (val, key) => {
				return csvColumnsToSqlColumns[key];
			});

			await model.upsert(newVals);
		});
	}).on('done', async (error: Error) => {
		if (Error) {
			throw error;
		}

		const sql = Db.getConnection();
		await sql.sync();
	});
})();
