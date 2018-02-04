/**
 * Everything behind `/api` will be handled here. Use this router to serve and post
 */

import * as Router from 'koa-router';
import { Pitches } from '@services/pitches';
import { Games } from '@services/games';

export class ApiRouter {
	private router: Router;
	private pitches: Pitches;
	private games: Games;

	constructor() {
		this.router = new Router();
		this.pitches = new Pitches();
		this.games = new Games();
	}

	/**
	 * TODO - split out these into middleware files
	 */
	public init = (): Router => {
		this.router.get('/pitches/:type', async (ctx) => {
			ctx.response.body = await this.pitches.getBy(ctx.params.type, ctx.request.query);
			ctx.response.status = 200;
		});

		this.router.get('/games/hr-per-fly-ball', async (ctx) => {
			ctx.response.body = await this.games.getHrPerFlyBall();
			ctx.response.status = 200;
		});

		return this.router;
	}
}
