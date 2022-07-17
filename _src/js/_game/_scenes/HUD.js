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

		this.rewardCount = 0;

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
				playerProperty: "damage",
				upgradeValue: Math.floor(Math.random() * 6) + 2
			},
			{
				name: "Upgrade Speed",
				playerProperty: "speed",
				upgradeValue: (Math.random() * 0.5) + 0.1
			},
			{
				name: "Upgrade Dash Speed",
				playerProperty: "dash",
				upgradeValue: (Math.random() * 0.2) + 0.05
			},
			{
				name: "Upgrade Mass",
				playerProperty: "mass",
				upgradeValue: (Math.random() * 0.8) + 0.2
			},
			{
				name: "Upgrade Dash Duration",
				playerProperty: "dashLength",
				upgradeValue: Math.floor(Math.random() * 10) + 2
			},
			{
				name: "Upgrade Crit",
				playerProperty: "critMult",
				upgradeValue: (Math.random() * 0.2) + 0.05
			}
		];

		upgrades = upgrades.sort(() => 0.5 - Math.random());
		
		let victoryDialog = this.add.dom(window.Game.windowWidth / 2, window.Game.windowHeight / 2).createFromHTML(`
			<div style="text-align: center; width: 500px; height: 500px; margin-top: -250px; margin-left: -250px; background-color: #222222; font-size: 16px; font-family: 'Crimson-Text';">
				<h2 style="color: #FFFFFF; font-size: 32px;">Victory!</h2>
				<h4 style="color: #FFFFFF; font-size: 32px;">Select Two Upgrades</h4>
				<button style="display: block; background-color: #FFFFFF; color: #000000;" name="con1">Press "1" - ${upgrades[0].name}</button>
				<button style="display: block; background-color: #FFFFFF; color: #000000;" name="con2">Press "2" - ${upgrades[1].name}</button>
				<button style="display: block; background-color: #FFFFFF; color: #000000;" name="con3">Press "3" - ${upgrades[2].name}</button>
			</div>
		`).setOrigin(0.5, 0);

		let condition1 = victoryDialog.getChildByName("con1");
		condition1.addEventListener("click", (event)=>{
			condition1.style.opacity = 0.5;
			this.selectReward(upgrades[0]);
		});
		let condition2 = victoryDialog.getChildByName("con2");
		condition2.addEventListener("click", (event)=>{
			condition2.style.opacity = 0.5;
			this.selectReward(upgrades[1]);
		});
		let condition3 = victoryDialog.getChildByName("con3");
		condition3.addEventListener("click", (event)=>{
			condition3.style.opacity = 0.5;
			this.selectReward(upgrades[2]);
		});

		let key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE);
		let key2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO);
		let key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.THREE);

		key1.on("up", () => { 
			condition1.style.opacity = 0.5;
			this.selectReward(upgrades[0]);
		});

		key2.on("up", () => { 
			condition2.style.opacity = 0.5;
			this.selectReward(upgrades[1]);
		});

		key3.on("up", () => { 
			condition3.style.opacity = 0.5;
			this.selectReward(upgrades[2]);
		});
		
	}

	selectReward(upgrade) {

		this.rewardCount++;
		console.log(window.Game.data.player);
		window.Game.data.player[upgrade.playerProperty] += upgrade.upgradeValue;
		console.log(window.Game.data.player);
		
		if(this.rewardCount >= 2){
			
			this.scene.start("Level");
		}
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		/** Update our game clock display */
		if(this.runClock === true) this.updateGameClock(time);

	}
}