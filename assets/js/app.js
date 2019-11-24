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
    var webService = 'Mail';
    var d = {
        service: null,
        date: new Date(),
        time: null,
        name: null,
        phone: ''
    }
    $scope.d = d;

    $scope.send = function (d) {
        alert('TODO'); return false;
        f.post(webService, 'SendReservation', { x: d }).then((d) => {
            //alert(d.msg);
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


;