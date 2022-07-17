export default class PlayerData {

	constructor(registry, object = {}) {

		/** Player data defaults */
		this.name = "player";
		this.data = {
			health: 100,
			damage: 20,
			speed: 4,

			// affect damage and resulting force
			mass: 1,
			velocity: 1,
			dash: 3,
			critMult: 3,
			dashLength: 180,

			// game values
			gamesPlayed: 0
		};

		/** Data store in window Object - hate get/set of DataManager */
		window.Game.data = window.Game.data || {};
		window.Game.data[this.name] = window.Game.data[this.name] || {};

		this.reg = registry;

		/** Proxy Handler */
		const handler = {
			set: (target, property, value)=>{

				target[property] = value;
				
				this.data[property] = value;

				this.set();

				return true;
			}
		}

		/** Establish Proxy Listener */
		window.Game.data[this.name] = new Proxy(window.Game.data[this.name], handler);

		this.load();
	}

	/** In case we want to save data in localStorage? */
	load() {

		/** check local storage for obj */
		window.Game.data[this.name] = this.data;

		/** set */
		this.set();
	}

	/** Sync to registry */
	set() {
		this.reg.set(this.name, this.data);
	}
}