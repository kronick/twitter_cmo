// generates random number that is greater or equal to low-bound, and smaller than high-bound.
function random(low, high) {
	return Math.floor(Math.random() * (high-low)) + low;
}

function random_item(array) {
	return array[random(0, array.length)];
}
