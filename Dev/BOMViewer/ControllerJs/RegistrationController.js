'use strict';
angular.module('BOMViewer')
    .controller('registration', registration);



// Injection des dépendances des contrôleurs
registration.$inject = ['$scope', '$location', '$http', 'User'];


function registration($scope, $location, $http, User) {

    $scope.init = function () {
        
        $scope.adLogin = document.getElementById('profil').innerHTML;

    }

    // WIDGET - INPUT FIRSTNAME
    $scope.firstNameInput = {
        bindingOptions: {
            value: 'firstName'
        },
        placeholder: "Nom",
        showClearButton: true
    };

    // WIDGET - INPUT SURNAME
    $scope.surNameInput = {
        bindingOptions: {
            value: 'surName'
        },
        placeholder: "Prénom",
        showClearButton: true
    };

    // WIDGET - INPUT SURNAME
    $scope.login = {
        bindingOptions: {
            value: 'adLogin'
        },
        visible: true,
        disabled: true
    };

    // WIDGET - Btn Inscription
    $scope.registrationBtn = {
        text: "Inscription",
        type: "success",
        width: 200,
        onClick: function (e) {
            if ($scope.firstName == "" || $scope.surName == "")
                DevExpress.ui.notify("Le champ nom ou prénom est vide", "error", 2000);
            else {
                // Add user to DB
                $http.post('api/Users/AddUser?firstName=' + $scope.firstName + '&surName=' + $scope.surName + '&login=' + $scope.adLogin)
                    .then(function (response) {
                        console.log(response);

                        let idUser = response.data;
                        User.setID_User(idUser);

                        DevExpress.ui.notify("Bienvenue à vous " + $scope.surName + " !", "success", 2000);

                        // Redirect to home index, to see home page now we've connected, then display the message 'bienvenu a vous'

                        // Need just to return the id of User, here the reponse data return 0...
                    }).catch(function (response) {
                        console.log(response);
                        DevExpress.ui.notify("La création de votre utilisateur a échoué, veuillez contacter le support", "error", 2000);
                    });

                /*
                $http.put('api/Users/ModifyUser')                    
                .then(function (response) {
                    DevExpress.ui.notify("Bienvenu à vous " + $scope.surName + " !", "success", 2000);
                }).catch(function (response) {
                    console.log(response);
                    DevExpress.ui.notify("La création de votre utilisateur a échoué, veuillez contacter le support", "error", 2000);
                });
                */
            }

        }
    };

    function modifyCreatedUser (id_User) {
        $http.put('api/Users/ModifyUser', { params: {id: id_User, firstName: $scope.firstName, surName: $scope.surName}})
            .then(function (response) {
                DevExpress.ui.notify("Bienvenu à vous " + $scope.surName + " !", "success", 2000);
            }).catch(function (response) {
                console.log(response);
                DevExpress.ui.notify("La création de votre utilisateur a échoué, veuillez contacter le support", "error", 2000);
            });
    }
};


