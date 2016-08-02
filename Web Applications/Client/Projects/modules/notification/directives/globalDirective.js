var app = angular.module('app.authentication.notification.directive.global', []);

app.directive('notificationGlobal', function() {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/global.html',
        options: {
            scope: '='
        },
        controller: function($scope, notificationServices, toastr, $cookies, $uibModal, $state) {
            var UserInfo = $cookies.getObject('userInfo');
            var roles = UserInfo.roles;
            var Role = [];
            var queue = 'GLOBALNOTIFY';

            for (var i = 0; i < roles.length; i++) {
                Role.push(roles[i].RoleCode);
            };

            $scope.search = {
                UID: UserInfo.UID,
                Role: Role,
                queue: queue
            };

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

            $scope.fieldSort = {};
            $scope.items = $scope.items != null && $scope.items != undefined ? $scope.items : $scope.itemDefault;

            $scope.fieldSort['CreatedDate'] = 'ASC';

            function LoadListGlobalNotify(info) {
                notificationServices.LoadListGlobalNotify(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                        if (data.data[i].Read.indexOf(UserInfo.UID) === -1) {
                            data.data[i].iRead = 'N'
                        };
                    };
                    console.log("LoadListGlobalNotify", data);
                    $scope.listGlobalNotify = data.data;
                    $scope.count = data.countAll;
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
                        UID: UserInfo.UID,
                        Role: Role,
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

            $scope.openCreate = function(data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg', // windowClass: 'app-modal-window', 
                    templateUrl: 'modules/notification/views/notificationGlobalCreate.html',
                    resolve: {
                        data: function() {
                            return data;
                        }
                    },
                    controller: 'notificationGlobalCreateCtrl',
                });
                modalInstance.result.then(function(result) {
                    if (result === 'close') {
                        ioSocket.LoadListGlobalNotify();
                    };
                }, function(err) {
                    console.log("Global.Notification.Create", err);
                });
            };

            $scope.openDetail = function(data) {
                if (data.MsgContent.Command && data.MsgContent.Command.Url_State) {
                    $state.go(data.MsgContent.Command.Url_State, { UID: data.MsgContent.Display.Object.UID });
                } else {
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

                // Change Read Log
                if (data.Read.indexOf(UserInfo.UID) === -1) {
                    var info = {
                        ID: data.ID,
                        Read: data.Read,
                        UserUID: UserInfo.UID
                    };
                    notificationServices.ChangeReadQueueJobg(info).then(function(info) {
                        $scope.init();
                        if (ioSocket.telehealthGlobalNotify()) {
                            ioSocket.telehealthGlobalNotify("msg");
                        }
                    }, function(err) {
                        console.log("GlobalNotify.ChangeReadQueueJobg", err);
                    });
                };
            };

            ioSocket.LoadListGlobalNotify = function() {
                $scope.init();
            };

            ComponentsDateTimePickers.init();
        },
    };
});
