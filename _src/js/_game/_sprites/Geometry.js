import Phaser from "phaser";

export default class Geometry extends Phaser.GameObjects.GameObject {
	
	/**
	 * @constructor
	 * @param {Phaser.Scene} scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
	 * @param {number} x The horizontal position of this Game Object in the world.
	 * @param {number} y The vertical position of this Game Object in the world.
	 * @param {string|Phaser.Textures.Texture} texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
	 * @param {string|number} [frame] An optional frame from the Texture this Game Object is rendering with.
	 */
	constructor(scene, x = 0, y = 0, texture = "noname", config = {

	}) {

		super(scene, x, y, undefined, texture);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		/**
		 * Physics
		 */
		this.body.setCollideWorldBounds(true);
		this.body.setSize(64, 64);

		/**
		 * Color
		 */
		this.tint = Math.random() * 0xffffff;
	}

	update() {
		
	}

	onCollide(target) {

	}
}