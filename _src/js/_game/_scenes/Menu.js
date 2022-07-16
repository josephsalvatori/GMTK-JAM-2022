import Phaser from "phaser";

const SCENE_KEY = "Menu";

export default class Menu extends Phaser.Scene {

	constructor() {

		super(SCENE_KEY);

		this.buttons = [];
		this.selectedButtonIndex = 0;
	}

	/** Used to prepare data */
	init() {

		/**
		 * Base cursor keys
		 *	- up
		 *	- down
		 *	- left
		 *	- right
		 *	- shift
		 *	- space
		 */
		this.cursors = this.input.keyboard.createCursorKeys();

		/** Add other keys */
		this.input.keyboard.on("keydown", event => {

			switch (event.key) {

				case "Enter":

					this.confirmSelect();

					break;

				default:

					break;
			}
		});
	}

	/** Used for preloading assets (image, audio) into the scene */
	preload() {
		this.load.svg("cursor_arrow", "/assets/svgs/cursor_arrow.svg");
	}

	/** Used to add objects to the scene */
	create(data) {

		/** DEBUG SKIP MENU */
		this.scene.start("Level", {
			"message": "Start Level"
		});
		/** END DEBUG SKIP MENU */
		
		const { width, height } = this.scale;

		/** Play Button */
		const playBtn = this.add.rectangle(width * 0.5, height * 0.5, 150, 50, "0xb3b3b3");

		this.add.text(playBtn.x, playBtn.y, "Play").setOrigin(0.5);

		playBtn.on("selected", ()=>{
			this.scene.start("Level", {
				"message": "Start Level"
			});
		});

		/** Settings Button */
		const settingsBtn = this.add.rectangle(playBtn.x, playBtn.y + playBtn.displayHeight + 15, 150, 50, "0xb3b3b3");

		this.add.text(settingsBtn.x, settingsBtn.y, "Settings").setOrigin(0.5);

		settingsBtn.on("selected", ()=>{ console.log("settings")});

		/** Add to our button array */
		this.buttons.push(playBtn);
		this.buttons.push(settingsBtn);

		this.selector = this.add.image(0, 0, "cursor_arrow");
		this.selector.setDisplaySize(50, 50);
		this.selector.setTint(0xffffff);

		/** Select our first button */
		this.selectButton(0);

		/** Set up clear event */
		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
			playBtn.off();
			settingsBtn.off();
		});
	}

	/** Our menu selection events */
	selectButton(index) {

		const currentBtn = this.buttons[this.selectedButtonIndex];

		currentBtn.setFillStyle(0xb3b3b3);

		const btn = this.buttons[index];

		btn.setFillStyle(0x66ff7f);

		this.selector.x = btn.x - ((btn.displayWidth * 0.5) + this.selector.displayWidth);
		this.selector.y = btn.y;

		this.selectedButtonIndex = index;
	}

	selectNextButton(change) {

		let index = this.selectedButtonIndex + change;

		if(index >= this.buttons.length) {
			index = 0;
		} else if(index < 0) {
			index = this.buttons.length - 1;
		}

		this.selectButton(index);
	}

	confirmSelect() {

		const btn = this.buttons[this.selectedButtonIndex];

		btn.emit("selected");
	}

	/** Used to update the game, like a run function for the scene */
	update(time, delta) {

		const upPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up);
		const downPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down);
		const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);

		if(upPressed) this.selectNextButton(-1);
		if(downPressed) this.selectNextButton(1);
		if(spacePressed) this.confirmSelect();
	}
}