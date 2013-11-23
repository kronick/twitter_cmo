// Tweet prototype
// ---------------

function Tweet(text, author, brandwords, categories) {
	this.text = text;	// Raw text input, auto parse hashtag and links later
	this.author = author;
	this.brandwords = brandwords || [];
	this.categories = categories || [];	//

	this.id = Tweet.count++;

	this.stats = {
		"retweets": 0,
		"favorites": 0,
		"followers": 0
	}


	// Physics properties
	this.velocity = [0,0];
	this.mass = 1;
	this.target = [0,0];

	this.addToDom();

	this.bubbles = [];
	for(var i=0; i<30; i++) {
		this.bubbles.push( new Bubble() );
	}

	this.el.hide();	// Start hidden
}

Tweet.count = 0;
Tweet.categories = ["good_words", "good_stats", "good_image", "good_conversation"];

Tweet.prototype = {
	addToDom: function() {
		this.el = $("<div class='tweet'><div class='author'>" +
					 this.author +
					 "</div><div class='text'>" + 
					  this.getMarkedUpText() + "</div></div>");
		$("#container").append(this.el);

		// Cache size from element
		this.size = {"width": this.el.width(), "height": this.el.height()};

		this.anchor = {
			"left": ($('#container').width() / 2 - this.size.width / 2),
			"top": ($('#container').height() / 2 - this.size.height / 2)
		}

		//this.el.offset(this.anchor);
		// Start off screen
		this.el.offset({"left": this.anchor.left,
						"top": $("#container").height() + this.el.height()});

		// Hide images by default
		this.el.find(".images").hide();
		
	},
	enter: function(duration, delay) {
		this.el.delay(delay)
			   .animate({opacity: "show",
			   			 left: this.anchor.left,
			   			 top: this.anchor.top},
			   			duration);
		for(var i=0; i<this.bubbles.length; i++) {
			this.bubbles[i].enter(random(500,2000), delay + random(5000,10000));
		}
	},
	exit: function(duration, delay) {
		/*
		var $this = this;
		window.setTimeout(function() {
			shatterLetters($this.el);
		}, delay);
		*/
		this.el.transition({
								"scale": 0,
								"opacity": 0,
								"rotate": 20,
								"delay": delay,
							}, duration);
	},
	showStats: function(delay) {

	},
	hide: function() {
		this.el.hide();
	},
	update: function() {

	},
	die: function() {
		this.el.remove();

	},
	getMarkedUpText: function() {
		// Add <span>'s around hashtags, @ replies, and links
		var hashtag_pattern = /(\S*#\S+)/gi;
		var hashtag_matches = this.text.match(hashtag_pattern);
		var output = this.text.replace(hashtag_pattern, "<span class='hashtag'>$1</span>");

		var atreply_pattern = /(\S*@\S+)/gi;
		var atreply_matches = this.text.match(atreply_pattern);
		output = output.replace(atreply_pattern, "<span class='atreply'>$1</span>");

		var twitpic_pattern = /(pic.twitter.com\/\S+)/gi;
		output = output.replace(twitpic_pattern, "<span class='url'>$1</span>");	
		var twitpic_matches = this.text.match(twitpic_pattern);	

		// Make brand words bigger than others
		for(var i=0; i<this.brandwords.length; i++) {
			var brand_pattern = new RegExp("(\S*[#|@]*" + this.brandwords[i] +"\S*)", 'gi');
			output = output.replace(brand_pattern, "<span class='brandname'>$1</span>");
		}

		// Add img tags if needed
		if(twitpic_matches.length > 0) {
			output += "<div class='images'>";
			for(var i=0; i<twitpic_matches.length; i++) {
				output += "<img src='images/redbull.jpg' style='width: 200px;' />";
			}
			output += "</div>";
		}

		return output;
		//var result = 
	}
}