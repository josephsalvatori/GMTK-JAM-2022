import Phaser from "phaser";

export default class Player extends Phaser.Physics.Matter.Sprite {

	/**
	 * @constructor
	 * @param {Phaser.World} world The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} x The horizontal position of this Game Object in the world.
	 * @param {number} y The vertical position of this Game Object in the world.
	 * @param {string|Phaser.Textures.Texture} texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
	 * @param {string|number} [frame] An optional frame from the Texture this Game Object is rendering with.
	 */
	constructor(world, x = 0, y = 0, texture = "noname", frame = undefined) {

		super(world, x, y, frame, texture);

		this.name = "Player";
		this.label = "Player";
		this.activePlaying = false;

		this.scene.add.existing(this);

		this.setTexture(texture);

		this.path = null;
		this.config = {
			baseDamage: window.Game.data.player.damage,
			damage: window.Game.data.player.damage,
			baseVelocity: window.Game.data.player.velocity,
			velocity: window.Game.data.player.velocity,
			dashVelocity: window.Game.data.player.dash,
			baseMass: window.Game.data.player.mass,
			mass: window.Game.data.player.mass,
			baseDashDuration: window.Game.data.player.dashLength,
			dashDuration: window.Game.data.player.dashLength,
			baseCrit: window.Game.data.player.critMult,
			isDashing: false,
			isColliding: false,
			dashPos: {
				x: this.x,
				y: this.y
			}
		};

		console.log(this.config);

		/**
		 * Controls
		 */
		this.controls = {
			W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
			D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
			Space: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
		};

		/**
		 * Physics
		 */
		this.setSize(32, 32);
		this.setFixedRotation();
		this.body.onCollide = true;

		/**
		 * Color
		 */
		// this.tint = Math.random() * 0xffffff;

		/**
		 * Abilities
		 */
	}

	update() {

		let playerData = this.scene.registry.get("player");
		const dashBtnPressed = Phaser.Input.Keyboard.JustDown(this.controls.Space);

		/** Stand still */
		this.setVelocity(0);
		

		/** Base Velocity */
		let m = 1; // this is scene: currentTile movement multiplier

		/**
		 * Spacebar - Dash
		 * 	- Increase velocity for X duration
		 * 	- Cannot take damage during dash
		 */
		if(dashBtnPressed && this.config.isDashing === false){

			this.scene.audio.player_dash.play();
			
			this.config.isDashing = true;
			this.config.isColliding = false;
			this.config.dashPos = { x: this.x, y: this.y };

			// this.setDrag(1000);
			this.config.velocity = this.config.dashVelocity;

			// this.setMass(this.config.mass * 3);

			this.body.mass = (this.config.mass * 3);
			this.body.inverseMass = (1 / this.body.mass);

			this.scene.time.clearPendingEvents();

			/** Unlock dash */
			this.scene.time.addEvent({
				delay: this.config.dashDuration / 1.15,
				callback: () => {
					this.config.isDashing = false;
					
					this.body.mass = 1;
					this.body.inverseMass = 1;
				}
			});

			/** Stop drag, reset velocity */
			this.scene.time.addEvent({
				delay: this.config.dashDuration,
				callback: () => {
					this.config.velocity = this.config.baseVelocity;
				}
			});
		}

		let v = this.config.velocity * m; // base velocity to multiply with player speed
		let btnsDown = 0;
		let vel = { x: 0, y: 0 };

		/** Up */
		if(this.controls.W?.isDown) {
			btnsDown++;
			vel.y = (v * playerData.speed) * -1;
			this.setVelocityY(vel.y);
			this.isPlaying = true;
		}

		/** Left */
		if(this.controls.A?.isDown) {
			btnsDown++;
			vel.x = (v * playerData.speed) * -1;
			this.setVelocityX(vel.x);
			this.isPlaying = true;
		}

		/** Down */
		if(this.controls.S?.isDown){
			btnsDown++;
			vel.y = (v * playerData.speed);
			this.setVelocityY(vel.y);
			this.isPlaying = true;
		}

		/** Right */
		if(this.controls.D?.isDown) {
			btnsDown++;
			vel.x = (v * playerData.speed);
			this.setVelocityX(vel.x);
			this.isPlaying = true;
		}

		/** Correct Diagonal */
		if(btnsDown > 1){
			
			this.setVelocity(vel.x * 0.75, vel.y * 0.75);
		}

		/** Reset to single path controls - needed for rotation */
		if(this.controls.S?.isDown && this.controls.D?.isDown) { // DOWN / RIGHT
			this.facingDir = ["up", "right"];
			this.setRotation(Phaser.Math.DegToRad(135));
		} else if(this.controls.W?.isDown && this.controls.D?.isDown) { // UP / RIGHT
			this.facingDir = ["up", "right"];
			this.setRotation(Phaser.Math.DegToRad(45));
		} else if(this.controls.S?.isDown && this.controls.A?.isDown) { // DOWN / LEFT
			this.facingDir = ["down", "left"];
			this.setRotation(Phaser.Math.DegToRad(225));
		} else if(this.controls.W?.isDown && this.controls.A?.isDown) { // UP / LEFT
			this.facingDir = ["up", "left"];
			this.setRotation(Phaser.Math.DegToRad(315));
		} else if(this.controls.D?.isDown) { // Right
			this.facingDir = ["", "right"];
			this.setRotation(Phaser.Math.DegToRad(90));
		} else if(this.controls.S?.isDown) { // Down
			this.facingDir = ["down", ""];
			this.setRotation(Phaser.Math.DegToRad(180));
		} else if(this.controls.W?.isDown) { // Up
			this.facingDir = ["up", ""];
			this.setRotation(0);
		} else if(this.controls.A?.isDown) { // Left
			this.facingDir = ["", "left"];
			this.setRotation(Phaser.Math.DegToRad(270));
		}

		if(this.isPlaying === false && this.activePlaying === false) {
			this.activePlaying = true;
			this.anims.play("player_walk");
		} else {
			this.activePlaying = false;
			this.isPlaying = false;
			this.anims.pause();
		}
	}

	// checkFlip() {

	// 	if(this.body.velocity.x < 0) {
	// 		this.scaleX = -1;
	// 	} else {
	// 		this.scaleX = 1;
	// 	}
	// }

	/**
	 * COLLISIONS
	 * @param {Object} target object colliding with
	 * @param {String} hitDirection direction of collision
	 */
	onCollide(target, hitDirection) {

		/** Collision during a Dash */
		if(this.config.isColliding === false && this.config.isDashing === true){

			this.config.isColliding = true; // Resets upon dash

			let damage = Math.ceil((this.config.damage * (this.config.velocity * this.body.mass)) * ((Math.random() * 0.2) + 1.1));
			let critical = (window.Game.diceRoll(20) > 18) ? this.config.baseCrit : 1;
			
			target.gameObject.damage(damage * critical);

		} else {
			// console.log("YOU'RE HIT", target, hitDirection, this.facingDir);
		}
	}

	/**
	 * OVERLAPS
	 * @param {Object} target object overlap with
	 */
	onOverlap(target) {

		if(target.index === -1) return; // no tile

		// console.log("OVERLAPPING A TRAP", target);
	}
}