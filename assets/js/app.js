/*!
app.js
(c) 2019 IG PROG, www.igprog.hr
*/
angular.module('app', [])
.config(['$httpProvider', ($httpProvider) => {
    //*******************disable catche**********************
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
    }
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
    //*******************************************************
}])

.factory('f', ['$http', ($http) => {
    return {
        post: (service, method, data) => {
            return $http({
                url: './' + service + '.asmx/' + method,
                method: 'POST',
                data: data
            })
            .then((response) => {
                return JSON.parse(response.data.d);
            },
            (response) => {
                return response.data.d;
            });
        },
        setDate: (x) => {
            var day = x.getDate();
            day = day < 10 ? '0' + day : day;
            var mo = x.getMonth();
            mo = mo + 1 < 10 ? '0' + (mo + 1) : mo + 1;
            var yr = x.getFullYear();
            return yr + '-' + mo + '-' + day;
        }
    }
}])

.controller('appCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    var getConfig = function () {
        $http.get('../config/config.json')
          .then(function (response) {
              $rootScope.config = response.data;
          });
    };
    getConfig();
    $scope.year = (new Date).getFullYear();

    $scope.setService = (x) => {
        $rootScope.service = x;
    }
}])

.controller('reservationCtrl', ['$scope', '$http', '$rootScope', 'f', function ($scope, $http, $rootScope, f) {
    var webService = 'Reservation';
    $scope.loading = false;
    //$scope.service = $rootScope.service;
    $scope.config = $rootScope.config;

    var init = () => {
        f.post(webService, 'Init', {}).then((d) => {
            $scope.d = d;
            $scope.d.date = new Date();
        });
    }
    init();

    $scope.send = (d, service) => {
        if (service !== null) {
            d.service = service;
        }
        d.date = f.setDate(d.date);
        $scope.loading = true;
        f.post(webService, 'Send', { x: d }).then((d) => {
            $scope.d = d;
            $scope.loading = false;
        });
    }

}])

.controller('contactCtrl', ['$scope', '$http', '$rootScope', 'f', function ($scope, $http, $rootScope, f) {
    var webService = 'Contact';
    $scope.loading = false;
    var init = () => {
        f.post(webService, 'Init', {}).then((d) => {
            $scope.d = d;
        });
    }
    init();

    $scope.send = function (d) {
        $scope.loading = true;
        f.post(webService, 'Send', { x: d }).then((d) => {
            $scope.d = d;
            $scope.loading = false;
        })
    }

}])

.controller('adminCtrl', ['$scope', '$http', 'f', ($scope, $http, f) => {
    var service = 'Admin';
    var data = {
        admin: {
            userName: null,
            password: null
        },
        isLogin: false,
        inquiries: null
    }
    $scope.d = data;

    var loadInquiries = () => {
        f.post('Reservation', 'Load', {}).then((d) => {
            $scope.d.inquiries = d;
        });
    }

    $scope.login = (x) => {
        f.post(service, 'Login', { username: x.userName, password: x.password }).then((d) => {
            $scope.d.isLogin = d;
            if (d == true) {
                loadInquiries();
            }
        });
    }



}])

.controller("schedulerCtrl", ['$scope', '$http', '$rootScope', '$timeout', 'f', function ($scope, $http, $rootScope, $timeout, f) {
    var service = 'Scheduler';
    //$scope.id = '#myScheduler';
    $scope.room = 0;
    //$scope.uid = $rootScope.user.userId;

    var showScheduler = function () {
        YUI().use('aui-scheduler', function (Y) {
            var agendaView = new Y.SchedulerAgendaView();
            var dayView = new Y.SchedulerDayView();
            var weekView = new Y.SchedulerWeekView();
            var monthView = new Y.SchedulerMonthView();
            var eventRecorder = new Y.SchedulerEventRecorder({
                on: {
                    save: function (event) {
                        addEvent(this.getTemplateData(), event);
                    },
                    edit: function (event) {
                        addEvent(this.getTemplateData(), event);
                    },
                    delete: function (event) {
                        removeEvent(this.getTemplateData(), event);
                    }
                }
            });

            //$scope.id = $scope.uid == null ? 'myScheduler' : $scope.uid;

            new Y.Scheduler({
                activeView: weekView,
                boundingBox: '#myScheduler', // '#' + $scope.id,
                date: new Date(),
                eventRecorder: eventRecorder,
                items: $rootScope.events,
                render: true,
                views: [dayView, weekView, monthView, agendaView],
                strings: {
                    agenda: 'Dnevni red',
                    day: 'Dan',
                    month: 'Mjesec',
                    table: 'Tablica',
                    today: 'Danas',
                    week: 'Tjedan',
                    year: 'Godina'
                },
            }
            );
        });
    }

    //var getUsers = function () {
    //    $http({
    //        url: $sessionStorage.config.backend + 'Users.asmx/GetUsersByUserGroup',
    //        method: 'POST',
    //        data: { userGroupId: $rootScope.user.userGroupId }
    //    })
    //    .then(function (response) {
    //        $scope.users = JSON.parse(response.data.d);
    //        $scope.getSchedulerEvents($rootScope.user.userId);
    //    },
    //    function (response) {
    //        functions.alert($translate.instant(response.data.d));
    //    });
    //};

    $scope.getSchedulerEvents = function (uid) {
        f.post(service, 'GetSchedulerEvents', { room: $scope.room, uid: uid }).then((d) => {
            $rootScope.events = d;
            $timeout(function () {
                showScheduler();
            }, 200);
        });


        //$http({
        //    url: $sessionStorage.config.backend + webService + '/GetSchedulerEvents',
        //    method: 'POST',
        //    data: { user: $rootScope.user, room: $scope.room, uid: uid }
        //})
        //.then(function (response) {
        //    $rootScope.events = JSON.parse(response.data.d);
        //    $timeout(function () {
        //        showScheduler();
        //    }, 200);
        //},
        //function (response) {
        //    functions.alert($translate.instant(response.data.d));
        //});
    };
    //getUsers();
    $scope.getSchedulerEvents(null);

    var addEvent = function (x, event) {
        $rootScope.events.push({
            room: $scope.room,
            clientId: null,  // << TODO
            content: event.details[0].newSchedulerEvent.changed.content,
            endDate: x.endDate,
            startDate: x.startDate,
            userId: null
        });

        var eventObj = {};
        eventObj.room = $scope.room;
        eventObj.clientId = null;
        eventObj.content = event.details[0].newSchedulerEvent.changed.content == null ? x.content : event.details[0].newSchedulerEvent.changed.content;
        eventObj.endDate = x.endDate;
        eventObj.startDate = x.startDate;
        eventObj.userId = null;

        var eventObj_old = {};
        eventObj_old.room = $scope.room;
        eventObj_old.clientId = null;
        eventObj_old.content = angular.isUndefined(event.details[0].newSchedulerEvent.lastChange.content) ? x.content : event.details[0].newSchedulerEvent.lastChange.content.prevVal;
        eventObj_old.endDate = angular.isUndefined(event.details[0].newSchedulerEvent.lastChange.endDate) ? x.endDate : Date.parse(event.details[0].newSchedulerEvent.lastChange.endDate.prevVal);
        eventObj_old.startDate = angular.isUndefined(event.details[0].newSchedulerEvent.lastChange.startDate) ? x.startDate : Date.parse(event.details[0].newSchedulerEvent.lastChange.startDate.prevVal);
        eventObj_old.userId = null;
        remove(eventObj_old);

        $timeout(function () {
            save(eventObj);
        }, 500);
    }

    var save = function (x) {
        //if ($rootScope.user.licenceStatus == 'demo') {
        //    functions.demoAlert('the saving function is disabled in demo version');
        //    return false;
        //}
        //if ($rootScope.user.userType < 1) {
        //    functions.demoAlert('this function is available only in standard and premium package');
        //    return false;
        //}

        f.post(service, 'Save', { userGroupId: null, userId: null, x: x }).then((d) => {
            getAppointmentsCountByUserId();
        });

        //$http({
        //    url: $sessionStorage.config.backend + webService + '/Save',
        //    method: "POST",
        //    data: { userGroupId: $rootScope.user.userGroupId, userId: $rootScope.user.userId, x: x }
        //})
        //.then(function (response) {
        //    getAppointmentsCountByUserId();
        //},
        //function (response) {
        //    functions.alert($translate.instant(response.data.d));
        //});
    }

    var removeEvent = function (x, event) {
        var eventObj = {};
        eventObj.room = $scope.room;
        eventObj.clientId = null;
        eventObj.content = x.content;
        eventObj.endDate = x.endDate;
        eventObj.startDate = x.startDate;
        eventObj.userId = null;
        remove(eventObj);
    }

    var remove = function (x) {
        f.post(service, 'Delete', { userGroupId: null, userId: null, x: x }).then((d) => {
            getAppointmentsCountByUserId();
        });

        //$http({
        //    url: $sessionStorage.config.backend + webService + '/Delete',
        //    method: "POST",
        //    data: { userGroupId: $rootScope.user.userGroupId, userId: $rootScope.user.userId, x: x }
        //})
        //.then(function (response) {
        //    getAppointmentsCountByUserId();
        //},
        //function (response) {
        //    functions.alert($translate.instant(response.data));
        //});
    }

    //$scope.toggleTpl = function (x) {
    //    $rootScope.currTpl = './assets/partials/' + x + '.html';
    //};

    //var getAppointmentsCountByUserId = function () {
    //    $http({
    //        url: $sessionStorage.config.backend + webService + '/GetAppointmentsCountByUserId',
    //        method: 'POST',
    //        data: { userGroupId: $rootScope.user.userGroupId, userId: $rootScope.user.userId },
    //    }).then(function (response) {
    //        $rootScope.user.datasum.scheduler = JSON.parse(response.data.d);
    //    },
    //    function (response) {
    //        functions.alert($translate.instant(response.data.d));
    //    });
    //}

    //var removeAllEvents = function () {
    //    $http({
    //        url: $sessionStorage.config.backend + webService + '/RemoveAllEvents',
    //        method: 'POST',
    //        data: { userGroupId: $rootScope.user.userGroupId },
    //    }).then(function (response) {
    //        $scope.uid = null;
    //        getAppointmentsCountByUserId();
    //        $scope.toggleTpl('dashboard');
    //    },
    //    function (response) {
    //        functions.alert($translate.instant(response.data.d));
    //    });
    //}

    //$scope.removeAllEvents = function () {
    //    var confirm = $mdDialog.confirm()
    //            .title($translate.instant('remove all events') + '?')
    //            .ok($translate.instant('yes') + '!')
    //            .cancel($translate.instant('no'));
    //    $mdDialog.show(confirm).then(function () {
    //        removeAllEvents();
    //    }, function () {
    //    });
    //}

}])

/********** Directives **********/
.directive('reservationDirective', () => {
    return {
        restrict: 'E',
        scope: {
            service: '='
        },
        templateUrl: './assets/partials/reservation.html'
    };
})

.directive('detailsDirective', () => {
    return {
        restrict: 'E',
        scope: {
            service: '=',
            desc: '=',
            img: '=',
            price: '='
        },
        templateUrl: './assets/partials/details.html'
    };
})

.directive('navbarDirective', () => {
    return {
        restrict: 'E',
        scope: {
            site: '='
        },
        templateUrl: './assets/partials/navbar.html'
    };
})

.directive('cardDirective', () => {
    return {
        restrict: 'E',
        scope: {
            service: '=',
            desc: '=',
            link: '='
        },
        templateUrl: './assets/partials/card.html'
    };
})

.directive('allowOnlyNumbers', function () {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keydown', function (event) {
                var $input = $(this);
                var value = $input.val();
                value = value.replace(',', '.');
                $input.val(value);
                if (event.which == 64 || event.which == 16) {
                    return false;
                } else if (event.which >= 48 && event.which <= 57) {
                    return true;
                } else if (event.which >= 96 && event.which <= 105) {
                    return true;
                } else if ([8, 13, 27, 37, 38, 39, 40].indexOf(event.which) > -1) {
                    return true;
                } else if (event.which == 110 || event.which == 188 || event.which == 190) {
                    return true;
                } else if (event.which == 46) {
                    return true;
                } else {
                    event.preventDefault();
                    return false;
                }
            });
        }
    }
})
/********** Directives **********/


;