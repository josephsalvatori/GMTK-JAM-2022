import { toHash } from "ajv/dist/compile/util";
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

		this.path = null;
		this.config = {
			baseVelocity: 100,
			velocity: 100,
			baseDash: 300,
			dash: 300,
			baseDashDuration: 180,
			dashDuration: 180,
			isDashing: false,
			isColliding: false
		};

		/**
		 * Locked Config, important to not edit
		 */
		this.setMaxVelocity(1900);

		/**
		 * Controls
		 */
		this.controls = {
			W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
			Space: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		};

		/**
		 * Physics
		 */
		this.body.setCollideWorldBounds(true);
		this.body.setSize(32, 32);
		this.body.onCollide = true;
		this.body.allowDrag = true;

		/**
		 * Color
		 */
		this.tint = Math.random() * 0xffffff;

		/**
		 * Abilities
		 */
	}

	update() {

		let playerData = this.scene.registry.get("player");
		const dashBtnPressed = Phaser.Input.Keyboard.JustDown(this.controls.Space);

		/** Stand still */
		this.body.setVelocity(0);

		/** Base Velocity */
		let m = 1; // this is scene: currentTile movement multiplier

		/**
		 * Spacebar - Dash
		 * 	- Increase velocity for X duration
		 * 	- Cannot take damage during dash
		 */
		if(dashBtnPressed && this.config.isDashing === false){
			
			this.config.isDashing = true;
			this.config.isColliding = false;

			// this.setDrag(1000);
			this.config.velocity = this.config.dash;

			this.scene.time.clearPendingEvents();

			/** Unlock dash */
			this.scene.time.addEvent({
				delay: this.config.dashDuration / 1.15,
				callback: () => {
					this.config.isDashing = false;
				}
			});

			/** Stop drag, reset velocity */
			this.scene.time.addEvent({
				delay: this.config.dashDuration,
				callback: () => {
					this.config.velocity = this.config.baseVelocity;
					this.setDrag(0);
				}
			});
		}

		let v = this.config.velocity * m; // base velocity to multiply with player speed

		/** Up */
		if(this.controls.W?.isDown) {
			this.setVelocityY((v * playerData.speed) * -1);
		}

		/** Left */
		if(this.controls.A?.isDown) {
			this.setVelocityX((v * playerData.speed) * -1);
			this.checkFlip();
			this.body.setOffset(32, 0);
		}

		/** Down */
		if(this.controls.S?.isDown){
			this.setVelocityY((v * playerData.speed));
		}

		/** Right */
		if(this.controls.D?.isDown) {
			this.setVelocityX((v * playerData.speed));
			this.checkFlip();
			this.body.setOffset(0, 0);
			this.body.setR
		}

		/** Reset to single path controls - needed for rotation */
		if(this.controls.W?.isDown && this.controls.A?.isDown) { // UP / LEFT
			this.setRotation(315);
		} else if(this.controls.W?.isDown && this.controls.D?.isDown) { // UP / RIGHT
			this.setRotation(45);
		} else if(this.controls.S?.isDown && this.controls.A?.isDown) { // DOWN / LEFT
			this.setRotation(225);
		} else if(this.controls.S?.isDown && this.controls.D?.isDown) { // DOWN / RIGHT
			this.setRotation(135);
		} else if(this.controls.W?.isDown) { // Up
			this.setRotation(0);
		} else if(this.controls.A?.isDown) { // Left
			this.setRotation(270);
		} else if(this.controls.S?.isDown) { // Down
			this.setRotation(180);
		} else if(this.controls.D?.isDown) { // Right
			this.setRotation(90);
		}
	}

	checkFlip() {

		if(this.body.velocity.x < 0) {
			this.scaleX = -1;
		} else {
			this.scaleX = 1;
		}
	}

	/**
	 * 
	 * @param {Object} target object colliding with
	 * @param {String} dir direction of collision
	 */
	onCollide(target, dir) {

		/** Collision during a Dash */
		if(this.config.isColliding === false && this.config.isDashing === true){

			this.config.isColliding = true; // Resets upon dash

			console.log("ATTACK", target, dir);
		} else {
			console.log("YOU'RE HIT", target, dir);
		}
	}
}