/**
 * The main entry-point of our app. In here put anything that is relevant to the app as a whole.
 */

import { PathObject, UrlRouter } from '@components/router/url-router';
import * as React from 'react';
import { BrowserRouter, Link, Route } from 'react-router-dom';

import '@styles/main.scss';

export class Main extends React.Component<{}> {
	private readonly urlRouter: UrlRouter;

	constructor(props: object) {
		super(props);
		this.urlRouter = new UrlRouter();
	}

	public render() {
		return(
			<BrowserRouter>
				<div>
					<div className='top-navigation'>
						<div className='navigation-link-container'>
							{this.getTabs()}
						</div>
					</div>
					<div>
						{this.getRoutes()}
					</div>
				</div>
			</BrowserRouter>
		);
	}

	/**
	 * Creates the tabs at the top of our portal based on the UrlRouter.
	 *
	 * @returns {React.ReactNode[]}
	 */
	private getTabs = (): React.ReactNode[] => {
		return this.urlRouter.PATHS.map((val: PathObject) =>
			<div className='navigation-link' key={val.url}><Link to={val.url}>{val.label}</Link></div>
		);
	}

	/**
	 * Creates the routes for our single page app based on the UrlRouter.
	 *
	 * @returns {React.ReactNode[]}
	 */
	private getRoutes = (): React.ReactNode[] => {
		return this.urlRouter.PATHS.map((val: PathObject) =>
			<Route key={val.url} path={val.url} component={val.component} />
		);
	}

}
