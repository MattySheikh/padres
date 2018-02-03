/**
 * Handles server setup and gets options from `App`. This file shouldn't do anything but start a server
 */

import { App } from './app';

const PORT: number = 1919;

export class Server {
	private app: App;

	constructor() {
		this.app = new App();
	}

	public start() {
		this.app.start();
		this.app.instance.listen(PORT, () => console.info(`Server running on port ${PORT}`));
	}
}

const server = new Server();
server.start();
