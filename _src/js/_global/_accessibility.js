class A11y {

	/**
	 * @arg {object} opts — Options
	 * @constructor
	 */
	constructor(opts = {}) {

		/** Init setup */
		this.linkParse();

		/** Setup our keyboard focus events */
		document.addEventListener("keydown", this.focusElements);
	}
	
	addTabbing() {

		// const tabEls = document.querySelectorAll()
	}

	focusElements(event) {

		if(event.key != "Tab") return;

		console.log("might not need to measure tabbing");
	}

	linkParse() {

		const linkEls = document.getElementsByTagName("a");

		/** Scan links for fixes */
		[...linkEls].forEach((link)=>{
			
			/** Don't process internal links */
			if(link.href.indexOf(window.location.hostname) > -1) return;

			/** Make sure external links contain proper rel types */
			let linkTypes = (link.getAttribute("rel") || "").split(" ");

			linkTypes.push("noopener", "noreferrer");
			link.setAttribute("rel", [...new Set(linkTypes)].join(" "));

			/** Force target for external links */
			if(link.target != "_blank") link.target = "_blank";

			/** Add new tab messaging (or icon) */
			link.insertAdjacentHTML("beforeend", `<span class="visually-hidden">(opens in a new tab)</span>`);
		});
	}
}

export default A11y;