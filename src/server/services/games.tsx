import { Db } from '@db/db';

// Taken from https://www.fangraphs.com/library/pitching/game-score/ and using gs2 with the NL constant
const GAME_SCORE_CONSTANT = 36;

interface ScoreRow {
	outs: number;
	strikeouts: number;
	walks: number;
	hits: number;
	runs: number;
	homeRuns: number;
	pitcherId: number;
	pitcher: string;
	gameId: string;
	fastballPct: number;
}

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
			SUM(\`pitches\`.\`playResult\` = 'HomeRun') AS 'hrCount',
			SUM(\`pitches\`.\`hitType\` LIKE '%fly%') AS 'flyBallCount'
			FROM pitches LEFT JOIN games ON \`pitches\`.\`gameId\` = \`games\`.\`gameid\`
			GROUP BY \`games\`.\`stadium\`;
		`;

		return await this.db.rawSelect(query);
	}

	public getGameScores = async (): Promise<object[]> => {
		const query = `
			SELECT
			SUM(\`pitches\`.\`playResult\` = 'Out') AS outs,
			SUM(\`pitches\`.\`kOrBb\` = 'Strikeout') AS strikeouts,
			SUM(\`pitches\`.\`kOrBb\` = 'Walk') AS walks,
			SUM(\`playResult\` = 'HomeRun') AS homeRuns,
			SUM(\`pitches\`.\`playResult\` IN('Single', 'Double', 'Triple', 'HomeRun')) AS hits,
			SUM(\`runsScored\`) AS runs,
			CAST(SUM(\`pitches\`.\`pitchType\` IN('Fastball', 'Sinker', 'Cutter')) as FLOAT) /
			CAST(COUNT(\`pitches\`.\`pitchType\`) AS FLOAT) as fastballPct,
			\`pitchers\`.\`pitcher\`,
			\`pitchers\`.\`pitcherId\`,
			\`pitches\`.\`gameId\`
			FROM pitches
			LEFT JOIN pitchers ON \`pitches\`.\`pitcherId\` = \`pitchers\`.\`pitcherId\`
			GROUP BY \`pitches\`.\`pitcherId\`, \`pitches\`.\`gameId\`
		`;

		const rows = await this.db.rawSelect(query);

		const scores = _.map(rows, (row: ScoreRow) => {
			const score = GAME_SCORE_CONSTANT
				+ (2 * row.outs)
				+ row.strikeouts
				- (2 * row.walks)
				- (2 * row.hits)
				- (3 * row.runs)
				- (6 * row.homeRuns);

			return {
				pitcherId: row.pitcherId,
				pitcher: row.pitcher,
				gameId: row.gameId,
				fastballPct: _.round(row.fastballPct * 100, 2),
				score
			}
		});

		return scores;
	}
}