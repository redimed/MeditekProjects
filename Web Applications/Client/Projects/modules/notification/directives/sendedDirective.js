var app = angular.module('app.authentication.notification.directive.sended', []);

app.directive('globalSended', function() {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/sended.html',
        controller: function($scope, notificationServices, toastr, $cookies, $uibModal) {
            var UserInfo = $cookies.getObject('userInfo');
            var SenderUID = UserInfo.UID;
            var queue = 'GLOBALNOTIFY';
            $scope.toggle = false;

            $scope.search = {
                SenderUID: SenderUID,
                queue: queue
            };

            $scope.itemSearch = [
                { field: "SenderAccount", name: "Sender" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Status", name: "Status" }
            ];

            $scope.itemDefault = [
                { field: "SenderAccount", name: "Sender" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Status", name: "Status" },
                { field: "CreatedDate", name: "Created Date" }
            ];

            $scope.fieldSort = {};
            $scope.items = $scope.items != null && $scope.items != undefined ? $scope.items : $scope.itemDefault;

            for (var i = 0; i < $scope.items.length; i++) {
                $scope.fieldSort[$scope.items[i].field] = 'ASC';
            };

            $scope.toggleFilter = function() {
                $scope.toggle = $scope.toggle === true ? false : true;
            };

            function LoadListGlobalNotify(info) {
                notificationServices.LoadListGlobalNotify(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                    };
                    console.log("LoadListGlobalNotify", data.data);
                    $scope.listGlobalNotify = data.data;
                    $scope.count = data.count;
                });
            };

            $scope.init = function() {
                $scope.searchObject = {
                    limit: 10,
                    offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    // attributes: scope.items,
                    Search: {
                        SenderUID: SenderUID,
                        queue: queue
                    },
                    order: 'CreatedDate DESC'
                };
                // scope.search.Enable = null;
                $scope.searchObjectMap = angular.copy($scope.searchObject);
                LoadListGlobalNotify($scope.searchObjectMap);
            };

            $scope.init();

            $scope.setPage = function() {
                $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
                LoadListGlobalNotify($scope.searchObjectMap);
            };

            $scope.Search = function(data) {
                ($scope.fromCreateDate && $scope.fromCreateDate !== null) ? data.FromCreatedDate = moment($scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.FromCreatedDate = null;
                ($scope.toCreateDate && $scope.toCreateDate !== null) ? data.ToCreatedDate = moment($scope.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.ToCreatedDate = null;
                $scope.searchObjectMap.Search = data;
                LoadListGlobalNotify($scope.searchObjectMap);
            };

            $scope.sort = function(field, sort) {
                $scope.isClickASC = false;
                if (sort === "ASC") {
                    $scope.isClickASC = true;
                    $scope.fieldSort[field] = 'DESC';
                } else {
                    $scope.isClickASC = false;
                    $scope.fieldSort[field] = 'ASC';
                }
                if (field == 'SenderAccount') {
                    field = 'SenderAccount.UserName';
                }
                var data = field + ' ' + sort;
                $scope.searchObjectMap.order = data;
                LoadListGlobalNotify($scope.searchObjectMap);
            };

            $scope.openDetail = function(data) {
                // if (data.SenderUID === UserInfo.UID) {
                //     $scope.openCreate(data);
                // } else {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg', // windowClass: 'app-modal-window', 
                    templateUrl: 'modules/notification/views/notificationGlobalDetail.html',
                    resolve: {
                        data: function() {
                            return data;
                        }
                    },
                    controller: 'notificationGlobalDetailCtrl',
                });
                modalInstance.result.then(function(result) {
                    if (result === 'close') {
                        ioSocket.LoadListGlobalNotify();
                    };
                }, function(err) {
                    console.log("Global.Notification.Detail", err);
                });
            };

            ioSocket.LoadListGlobalNotify = function() {
                $scope.init();
            };
        },
    };
});
