var app = angular.module('app.authentication.notification.directive.private', [
]);

app.directive('notificationPrivate', function() {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/private.html',
        options: {
            scope: '='
        },
        controller: function($scope, notificationServices, AuthenticationService, toastr, $cookies, $state, $uibModal) {
            var UserInfo = $cookies.getObject('userInfo');
            var userUID = UserInfo.UID;
            var queue = 'NOTIFY';

            $scope.search = {
                userUID: userUID,
                queue: queue
            };

            $scope.fieldSort = {};

            $scope.itemSearch = [
                { field: "SenderAccount", name: "Sender" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Object", name: "Object" }
            ];

            $scope.itemDefault = [
                { field: "SenderAccount", name: "Sender" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Object", name: "Object" },
                { field: "CreatedDate", name: "Created Date" }
            ];

            $scope.fieldSort['CreatedDate'] = 'ASC';

            $scope.loadListPrivateNotify = function(info) {
                notificationServices.getListNotifySearch(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                    };
                    console.log("listNotifySearch", data.data);
                    $scope.listPrivateNotify = data.data;
                    $scope.count = data.countAll;
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
                $scope.loadListPrivateNotify($scope.searchObjectMap);
            };

            $scope.init();

            $scope.setPage = function() {
                $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
                $scope.loadListPrivateNotify($scope.searchObjectMap);
            };

            $scope.Search = function(data, e) {
                try {
                    ($scope.fromCreateDate && $scope.fromCreateDate !== null) ? data.FromCreatedDate = moment($scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.FromCreatedDate = null;
                    ($scope.toCreateDate && $scope.toCreateDate !== null) ? data.ToCreatedDate = moment($scope.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.ToCreatedDate = null;
                    $scope.searchObjectMap.Search = data;
                    $scope.loadListPrivateNotify($scope.searchObjectMap);
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
                $scope.loadListPrivateNotify($scope.searchObjectMap);
            };

            // Go to state
            $scope.gotoUrl = function(queuejob) {
                if (queuejob.MsgContent.Command && queuejob.MsgContent.Command.Url_State) {
                    $state.go(queuejob.MsgContent.Command.Url_State, { UID: queuejob.MsgContent.Display.Object.UID });
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg', // windowClass: 'app-modal-window', 
                        templateUrl: 'modules/notification/views/notificationPrivateDetail.html',
                        resolve: {
                            data: function() {
                                return queuejob;
                            }
                        },
                        controller: 'notificationPrivateDetailCtrl',
                    });
                    modalInstance.result.then(function(result) {
                        if (result === 'close') {
                            ioSocket.LoadListGlobalNotify();
                        };
                    }, function(err) {
                        console.log("Global.Notification.Detail", err);
                    });
                };

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
                    if (ioSocket.telehealthNotify()) {
                        ioSocket.telehealthNotify('');
                    };
                };
            };

            $scope.create = function(data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg', // windowClass: 'app-modal-window', 
                    templateUrl: 'modules/notification/views/notificationPrivateCreate.html',
                    resolve: {
                        data: function() {
                            return data;
                        }
                    },
                    controller: 'notificationPrivateCreateCtrl',
                });
                modalInstance.result.then(function(result) {
                    if (result === 'close') {
                        ioSocket.LoadListPrivateNotify();
                    };
                }, function(err) {
                    console.log("Private.Notification.Create", err);
                });
            };

            ioSocket.LoadListPrivateNotify = function() {
                $scope.init();
            };

            ComponentsDateTimePickers.init();
        },
    };
});
