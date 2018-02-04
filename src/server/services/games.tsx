import { Db } from '@db/db';

export class Games {
	private db: Db;

	constructor() {
		this.db = new Db();
	}

	// Consider LineDrive
	public getHrPerFlyBall = async (): Promise<object[]> => {
		// It's a lot easier to hand-write this query as sequelize doesn't really handle CASE's in SUM's well
		const query = `
			SELECT \`games\`.\`stadium\`,
			SUM(CASE WHEN \`pitches\`.\`playResult\` = 'HomeRun' THEN 1 ELSE 0 END) AS 'hrCount',
			SUM(CASE WHEN \`pitches\`.\`hitType\` LIKE '%fly%' THEN 1 ELSE 0 END) AS 'flyBallCount'
			FROM pitches LEFT JOIN games ON \`pitches\`.\`gameId\` = \`games\`.\`gameid\`
			GROUP BY \`games\`.\`stadium\`;
		`;

		return await this.db.rawSelect(query);
	}
}
