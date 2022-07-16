import Phaser from "phaser";
import Geometry from "Game/_sprites/Geometry";

const SCENE_KEY = "HUD";

export default class HUD extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

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

		level.events.on("updateHUD", () => {

		}, this);

		/** CLock object */
		let clockDimensions = { w: 200, h: 80 };

		this.displayClock = new Geometry(this, (this.physics.world.bounds.width / 2) - (clockDimensions.w / 2), 0, {
			width: clockDimensions.w,
			height: clockDimensions.h
		});

		this.clock = this.add.text(500, 0, "", { font: "50px Crimson-Text", fill: "#FFFFFF" });
	}

	updateGameClock(time) {

		let seconds = Math.round((time / 1000) * 100) / 100;
		let minutes = Math.floor(seconds / 60);
		let display = `${(minutes > 0 ? minutes + ":" : "")}${seconds}`;

		
		this.clock.setText(display);
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		/** Update our game clock display */
		this.updateGameClock(time);

	}
}