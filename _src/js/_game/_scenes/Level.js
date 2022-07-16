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

		this.spawnSize = 4;
		this.tileConfig.spawnSize = 4;
		this.tileConfig.gates = {
			N: {
				x1: (this.tileConfig.x / 2) - (this.tileConfig.spawnSize / 2),
				x2: (this.tileConfig.x / 2) + (this.tileConfig.spawnSize / 2),
				y1: 0,
				y2: this.spawnSize
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
		this.load.image("tiles", "/assets/imgs/drawtiles.png");
	}

	drawArena() {

		this.level = [];

		/** Generate tilemap Rows */
		for(let i = 0; i < this.tileConfig.y; i++){

			/** Generate tilemap columns */
			for(let j = 0; j < this.tileConfig.x; j++){

				if(!this.level[i]) this.level[i] = [];

				/** Gates N & S */
				if(
					i < this.tileConfig.gates.N.y2 && j >= this.tileConfig.gates.N.x1 && j < this.tileConfig.gates.N.x2 ||
					i >= this.tileConfig.gates.S.y1 && j >= this.tileConfig.gates.S.x1 && j < this.tileConfig.gates.S.x2
				){

					this.level[i][j] = 8;

					continue;
				}

				/** Gates W1, W2, E1, E2 */
				if(
					j < this.tileConfig.gates.W1.x2 && i >= this.tileConfig.gates.W1.y1 && i < this.tileConfig.gates.W1.y2 ||
					j < this.tileConfig.gates.W2.x2 && i >= this.tileConfig.gates.W2.y1 && i < this.tileConfig.gates.W2.y2 ||
					j >= this.tileConfig.gates.E1.x1 && i >= this.tileConfig.gates.E1.y1 && i < this.tileConfig.gates.E1.y2 ||
					j >= this.tileConfig.gates.E2.x1 && i >= this.tileConfig.gates.E2.y1 && i < this.tileConfig.gates.E2.y2
				){

					this.level[i][j] = 8;

					continue;
				}

				/** Set outside walls */
				if(i < this.tileConfig.spawnSize || i >= (this.tileConfig.y - this.tileConfig.spawnSize) || j < this.tileConfig.spawnSize || j >= (this.tileConfig.x - this.tileConfig.spawnSize)){

					this.level[i][j] = 6;

					continue;
				}

				this.level[i][j] = 0;
			}
		}

		this.arena = this.make.tilemap({
			data: this.level,
			tileWidth: this.tileConfig.size,
			tileHeight: this.tileConfig.size
		});

		let tileset = this.arena.addTilesetImage("tiles", null, 32, 32);

		this.arenaLayer = this.arena.createLayer(0, tileset, 0, 0);
		this.arena.setCollision([6], true);
		this.arenaLayer.setDepth(2);

		/** Debug Arena */
		this.arenaLayer.renderDebug(this.add.graphics(), {
			tileColor: null,

		});
	}

	/** Used to add objects to the scene */
	create(data) {

		this.zoom = 1;
		this.scale = 1 / this.zoom;
		this.physics.world.setBounds(0, 0, this.tileConfig.size * this.tileConfig.x, this.tileConfig.size * this.tileConfig.y);
		this.physics.world.veloc

		/** Grid */
		this.grid = this.add.grid(0, 0, this.tileConfig.size * this.tileConfig.x, this.tileConfig.size * this.tileConfig.y, this.tileConfig.size, this.tileConfig.size, undefined, undefined, 0xffffff, 0.25);
		this.grid.setOrigin(0);
		this.grid.setDepth(1);

		/** Player */
		this.player = new Player(this, this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "Player");
		this.player.setOrigin(0.5);
		this.player.setDepth(2);

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
		this.physics.add.collider(this.player, this.arenaLayer, (player, tile)=>{

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

		/** Enemies vs. Tilemap */
		this.physics.add.collider(this.enemies, this.arenaLayer, (enemy, tile)=>{
			
		}, null, this);

		/** Player vs. Enemies */
		this.physics.add.collider(this.player, this.enemies, (player, enemy)=>{
			this.player.onCollide(enemy);
		});

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