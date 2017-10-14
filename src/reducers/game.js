import levels from '../library/levels.js';
import Map from '../library/map.js';
import settings from '../library/settings.js';

export default function game(state = {}, action) {
	switch (action.type) {
		case 'SHOW_MESSAGE':
			return {
				...state,
				message: action.message,

			}
		case 'HIDE_MESSAGE':
			return {
				...state,
				message: undefined,

			}
		case 'INIT':
			return {
				...state,
				bottles: action.bottles,
				blocks: Map.updateAllowed(action.blocks),
				turn: 'PLAYER',
				mode: 'WALK',

			};
		case 'LOAD_LEVEL':
			return {
				bottles: levels[action.level - 1].bottles,
				mode: 'WALK',
				blocks: Map.create(levels[action.level - 1].map),
				level: action.level,
				turn: 'PLAYER',
				levelName: levels[action.level - 1].name
			};
		case 'RESTART':
			return {
				bottles: levels[state.level - 1].bottles,
				mode: 'WALK',
				blocks: Map.create(levels[state.level - 1].map),
				turn: 'PLAYER',
				status: 'GAME',
				level: state.level,
				levelName: levels[state.level - 1].name
			};

		case 'MOVE':
			return {
				...state,
				blocks: Map.move(state.blocks, action.obj, action.block.x, action.block.y, action.block.z + 1)
			};
		case 'ENTER_PORTAL':
			return {
				...state,
				blocks: state.blocks.map(el => {
					if (el.id === action.obj.id) {
						return {
							...el,
							hidden: true,
						};
					}
					else if (el.id == action.portal.id) {
						return {
							...el,
							hidden: false
						};
					}
					else {
						return el;
					}
				})
			};
		case 'EXIT_PORTAL':
			return {
				...state,
				blocks: state.blocks.map(el => {
					if (el.id === action.obj.id) {
						return {
							...el,
							x: action.portal.x,
							y: action.portal.y,
							z: action.portal.z,
							hidden: false
						};
					}
					else if (el.x === action.portal.x && el.y === action.portal.y && el.z === action.portal.z) {
						return {
							...el,
							hidden: true,
						};
					}
					else {
						return el;
					}
				})
			};

		case 'LIFT_BLOCK':
			var block     = Map.object(state.blocks, action.block.id);
			var newBlocks = state.blocks.map(el => {
				if (Map.isAbove(el, block) || (block.id == el.id)) {
					return {
						...el,
						z: el.z + 1
					};
				}
				else {
					return el;
				}
			});
			return {
				...state,
				blocks: newBlocks,
				bottles: (state.bottles == 'INFINITY' || !action.player) ? state.bottles : (state.bottles - 1)
			};
		case 'LOWER_BLOCK':
			var block      = Map.object(state.blocks, action.block.id);
			var candidates = Map.deepBelow(state.blocks, block);
			var newBlocks  = state.blocks.map(el => {
				if (candidates.find(candidate => el.id == candidate.id) || Map.isAbove(el, block)) {
					return {
						...el,
						z: el.z - 1
					};
				}
				else {
					return el;
				}
			});
			return {
				...state,
				blocks: newBlocks,
				bottles: (state.bottles == 'INFINITY' || !action.player) ? state.bottles : (state.bottles - 1)
			};
		case 'FAIL':
			var newBlocks = state.blocks.map(el => {
				if (el.type == 'PLAYER') {
					return {
						...el,
						hidden: true
					};
				}
				else {
					return el;
				}
			});
			return {
				...state,
				status: 'FAIL',
				blocks: newBlocks
			};
		case 'WIN':
			var newBlocks = state.blocks.map(el => {
				if (el.type == 'MONSTER') {
					return {
						...el,
						z: settings.height,
						hidden: true
					};
				}
				else {
					return el;
				}
			});
			return {
				...state,
				status: 'WIN'
			};
		case 'TAKE':
			var newBlocks = Map.remove(state.blocks, action.obj);
			if (action.obj.type == 'BOTTLE') {
				return {
					...state,
					bottles: state.bottles == 'INFINITY' ? state.bottles : state.bottles + 1,
					blocks: newBlocks
				};
			}
			else if (action.obj.type == 'ARTIFACT') {
				return {
					...state,
					bottles: 'INFINITY',
					blocks: newBlocks
				};
			}
			else if (action.obj.type == 'COIN') {
				var clear = !newBlocks.filter(el => el.type == 'COIN' && !el.hidden).length;
				return {
					...state,
					blocks: newBlocks.map(el => {
						if (clear && el.type == 'EXIT_LOCKED') {
							return {
								...el,
								type: 'EXIT'
							};
						}
						else {
							return el;
						}
					})
				};
			}
			else {
				return state;
			}
		case 'SET_TURN':
			if (action.turn == 'PLAYER') {
				return {
					...state,
					turn: action.turn,
					blocks: Map.updateAllowed(state.blocks, state.mode)
				};
			}
			else {
				return {
					...state,
					turn: action.turn
				};
			}

		case 'SET_MODE':
			return {
				...state,
				blocks: Map.updateAllowed(state.blocks, action.mode),
				mode: action.mode
			};
		default:
			return state;
	}

}