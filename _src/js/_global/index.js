/**
 * Global Scope JS
 *  - will load shared script on every page
 */
import A11y from "./_accessibility";
import Components from "./_components";
import isMobile from "ismobilejs";

/** Set up window object */
window.Game = window.Game || {};
window.Game.scroll = window.Game.scroll || {};
window.Game.scroll.direction = window.Game.scroll.direction || {};

/** Set base config */
window.Game.a11y = new A11y();
window.Game.components = new Components();
window.Game.isMobile = isMobile(window.navigator).any;
window.Game.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Grab the rest of our scripts */
import "Global/_listeners";