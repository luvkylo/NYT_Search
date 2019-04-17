function ajaxcall(url) {
	// do ajax call
	$.ajax({
		url: url,
		method: "GET"
	}).then(function(response) {
		// receive response
		console.log(response)
	});
}

$(document).ready(function() {
	// declare variable for later use for search
	var search = "";
	var numOfRec = 0;
	var startYear = "";
	var endYear = "";

	// declare the api key
	var api_key = "6Ga3fjgxB90iMKe9MJs0Y48RJyevCWmJ";

	// declare the api url
	var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + api_key;

	// when search button is clicked
	$("#form").submit(function(event) {
		event.preventDefault();
		// always clear var to prevent overlaping
		search = "";
		numOfRec = 0;
		startYear = "";
		endYear = "";
		url = "https://api.nytimes.com/svc/search/v2/articlesearch.json?api-key=" + api_key;

		// read in all values
		search = $("#Search").val();
		numOfRec = $("#NumOfRecord option:selected").val();
		startYear = $("#StartYear").val();
		endYear = $("#EndYear").val();
		var regex = /(19\d{6})|(200\d{5})|(201[0-9]\d{4})/;
		var stringreg = /[A-Za-z0-9\s]+/;

		// see if optional are passed in
		if (stringreg.test(search)) {
			search = search.replace(" ", "+");
			// change the url
			if (startYear !== "" || endYear !== "") {
				startYear = (startYear + "0101").toString();
				endYear = (endYear + "1231").toString();
				if (startYear !== "" && endYear === "") {
					if (regex.test(startYear)) {
						url = url + "&fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=" + startYear;
						ajaxcall(url);
					}
				}
				else if (startYear === "" && endYear !== "") {
					if (regex.test(endYear)) {
						url = url + "&fq=" + search + "&facet_field=day_of_week&facet=true&end_date=" + endYear;
						ajaxcall(url);
					}
				}
				else {
					if (regex.test(startYear) && regex.test(endYear)) {
						url = url + "&fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=" + startYear + "&end_date=" + endYear;
						ajaxcall(url);
					}
				}
			}
			else {
				url = url + "&q=" + search;
				ajaxcall(url);
			}
		}



		// display the response
		// <-----------------------------------------------------------------------------
			// if there are already display, clear them first
			// use the numOfRec variable to limit the amount of response displayed
			// the response will only contain 10 articles and user can only choose the numOfRec up to 10
	}); 

	// when clear button is clicked
	$("#ClearButton").on("click", function() {
		// reset all variable
		search = "";
		numOfRec = 0;
		startYear = "";
		endYear = "";
		$("#Search").val("");
		$("#StartYear").val("");
		$("#EndYear").val("");

		// clear the display
		$("#main-display").empty();

	});

});