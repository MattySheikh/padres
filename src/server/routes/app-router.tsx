/**
 * Handles which routes to pass off to the front-end and where to serve static files from
 */

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as send from 'koa-send';

import { ApiRouter } from '@routes/api-router';

// For our Single Page App we will defer control of the routes to the front-end
const FRONTEND_ROUTES: string[] = ['/', '/pitches', '/pitchers', '/games'];

export class AppRouter {
	private router: Router;
	private send: (ctx: Koa.Context, path: string, options?: send.SendOptions) => Promise<string>;
	private ApiRouter: ApiRouter;

	constructor() {
		this.router = new Router();
		this.send = send;
		this.ApiRouter = new ApiRouter();
	}

	/**
	 * Renders any front-end route and passes the state to the front-end. Also handles serving of
	 * static files and passes anything behind `/api` to ApiRouter
	 */
	public init = (): Router => {

		// Cast this as `any` because the koa-router type doesn't allow an array of strings even though
		// the API allows it
		this.router.get((FRONTEND_ROUTES as any), async (ctx: Koa.Context) => {
			return await ctx.render('index', {
				state: JSON.stringify(ctx.state)
			});
		});

		this.router.get('/static/*', async (ctx: Koa.Context) => {
			const path = ctx.path.split(`/static`)[1];

			await this.send(ctx, path, {
				gzip: true,
				root: 'static'
			});
		});

		this.router.use('/api', this.ApiRouter.init().routes());

		return this.router;
	}
}
