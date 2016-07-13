var app = angular.module('app.authentication.notification.directive.private', []);

app.directive('notificationPrivate', function() {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/private.html',
        options: {
            scope: '='
        },
        controller: function($scope, notificationServices, AuthenticationService, toastr, $cookies, $state) {
            var UserInfo = $cookies.getObject('userInfo');
            var userUID = UserInfo.UID;
            var queue = 'NOTIFY';

            $scope.search = {
                userUID: userUID,
                queue: queue
            };
            $scope.fieldSort = {};

            $scope.fieldSort.Time = 'ASC';
            // $scope.fieldSort.Action = 'ASC';

            $scope.loadListNotify = function(info) {
                notificationServices.getListNotifySearch(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                    };
                    console.log("listNotifySearch", data.data);
                    $scope.listNotify = data.data;
                    $scope.count = data.count;
                });
            };

            // $scope.loadListNotify();

            $scope.init = function() {
                $scope.searchObject = {
                    limit: 10,
                    offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    // attributes: scope.items,
                    Search: {
                        userUID: userUID,
                        queue: queue
                    },
                    order: 'CreatedDate DESC'
                };
                // scope.search.Enable = null;
                $scope.searchObjectMap = angular.copy($scope.searchObject);
                $scope.loadListNotify($scope.searchObjectMap);
            };

            $scope.init();

            $scope.toggle = false;
            $scope.toggleFilter = function() {
                $scope.toggle = $scope.toggle === false ? true : false;
            };

            $scope.setPage = function() {
                $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
                $scope.loadListNotify($scope.searchObjectMap);
            };

            $scope.Search = function(data, e) {
                try {
                    ($scope.fromCreateDate && $scope.fromCreateDate !== null) ? data.FromCreatedDate = moment($scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.FromCreatedDate = null;
                    ($scope.toCreateDate && $scope.toCreateDate !== null) ? data.ToCreatedDate = moment($scope.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.ToCreatedDate = null;
                    $scope.searchObjectMap.Search = data;
                    $scope.loadListNotify($scope.searchObjectMap);
                } catch (err) {
                    console.log(err);
                };
            };

            $scope.sort = function(field, sort) {
                $scope.isClickASC = false;
                console.log("Hello");
                if (sort === "ASC") {
                    $scope.isClickASC = true;
                    $scope.fieldSort[field] = 'DESC';
                } else {
                    $scope.isClickASC = false;
                    $scope.fieldSort[field] = 'ASC';
                };
                if (field === 'Action') {
                    field = 'MsgContent';
                };
                if (field === 'Time') {
                    field = 'CreatedDate';
                };
                var data = '';
                data = field + ' ' + sort;

                $scope.searchObjectMap.order = data;
                $scope.loadListNotify($scope.searchObjectMap);
            };

            // Go to state
            $scope.gotoUrl = function(queuejob) {
                if (queuejob.Read === 'N') {
                    var whereClause = {
                        userUID: userUID,
                        queue: queue,
                        ID: queuejob.ID
                    };
                    AuthenticationService.updateReadQueueJob(whereClause).then(function(data) {
                        if (data.status === 'success') {
                            $scope.init();
                        };
                    }, function(err) {
                        console.log("updateReadQueueJob ", err);
                    });
                };
                $state.go(queuejob.MsgContent.Command.Url_State, { UID: queuejob.MsgContent.Display.Object.UID });
            };

            ioSocket.LoadListNotify = function() {
                $scope.init();
            };

            ComponentsDateTimePickers.init();
        },
    };
});
