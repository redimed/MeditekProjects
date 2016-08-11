var app = angular.module('app.authentication.notification.directive.global', []);

app.directive('notificationGlobal', function($uibModal) {
    return {
        restrict: 'EA',
        templateUrl: 'modules/notification/directives/templates/global.html',
        options: {
            scope: '='
        },
        controller: function($scope, notificationServices, toastr, $cookies, $state) {
            var self = $scope;

            var UserInfo = $cookies.getObject('userInfo');
            var roles = UserInfo.roles;
            var Role = [];
            var queue = 'GLOBALNOTIFY';

            for (var i = 0; i < roles.length; i++) {
                Role.push(roles[i].RoleCode);
            };

            self.searchg = {
                UID: UserInfo.UID,
                Role: Role,
                queue: queue
            };

            self.itemSearchg = [
                { field: "SenderAccount", name: "Sender" },
                { field: "Receiver", name: "Receiver" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Object", name: "Object" }
            ];

            self.itemDefaultg = [
                { field: "SenderAccount", name: "Sender" },
                { field: "Receiver", name: "Receiver" },
                { field: "Subject", name: "Subject" },
                { field: "MsgContent", name: "Content" },
                { field: "Object", name: "Object" },
                { field: "CreatedDate", name: "Created Date" }
            ];

            self.fieldSort = {};
            self.items = self.items != null && self.items != undefined ? self.items : self.itemDefault;

            self.fieldSort['CreatedDate'] = 'ASC';

            function LoadListGlobalNotify(info) {
                notificationServices.LoadListGlobalNotify(info).then(function(data) {
                    for (var i = 0; i < data.data.length; i++) {
                        data.data[i].MsgContent = JSON.parse(data.data[i].MsgContent);
                        if (data.data[i].Read.indexOf(UserInfo.UID) === -1) {
                            data.data[i].iRead = 'N'
                        };
                    };
                    console.log("LoadListGlobalNotify", data);
                    self.listGlobalNotify = data.data;
                    self.countg = data.countAll;
                });
            };

            self.initg = function() {
                console.log("||||||||", self.itemDefault);

                self.searchObject = {
                    limit: 5,
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
                self.searchgObjectMap = angular.copy(self.searchObject);
                LoadListGlobalNotify(self.searchgObjectMap);
            };

            self.initg();

            self.setPageg = function() {
                self.searchgObjectMap.offset = (self.searchgObjectMap.currentPage - 1) * self.searchgObjectMap.limit;
                LoadListGlobalNotify(self.searchgObjectMap);
            };

            self.Searchg = function(data) {
                (self.fromCreateDate && self.fromCreateDate !== null) ? data.FromCreatedDate = moment(self.fromCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.FromCreatedDate = null;
                (self.toCreateDate && self.toCreateDate !== null) ? data.ToCreatedDate = moment(self.toCreateDate, 'DD/MM/YYYY').format('YYYY-MM-DD HH:mm:ss Z'): data.ToCreatedDate = null;
                self.searchgObjectMap.Search = data;
                LoadListGlobalNotify(self.searchgObjectMap);
            };

            self.sort = function(field, sort) {
                self.isClickASC = false;
                if (sort === "ASC") {
                    self.isClickASC = true;
                    self.fieldSort[field] = 'DESC';
                } else {
                    self.isClickASC = false;
                    self.fieldSort[field] = 'ASC';
                }
                if (field == 'SenderAccount') {
                    field = 'SenderAccount.UserName';
                }
                var data = field + ' ' + sort;
                self.searchgObjectMap.order = data;
                LoadListGlobalNotify(self.searchgObjectMap);
            };

            socketNcFunction.LoadListGlobal = function() {
                self.initg();
            };

            self.openCreate = function(data) {
                var modalInstance = $uibModal.open({
                    animation: true,
                    size: 'lg', // windowClass: 'app-modal-window', 
                    templateUrl: 'modules/notification/views/notificationGlobalCreate.html',
                    resolve: {
                        data: function() {
                            return data;
                        },
                    },
                    controller: 'notificationGlobalCreateCtrl',
                });
                modalInstance.result.then(function(result) {
                    if (result.message === 'success') {
                        if (socketNcFunction.LoadListGlobal) {
                            socketNcFunction.LoadListGlobal();
                        };
                        if (socketNcFunction.LoadListSendedGlobal) {
                            socketNcFunction.LoadListSendedGlobal();
                        };
                    };
                }, function(err) {
                    console.log("Global.Notification.Create", err);
                });
            };

            self.openDetail = function(data) {
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
                            socketNcFunction.LoadListGlobal();
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
                        self.initg();
                        if (socketNcFunction.LoadGlobalNotify) {
                            socketNcFunction.LoadGlobalNotify("msg");
                        };
                    }, function(err) {
                        console.log("GlobalNotify.ChangeReadQueueJobg", err);
                    });
                };
            };

            ComponentsDateTimePickers.init();
        },
    };
});
