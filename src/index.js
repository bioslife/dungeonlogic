import {AppContainer} from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import {router} from './router.js';
import {store} from './store.js';
import {Provider} from 'react-redux';
const rootEl = document.getElementById('root');

const render = Component =>
	ReactDOM.render(
		<AppContainer>
			<Provider store={store}>
				{router}
			</Provider>
		</AppContainer>,
		rootEl
	);

render({router});

if (module.hot) module.hot.accept('./router.js', () => render({router}));