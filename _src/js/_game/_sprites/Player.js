import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {

	/**
	 * @constructor
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} x The horizontal position of this Game Object in the world.
	 * @param {number} y The vertical position of this Game Object in the world.
	 * @param {string|Phaser.Textures.Texture} texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
	 * @param {string|number} [frame] An optional frame from the Texture this Game Object is rendering with.
	 */
	constructor(scene, x = 0, y = 0, texture = "noname", frame = undefined) {

		super(scene, x, y, frame, texture);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.config = {
			velocity: 100
		};

		/**
		 * Controls
		 */
		this.controls = {
			W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
		};

		/**
		 * Physics
		 */
		this.body.setCollideWorldBounds(true);
		this.body.setSize(32, 32);
		this.body.onCollide = true;

		/**
		 * Color
		 */
		this.tint = Math.random() * 0xffffff;
	}

	update() {

		let playerData = this.scene.registry.get("player");

		/** Stand still */
		this.body.setVelocity(0);

		/** Up */
		if(this.controls.W?.isDown) {

			this.body.velocity.y = (this.config.velocity * playerData.speed) * -1;
		}

		/** Left */
		if(this.controls.A?.isDown) {

			this.body.velocity.x = (this.config.velocity * playerData.speed) * -1;
			this.checkFlip();
			this.body.setOffset(32, 0);
		}

		/** Down */
		if(this.controls.S?.isDown){

			this.body.velocity.y = (this.config.velocity * playerData.speed);
		}

		/** Right */
		if(this.controls.D?.isDown) {

			this.body.velocity.x = (this.config.velocity * playerData.speed);
			this.checkFlip();
			this.body.setOffset(0, 0);
		}
	}

	checkFlip() {

		if(this.body.velocity.x < 0) {
			this.scaleX = -1;
		} else {
			this.scaleX = 1;
		}
	}

	onCollide(target) {

	}
}