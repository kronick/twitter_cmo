// Bubble prototype
// ----------------

function Bubble(image, size) {
	this.image = image || "images/mcdonalds.jpg";
	//this.image = image;
	this.size = size || random(20,60);
	this.id = Bubble.count++;

	this.anchor = {left:  $("#svgelem").width() / 2,
				   top: $("#svgelem").height()/2 };
	this.position = {left: this.anchor.left, top: this.anchor.top};

	this.angle = random(-20* Math.PI, 20 * Math.PI);
	this.radius = random(100, 300);

	this.target = {left: this.position.left + this.radius * Math.cos(this.angle),
				   top:  this.position.top  + this.radius * Math.sin(this.angle)};

	this.elements = {};

	this.showConnector = true;
	//this.showImage = this.image ? true : false;
	this.showImage = random(0,1) < 0.2;
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
		
		this.elements["line"] = s.line(this.anchor.left, this.anchor.top,
									   this.anchor.left, this.anchor.top);
		this.elements["line"].attr({class: "bubble_connector"});

		this.elements["dot"] = s.circle(this.anchor.left,
						   				this.anchor.top,
						   				0);	// Start invisible


		this.elements["maskdot"] = s.circle(this.anchor.left,
						   					this.anchor.top,
						   					0);	// Start invisible

		//this.elements["dot"].attr({fill: this.showImage ? "#fff" : "#000"});
		this.elements["dot"].attr({fill: "#000"});
		this.elements["maskdot"].attr({fill: "#fff"});
		
		this.elements["img"] = s.image(this.image,
						  			   this.anchor.left - this.size/2,
						  			   this.anchor.top - this.size/2,
						  			   this.size, this.size);

		this.elements["img"].attr({mask: this.elements["maskdot"]});

		if(!this.showImage) {
			$(this.elements["img"].node).addClass("hidden");
		}



		//this.enter(1000,5000);
	},

	enter: function(duration, delay) {
		var $this = this;

		setTimeout(function() {
			$this.elements["dot"].animate({r: $this.size / 8},
										  duration/2,
										  mina.bounce);
		}, delay);
		$this.moveTo([$this.target.left, $this.target.top],
					 duration/2,
					 delay,
					 mina.backout,
					 function() {
					 	$this.elements["dot"].animate({r: $this.size / 2},
					 								  duration/2,
					 								  mina.bounce);
						$this.elements["maskdot"].animate({r: $this.size / 2},
					 									  duration/2,
					 									  mina.bounce);					 	
					 });

		//this.moveTo([$this.anchor.left + 300, $this.anchor.top + 200],
		//			duration/2, delay*2+duration, mina.backout);
	},

	moveTo: function(target, duration, delay, ease, after) {
		var $this = this;
		if(!target.left) {	// Assume coords were passed as array if not as offset
			target = {left: target[0], top: target[1]}
		}
		// TODO: Allow relative coordinates by looking at first chars of coords

		setTimeout(function() {
			Snap.animate([$this.position.left, $this.position.top],
						 [target.left, target.top], function(val) {
						 	if($this.showImage) {
						 		$this.elements["img"].attr({
									x: (val[0] - $this.size/2),
									y: (val[1] - $this.size/2)
								});
						 	}
							$this.elements["dot"].attr({
								cx: val[0],
								cy: val[1], 
							});
							$this.elements["maskdot"].attr({
								cx: val[0],
								cy: val[1], 
							});							
							$this.elements["line"].attr({
								x2: val[0],
								y2: val[1], 
							});							
							// Update where the center is
							$this.position.left = val[0];
							$this.position.top = val[1];
						 }, duration, ease);
		}, delay);

		setTimeout(function() {
			if(after) after();
		}, delay + duration);
	}
}