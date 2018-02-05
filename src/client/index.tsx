/**
 * Webpack initializes our app here. So we should just include react and set any globals we'd like
 */

// Some TypeScripty things so we can make lodash accessible from everywhere
import * as LODASH from 'lodash';
declare global {
  const _: typeof LODASH;
}
(window as any)._ = LODASH;

import { Main } from '@components/main';
import * as React from 'react'; // Required in order to load Main
import * as ReactDOM from 'react-dom';

import '@styles/index.scss';

ReactDOM.render(
	<Main />,
	document.getElementById('main')
);
