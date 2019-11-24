/*!
app.js
(c) 2019 IG PROG, www.igprog.hr
*/
angular.module('app', [])

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

.controller('contactCtrl', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
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
        $http({ url: '../Mail.asmx/Send', method: 'POST',
            data: { name: d.name, email: d.email, messageSubject: 'Upit', message: d.message }
        }).then(function (response) {
           if (response.data.d == 'sent') {
               $scope.showAlert = true;
               $scope.sendicon = 'far fa-envelope';
               $scope.sendicontitle = 'Pošalji';
               window.location.hash = 'contact';
           } else {
               $scope.showAlert = false;
               $scope.sendicon = 'far fa-envelope';
               $scope.sendicontitle = 'Pošalji';
               alert(response.data.d);
           }
       },
       function (response) {
           $scope.showAlert = false;
           $scope.sendicon = 'far fa-envelope';
           $scope.sendicontitle = 'Pošalji';
           alert(response.data.d);
       });
    }

}])


;