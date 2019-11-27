/*!
app.js
(c) 2019 IG PROG, www.igprog.hr
*/
angular.module('app', [])

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
}])

.controller('reservationCtrl', ['$scope', '$http', 'f', function ($scope, $http, f) {
    var webService = 'Reservation';
    $scope.loading = false;
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

.controller('contactCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    var webService = 'Mail';
    $scope.showAlert = false;
    $scope.sendicon = 'far fa-envelope';
    $scope.sendicontitle = 'Pošalji';

    $scope.d = {
        name: '',
        email: '',
        message: ''
    }

    $scope.send = function (d) {
        $scope.isSendButtonDisabled = true;
        $scope.sendicon = 'fa fa-spinner fa-spin';
        $scope.sendicontitle = 'Šaljem';

        f.post(webService, 'Send', { name: d.name, email: d.email, messageSubject: 'Upit', message: d.message }).then((d) => {
            //alert(d.msg);
        })

       // $http({
       //     url: '../Mail.asmx/Send', method: 'POST',
       //     data: { name: d.name, email: d.email, messageSubject: 'Upit', message: d.message }
       // }).then(function (response) {
       //    if (response.data.d == 'sent') {
       //        $scope.showAlert = true;
       //        $scope.sendicon = 'far fa-envelope';
       //        $scope.sendicontitle = 'Pošalji';
       //        window.location.hash = 'contact';
       //    } else {
       //        $scope.showAlert = false;
       //        $scope.sendicon = 'far fa-envelope';
       //        $scope.sendicontitle = 'Pošalji';
       //        alert(response.data.d);
       //    }
       //},
       //function (response) {
       //    $scope.showAlert = false;
       //    $scope.sendicon = 'far fa-envelope';
       //    $scope.sendicontitle = 'Pošalji';
       //    alert(response.data.d);
       //});


    }

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
        templateUrl: './assets/partials/navbar.html'
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