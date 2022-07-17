import Phaser from "phaser";
import Geometry from "Game/_sprites/Geometry";

const SCENE_KEY = "HUD";

export default class HUD extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

		this.runClock = true;
	}

	/** Used to prepare data */
	init() {

	}

	/** Used for preloading assets (image, audio) into the scene */
	preload() {

	}

	/** Used to add objects to the scene */
	create(data) {

		let level = this.scene.get("Level");

		level.events.on("updateHUD", (data) => {
			console.log("updateHUD", data);
			/** Game ends for HUD */
			if(data.complete && data.complete === true) {
				this.runClock = false;
			}

		}, this);

		/** CLock object */
		let clockDimensions = { w: 200, h: 80 };

		console.log(this.matter.world.width);

		this.clock = this.add.text((window.Game.windowWidth / 2), 10, "", { font: "50px Crimson-Text", fill: "#FFFFFF", align: "left", fixedWidth: 200 }).setOrigin(0.5, 0);
		this.clock.setStroke("#000000", 6);
	}

	updateGameClock(time) {

		let fullSeconds = Math.round((time / 1000) * 100) / 100;
		let minutes = Math.floor(fullSeconds / 60);
		let seconds = fullSeconds - (minutes * 60);
		let display = `${(minutes > 0 ? minutes + ":" : "   ")}${(seconds < 10) ? "0" + seconds.toFixed(2) : seconds.toFixed(2)}`;

		this.clock.setText(display);
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		/** Update our game clock display */
		if(this.runClock === true) this.updateGameClock(time);

	}
}