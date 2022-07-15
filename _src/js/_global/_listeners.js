import LazyLoad from "vanilla-lazyload";

/** Document Ready */
const onReady = ()=>{

	/** Setup our base store */
	window.Game = window.Game || {};

	window.Game.windowHeight = window.innerHeight;
	window.Game.windowWidth = window.innerWidth;

	/** vh variable set */
	let vh = window.innerHeight * 0.01;

	document.body.style.setProperty('--vh', `${vh}px`);

	/** Init page & components */
	window.Game.components.init();
	window.Game.page.init();

	/** Let's start loading our images */
	window.Game.lazyLoad = new LazyLoad({
		threshold: 600,
		callback_enter: (ev)=>{
			// read data attr, fire animation class
		}
	});
};

/** Window Load */
const onLoad = ()=>{
	
	window.Game = window.Game || {};

	window.Game.scroll = window.Game.scroll || {};
	window.Game.scroll.current = window.scrollY;
	window.Game.scroll.last = null;
};

/** Window Resize */
let resizeTimeout;

const onResize = ()=>{

	/** Need to delay this if user is actively resizing window */
	clearTimeout(resizeTimeout);

	resizeTimeout = setTimeout(()=>{

		window.Game = window.Game || {};
		window.Game.windowHeight = window.innerHeight;
		window.Game.windowWidth = window.innerWidth;

		let vh = window.innerHeight * 0.01;

		document.body.style.setProperty('--vh', `${vh}px`);
		
	}, 300);
};

/** Document Scroll */
const onScroll = ()=>{

	/** Grab scroll */
	window.Game = window.Game || {};
	window.Game.scroll = window.Game.scroll || {};
	window.Game.scroll.current = window.scrollY;

	/** Set up first load */
	if(window.Game.scroll.last === null){

		window.Game.scroll.last = window.Game.scroll.current;

		return;
	}
	
	/** Bounce if equal */
	if(window.Game.scroll.current === window.Game.scroll.last){

		window.Game.scroll.direction.dir = "idle";

		return;
	}

	// TODO: extend with maybe acceleration 

	/** Set direction */
	if(window.Game.scroll.current > window.Game.scroll.last && window.Game.scroll.direction.dir != "down") window.Game.scroll.direction.dir = "down";
	if(window.Game.scroll.current < window.Game.scroll.last && window.Game.scroll.direction.dir != "up") window.Game.scroll.direction.dir = "up";

	window.Game.scroll.last = window.Game.scroll.current;
};

/** Attach Events */
document.addEventListener("DOMContentLoaded", onReady);
window.addEventListener("load", onLoad.bind(this));
window.addEventListener("resize", onResize.bind(this));
window.addEventListener("scroll", onScroll.bind(this));