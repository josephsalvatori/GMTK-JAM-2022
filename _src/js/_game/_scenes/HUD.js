import Phaser from "phaser";

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
		this.victoryScreenVisible = false;
		level.events.on("updateHUD", (data) => {
			/** Game ends for HUD */
			if(data.complete && data.complete === true) {
				this.runClock = false;
				if(!this.victoryScreenVisible) this.runVictory();
			}

		}, this);

		/** CLock object */
		let clockDimensions = { w: 200, h: 80 };

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

	runVictory() {
		this.victoryScreenVisible = true;
		


		let upgrades = [
			{
				name: "Upgrade Damage",
				playerPropery: "damage",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			},
			{
				name: "Upgrade Velocity",
				playerPropery: "velocity",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			},
			{
				name: "Upgrade Dash Speed",
				playerPropery: "dashVelocity",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			},
			{
				name: "Upgrade Mass",
				playerPropery: "mass",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			},
			{
				name: "Upgrade Dash Duration",
				playerProperty: "dashDuration",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			},
			{
				name: "Upgrade Crit",
				playerProperty: "baseCrit",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			}
		];

		upgrades = upgrades.sort(() => 0.5 - Math.random());
		
		let victoryDialog = this.add.dom(window.Game.windowWidth / 2, window.Game.windowHeight / 2).createFromHTML(`
		<div style="width: 300px; height: 300px; background: lime;">
			<h2>Boxes Destroyed</h2>
			<h4>Choose upgrade</h4>
			<button name="con1">${upgrades[0].name}</button>
			<button name="con2">${upgrades[1].name}</button>
			<button name="con3">${upgrades[2].name}</button>
		</div>
	`).setOrigin(0.5, 0);

		let condition1 = victoryDialog.getChildByName("con1");
		condition1.addEventListener("click", function(event){
			this.events.emit("rewardSelected", upgrades[0]);
		});
		let condition2 = victoryDialog.getChildByName("con2");
		condition2.addEventListener("click", function(event){
			this.events.emit("rewardSelected", upgrades[1]);
		});
		let condition3 = victoryDialog.getChildByName("con2");
		condition3.addEventListener("click", function(event){
			this.events.emit("rewardSelected", upgrades[2]);
			
		});

	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		/** Update our game clock display */
		if(this.runClock === true) this.updateGameClock(time);

	}
}