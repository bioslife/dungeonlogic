export function queue(actions) {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			if (actions.length) {
				var chain = dispatch(actions.shift());
				actions.forEach(action => {
					chain = chain.then(result => dispatch(action))
				})
				chain.then(resolve);
			}
			else {
				resolve();
			}

		})
	}
}
