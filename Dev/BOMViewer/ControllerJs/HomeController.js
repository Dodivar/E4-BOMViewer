'use strict';

angular.module('BOMViewer')
    .controller('homeAccueil', homeAccueil);

homeAccueil.$inject = ['$scope', '$location', '$http', 'User'];


function homeAccueil($scope, $location, $http, User) {

    $scope.init = function () {
        
        $scope.adLogin = document.getElementById('profil').innerHTML;
        
        // API - Get true if user is already sign-in
        /*$http.get('api/Users/RegisterUser', { params: { login: $scope.adLogin } }).then(function (response) {

            if (!response.data) {
                
            }

        }).catch(function (response) {
            console.log(response);
        });*/

        // Affiche la liste des tables 
        $http({
            url: 'AllApi/GetViewList',
            method: 'GET',
            params: {
                ID_User: User.getID_User()
            }
        }).then(function (response) {
            //console.log(response.data);
            $scope.viewList = response.data;

            // Recoit la dernière vue utilisé
            $http({
                url: 'AllApi/GetLastViewUsed',
                method: 'GET',
                params: {
                    ID_User: User.getID_User()
                }
            }).then(function (response) {
                //console.log(response.data);
                $scope.lastViewUsed = response.data[0].ID_View;

                // WIDGET List of View
                $scope.listOfView = {
                    dataSource: $scope.viewList,
                    value: $scope.lastViewUsed,
                    closeOnOutsideClick: true,
                    placeholder: 'Sélectionner une vue',
                    displayExpr: 'ViewName',
                    valueExpr: 'ID_View',

                    onItemClick: function (e) {
                        //console.log(e.itemData);
                        User.setID_View(User.getID_User(), e.itemData.ID_View);
                    }
                }

            }).catch(function (response) {
                console.log(response);                
            });

        }).catch(function (response) {
            console.log(response);            
        });


      
    }
}


