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
            var self = $scope;

            var UserInfo = $cookies.getObject('userInfo');
            var userUID = UserInfo.UID;
            var queue = 'NOTIFY';

            self.search = {
                userUID: userUID,
                queue: queue
            };

            self.fieldSort = {};

            self.itemSearch = [
                { field: "SenderAccount", name: "Sender" },
                { field: "ReceiverAccount", name: "Receiver" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Object", name: "Object" }
            ];

            self.itemDefault = [
                { field: "SenderAccount", name: "Sender" },
                { field: "ReceiverAccount", name: "Receiver" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Object", name: "Object" },
                { field: "CreatedDate", name: "Created Date" }
            ];

            self.fieldSort['CreatedDate'] = 'ASC';

            self.loadListPrivateNotify = function(info) {
                notificationServices.getListNotifySearch(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                    };
                    console.log("listNotifySearch", data.data);
                    self.listPrivateNotify = data.data;
                    self.count = data.countAll;
                });
            };

            self.init = function() {
                self.searchObject = {
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
                self.searchObjectMap = angular.copy(self.searchObject);
                self.loadListPrivateNotify(self.searchObjectMap);
            };

            self.init();

            self.setPage = function() {
                self.searchObjectMap.offset = (self.searchObjectMap.currentPage - 1) * self.searchObjectMap.limit;
                self.loadListPrivateNotify(self.searchObjectMap);
            };

            self.Search = function(data, e) {
                try {
                    (self.fromCreateDate && self.fromCreateDate !== null) ? data.FromCreatedDate = moment(self.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.FromCreatedDate = null;
                    (self.toCreateDate && self.toCreateDate !== null) ? data.ToCreatedDate = moment(self.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.ToCreatedDate = null;
                    self.searchObjectMap.Search = data;
                    self.loadListPrivateNotify(self.searchObjectMap);
                } catch (err) {
                    console.log(err);
                };
            };

            self.sort = function(field, sort) {
                self.isClickASC = false;
                console.log("Hello");
                if (sort === "ASC") {
                    self.isClickASC = true;
                    self.fieldSort[field] = 'DESC';
                } else {
                    self.isClickASC = false;
                    self.fieldSort[field] = 'ASC';
                };
                if (field === 'Action') {
                    field = 'MsgContent';
                };
                if (field === 'Time') {
                    field = 'CreatedDate';
                };
                var data = '';
                data = field + ' ' + sort;

                self.searchObjectMap.order = data;
                self.loadListPrivateNotify(self.searchObjectMap);
            };

            // Go to state
            self.gotoUrl = function(queuejob) {
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
                            self.init();
                        };
                    }, function(err) {
                        console.log("updateReadQueueJob ", err);
                    });
                    if (ioSocket.telehealthNotify()) {
                        ioSocket.telehealthNotify('');
                    };
                };
            };

            self.create = function(data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    // size: 'lg', // 
                    windowClass: 'app-modal-window', 
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
                self.init();
            };

            ComponentsDateTimePickers.init();
        },
    };
});
