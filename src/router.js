import React from 'react';
import {Route, Switch} from 'react-router';
import {ConnectedRouter} from 'react-router-redux';


import {store} from './store.js';


// Gets the history
import {history} from './store.js';

// Components
import Layout from './components/Layout';
import Menu from './pages/Menu/Menu';
import Game from './pages/Game/Game';
import Train from './pages/Train/Train';
import Titles from './pages/Titles/Titles';

const guard = store => {
	return (location) => {
		var level = location.match.params.level;


		if (level > 1 && level <= store.getState().general.lastLevel) {
			if (level == 11) {
				return (<Titles/>);
			}
			else {
				store.dispatch({type: 'LOAD_LEVEL', level: level});
				return (<Game/>);
			}

		}
		else if (level == 1) {
			store.dispatch({type: 'LOAD_LEVEL', level: level});
			return (<Train/>);
		}
		else {
			return (<Menu/>);
		}
	};
};


// Build the router
const router = (

	<ConnectedRouter onUpdate={() => window.scrollTo(0, 0)} history={history}>
		<Layout>
			<Switch>
				<Route exact path="/main/" component={Menu}/>
				<Route exact path="/level/:level" render={guard(store)}/>
				<Route component={Menu}/>
			</Switch>
		</Layout>
	</ConnectedRouter>

);

// Export
export {router};
