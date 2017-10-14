import {createStore, applyMiddleware, compose} from "redux";
import reducers from "./reducers/";
import createHistory from 'history/createBrowserHistory'
import {routerMiddleware, routerReducer} from 'react-router-redux'
import {combineReducers} from 'redux';
import thunk from 'redux-thunk'


// Add the middlewares
let middlewares = [];

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Add the router middleware and thunk
middlewares.push(routerMiddleware(history), thunk);


// Apply the middleware
let middleware = applyMiddleware(...middlewares);

// Add the redux dev tools
if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
	middleware = compose(middleware, window.devToolsExtension());
}

// Create the reducers
const store = createStore(
	combineReducers({
		...reducers,
		router: routerReducer
	}),
	middleware
);

// Export
export {store, history};