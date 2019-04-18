function ajaxcall(url) {
	// do ajax call
	$.ajax({
		url: url,
		method: "GET"
	}).then(function (response) {
		// receive response
		console.log(response)
	});
}

$(document).ready(function () {
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
	$("#form").submit(function (event) {
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
				if (startYear !== "" && endYear === "") {
					startYear = (startYear + "0101").toString();
					if (regex.test(startYear)) {
						url = url + "&fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=" + startYear;
						ajaxcall(url);
						console.log("1")
					}
				}
				else if (startYear === "" && endYear !== "") {
					endYear = (endYear + "1231").toString();
					if (regex.test(endYear)) {
						url = url + "&fq=" + search + "&facet_field=day_of_week&facet=true&end_date=" + endYear;
						ajaxcall(url);
						console.log("2")
					}
				}
				else {
					startYear = (startYear + "0101").toString();
					endYear = (endYear + "1231").toString();
					if (regex.test(startYear) && regex.test(endYear)) {
						url = url + "&fq=" + search + "&facet_field=day_of_week&facet=true&begin_date=" + startYear + "&end_date=" + endYear;
						ajaxcall(url);
						console.log("3")
					}
				}
			}
			else {
				url = url + "&q=" + search;
				ajaxcall(url);
				console.log("4")
			}
		}

		// display the response
		// <-----------------------------------------------------------------------------
		// if there are already display, clear them first
		// use the numOfRec variable to limit the amount of response displayed
		// the response will only contain 10 articles and user can only choose the numOfRec up to 10


		// This clears the display area
		$("#main-display").empty()
		// This is the actual ajax call.
		$.ajax({
			url: url,
			method: "GET"
		}).then(function (response) {
			// This line just creates the document counter we use to number the documents.
			var resultCount = 0;
			// This line creates var's for all 5 of the things we retrieve from NYT
			var headline = ""; var source = ""; var section = ""; var pubDate = ""; var webURL = "";
			for (var i = 0; i < numOfRec; i++) {
				// This creates a new div that we will put all the information retrieved from NYT into. 
				var newDiv = $("<div>")
				// This adds 1 to the document counter that is displayed in front of our results. 
				resultCount++;
				// This makes the first thing in our newDiv be a the doc number
				newDiv.append(resultCount + ". ");
				// These two lines are for styling as they add a class called results and individually assign id's equal to doc + the article number
				newDiv.addClass("Results");
				newDiv.attr("id", ("Doc" + resultCount))
				// The next five lines retrieve then store their information into the newdiv. 
				headline = (response.response.docs[i].headline.main); newDiv.append(headline + "<br>");
				source = (response.response.docs[i].source); newDiv.append("By: " + source + "<br>");
				section = (response.response.docs[i].section_name); newDiv.append("Section: " + section + "<br>");
				pubDate = (response.response.docs[i].pub_date); newDiv.append(pubDate + "<br>");
				webURL = (response.response.docs[i].web_url); newDiv.append(webURL + "<br>" + "<br>");
				// This line finally adds the newDiv into the document 
				$("#main-display").append(newDiv)
			}

		})

	});

	// when clear button is clicked
	$("#ClearButton").on("click", function () {
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