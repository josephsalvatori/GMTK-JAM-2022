import GameJam from "Game/index";

class Components {

	/**
	 * @arg {object} opts — Options
	 * @constructor
	 */
	constructor(opts = {}) {

	}
	
	init() {

		/** Before customElements */
		window.Game = window.Game || {};
		window.Game.diceRoll = (sides = 6, min = 1) => {
			return Math.floor(Math.random() * sides) + min;
		};

		/** Custom elements */
		customElements.define("game-jam", GameJam);

		/** Invokations */
	}
}

export default Components;