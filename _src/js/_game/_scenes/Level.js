import Phaser from "phaser";
import Player from "../_sprites/Player";

const SCENE_KEY = "Level";

export default class Level extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

		/**
		 * Tile settings
		 */
		this.tileSize = 64;
		this.tilesX = 1000;
		this.tilesY = 2000;
	}

	/** Used to prepare data */
	init() {
		console.log("getData", this.registry.get("player"));
	}

	/** Used for preloading assets (image, audio) into the scene */
	preload() {

	}

	/** Used to add objects to the scene */
	create(data) {

		this.physics.world.setBounds(0, 0, this.tileSize * this.tilesX, this.tileSize * this.tilesY);

		/** Grid */
		this.grid = this.add.grid(0, 0, this.tileSize * this.tilesX, this.tileSize * this.tilesY, this.tileSize, this.tileSize, undefined, undefined, 0xffffff, 0.25);
		this.grid.setOrigin(0);
		this.grid.setDepth(1);

		/** Player */
		this.player = new Player(this, this.physics.world.bounds.width / 2, this.physics.world.bounds.height / 2, "Player");
		this.player.setOrigin(0.5);
		this.player.setDepth(2);

		/** Camera - follow player */
		this.cameras.main.zoom = 0.5;
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