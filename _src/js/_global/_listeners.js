import { getViewport, parseQueryString } from "@zero-studios/library";
import LazyLoad from "vanilla-lazyload";

/** Document Ready */
const onReady = ()=>{

	/** Setup our base store */
	window.Game = window.Game || {};
	
	try {
		window.Game.queryParams = parseQueryString();
	} catch(err){
		window.Game.queryParams = undefined;
	}

	window.Game.windowHeight = getViewport().height;
	window.Game.windowWidth = getViewport().width;

	/** vh variable set */
	let vh = getViewport().height * 0.01;

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
		window.Game.windowHeight = getViewport().height;
		window.Game.windowWidth = getViewport().width;

		let vh = getViewport().height * 0.01;

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