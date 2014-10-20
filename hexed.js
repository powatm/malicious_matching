(function($){

    $.fn.hexed = function(arg) {
        if(!(arg instanceof String)) {
            var settings = arg;
            difficulty = settings.difficulty;
            turns = settings.turns;
            init(this);
        } else {
            var action = arg;
            if(action == "name of a command") {
                ;; //do that command 
            } else {
                $.error('Action '+ action +' does not exist on jQuery.hexed');
            }
        }
        return this;
    }

    function init(hexObj) {
	//Define r,g,b variables to hold the player entered RGB.
	//When a player manipulates the text box or slider, this changes it.
	//When a function needs to read from the RGB values, it reads from this.
	red = green = blue = 255;

	//Create the slider objects.
        make_sliders();

	//Initialize the text boxes.
	$("#red_slider_number").val(red);
	$("#green_slider_number").val(green);
	$("#blue_slider_number").val(blue);

	//Add the drawing canvas.
	hexObj.append("<canvas id=\"goalCanvas\" width=\"300\" height=\"150\"></canvas>");
	
	//Generate Color button click
        $("#gen").click(function() { // need time
            start = new Date().getMilliseconds();
            var c=document.getElementById("goalCanvas");
            var ctx=c.getContext("2d");
            ctx.beginPath();
            ctx.arc(100,75,50,0,2*Math.PI);
            ctx.fillStyle=randomColor();
            ctx.fill();
        });

	//Got It button click
        $("#answer").click(function() {
            end = new Date().getMilliseconds();
            $("#score").text("Score: " + calculate_score());
            alert(calculate_score());
        });
    }

    theColor=[];                       
    function randomColor(){ //determine random rgb
        var r=Math.floor((Math.random() * 255)); //range of 0-255
        var g=Math.floor((Math.random() * 255));
        var b=Math.floor((Math.random() * 255));
        theColor=[r,g,b];
        return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    }

    //Draws the player's color choice from the sliders next to the original
    //color
    function playerColor() {
        var c=document.getElementById("goalCanvas");
        var ctx=c.getContext("2d");
        ctx.beginPath();
        ctx.arc(250,75,30,0,2*Math.PI);
        ctx.fillStyle =
	    "#" + red.toString(16) + green.toString(16) + blue.toString(16);
        ctx.fill();
    }

    function make_sliders() {
        $("#red_slider").slider({ min: 0, max: 255, value: red, slide: function(event, ui) {
	    red = ui.value;
	    $("#red_slider_number").val(red);
    	    playerColor();
        }});
        $("#green_slider").slider({ min: 0, max: 255, value: green, slide: function(event, ui) {
	    green = ui.value;
    	    $("#green_slider_number").val(green);
    	    playerColor();
        }});
        $("#blue_slider").slider({ min: 0, max: 255, value: blue, slide: function(event, ui) {
	    blue = ui.value;
    	    $("#blue_slider_number").val(blue);
    	    playerColor();
        }});
    }

    //determine the percent difference between the actual and
    //expected r, g, b variables
    function percent_off() {
        return ((theColor[0] - red)/255 +
                (theColor[1] - green)/255 +
                (theColor[2] - blue)/255) * 100 / 3;
    }

    // determine score
    // ((15 – difficulty – percent_off) / (15 – difficulty)) * (15000 – milliseconds_taken)
    function calculate_score() {
        var weighted_diff = 15 - difficulty;
        var score = (weighted_diff - percent_off()) / (weighted_diff * (end-start));
        return percent_off() + "% off";
    }
}( jQuery ));
