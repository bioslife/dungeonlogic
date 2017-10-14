import game from './game.js';


export default function train(state = {}, action) {
	switch (action.type) {
		case 'SET_TRAIN':
			return {
				...state,
				stage: action.stage,
				bottles: action.bottles,
				message: action.message,
				blocks: action.blocks.map(
					el => ({
						...el
					})
				),

			}
		default:
			return state;
	}
}