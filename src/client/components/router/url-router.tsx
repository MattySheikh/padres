/**
 * UrlRouter handles all routes and pathing in our single page app.
 *
 * NOTE - if you'd like to add a route here for our single page app to handle, you must update the
 * FRONTEND_ROUTES array in app-router in app-router
 */

import { Pitches } from '@components/pitches/pitches';
import { Games } from '@components/games/games';
import { Pitchers } from '@components/pitchers/pitchers';
import * as React from 'react';

export interface PathObject {
	url: string,
	component: React.ComponentClass,
	label: string
}


export class UrlRouter {
	readonly PATHS: PathObject[] = [
		{
			url: `/pitches`,
			component: Pitches,
			label: 'Pitches'
		},
		{
			url: `/games`,
			component: Games,
			label: 'Games'
		},
		{
			url: `/pitchers`,
			component: Pitchers,
			label: 'Pitchers'
		}
	]
}