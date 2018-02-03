/**
 * Everything behind `/api` will be handled here. Use this router to serve and post
 */

import * as Router from 'koa-router';
import { Pitches } from '@services/pitches';

export class ApiRouter {
	private router: Router;
	private pitches: Pitches;

	constructor() {
		this.router = new Router();
		this.pitches = new Pitches();
	}

	/**
	 * TODO - split out these into middleware files
	 */
	public init = (): Router => {
		this.router.get('/pitches/:type', async (ctx) => {
			ctx.response.body = await this.pitches.getBy(ctx.params.type, ctx.request.query);
			ctx.response.status = 200;
		});

		return this.router;
	}
}
