/**
 * Handles server setup and gets options from `App`. This file shouldn't do anything but start a server
 */

import * as winston from 'winston';
import { App } from './app';

const PORT: number = 1919;

export class Server {
	private app: App;

	constructor() {
		this.app = new App();
	}

	public start() {
		this.app.start();
		this.app.instance.listen(PORT, () => winston.info(`Server running on port ${PORT}`));
	}
}

const server = new Server();
server.start();
