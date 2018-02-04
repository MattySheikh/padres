import { models } from '@db/models';
import { Db } from '@db/db';

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

export class Games {
	private sql: SequelizeType;

	constructor() {
		this.sql = Db.getConnection();
	}

	// Consider LineDrive
	public getHrPerFlyBall = async (queryOptions: QueryOptions): Promise<object[]> => {
		// It's a lot easier to hand-write this query as sequelize doesn't really handle CASE's in SUM's well
		const query = `
			SELECT \`games\`.\`stadium\`,
			SUM(CASE WHEN \`pitches\`.\`playResult\` = 'HomeRun' THEN 1 ELSE 0 END) AS 'hrCount',
			SUM(CASE WHEN \`pitches\`.\`hitType\` LIKE '%fly%' THEN 1 ELSE 0 END) AS 'flyBallCount'
			FROM pitches LEFT JOIN games ON \`pitches\`.\`gameId\` = \`games\`.\`gameid\`
			GROUP BY \`games\`.\`stadium\`;
		`;

		return await this.sql.query(query, { type: this.sql.QueryTypes.SELECT});
	}
}
