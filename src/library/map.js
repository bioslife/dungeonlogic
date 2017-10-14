import settings from "./settings.js"
import PriorityQueue from "./queue.js"

// The tools for map manipulating
export default class Map {
	constructor(blocks) {
		this.blocks = blocks;
	}

	// Auxiliary functions
	static isBlank(el) {
		if (Array.isArray(el)) {
			return el.every(el => (typeof el == "undefined") || (el.type == "NONE") || (!Map.isBlock(el) && el.type != "MONSTER" && el.type != "BOSS"))
		}
		else {
			return (typeof el == "undefined") || (el.type == "NONE") || (!Map.isBlock(el) && el.type != "MONSTER")
		}
	}

	static isBlock(el) {
		return (typeof el !== "undefined") && (el.type == "BLOCK" || el.type == "GALA_BLOCK" || el.type == "EXIT" || el.type == "EXIT_LOCKED")
	}

	static coins(map) {
		return map.filter(el => el.type === "COIN" && !el.hidden).length
	}

	static isNeighbourhood(el, obj) {
		return ((obj.x == el.x && obj.y == el.y) || (obj.x == el.x && ((obj.y == el.y + 1) || (obj.y == el.y - 1))) || (obj.y == el.y && ((obj.x == el.x + 1) || (obj.x == el.x - 1))))
	}

	static isAbove(el, obj) {
		return obj.x == el.x && obj.y == el.y && el.z == obj.z + 1
	}

	static deepBelow(map, obj, array = true) {
		var candidates = [obj]
		while (true) {
			var element = map.find(el => Map.isAbove(candidates[0], el));
			if (element && Map.isBlock(element)) {
				candidates.unshift(element)
			}
			else {
				if (!array) {
					return candidates[0];
				}
				break;
			}
		}
		return candidates;
	}


	static object(map, id) {
		return map.find(obj => obj.id == id)
	}

	static move(map, obj, x, y, z) {
		return map.map(el => {
			if (el.id == obj.id) {
				return {
					...el,
					x: x,
					y: y,
					z: z
				}
			}
			else if (el.x === x && el.y === y && el.z === z) {
				return {
					...el,
					hidden: true,
				}
			}
			else if (el.x === obj.x && el.y === obj.y && el.z === obj.z) {
				return {
					...el,
					hidden: false,
				}
			}
			else {
				return el
			}
		});
	}

	static remove(map, obj) {
		return map.map(el => {
			if (el.id == obj.id) {
				return {
					...el,
					hidden: true,
					z: -settings.magic, // WORKAROUND
					//type: 'NONE'
				}
			}
			else {
				return el;
			}
		});
	}

	static create(map) {
		function generateCell(cell, hidden = false) {
			if (cell != "NONE") {
				var block = {
					type: cell,
					x: x,
					y: y,
					z: z,
					id: result.length,
					hidden: hidden
				};
				if (block.type == 'BLOCK') {
					block.allowed = false;
				}
				if (block.type == 'MONSTER_FROZEN') {
					block.frozen = true;
					block.type   = "MONSTER"
				}
				result.push(block)
			}
		}

		var result = [];
		for (var z = 0; z < map.length; z++) {
			for (var y = 0; y < map[z].length; y++) {
				for (var x = 0; x < map[z][y].length; x++) {
					if (Array.isArray(map[z][y][x])) {
						for (var i = 0; i < map[z][y][z].length; i++) {
							generateCell(map[z][y][x][i], i != 0)
						}
					}
					else {
						generateCell(map[z][y][x])
					}

				}
			}
		}
		return Map.updateAllowed(result);
	}

	static player(map) {
		return map.find(el => el.type == 'PLAYER')
	}


	static monsters(map) {
		return map.filter(el => el.type == 'MONSTER' || el.type == "BOSS")
	}


	move(obj, x, y, z) {

	}


	static distance(first, second) {
		return ((first.x - second.x) * (first.x - second.x) + (first.y - second.y) * (first.y - second.y) + (first.z - second.z) * (first.z - second.z) / 4 )
	}

	static canLift(map, actor, block) {
		var above = map.find(above => Map.isAbove(above, block));
		return (Map.isBlock(block) && (block.z < settings.magic) && Map.isNeighbourhood(block, actor) && (!above || (!Map.isBlock(above) && !map.find(some => Map.isAbove(some, above)))))
	}

	static canLower(map, actor, block) {
		var below = Map.deepBelow(map, block, false);
		return (Map.isBlock(block) && (below.z > -settings.magic) && !map.find(el => Map.isAbove(below, el)) && Map.isNeighbourhood(block, actor) && (!Map.isBlock(map.find(aboveEl => Map.isAbove(aboveEl, block)))))
	}

	static findPath(candidates, actor, end) {

		function dist(a, b) {
			if (Math.abs(b.x - a.x) == 0 || Math.abs(b.y - a.y) == 0) {
				var angle = 0
			}
			else {
				var angle = Math.abs(b.x - a.x) / Math.abs(b.y - a.y)
			}
			return paths[a.id].distance + Map.distance(a, b) * (angle)

		}

		// Reached blocks:
		var closed = [],
		    // Partial solutions:
		    start  = candidates.find(el => Map.isAbove(actor, el)),
		    opened = new PriorityQueue((a, b) => dist(a, end) < dist(b, end)),
		    paths  = {};

		// First vertex is the start point:
		paths[start.id] = {
			distance: 0
		};
		opened.add(start);
		// While non reviewed blocks exist:
		while (!opened.isEmpty()) {
			let last = opened.poll();
			if (closed.find(el => el == last)) {
				continue;
			}
			if (last == end) {
				var path    = [],
				    pointer = end;
				while (paths[pointer.id].previous) {
					path.unshift(pointer);
					pointer = paths[pointer.id].previous;
				}
				return path;
			}
			closed.push(last);
			candidates.filter(el => Map.isNeighbourhood(el, last)).forEach(el => {
				let distance = dist(last, el);
				if (!paths[el.id] || (distance < paths[el.id].distance)) {
					paths[el.id] = {
						previous: last,
						distance: distance
					};
				}
				opened.add(el);
			})
		}
		return []
	}

	static style(block) {
		var {x, y, z} = block;
		return {
			left: (45 * x - (46) * y),
			top: (23 * x + 23 * y - z * (46)),
			zIndex: (y + settings.magic) * (y + settings.magic) + (x + settings.magic + 1) * (x + settings.magic + 1) + (z + settings.magic) * (z + settings.magic)
		}
	}


	static updateAllowed(map, mode = 'WALK') {
		const player = Map.player(map);

		if (mode == 'WALK') {
			var candidates = map.filter(belowEl => (belowEl.z == (player.z - 1)) && Map.isBlock(belowEl) && Map.isBlank(map.filter(aboveEl => Map.isAbove(aboveEl, belowEl))));
		}

		return map.map(
			belowEl => {
				if (mode === 'WALK') {
					if (Map.isBlock(belowEl) && (belowEl.z == (player.z - 1)) && Map.isBlank(map.filter(aboveEl => Map.isAbove(aboveEl, belowEl)))) {
						if (Map.isNeighbourhood(belowEl, player)) {
							return {...belowEl, allowed: true, reachable: true, path: []}
						}
						else {
							return {...belowEl, allowed: false, reachable: true, path: Map.findPath(candidates, player, belowEl)}
						}
					}
					else {
						return {...belowEl, allowed: false, reachable: false}
					}
				}
				else if (mode === 'LIFT') {
					if (Map.canLift(map, player, belowEl)) {
						return {...belowEl, allowed: true}
					}
					else {
						return {...belowEl, allowed: false}
					}
				}
				else {
					if (Map.canLower(map, player, belowEl)) {
						return {...belowEl, allowed: true}
					}
					else {
						return {...belowEl, allowed: false}
					}
				}

			}
		);
	}
}