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
