var app = angular.module('app.authentication.home.list.controller',[
	'app.authentication.home.list.detail.controller'
]);

app.controller('homeListCtrl', function($scope){
	console.log('homeListCtrl');


        var data = [
	        "Albania",
	        "Andorra",
	        "Armenia",
	        "Austria",
	        "Azerbaijan",
	        "Belarus",
	        "Belgium",
	        "Bosnia & Herzegovina",
	        "Bulgaria",
	        "Croatia",
	        "Cyprus",
	        "Czech Republic",
	        "Denmark",
	        "Estonia",
	        "Finland",
	        "France",
	        "Georgia",
	        "Germany",
	        "Greece",
	        "Hungary",
	        "Iceland",
	        "Ireland",
	        "Italy",
	        "Kosovo",
	        "Latvia",
	        "Liechtenstein",
	        "Lithuania",
	        "Luxembourg",
	        "Macedonia",
	        "Malta",
	        "Moldova",
	        "Monaco",
	        "Montenegro",
	        "Netherlands",
	        "Norway",
	        "Poland",
	        "Portugal",
	        "Romania",
	        "Russia",
	        "San Marino",
	        "Serbia",
	        "Slovakia",
	        "Slovenia",
	        "Spain",
	        "Sweden",
	        "Switzerland",
	        "Turkey",
	        "Ukraine",
	        "United Kingdom",
	        "Vatican City"
    ];

    // create AutoComplete UI component
    angular.element("#countries").kendoAutoComplete({
	    dataSource: data,
	    filter: "startswith",
	    placeholder: "Select country...",
	    separator: ", "
    });


});
