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

		/** Custom elements */
		customElements.define("game-jam", GameJam);

		/** Invokations */
	}
}

export default Components;