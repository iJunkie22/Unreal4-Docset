var margin;

$(document).ready(function(){
	//ContentFix
	$("#navigation").html("<");
	$("#navigation").click(SlideIn);
});

//******************** NAVIGATION PANEL FUNCTIONS *********************//
// Slides the panel into and out of view and fixes the margins and
// positions of the inner elements so that everything remains uniform
function SlideIn(){
	//get DOM elements
	var navPanel = document.getElementById("navPanel");
	var navigationButton = document.getElementById("navigation");
	var navigationWrapper = document.getElementById("navWrapper");
	var pageDefault = document.getElementById("contentContainer");	
	
	//set transitions
	navPanel.style.transition = "left 0.5s linear 0s";
	navigationButton.style.transition = "left 0.5s linear 0s";
	navigationWrapper.style.transition = "width 0.5s linear 0s";
	pageDefault.style.transition = "margin-left 0.5s linear 0s";
	
	//Perform page transitions to hide navBar
	navPanel.style.left = "-300px";
	navigationButton.style.left = "-8px";
	navigationWrapper.style.width = "0px";
	pageDefault.style.marginLeft = "0px";
	
	//ContentFix
	$("#navigation").html(">");
	
	//attach new event handlers
	$("#navigation").off("click");
	$("#navigation").on("click", SlideOut);
}

function SlideOut(){
	//get DOM elements
	var navPanel = document.getElementById("navPanel");
	var navigationButton = document.getElementById("navigation");
	var navigationWrapper = document.getElementById("navWrapper");
	var pageDefault = document.getElementById("contentContainer");	
	
	//set transitions
	navPanel.style.transition = "left 0.5s linear 0s";
	navigationButton.style.transition = "left 0.5s linear 0s";
	navigationWrapper.style.transition = "width 0.5s linear 0s";
	pageDefault.style.transition = "margin-left 0.5s linear 0s";
	
	//Perform page transitions to hide navBar
	navPanel.style.left = "0px";
	navigationButton.style.left = "292px";
	navigationWrapper.style.width = "300px";
	pageDefault.style.marginLeft = "300px";
	
	//ContentFix
	$("#navigation").html("<");
	
	//attach new event handlers
	$("#navigation").off("click");
	$("#navigation").on("click", SlideIn);
}
//
//***************** END NAVIGATION PANEL FUNCTIONS *********************//