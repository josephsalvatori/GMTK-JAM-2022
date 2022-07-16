import Phaser from "phaser";
import Enemy from "../_sprites/Enemy";
import Player from "../_sprites/Player";

const SCENE_KEY = "Level";

export default class Level extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

		/**
		 * Tile settings
		 */
		this.tileConfig = {
			size: 32,
			x: 80,
			y: 100
		};

		/**
		 * Spawning Beds 
		 */

		this.tileConfig.spawnSize = 4; // Size of gate spawns
		this.tileConfig.graceArea = 2; // space between walls & obstacles
		this.tileConfig.gates = {
			N: {
				x1: (this.tileConfig.x / 2) - (this.tileConfig.spawnSize / 2),
				x2: (this.tileConfig.x / 2) + (this.tileConfig.spawnSize / 2),
				y1: 0,
				y2: this.tileConfig.spawnSize
			},
			S: {
				x1: (this.tileConfig.x / 2) - (this.tileConfig.spawnSize / 2),
				x2: (this.tileConfig.x / 2) + (this.tileConfig.spawnSize / 2),
				y1: (this.tileConfig.y - this.tileConfig.spawnSize),
				y2: this.tileConfig.y
			},
			W1: {
				x1: 0,
				x2: this.tileConfig.spawnSize,
				y1: Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) + this.tileConfig.spawnSize,
				y2: Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) + (this.tileConfig.spawnSize * 2)
			},
			W2: {
				x1: 0,
				x2: this.tileConfig.spawnSize,
				y1: (Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) * 2) + (this.tileConfig.spawnSize * 2),
				y2: (Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) * 2) + (this.tileConfig.spawnSize * 3)
			},
			E1: {
				x1: (this.tileConfig.x - this.tileConfig.spawnSize),
				x2: this.tileConfig.x,
				y1: Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) + this.tileConfig.spawnSize,
				y2: Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) + (this.tileConfig.spawnSize * 2)
			},
			E2: {
				x1: (this.tileConfig.x - this.tileConfig.spawnSize),
				x2: this.tileConfig.x,
				y1: (Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) * 2) + (this.tileConfig.spawnSize * 2),
				y2: (Math.round((this.tileConfig.y - (this.tileConfig.spawnSize * 4)) / 3) * 2) + (this.tileConfig.spawnSize * 3)
			}
		};
	}

	/** Used to prepare data */
	init() {
		console.log("getData", this.registry.get("player"));

		this.scene.launch("HUD");
	}

	/** Used for preloading assets (image, audio) into the scene */
	preload() {

		/** Random tileset */
		let tilesets = [
			"/assets/imgs/tileset_debug.png",
			"/assets/imgs/tileset_stone_water_sand_lava.png",
		];

		let tilesetIndex = Math.floor(Math.random() * tilesets.length);

		this.load.image("tiles", tilesets[tilesetIndex]);
		this.load.spritesheet("player", "/assets/imgs/player_debug.png", {
			frameWidth: 32,
			frameHeight: 32
		});
	}

	drawArena() {

		this.level = [];
		this.enemies = 0;
		this.wave = 0;

		/**
		 * Tileset
		 * 	- 0-9: Floor
		 * 	- 10-13: Wall
		 * 	- 14: Gate
		 * 	- 15-20: Obstacle
		 * 	- 21-27: Slow Floor
		 * 	- 28-31: Traps
		 */
		
		let neutralSlowTileWeight = [
			{ index: 0, weight: 240 },	// base neutral
			{ index: 1, weight: 140 },	// neutral variation 2
			{ index: 2, weight: 80 },	// neutral variation 3
			{ index: 3, weight: 70 },	// neutral variation 4
			{ index: 4, weight: 50 },	// neutral variation 5
			{ index: 5, weight: 40 },	// neutral variation 6
			{ index: 6, weight: 20 },	// neutral variation 7
			{ index: 7, weight: 18 },	// neutral variation 8
			{ index: 8, weight: 16 },	// neutral variation 9
			{ index: 9, weight: 14 },	// neutral variation 10
			{ index: 21, weight: 10 },	// slowdown variant 1
			{ index: 22, weight: 8 },	// slowdown variant 2
			{ index: 23, weight: 6 },	// slowdown variant 3
			{ index: 24, weight: 5 },	// slowdown variant 4
			{ index: 25, weight: 4 },	// slowdown variant 5
			{ index: 26, weight: 3 },	// slowdown variant 6
			{ index: 27, weight: 2 },	// slowdown variant 7
			{ index: 28, weight: 1 }	// slowdown variant 8
		];

		let obstacleTileWeight = [
			{ index: -1, weight: 1200 }, // transparent
			{ index: 15, weight: 4 },	// obstacle variation 1
			{ index: 16, weight: 3 },	// obstacle variation 2
			{ index: 17, weight: 2 },	// obstacle variation 3
			{ index: 18, weight: 2 },	// obstacle variation 4
			{ index: 19, weight: 1 },	// obstacle variation 5
			{ index: 20, weight: 1 }	// obstacle variation 6
		];

		let trapTileWeight = [
			{ index: -1, weight: 1200 }, // transparent
			{ index: 28, weight: 3 },	// trap variation 1
			{ index: 29, weight: 2 },	// trap variation 2
			{ index: 30, weight: 2 },	// trap variation 3
			{ index: 31, weight: 2 }	// trap variation 4
		];

		let wallWeight = [
			{ index: 10, weight: 2 },	// wall variation 1
			{ index: 11, weight: 2 },	// wall variation 2
			{ index: 12, weight: 2 },	// wall variation 3
			{ index: 13, weight: 2 }	// wall variation 4
		];

		this.arena = this.make.tilemap({
			tileWidth: this.tileConfig.size,
			tileHeight: this.tileConfig.size,
			width: this.tileConfig.x,
			height: this.tileConfig.y
		});

		let tileset = this.arena.addTilesetImage("tiles", null, 32, 32);

		this.arenaGroundLayer = this.arena.createBlankLayer(0, tileset);
		this.arenaObjectLayer = this.arena.createBlankLayer(1, tileset);
		this.arenaTrapLayer = this.arena.createBlankLayer(2, tileset)

		/** Place tiles */
		this.arenaObjectLayer.weightedRandomize(wallWeight, 0, 0, this.arena.width, this.tileConfig.spawnSize); // top wall
		this.arenaObjectLayer.weightedRandomize(wallWeight, 0, (this.arena.height - this.tileConfig.spawnSize), this.arena.width, this.tileConfig.spawnSize); // bottom wall
		this.arenaObjectLayer.weightedRandomize(wallWeight, 0, 0, this.tileConfig.spawnSize, this.arena.height); // left wall
		this.arenaObjectLayer.weightedRandomize(wallWeight, (this.arena.width - this.tileConfig.spawnSize), 0, this.tileConfig.spawnSize, this.arena.height); // right wall
		this.arenaObjectLayer.weightedRandomize(obstacleTileWeight, (this.tileConfig.spawnSize + this.tileConfig.graceArea), (this.tileConfig.spawnSize + this.tileConfig.graceArea), (this.arena.width - ((this.tileConfig.spawnSize * 2) + (this.tileConfig.graceArea * 2))), (this.arena.height - ((this.tileConfig.spawnSize * 2) + (this.tileConfig.graceArea * 2))));
		this.arenaTrapLayer.weightedRandomize(trapTileWeight, (this.tileConfig.spawnSize + this.tileConfig.graceArea), (this.tileConfig.spawnSize + this.tileConfig.graceArea), (this.arena.width - ((this.tileConfig.spawnSize * 2) + (this.tileConfig.graceArea * 2))), (this.arena.height - ((this.tileConfig.spawnSize * 2) + (this.tileConfig.graceArea * 2))));
		this.arenaGroundLayer.weightedRandomize(neutralSlowTileWeight, this.tileConfig.spawnSize, this.tileConfig.spawnSize, (this.arena.width - (this.tileConfig.spawnSize * 2)), (this.arena.height - (this.tileConfig.spawnSize * 2)));

		/** Gates */
		// TODO: Gates
		// this.arenaObjectLayer.putTilesAt([
		// 	{}
		// ]);

		/** Spawning Area */
		// TODO: Spawning Area
		// this.arenaGroundLayer.putTilesAt([
		// 	{}
		// ])

		/** Add collision */
		this.arena.setCollision([10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20], true, true, this.arenaObjectLayer, true);
		this.arenaObjectLayer.setDepth(3);
		this.arenaTrapLayer.setDepth(2);
		this.arenaGroundLayer.setDepth(1);
		this.arenaGroundLayer.setAlpha(0.5); // Debug alpha
		
		/** Debug Arena */
		// this.arena.renderDebug(this.add.graphics(), {
		// 	tileColor: null
		// });
	}

	/** Used to add objects to the scene */
	create(data) {

		this.zoom = 1;
		this.scale = 1 / this.zoom;
		this.physics.world.setBounds(0, 0, this.tileConfig.size * this.tileConfig.x, this.tileConfig.size * this.tileConfig.y);

		/** Grid */
		this.grid = this.add.grid(0, 0, this.tileConfig.size * this.tileConfig.x, this.tileConfig.size * this.tileConfig.y, this.tileConfig.size, this.tileConfig.size, undefined, undefined, 0xffffff, 0.25);
		this.grid.setOrigin(0);
		this.grid.setDepth(1);

		/** Player */
		this.player = new Player(this, this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "player");
		this.player.setOrigin(0.5);
		this.player.setDepth(3);

		/** Arena */
		this.drawArena();

		/** Enemy Generator */
		let enemiesToGenerate = 15;

		this.enemies = [];

		let centerX = this.physics.world.bounds.width / 2; // center point X
		let centerY = this.physics.world.bounds.height / 2; // center point Y
		let offsetX = (window.Game.windowWidth / 2) * this.scale; // distance to offcamera from center X
		let offsetY = (window.Game.windowHeight / 2) * this.scale; // distance to offcamera from center Y

		// for(let i = 0; i < enemiesToGenerate; i++){

		// 	let randX = centerX + ((offsetX + Math.ceil(Math.random() * 1000)) * (Math.round(Math.random()) ? 1 : -1));
		// 	let randY = centerY + ((offsetY + Math.ceil(Math.random() * 1000)) * (Math.round(Math.random()) ? 1 : -1));
		// 	let enemyName = `Enemy${i}`;

		// 	this.enemies[i] = new Enemy(this, randX, randY, enemyName);
		// 	this.enemies[i].setDepth(2);
		// }

		/**
		 * Collision
		 */
		/** Player vs. Tilemap */
		this.physics.add.collider(this.player, this.arenaObjectLayer, (player, tile) => {

			if(this.player.body.blocked.left){
				this.player.onCollide(tile, "left");
			} else if(this.player.body.blocked.right){
				this.player.onCollide(tile, "right");
			} else if(this.player.body.blocked.up){
				this.player.onCollide(tile, "up");
			} else if(this.player.body.blocked.down){
				this.player.onCollide(tile, "down");
			}
			
		}, null, this);

		/** Player vs. Traps */
		this.physics.add.overlap(this.player, this.arenaTrapLayer, (player, tile) => {
			this.player.onOverlap(tile);
		}, null, this);

		/** Enemies vs. Tilemap */
		this.physics.add.collider(this.enemies, this.arenaObjectLayer, (enemy, tile) => {
			
		}, null, this);

		/** Player vs. Enemies */
		this.physics.add.collider(this.player, this.enemies, (player, enemy) => {
			this.player.onCollide(enemy);
		});

		// this.displayClock.setScrollFactor(0);

		/** Camera - follow player */
		this.cameras.main.zoom = this.zoom;
		this.cameras.main.startFollow(this.player);
		this.cameras.main.roundPixels = true;
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		/** Update our player */
		this.player.update();
	}

	render() {

		console.log("render");

		/** Debug */
		
		// this.game.debug.cameraInfo(this.game.cameras.main, 32, 32);
	}
}