import Map from "./map.js";

var NONE        = 'NONE';
var BLOCK       = 'BLOCK';
var PLAYER      = 'PLAYER';
var MONSTER     = 'MONSTER';
var VIAL        = 'VIAL';
var COIN        = 'COIN';
var EXIT_LOCKED = 'EXIT_LOCKED';
var EXIT_OPENED = 'EXIT_OPENED';

describe('Manipulating the map', () => {

	var defaultMap = [
		[
			[BLOCK, BLOCK],
			[BLOCK, BLOCK],
		],
		[
			[NONE, NONE],
			[BLOCK, PLAYER]
		],
		[
			[NONE, NONE],
			[NONE, NONE],
		],
	];

	var blocks = Map.create(defaultMap)

	var map = new Map(blocks)


	test('create the map', () => {

		var expected = [
			{type: 'BLOCK', allowed: false, x: 0, y: 0, z: 0, id: 0},
			{type: 'BLOCK', allowed: false, x: 1, y: 0, z: 0, id: 1},
			{type: 'BLOCK', allowed: false, x: 0, y: 1, z: 0, id: 2},
			{type: 'BLOCK', allowed: false, x: 1, y: 1, z: 0, id: 3},
			{type: 'NONE', x: 0, y: 0, z: 1, id: 4},
			{type: 'NONE', x: 1, y: 0, z: 1, id: 5},
			{type: 'BLOCK', allowed: false, x: 0, y: 1, z: 1, id: 6},
			{type: 'PLAYER', x: 1, y: 1, z: 1, id: 7},
			{type: 'NONE', x: 0, y: 0, z: 2, id: 8},
			{type: 'NONE', x: 1, y: 0, z: 2, id: 9},
			{type: 'NONE', x: 0, y: 1, z: 2, id: 10},
			{type: 'NONE', x: 1, y: 1, z: 2, id: 11}
		];

		expect(Map.create(defaultMap)).toMatchObject(expected)
	});

	test('finding player', () => {
		expect(map.player()).toMatchObject({type: 'PLAYER', x: 1, y: 1, z: 1})
	});

	test('set allowed blocks', () => {

		var expected = [
			{type: 'BLOCK', allowed: false, x: 0, y: 0, z: 0, id: 0},
			{type: 'BLOCK', allowed: true, x: 1, y: 0, z: 0, id: 1},
			{type: 'BLOCK', allowed: false, x: 0, y: 1, z: 0, id: 2},
			{type: 'BLOCK', allowed: true, x: 1, y: 1, z: 0, id: 3},
			{type: 'NONE', x: 0, y: 0, z: 1, id: 4},
			{type: 'NONE', x: 1, y: 0, z: 1, id: 5},
			{type: 'BLOCK', allowed: false, x: 0, y: 1, z: 1, id: 6},
			{type: 'PLAYER', x: 1, y: 1, z: 1, id: 7},
			{type: 'NONE', x: 0, y: 0, z: 2, id: 8},
			{type: 'NONE', x: 1, y: 0, z: 2, id: 9},
			{type: 'NONE', x: 0, y: 1, z: 2, id: 10},
			{type: 'NONE', x: 1, y: 1, z: 2, id: 11}
		];

		expect(map.updateAllowed()).toMatchObject(expected)
	});


});