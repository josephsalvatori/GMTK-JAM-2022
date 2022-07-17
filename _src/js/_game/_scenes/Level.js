import Phaser from "phaser";
import Enemy from "../_sprites/Enemy";
import Player from "../_sprites/Player";
import * as EasyStar from "easystarjs";

const SCENE_KEY = "Level";

export default class Level extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

		/**
		 * Tile settings
		 */
		this.tileConfig = {
			size: 32,
			x: 68,
			y: 92
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
	}

	/** Used for preloading assets (image, audio) into the scene */
	preload() {

		/** Random tileset */
		let tilesets = [
			"/assets/imgs/tileset_2.png",
			"/assets/imgs/tileset_3.png",
			"/assets/imgs/tileset_stone_water_sand_lava.png",
		];

		let tilesetIndex = Math.floor(Math.random() * tilesets.length);

		this.load.image("tiles", tilesets[tilesetIndex]);
		this.load.spritesheet("player", "/assets/imgs/wolf.png", {
			frameWidth: 32,
			frameHeight: 32
		});
		this.load.spritesheet("enemy", "/assets/imgs/demon.png", {
			frameWidth: 32,
			frameHeight: 32
		});

		/** Audio in scene */
		this.load.audio("object_collision", "/assets/audio/object_collision.wav");
		this.load.audio("enemy_collision", "/assets/audio/enemy_collision.wav");
		this.load.audio("player_dash", "/assets/audio/player_dash.wav");
		this.load.audio("crowd_base", "/assets/audio/crowd_base.mp3");
		this.load.audio("crowd_deathswell", "/assets/audio/crowd_deathswell.mp3");
		this.load.audio("loop_base", "/assets/audio/loop_scifi.mp3");
	}

	drawArena() {

		this.level = [];
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
			{ index: 31, weight: 2 },	// trap variation 4
			{ index: 21, weight: 18 },	// slowdown variant 1
			{ index: 22, weight: 14 },	// slowdown variant 2
			{ index: 23, weight: 10 },	// slowdown variant 3
			{ index: 24, weight: 8 },	// slowdown variant 4
			{ index: 25, weight: 6 },	// slowdown variant 5
			{ index: 26, weight: 4 },	// slowdown variant 6
			{ index: 27, weight: 4 },	// slowdown variant 7
			{ index: 28, weight: 3 }	// slowdown variant 8
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
		this.arenaGroundLayer.alpha = 0.8;
		this.arenaTrapLayer.alpha = 0.8;

		// this.arenaTileMap = this.arenaObjectLayer.layer.data.map(array => {

		// 	let arr = array.map(obj => { return (!obj.index ? "0" : obj.index); });
			
		// 	return arr;
		// });
		
		/** Debug Arena */
		// this.arena.renderDebug(this.add.graphics(), {
		// 	tileColor: null
		// });
	}

	/** Used to add objects to the scene */
	create(data) {
		
		// this.scene.pause();
		this.victory = false;
		this.scene.launch("HUD");
		this.sound.pauseOnBlur = false;

		/** Create some audio */
		this.audio = {};
		this.audio.collide_object = this.sound.add("object_collision");
		this.audio.collide_enemy = this.sound.add("enemy_collision");
		this.audio.player_dash = this.sound.add("player_dash", {
			volume: 0.9
		});
		this.audio.crowd_base = this.sound.add("crowd_base", {
			volume: 0
		});
		this.audio.crowd_base.play({
			loop: true
		});
		this.audio.crowd_deathswell = this.sound.add("crowd_deathswell");
		this.audio.loop_base = this.sound.add("loop_base", {
			volume: 0
		});
		this.audio.loop_base.play({
			loop: true
		});

		/** Fade in our audios */
		this.tweens.add({
			targets: [
				this.audio.crowd_base
			],
			delay: 3000,
			volume: { from: 0, to: 0.95 },
			duration: 3000
		});
		this.tweens.add({
			targets: [
				this.audio.loop_base
			],
			delay: 3000,
			volume: { from: 0, to: 0.25 },
			duration: 3000
		});

		

		/** Animations */
		this.anims.create({
			key: "enemy_walk",
			frames: this.anims.generateFrameNumbers("enemy", { start: 16, end: 23 }),
			frameRate: 8,
			repeat: -1
		});
		this.anims.create({
			key: "enemy_dead",
			frames: this.anims.generateFrameNumbers("enemy", { start: 32, end: 39 }),
			frameRate: 8
		});
		this.anims.create({
			key: "player_walk",
			frames: this.anims.generateFrameNumbers("player", { end: 15 }),
			frameRate: 8,
			repeat: -1
		});

		this.zoom = 1.2;
		// this.scale = 1 / this.zoom;
		this.waveCount  = 0;
		this.maxWaves   = 3;
		this.enemyCount = 0;
		this.deathCount = 0;

		this.worldWidth = this.tileConfig.size * this.tileConfig.x;
		this.worldHeight = this.tileConfig.size * this.tileConfig.y;

		this.matter.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

		/** Grid
		this.grid = this.add.grid(0, 0, this.tileConfig.size * this.tileConfig.x, this.tileConfig.size * this.tileConfig.y, this.tileConfig.size, this.tileConfig.size, undefined, undefined, 0xffffff, 0.25);
		this.grid.setOrigin(0);
		this.grid.setDepth(1); */

		/** Arena */
		this.drawArena();

		/** Player */
		this.player = new Player(this.matter.world, this.worldWidth / 2, this.worldHeight / 2, "player");
		this.player.setOrigin(0.5);
		this.player.setDepth(3);

		/** Enemy Group Generation */
		this.enemies = [];
		this.enemyGroup = this.add.group(this.enemies);

		this.spawnEnemies(15);

		/**
		 * Collision
		 * 	- audio manager
		 */
		this.objectCollidePlaying = false;
		this.enemyCollidePlayer = [];

		this.matter.world.on("collisionstart", (event, obj1, obj2) => {

			if(!obj1.gameObject) return;
			if(!obj2.gameObject) return;

			/** Enemy */
			if(obj1.gameObject.label == "Player" && obj2.gameObject.label == "Enemy") {
				
				if(this.enemyCollidePlayer[obj2.gameObject.name] === true) return;

				this.enemyCollidePlayer[obj2.gameObject.name] = true;

				setTimeout(() => this.enemyCollidePlayer[obj2.gameObject.name] = false, 1000);

				this.audio.collide_enemy.play();
			}

			/** Pillar / Wall */
			if(obj1.gameObject.label == "Player" && obj2.gameObject.label != "Enemy") {

				if(this.objectCollidePlaying === true) return;

				this.objectCollidePlaying = true;

				setTimeout(() => this.objectCollidePlaying = false, 1000);

				if(this.player.config.isDashing) this.audio.collide_object.play();
			}
		});

		/** Player vs. Traps */
		// this.matter.overlap(this.player, this.arenaTrapLayer, (player, tile) => {
		// 	this.player.onOverlap(tile);
		// }, null, this);

		/** Player vs. Enemies */
		// this.matter.(this.player, this.enemyGroup, (player, enemy) => {
		// 	this.player.onCollide(enemy);
		// });

		/** Enemies vs. Enemies */
		// this.matter.collider(this.enemyGroup, this.enemyGroup, (enemy1, enemy2) => {
		// 	// this.player.onCollide(enemy);
		// });

		/** Player vs. Tilemap */
		// this.matter.collider(this.player, this.arenaObjectLayer, (player, tile) => {

		// 	if(this.player.body.blocked.left){
		// 		this.player.onCollide(tile, "left");
		// 	} else if(this.player.body.blocked.right){
		// 		this.player.onCollide(tile, "right");
		// 	} else if(this.player.body.blocked.up){
		// 		this.player.onCollide(tile, "up");
		// 	} else if(this.player.body.blocked.down){
		// 		this.player.onCollide(tile, "down");
		// 	}
			
		// }, null, this);

		/** Enemies vs. Tilemap */
		// this.matter.collider(this.enemyGroup, this.arenaObjectLayer, (enemy, tile) => {
			
		// }, null, this);

		this.matter.world.convertTilemapLayer(this.arenaObjectLayer);

		/** Camera - follow player */
		this.cameras.main.zoom = this.zoom;
		this.cameras.main.startFollow(this.player);
		this.cameras.main.roundPixels = true;

		/** Event Test */
		this.events.emit("updateHUD", {
			create: true
		});
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		this.checkVictory();

		/** Update our player */
		this.player.update();

		this.enemyGroup.getChildren().forEach((enemy)=>{
			enemy.update();
		});
	}

	/**
	 * Enemy Spawner (randomized)
	 * @param {number} enemiesToGenerate 
	 */
	spawnEnemies(enemiesToGenerate) {

		// TODO: Fix out of bound spawning
		let spawnSeconds = 25 - (window.Game.data.player.gamesWon);

		// min spawn
		if(spawnSeconds < 10) spawnSeconds = 10;
		// let spawnSeconds = 3;
		
		let centerX = this.player.x; // center point X
		let centerY = this.player.y; // center point Y
		let buffer = (this.tileConfig.size * 6);
		let x1Max = this.player.x - buffer; // left distance from player we can spawn
		let x2Max = ((this.tileConfig.size * this.tileConfig.x) - buffer) - this.player.x;  // right distance from player we can spawn
		let y1Max = this.player.y - buffer; // top distance from player we can spawn
		let y2Max = ((this.tileConfig.size * this.tileConfig.y) - buffer) - this.player.y;  // botton distance from player we can spawn
		
		let minDistance = 150;
		let thisGroup = [];

		let maxEnemies = enemiesToGenerate + this.enemies.length + ((window.Game.data.player.gamesWon + this.waveCount) * 2);
		// let maxEnemies = 2;

		for(let i = this.enemies.length; i < maxEnemies; i++){

			let offsetX = (x1Max < minDistance || window.Game.diceRoll(2) === 2 && x2Max > minDistance) ? x2Max : x1Max;
			let offsetY = (y1Max < minDistance || window.Game.diceRoll(2) === 2 && y2Max > minDistance) ? y2Max : y1Max;

			let disBetX = (centerX - (offsetX + minDistance));
			let disBetY = (centerY - (offsetX + minDistance));

			let randX = centerX + ((offsetX - window.Game.diceRoll(offsetX, minDistance)) * (disBetX > 0 ? -1 : 1));
			let randY = centerY + ((offsetY - window.Game.diceRoll(offsetY, minDistance)) * (disBetY > 0 ? -1 : 1));

			let enemyName = `Enemy${i}`;

			this.enemies[i] = new Enemy(this.matter.world, randX, randY, "enemy", enemyName);
			this.enemies[i].setDepth(3);

			thisGroup.push(this.enemies[i]);

			this.enemyGroup.add(this.enemies[i]);
		}

		let thisGroupCount = thisGroup.length;

		this.enemyCount = this.enemyCount + thisGroupCount;

		this.player.setOnCollideWith(thisGroup, (target, collisionDetails) => {

			this.player.onCollide(target);

			let playerRotation = this.player.rotation * (180 / Math.PI);
			let playerPostion = {x: this.player.x, y: this.player.y};
			let enemyPosition = target.position;
			let enemyRotation = target.gameObject._rotation * (180 / Math.PI);
		});

		this.waveCount++;

		/** Start countdown to next wave */
		if(this.waveCount < this.maxWaves) {

			this.time.addEvent({
				delay: spawnSeconds * 1000,
				callback: () => {
					this.spawnEnemies(thisGroupCount + window.Game.diceRoll());
				}
			});
		}
	}

	/** See if the user has "won" */
	checkVictory() {

		// check if any enemies are alive
		if(this.deathCount < this.enemyCount || this.waveCount < this.maxWaves || this.victory === true) return;

		this.victory = true;

		window.Game.data.player.gamesPlayed++;
		window.Game.data.player.gamesWon++;

		// console.log(this.tweens);
		// fade out audio
		// this.tweens.add({
		// 	targets: [
		// 		this.audio.crowd_base,
		// 		this.audio.loop_base
		// 	],
		// 	volume: { to: 0 },
		// 	duration: 1500,
		// 	onComplete: () => {
		// 		// this.audio.crowd_base.stop();
		// 		// this.audio.loop_base.stop();
		// 		this.scene.pause();
		// 	}
		// });

		console.log("win");

		this.scene.pause();

		// TODO: Results Screen with random choices
		this.events.emit("updateHUD", {
			complete: true
		});

		// this.scene.start("Level")
	}
}