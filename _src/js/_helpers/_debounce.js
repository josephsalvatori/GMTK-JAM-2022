/**
 * Debounce, input delay
 * @param {function} fn 
 * @param {integer} wait 
 * @returns 
 * 
 * Example usage:
 * 	this.addEventListener("change", debounce(event => this.onChange(event)).bind(this));
 */
 export const debounce = (fn, wait = 300) => {

	let t;

	return (...args) => {
		clearTimeout(t);
		t = setTimeout(() => fn.apply(this, args), wait);
	};
}