import Phaser from "phaser";

export default class Enemy extends Phaser.Physics.Matter.Sprite {
	
	/**
	 * @constructor
	 * @param {Phaser.World} world The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} x The horizontal position of this Game Object in the world.
	 * @param {number} y The vertical position of this Game Object in the world.
	 * @param {string|Phaser.Textures.Texture} texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
	 * @param {string|number} [frame] An optional frame from the Texture this Game Object is rendering with.
	 */
	constructor(world, x = 0, y = 0, texture = "noname", name = "Enemy", config = {}) {

		super(world, x, y, undefined, texture);

		this.name = name;
		this.label = "Enemy";

		this.scene.add.existing(this);
		this.isPlaying = false;

		this.setTexture(texture);

		/**
		 * Physics
		 */
		this.setSize(32, 32);
		this.setFixedRotation();

		/**
		 * config
		 * 
		 */
		this.config = {
			baseHealth: (100 + (window.Game.data.player.gamesWon * window.Game.diceRoll(50, 30))),
			health: 100 + (window.Game.data.player.gamesWon * window.Game.diceRoll(50, 30)),
			speed: 3.2 * ((Math.random() * (1 - 0.5)) + 0.5),
			mass: 1,
			velocity: 1,
			followDistance: config.followDistance || 500,
			hitPos: {
				x: 0,
				y: 0
			}
		};
		this.stop = false;
		this.isDead = false;
		this.transferDamage = null;

		/**
		 * Color
		 */
		this.tint = Math.random() * 0xffffff;
	}

	update() {

		this.enemyFollows();
		/**
		 * Pathfinding
		 */
		// this.scene.easystar.cancelPath(this.texture);
		// this.scene.easystar.findPath(Math.floor(this.x / 32), Math.floor(this.y / 32), Math.floor(this.scene.player.x / 32), Math.floor(this.scene.player.y / 32), (path) => {

		// 	if(!path) return;

		// 	this.enemyFollows(path);

		// }, this.texture);
	}

	enemyFollows() {

		if(this.stop === true) return;

		if(this.isPlaying === false) {
			this.isPlaying = true;
			this.anims.play("enemy_walk");
		}

		let dis = Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y);

		if(dis > this.config.followDistance) {

			this.isPlaying = false;
			this.anims.pause();

			this.setVelocity(0);

			return;
		}

		let vel = this.moveToTarget(this, this.scene.player, (this.config.velocity * this.config.speed) * 0.68);

		this.setVelocity(vel.velX, vel.velY);
	}

	moveToTarget(from, to, speed = 1) {

		const direction = Math.atan((to.x - from.x) / (to.y - from.y));
		const radian = Math.atan2((to.y - from.y), (to.x - from.x));
		const move = to.y >= from.y ? speed : -speed;

		this.setRotation(radian + 1.5708);

		return { velX: move * Math.sin(direction), velY: move * Math.cos(direction) };
	}

	onCollide(data) {

		if(!data.bodyA.gameObject) return;

		let otherBody = (data.bodyA.id === this.body.id) ? data.bodyB : data.bodyA;

		/** Check enemy on enemy hit, then check if transfer damage is passing */
		if(!otherBody.gameObject || otherBody.gameObject.label != "Enemy") return;

		/** Only when other enemy passes damage to this enemy */
		if(!otherBody.gameObject.transferDamage || otherBody.gameObject.transferDamage <= 2) return;

		/** First, split the transfer damage in half */
		let transferDmg = (Math.floor(otherBody.gameObject.transferDamage / 2));

		otherBody.gameObject.transferDamage = transferDmg;

		console.log(`${otherBody.gameObject.name} passing ${transferDmg} to ${this.name}`)

		/** Now damage the other enemy, and pass x, y, d */
		this.damage(transferDmg, otherBody.gameObject.config.hitPos.x, otherBody.gameObject.config.hitPos.y, (otherBody.gameObject.config.mass * 200));
	}

	/** Enemy has been hit, launch it, then kill it */
	damage(dmg, x = null, y = null, d = null) {

		let setX = (x ? x : this.scene.player.config.dashPos.x);
		let setY = (y ? y : this.scene.player.config.dashPos.y);

		/** Calculate the damage penalty due to being outside of distance sweetspot */
		let dis = Phaser.Math.Distance.Between(this.x, this.y, setX, setY);
		let dur = d ? d : this.scene.player.config.dashDuration;
		let prime = Math.round(dur / 2); // ideal distance for transfer
		let disPen = Math.round((dis < prime) ? prime - dis : dis - prime); // penalty

		let dmgDone = (dmg - disPen);

		this.transferDamage = (dmgDone > 0) ? dmgDone : null;

		if(this.config.health > 0 && dmgDone > 0) {
			this.config.health = this.config.health - dmgDone;
		}

		this.config.hitPos = {
			x: this.x,
			y: this.y
		};

		/** Health under 20% */
		if(this.config.health > 0 && (this.config.health / this.config.baseHealth) < 0.2) {
			console.log("Enemy is weak");
		}

		/** Otherwise kill it */
		if(this.config.health <= 0 && this.isDead === false) this.death();

		/** Now transfer push */
		if(dmgDone > 0) {

			this.stop = true;

			const direction = Math.atan2((this.y - setY), (this.x - setX)) + 1.5708;
			
			this.setVelocity(0);

			let forceCap = 250;
			let forceRate = (dmgDone > forceCap) ? forceCap : dmgDone;
			let force = (forceRate * -1) / window.Game.diceRoll(6, 4);

			this.setVelocity(Math.sin(direction) * force, Math.cos(direction) * force);
		}

		setTimeout(()=>{

			this.transferDamage = null;

			if(this.isDead === false) this.stop = false;

		}, 1000);
	}

	/** Play death, set dead texture obj */
	death() {

		this.isDead = true;
		this.scene.deathCount++;

		this.anims.pause();
		this.anims.play("enemy_dead");
		this.scene.audio.crowd_deathswell.play();

		// this.setToSleep();
	}
}