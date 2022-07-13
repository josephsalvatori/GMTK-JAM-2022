import Phaser from "phaser";

export default class Template extends Phaser.GameObjects.Sprite {
	
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
	}
}