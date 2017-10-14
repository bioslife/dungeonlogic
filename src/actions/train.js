import Map from '../library/map.js';
import settings from '../library/settings.js';
import {push} from 'react-router-redux';

import {queue} from './general';


var NONE = 'NONE';
var BLOC = 'BLOCK';
var GBLO = 'GALA_BLOCK';
var PLAY = 'PLAYER';
var MONS = 'MONSTER';
var MONF = 'MONSTER_FROZEN';
var BOTL = 'BOTTLE';
var BOSS = 'BOSS';
var COIN = 'COIN';
var EXIL = 'EXIT_LOCKED';
var EXIT = 'EXIT';
var PORT = 'PORTAL';
var ARTI = 'ARTIFACT';


export const move = (obj, block) => {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			var map   = getState().game.blocks,
			    above = map.find(el => Map.isAbove(el, block));

			dispatch({type: 'MOVE', obj: obj, block: block});

			if (above && obj.type == 'PLAYER' && (above.type == 'BOTTLE' || above.type == 'COIN' || above.type == 'ARTIFACT')) {
				dispatch({type: 'TAKE', obj: above});
			}
			setTimeout(resolve, settings.transition);

		});
	};
};

export const showMessage = (message) => {
	return {type: 'SHOW_MESSAGE', message: message}
}

let stages = [
	// Moving around
	{
		init: (dispatch, state) => {
			// Start blocks:
			dispatch({
				type: "INIT",
				bottles: 0,
				blocks: state.game.blocks.map(el => {
					if (el.type === "BOTTLE") {
						return {
							...el,
							hidden: true
						}
					}
					else {
						return el;
					}
				})
			});

			dispatch(showMessage({
				title: "Train message title (1)",
				content: "Train message content (1)",
			}))

		},

		process: (dispatch, state) => {
			let player      = Map.player(state.game.blocks),
			    oldPosition = Map.player(state.train.blocks)

			if (Map.distance(player, oldPosition) > 2) {
				dispatch(nextStage())
			}
		}

	},
	{
		init: (dispatch, state) => {
			dispatch(showMessage({
				title: "Train message title (2)",
				content: "Train message content (2)",
			}))

		},
		process: function (dispatch, state) {
			if (!state.game.blocks.find(el => el.z == 1 && el.type === "COIN")) {
				dispatch(nextStage())
			}
		}
	},
	{
		init: (dispatch, state) => {
			let blocks = state.game.blocks.map(el => {
				if (el.type === "BOTTLE") {
					return {
						...el,
						hidden: false
					}
				}
				else {
					return el;
				}
			})
			dispatch({
				type: "INIT",
				blocks: blocks,
				bottles: 0,
			})

			dispatch(showMessage({
				title: "Train message title (3)",
				content: "Train message content (3)",
			}))

		},
		process: function (dispatch, state) {
			if (!state.game.blocks.find(el => el.z == 1 && el.type === "BOTTLE")) {
				dispatch(nextStage())
			}
		}
	},
	{
		init: (dispatch, state) => {
			dispatch(showMessage({
				title: "Train message title (4)",
				content: "Train message content (4)",
			}))
		},
		process: function (dispatch, state) {
			let player     = Map.player(state.game.blocks),
			    candidates = state.game.blocks.filter(el => el.z === player.z - 1)
			if (state.game.bottles == 0) {
				if (!Map.findPath(candidates, player, state.game.blocks.find(el => el.x == 1 && el.y == 0 && el.z == 1)).length) {
					dispatch(showMessage({
						title: "Train message title (4 - error)",
						content: "Train message content (4 - error)",
					}))
				}
				else {
					dispatch(nextStage())
				}
			}
		}
	},
	{
		init: (dispatch, state) => {
			dispatch(showMessage({
				title: "Train message title (5)",
				content: "Train message content (5)",
			}))
		},
		process: function (dispatch, state) {
			if (state.game.bottles === 0 && !state.game.blocks.find(el => !el.hidden && el.type == "BOTTLE")) {
				let coin   = state.game.blocks.find(el => !el.hidden && el.type === "COIN"),
				    player = Map.player(state.game.blocks)
				if ((!coin && player.z !== 2) || (coin && coin.z !== 2)) {
					dispatch(showMessage({
						title: "Train message title (5 - error)",
						content: "Train message content (5 - error)",
					}))
				}
				else if (!coin && player.z === 2) {
					dispatch(nextStage())
				}
			}
		}
	},
	{
		init: (dispatch, state) => {
			dispatch(showMessage({
				title: "Train message title (6)",
				content: "Train message content (6)",
			}))
		},
		process: function (dispatch, state) {
		}
	},
]


export const nextStage = () => {
	return (dispatch, getState) => {
		dispatch(setStage(getState().train.stage + 1))
	}
}

export const setStage = (stage) => {
	return (dispatch, getState) => {

		const currentState = getState();

		stages[stage].init(dispatch, currentState);

		const stateAfterInit = getState();

		dispatch({
			type: 'SET_TRAIN',
			stage: stage,
			blocks: stateAfterInit.game.blocks,
			bottles: stateAfterInit.game.bottles,
			message: stateAfterInit.game.message
		})
	}
}

export const switchTurn = (block) => {
	return (dispatch, getState) => {
		const state = getState();
		dispatch({type: 'SET_TURN', turn: 'PLAYER'});
		stages[state.train.stage].process(dispatch, state);
	}

};

export const movePlayer = (block) => {
	var id = block.id;
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			const state = getState();

			var map    = state.game.blocks,
			    player = Map.player(map),
			    block  = Map.object(map, id);

			dispatch({type: 'SET_TURN', turn: 'NOBODY'});
			if (block.allowed) {
				dispatch(move(player, block))
					.then(() => {
						if (block.type == 'EXIT') {
							dispatch({type: 'WIN', level: state.game.level});
							dispatch(push(`/level/${+state.game.level + 1}`));
							reject();
						}
						else {
							dispatch(switchTurn());
							resolve();
						}
					});
			}
			else {
				dispatch({type: 'SET_TURN', turn: 'PLAYER'});
			}

		});
	};
};

export const liftBlock = (block, player) => {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			dispatch({type: 'LIFT_BLOCK', block: block, player: player});
			setTimeout(resolve, settings.transition * 2);
		});
	};
};

export const lowerBlock = (block, player) => {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			dispatch({type: 'LOWER_BLOCK', block: block, player: player});
			setTimeout(resolve, settings.transition * 2);
		});
	};
};


export const clickBlock = block => {
	return (dispatch, getState) => {
		const state = getState();
		if (state.game.turn == 'PLAYER') {
			if (state.game.mode == 'LIFT' && block.allowed) {
				if (state.game.bottles == 'INFINITY' || state.game.bottles > 0)
					dispatch(liftBlock(block, true)).then(() => {
						dispatch(switchTurn());
					});
			}
			else if (state.game.mode == 'LOWER' && block.allowed) {
				if (state.game.bottles == 'INFINITY' || state.game.bottles > 0)
					dispatch(lowerBlock(block, true)).then(() => {
						dispatch(switchTurn());
					});
			}
			else if (state.game.mode == 'WALK') {
				if (block.allowed) {
					dispatch(movePlayer(block));
				}
				else if (block.reachable) {
					var actions = [];
					for (let i = 0; i < block.path.length; i++) {
						let goal = block.path[i];
						actions.push(movePlayer(goal));
					}
					dispatch(queue(actions));
				}
			}
		}
	};
};

export const setMode = (mode) => ({
	type: 'SET_MODE',
	mode: mode
});

export const restart = () => {
	return (dispatch, getState) => {
		const state = getState();
		dispatch({type: 'INIT', blocks: state.train.blocks, bottles: state.train.bottles})
		if (state.train.message) {
			dispatch({type: 'SHOW_MESSAGE', message: state.train.message})
		}
	}
};

export const loadLevel = (level) => {
	return {
		type: 'LOAD_LEVEL',
		level: level
	};
};
