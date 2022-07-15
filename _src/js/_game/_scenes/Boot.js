import Phaser from "phaser";
import PlayerData from "Game/_data/Player";

const SCENE_KEY = "Boot";

export default class Boot extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

	}

	/** Used to prepare data */
	init() {

		window.Data = window.Data || {};
		window.Data.player = new PlayerData(this.registry);

		/** Establish data manager objects */
		
	}

	/** Used for preloading assets (image, audio) into the scene */
	preload() {

	}

	/** Used to add objects to the scene */
	create(data) {
		this.scene.start("Menu");
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

	}
}