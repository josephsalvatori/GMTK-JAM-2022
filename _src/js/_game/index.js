import Phaser from "phaser";
import Boot from "Game/_scenes/Boot";
import Menu from "Game/_scenes/Menu";
import Level from "Game/_scenes/Level";

/** Debug */
import SceneWatcherPlugin from "phaser-plugin-scene-watcher";
import DebugDrawPlugin from "phaser-plugin-debug-draw";

export default class GameJam extends HTMLElement {

	constructor(){

		super();

		this.canvas = this.querySelector("canvas");

		window.Game = window.Game || {};
		window.Game.config = {
			type: Phaser.WEBGL,
			canvas: this.canvas,
			scale: {
				width: window.Game.windowWidth,
				height: window.Game.windowHeight,
				autoCenter: Phaser.Scale.CENTER_BOTH
			},
			physics: {
				default: "arcade",
				arcade: {
					gravity: { y: 0 },
					debug: true
				}
			},
			/**
			 * You can inject scenes dynamically later using:
			 * 	- window.Game.p.scene.add(scene)
			 */
			scene: [
				Boot,
				Menu,
				Level
			],
			/** Some debug object plugins */
			plugins: {
				global: [
					{
						key: "SceneWatcherPlugin",
						plugin: SceneWatcherPlugin,
						start: false
					}
				],
				scene: [
					{
						key: "DebugDrawPlugin",
						plugin: DebugDrawPlugin,
						start: true
					}
				]
			},
			/** Console debugs */
			callbacks: {
				postBoot: function(game) {
					game.plugins.get("SceneWatcherPlugin").watchAll();
				}
			}
		};

		window.Game.p = new Phaser.Game(window.Game.config);
	}
}