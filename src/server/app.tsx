/**
 * The entry point of our application. It sets up routes and determines where views go.
 */
import * as _ from 'lodash';

(global as any)._ = _;

import '@db/models';
import { AppRouter } from '@routes/app-router';

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as views from 'koa-views';
import * as winston from 'winston';

export class App {
	public instance: Koa;
	private appRouter: AppRouter;

	constructor() {
		this.instance = new Koa();
		this.appRouter = new AppRouter();
	}

	/**
	 * Initializes the app and sets up views and routes
	 *
	 * @returns {undefined}
	 */
	public start = (): void => {
		this.instance.use(views(`${__dirname}/views`, {
			map: {
				html: 'lodash'
			}
		}));

		this.instance.use(bodyParser());

		this.setupRouteTries();
		this.setupAppRoutes();
		this.setupFallbackRoutes();
	}

	/**
	 * Checks the proper session and try/catches the next route. That way if we throw an error and
	 * don't catch it along the way it will eventually be caught here.
	 *
	 * @returns {undefined}
	 */
	private setupRouteTries = (): void => {
		this.instance.use(async (ctx: Koa.Context, next: () => void) => {
			try {
				await next();
			} catch (error) {
				ctx.status = error.statusCode || error.status || 500;
				winston.error('APP-ERROR', error);
			}
		});
	}

	/**
	 * Anything that requires a proper session should be set up in the AppRouter and it will be
	 * initialized here
	 *
	 * @returns {undefined}
	 */
	private setupAppRoutes = (): void => {
		this.instance.use(this.appRouter.init().routes());
	}

	/**
	 * If we come upon a route that doesn't exist we just want to log it then do nothing
	 */
	private setupFallbackRoutes = (): void => {
		this.instance.use(async (ctx: Koa.Context) => {
			winston.error('INVALID-ROUTE', `No ${ctx.req.method} routes exist for ${ctx.originalUrl}`);
		});
	}
}
