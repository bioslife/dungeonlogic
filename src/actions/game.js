import Map from '../library/map.js';
import settings from '../library/settings.js';
import {push} from 'react-router-redux';

import {queue} from './general';

export const move = (obj, block) => {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			var map   = getState().game.blocks,
			    above = map.find(el => Map.isAbove(el, block));

			dispatch({type: 'MOVE', obj: obj, block: block});

			if (above && above.type == 'PORTAL') {
				setTimeout(() => {
					dispatch(teleport(obj, above)).then(resolve);
				}, settings.transition);
			}
			else {
				if (above && obj.type === 'PLAYER' && (above.type === 'BOTTLE' || above.type == 'COIN' || above.type == 'ARTIFACT')) {
					dispatch({type: 'TAKE', obj: above});
				}
				setTimeout(resolve, settings.transition);
			}
		});
	};
};

export const teleport = (obj, portal) => {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			var map     = getState().game.blocks,
			    portals = map.filter(el => el.type == 'PORTAL' && el.id != portal.id);

			if (portals.length) {
				var selected = portals[Math.floor(portals.length * Math.random())];
				dispatch({type: 'ENTER_PORTAL', obj: obj, portal: portal});
				setTimeout(() => {
					dispatch({type: 'EXIT_PORTAL', obj: obj, portal: selected});
					resolve();
				}, settings.transition * 5);
			}
			else {
				resolve();
			}
		});
	};
};

export const moveMonster = (monster, memory) => {
	var id = monster.id;
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {

			const state   = getState();
			var map       = state.game.blocks,
			      player  = Map.player(map),
			      monster = Map.object(map, id);

			if (state.game.turn != 'MONSTERS') {
				resolve();
				return;
			}

			memory.push(map.find(block => Map.isAbove(monster, block)).id);
			var candidates = map.filter(
				belowEl => Map.isBlock(belowEl) && Map.isNeighbourhood(belowEl, monster) && (monster.z == belowEl.z + 1) && (memory.indexOf(belowEl.id) === -1) && Map.isBlank(map.filter(aboveEl => Map.isAbove(aboveEl, belowEl)))
			);

			if (candidates.length) {
				var way = candidates.find(block => Map.isAbove(player, block)) || candidates[Math.floor(Math.random() * candidates.length)];
				if (Map.isAbove(player, way)) {
					dispatch({type: 'FAIL', level: state.game.level});
					reject();
				}
				dispatch(move(monster, way)).then(resolve);
			}
			else {
				resolve();
			}

		});
	};
};


export const moveBoss = (boss, memory) => {

	var id = boss.id;

	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {

			const state        = getState();
			let map            = state.game.blocks,
			      player       = Map.player(map),
			      boss         = Map.object(map, id),
			      currentBlock = map.find(block => Map.isAbove(boss, block));

			if (state.game.turn !== 'MONSTERS') {
				resolve();
				return;
			}

			memory.push(currentBlock.id);

			const candidates = map.filter(
				belowEl => Map.isBlock(belowEl) && (belowEl.z === currentBlock.z || (belowEl.x !== currentBlock.x || belowEl.y != currentBlock.y)) && Map.isNeighbourhood(belowEl, boss) && (memory.indexOf(belowEl.id) === -1) && Map.isBlank(map.filter(aboveEl => Map.isAbove(aboveEl, belowEl)))
			);

			if (candidates.length) {
				var cattedCandidates = candidates.filter(el => (el.z == boss.z - 1) || Math.random() > 0.7),
				    way              = candidates.find(block => Map.isAbove(player, block)) || cattedCandidates[Math.floor(Math.random() * cattedCandidates.length)],
				    actions          = [],
				    probability      = Math.random();

				if (!way || probability > (1 - (6 - Map.coins(map)) / 14)) {
					let min = candidates[0];
					candidates.forEach(el => {
						if (Map.distance(el, player) < Map.distance(min, player)) {
							min = el;
						}
					});
					way = min;
				}

				var distance = (way.z - currentBlock.z);

				if (distance != 0) {
					map.forEach(el => {
						if (el.id != way.id && Map.isNeighbourhood(el, boss) && (memory.indexOf(el.id) === -1)) {
							memory.push(el.id);
						}
					});

					if ((distance < 0) && Map.canLower(map, boss, currentBlock)) {
						dispatch(lowerBlock(currentBlock)).then(resolve);
					}
					else if (Map.canLift(map, boss, currentBlock)) {
						dispatch(liftBlock(currentBlock)).then(resolve);
					}
					else {
						dispatch(teleport(boss, currentBlock)).then(resolve);
					}
				}
				else {
					dispatch(move(boss, way)).then(() => {
						if (Map.isAbove(player, way)) {
							dispatch({type: 'FAIL', level: state.game.level});
							reject();
						}
						else {
							resolve();
						}
					});
				}
			}
			else {
				resolve();
			}

		});
	};
};


export const switchTurn = () => {
	return (dispatch, getState) => {
		return new Promise(function (resolve, reject) {
			var map      = getState().game.blocks,
			    monsters = Map.monsters(map),
			    actions  = [];

			if (monsters) {
				dispatch({type: 'SET_TURN', turn: 'MONSTERS'});
				monsters.forEach(monster => {
					let memory = [];
					if (monster.frozen) {
						if (map.find(el => Map.isNeighbourhood(el, monster) && el.z == monster.z && el.type == 'PLAYER')) {
							actions.push(moveMonster(monster, []));
						}
					}
					else if (monster.type === 'BOSS') {
						for (var i = 0; i < 2; i++) {
							actions.push(moveBoss(monster, memory));
						}
					}
					else {
						for (var i = 0; i < 2; i++) {
							actions.push(moveMonster(monster, memory));
						}
					}
				});
				dispatch(queue(actions)).then(() => {
					dispatch({type: 'SET_TURN', turn: 'PLAYER'});
					resolve();
				});
			}
			else {
				dispatch({type: 'SET_TURN', turn: 'PLAYER'});
				resolve();
			}
		});
	};
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
							dispatch(switchTurn()).then(resolve);
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

export const restart = () => ({
	type: 'RESTART'
});

export const loadLevel = (level) => {
	return {
		type: 'LOAD_LEVEL',
		level: level
	};
};
