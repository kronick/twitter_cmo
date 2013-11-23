// Bubble prototype
// ----------------

function Bubble(image, size) {
	this.image = image || "images/mcdonalds.jpg";
	this.size = size || 50;
	this.id = Bubble.count++;

	this.elements = [];

	this.addToDom();
}

Bubble.count = 0;

Bubble.prototype = {
	addToDom: function() {
		if(this.elements.length > 0) {
			// Clear out the old stuff first
			for(var i=0; i<this.elements.length; i++) {
				this.elements[i].remove();
			}
		}

		var s = Snap("#svgelem");
		var dot = s.circle($("#svgelem").width() / 2,
						   $("#svgelem").height()/2,
						   0);	// Start invisible
		dot.attr({fill: "#fff"});
		var img = s.image(this.image,
						  $("#svgelem").width() / 2 - this.size/2,
						  $("#svgelem").height()/2 - this.size/2,
						  this.size, this.size);

		img.attr({mask: dot});

		dot.animate({r: this.size / 2}, 500, mina.bounce);

		var $this = this;

		Snap.animate(0,100, function(val) {
			img.attr({x: (val - $this.size/2)});
			dot.attr({cx: val});
		}, 500, mina.easein);
	}
}