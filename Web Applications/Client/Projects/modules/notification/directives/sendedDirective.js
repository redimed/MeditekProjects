var app = angular.module('app.authentication.notification.directive.sended', []);

app.directive('notificationSend', function() {
    return {
        restrict: "EA",
        templateUrl: 'modules/notification/directives/templates/sended.html',
        scope: {
            kind: '=onKind',
        },
        controller: function($scope, notificationServices, toastr, $cookies, $uibModal, $state, $stateParams) {
            var queue = '';
            var templateUrl = '';
            var templateCtrl = '';

            if ($scope.kind === 'Private' || $scope.kind === 'ToDo' || $scope.kind === 'Request' || $scope.kind === 'Review') {
                queue = 'NOTIFY';
                templateUrl = 'notificationPrivateDetail.html';
                templateCtrl = 'notificationPrivateDetailCtrl';

                socketNcFunction.LoadListSended = function() {
                    $scope.init();
                };
            } else if ($scope.kind === 'global') {
                queue = 'GLOBALNOTIFY';
                templateUrl = 'notificationGlobalDetail.html';
                templateCtrl = 'notificationGlobalDetailCtrl';

                socketNcFunction.LoadListSendedGlobal = function() {
                    $scope.init();
                };
            };

            var UserInfo = $cookies.getObject('userInfo');
            var SenderUID = UserInfo.UID;

            $scope.toggle = false;

            $scope.search = {
                SenderUID: SenderUID,
                queue: queue,
                kind: $scope.kind,
            };

            if ($stateParams.type) {
                $scope.search.type = $stateParams.type;
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

            function LoadListNotify(info) {
                if ($scope.kind === 'global') {
                    notificationServices.LoadListGlobalNotify(info).then(function(data) {
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                        };
                        // console.log("LoadListGlobalNotify", data.data);
                        $scope.listGlobalNotify = data.data;
                        $scope.count = data.count;
                    });
                } else if ($scope.kind === 'Private' || $scope.kind === 'ToDo' || $scope.kind === 'Request' || $scope.kind === 'Review') {
                    console.log("|||||", info);
                    notificationServices.getListNotifySearch(info).then(function(data) {
                        console.log("length", data.countAll);
                        for (var i = 0; i < data.data.length; i++) {
                            data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                        };
                        // console.log("LoadListSended", data.data);
                        $scope.listGlobalNotify = data.data;
                        // console.log("LoadListSended count", data.count);
                        $scope.count = data.countAll;
                    });
                };
            };

            $scope.init = function() {
                $scope.searchObject = {
                    limit: 5,
                    offset: 0,
                    currentPage: 1,
                    maxSize: 5,
                    // attributes: scope.items,
                    Search: {
                        SenderUID: SenderUID,
                        queue: queue,
                        kind: $scope.kind,
                    },
                    order: 'CreatedDate DESC'
                };
                if ($stateParams.type) {
                    $scope.searchObject.Search.type = $stateParams.type;
                };
                console.log("$scope.searchObject", $scope.searchObject);
                $scope.searchObjectMap = angular.copy($scope.searchObject);
                LoadListNotify($scope.searchObjectMap);
            };

            $scope.init();

            $scope.setPage = function() {
                $scope.searchObjectMap.offset = ($scope.searchObjectMap.currentPage - 1) * $scope.searchObjectMap.limit;
                LoadListNotify($scope.searchObjectMap);
            };

            $scope.Search = function(data) {
                ($scope.fromCreateDate && $scope.fromCreateDate !== null) ? data.FromCreatedDate = moment($scope.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.FromCreatedDate = null;
                ($scope.toCreateDate && $scope.toCreateDate !== null) ? data.ToCreatedDate = moment($scope.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.ToCreatedDate = null;
                $scope.searchObjectMap.Search = data;
                LoadListNotify($scope.searchObjectMap);
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
                LoadListNotify($scope.searchObjectMap);
            };

            $scope.openDetail = function(data) {
                if (data.MsgContent.Command && data.MsgContent.Command.Url_State) {
                    $state.go(data.MsgContent.Command.Url_State, { UID: data.MsgContent.Display.Object.UID });
                } else {
                    var modalInstance = $uibModal.open({
                        animation: true,
                        size: 'lg', // windowClass: 'app-modal-window', 
                        templateUrl: 'modules/notification/views/' + templateUrl,
                        resolve: {
                            data: function() {
                                return data;
                            }
                        },
                        controller: templateCtrl,
                    });
                    modalInstance.result.then(function(result) {
                        if (result === 'close') {
                            socketNcFunction.LoadListSended();
                        };
                    }, function(err) {
                        console.log($scope.kind + ".Notification.Detail", err);
                    });
                }
            };
        },
    };
});
