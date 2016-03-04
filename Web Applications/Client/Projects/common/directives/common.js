angular.module('app.common.ngEnter', [])
    // Enter
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if (event.which === 13) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    // History Back
    .directive('backButton', function() {
        return function(scope, element, attrs) {
            element.on('click', function() {
                history.back();
                scope.$apply();
            });
        };
    })
    // Number
    .directive('onlyNumber', function() {
        return {
            require: 'ngModel',
            restrict: 'A',
            link: function(scope, element, attr, ctrl) {
                function inputValue(val) {
                    if (val) {
                        var digits = val.replace(/[^0-9]/g, '');

                        if (digits !== val) {
                            ctrl.$setViewValue(digits);
                            ctrl.$render();
                        }
                        return parseInt(digits, 10);
                    }
                    return undefined;
                }
                ctrl.$parsers.push(inputValue);
            }
        };
    })

// BEGIN Auto Complete
.factory('MovieRetriever', function($http, $q, $timeout) {
        var MovieRetriever = new Object();
        MovieRetriever.getmovies = function(i) {
            var moviedata = $q.defer();
            var movies;

            var someMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel"];

            var moreMovies = ["The Wolverine", "The Smurfs 2", "The Mortal Instruments: City of Bones", "Drinking Buddies", "All the Boys Love Mandy Lane", "The Act Of Killing", "Red 2", "Jobs", "Getaway", "Red Obsession", "2 Guns", "The World's End", "Planes", "Paranoia", "The To Do List", "Man of Steel", "The Way Way Back", "Before Midnight", "Only God Forgives", "I Give It a Year", "The Heat", "Pacific Rim", "Pacific Rim", "Kevin Hart: Let Me Explain", "A Hijacking", "Maniac", "After Earth", "The Purge", "Much Ado About Nothing", "Europa Report", "Stuck in Love", "We Steal Secrets: The Story Of Wikileaks", "The Croods", "This Is the End", "The Frozen Ground", "Turbo", "Blackfish", "Frances Ha", "Prince Avalanche", "The Attack", "Grown Ups 2", "White House Down", "Lovelace", "Girl Most Likely", "Parkland", "Passion", "Monsters University", "R.I.P.D.", "Byzantium", "The Conjuring", "The Internship"]

            if (i && i.indexOf('T') != -1)
                movies = moreMovies;
            else
                movies = moreMovies;

            $timeout(function() {
                moviedata.resolve(movies);
            }, 1000);

            return moviedata.promise;
        };
        return MovieRetriever;
    })
    .directive('autocomplete', function() {
        var index = -1;

        return {
            restrict: 'E',
            scope: {
                searchParam: '=ngModel',
                suggestions: '=data',
                onType: '=onType',
                onSelect: '=onSelect',
                autocompleteRequired: '='
            },
            controller: ['$scope', function($scope) {
                // the index of the suggestions that's currently selected
                $scope.selectedIndex = -1;

                $scope.initLock = true;

                // set new index
                $scope.setIndex = function(i) {
                    $scope.selectedIndex = parseInt(i);
                };

                this.setIndex = function(i) {
                    $scope.setIndex(i);
                    $scope.$apply();
                };

                $scope.getIndex = function(i) {
                    return $scope.selectedIndex;
                };

                // watches if the parameter filter should be changed
                var watching = true;

                // autocompleting drop down on/off
                $scope.completing = false;

                // starts autocompleting on typing in something
                $scope.$watch('searchParam', function(newValue, oldValue) {

                    if (oldValue === newValue || (!oldValue && $scope.initLock)) {
                        return;
                    }

                    if (watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
                        $scope.completing = true;
                        $scope.searchFilter = $scope.searchParam;
                        $scope.selectedIndex = -1;
                    }

                    // function thats passed to on-type attribute gets executed
                    if ($scope.onType)
                        $scope.onType($scope.searchParam);
                });

                // for hovering over suggestions
                this.preSelect = function(suggestion) {

                    watching = false;

                    // this line determines if it is shown
                    // in the input field before it's selected:
                    //$scope.searchParam = suggestion;

                    $scope.$apply();
                    watching = true;

                };

                $scope.preSelect = this.preSelect;

                this.preSelectOff = function() {
                    watching = true;
                };

                $scope.preSelectOff = this.preSelectOff;

                // selecting a suggestion with RIGHT ARROW or ENTER
                $scope.select = function(suggestion) {
                    if (suggestion) {
                        $scope.searchParam = suggestion;
                        $scope.searchFilter = suggestion;
                        if ($scope.onSelect)
                            $scope.onSelect(suggestion);
                    }
                    watching = false;
                    $scope.completing = false;
                    setTimeout(function() { watching = true; }, 1000);
                    $scope.setIndex(-1);
                };


            }],
            link: function(scope, element, attrs) {

                setTimeout(function() {
                    scope.initLock = false;
                    scope.$apply();
                }, 250);

                var attr = '';

                // Default atts
                scope.attrs = {
                    "placeholder": "start typing...",
                    "class": "",
                    "id": "",
                    "inputclass": "",
                    "inputid": ""
                };

                for (var a in attrs) {
                    attr = a.replace('attr', '').toLowerCase();
                    // add attribute overriding defaults
                    // and preventing duplication
                    if (a.indexOf('attr') === 0) {
                        scope.attrs[attr] = attrs[a];
                    }
                }

                if (attrs.clickActivation) {
                    element[0].onclick = function(e) {
                        if (!scope.searchParam) {
                            setTimeout(function() {
                                scope.completing = true;
                                scope.$apply();
                            }, 200);
                        }
                    };
                }

                var key = { left: 37, up: 38, right: 39, down: 40, enter: 13, esc: 27, tab: 9 };

                document.addEventListener("keydown", function(e) {
                    var keycode = e.keyCode || e.which;

                    switch (keycode) {
                        case key.esc:
                            // disable suggestions on escape
                            scope.select();
                            scope.setIndex(-1);
                            scope.$apply();
                            e.preventDefault();
                    }
                }, true);

                document.addEventListener("blur", function(e) {
                    // disable suggestions on blur
                    // we do a timeout to prevent hiding it before a click event is registered
                    setTimeout(function() {
                        scope.select();
                        scope.setIndex(-1);
                        scope.$apply();
                    }, 150);
                }, true);

                element[0].addEventListener("keydown", function(e) {
                    var keycode = e.keyCode || e.which;

                    var l = angular.element(this).find('li').length;

                    // this allows submitting forms by pressing Enter in the autocompleted field
                    if (!scope.completing || l == 0) return;

                    // implementation of the up and down movement in the list of suggestions
                    switch (keycode) {
                        case key.up:

                            index = scope.getIndex() - 1;
                            if (index < -1) {
                                index = l - 1;
                            } else if (index >= l) {
                                index = -1;
                                scope.setIndex(index);
                                scope.preSelectOff();
                                break;
                            }
                            scope.setIndex(index);

                            if (index !== -1)
                                scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                            scope.$apply();

                            break;
                        case key.down:
                            index = scope.getIndex() + 1;
                            if (index < -1) {
                                index = l - 1;
                            } else if (index >= l) {
                                index = -1;
                                scope.setIndex(index);
                                scope.preSelectOff();
                                scope.$apply();
                                break;
                            }
                            scope.setIndex(index);

                            if (index !== -1)
                                scope.preSelect(angular.element(angular.element(this).find('li')[index]).text());

                            break;
                        case key.left:
                            break;
                        case key.right:
                        case key.enter:
                        case key.tab:

                            index = scope.getIndex();
                            // scope.preSelectOff();
                            if (index !== -1) {
                                scope.select(angular.element(angular.element(this).find('li')[index]).text());
                                if (keycode == key.enter) {
                                    e.preventDefault();
                                }
                            } else {
                                if (keycode == key.enter) {
                                    scope.select();
                                }
                            }
                            scope.setIndex(-1);
                            scope.$apply();

                            break;
                        case key.esc:
                            // disable suggestions on escape
                            scope.select();
                            scope.setIndex(-1);
                            scope.$apply();
                            e.preventDefault();
                            break;
                        default:
                            return;
                    }

                });
            },
            template: '\
	        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
	          <input\
	            type="text"\
	            ng-model="searchParam"\
	            placeholder="{{ attrs.placeholder }}"\
	            class="{{ attrs.inputclass }} form-control"\
	            id="{{ attrs.inputid }}"\
	            ng-required="{{ autocompleteRequired }}" />\
	          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">\
	            <li\
	              suggestion\
	              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"\
	              index="{{ $index }}"\
	              val="{{ suggestion }}"\
	              ng-class="{ active: ($index === selectedIndex) }"\
	              ng-click="select(suggestion)"\
	              ng-bind-html="suggestion | highlight:searchParam"></li>\
	          </ul>\
	        </div>'
        };
    })
    .filter('highlight', ['$sce', function($sce) {
        return function(input, searchParam) {
            if (typeof input === 'function') return '';
            if (searchParam) {
                var words = '(' +
                    searchParam.split(/\ /).join(' |') + '|' +
                    searchParam.split(/\ /).join('|') +
                    ')',
                    exp = new RegExp(words, 'gi');
                if (words.length) {
                    input = input.replace(exp, "<span class=\"highlight\">$1</span>");
                }
            }
            return $sce.trustAsHtml(input);
        };
    }])

.directive('suggestion', function() {
        return {
            restrict: 'A',
            require: '^autocomplete', // ^look for controller on parents element
            link: function(scope, element, attrs, autoCtrl) {
                element.bind('mouseenter', function() {
                    autoCtrl.preSelect(attrs.val);
                    autoCtrl.setIndex(attrs.index);
                });

                element.bind('mouseleave', function() {
                    autoCtrl.preSelectOff();
                });
            }
        };
    })
    // END Auto Complete
    //capitalize 
    .directive('capitalize', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {
                var capitalize = function(inputValue) {
                    if (inputValue == undefined) inputValue = '';
                    var capitalized = inputValue.toUpperCase();
                    if (capitalized !== inputValue) {
                        modelCtrl.$setViewValue(capitalized);
                        modelCtrl.$render();
                    }
                    return capitalized;
                }
                modelCtrl.$parsers.push(capitalize);
                capitalize(scope[attrs.ngModel]); // capitalize initial value
            }
        };
    })
    //end capitalize
;
