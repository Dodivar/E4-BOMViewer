﻿'use strict';
var BOMViewer = angular.module('BOMViewer');
BOMViewer
    .controller('UserSetting', UserSetting)


UserSetting.$inject = ['$scope', '$location', '$localStorage', '$http', 'User', 'localstorage'];


// COLOR BOX \\        
function UserSetting($scope, $location, $localStorage, $http, User, localstorage) {

    // To know if the user have checked or not the DisplayDeletedLine
    $http({
        url: 'Api/GetSettingDisplayDeletedLine',
        method: 'GET',
        params: {
            ID_User: User.getID_User()
        }
    }).then(function (response) {
        var result = response.data[0].CustomSettingValue;
        //console.log(result);
        if (result == 1)
            $scope.displayDeletedLine = true 
        else
            $scope.displayDeletedLine = false

    }), function (response) {
        console.log(response);
        alert(reponse);
    };



    $scope.$storage = $localStorage.$default({
        bool: false
    });
    //console.log($scope.$storage.bool);

    $scope.bool = false;

    var applyButton = "Valider";
    var cancelButton = "Annuler";

    // Store colorValue from database
    User.getColor(User.getID_User()).then(function (response) {

        $scope.ColorValue = localstorage.getObject('colorValue', 'erreur colorValue');

        $scope.colorBox = {
            Commande: {
                bindingOptions: {
                    value: 'ColorValue.Commande'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Commande",
                lib: "Commande"
            },
            Ligne: {
                bindingOptions: {
                    value: 'ColorValue.Ligne'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "N° de Ligne",
                lib: "Ligne"
            },
            Pere: {
                bindingOptions: {
                    value: 'ColorValue.Pere'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Père (P)",
                lib: "Pere"
            },
            Fils: {
                bindingOptions: {
                    value: 'ColorValue.Fils'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Nomenclature Fils (N)",
                lib: "Fils"
            },
            Virtuelle: {
                bindingOptions: {
                    value: 'ColorValue.Virtuelle'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Virtuelle (V)",
                lib: "Virtuelle"
            },
            Usinage: {
                bindingOptions: {
                    value: 'ColorValue.Usinage'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Usinage (U)",
                lib: "Usinage"
            },
            EtapeUsi: {
                bindingOptions: {
                    value: 'ColorValue.EtapeUsi'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Etape Usinage (S)",
                lib: "EtapeUsi"
            },
            MatiereGen: {
                bindingOptions: {
                    value: 'ColorValue.MatiereGen'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Matière générée (G)",
                lib: "MatiereGen"
            },
            IPM: {
                bindingOptions: {
                    value: 'ColorValue.IPM'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Infos Processus Matière (I)",
                lib: "IPM"
            },
            Fabrication: {
                bindingOptions: {
                    value: 'ColorValue.Fabrication'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Fabrication (F)",
                lib: "Fabrication"
            },
            GammeOpe: {
                bindingOptions: {
                    value: 'ColorValue.GammeOpe'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Gamme d'opération (O)",
                lib: "GammeOpe"
            },
            PDC: {
                bindingOptions: {
                    value: 'ColorValue.PDC'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Poste De Charge (W)",
                lib: "PDC"
            },
            InfosProcPDC: {
                bindingOptions: {
                    value: 'ColorValue.InfosProcPDC'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Infos Processus PDC (Ip)",
                lib: "InfosProcPDC"
            },
            LigneColis: {
                bindingOptions: {
                    value: 'ColorValue.LigneColis'
                },
                applyValueMode: 'instantly',
                applyButtonText: applyButton,
                cancelButtonText: cancelButton,
                editAlphaChannel: $scope.$storage.bool,
                text: "Ligne colis (L)",
                lib: "LigneColis"
            }
        };

        // To keep data of the original value in case of the user want to cancel his changes
        $scope.colorValueOriginal = 'C=' + $scope.ColorValue.Commande + ';A=' + $scope.ColorValue.Ligne + ';P=' + $scope.ColorValue.Pere + ';N=' + $scope.ColorValue.Fils + ';V='
            + $scope.ColorValue.Virtuelle + ';U=' + $scope.ColorValue.Usinage + ';S=' + $scope.ColorValue.EtapeUsi + ';G=' + $scope.ColorValue.MatiereGen + ';I=' + $scope.ColorValue.IPM + ';F=' + $scope.ColorValue.Fabrication
            + ';O=' + $scope.ColorValue.GammeOpe + ';W=' + $scope.ColorValue.PDC + ';Ip=' + $scope.ColorValue.InfosProcPDC + ';L=' + $scope.ColorValue.LigneColis;
    }).catch(function (error) {
        DevExpress.ui.notify('Erreur ! Importation des couleurs en échec', "error", 5000)
    });
    

    
    // To enable "editAlphaChannel" for colorBox
    $scope.checkBox = {
        forDeletedLine: {
            bindingOptions: {
                value: 'displayDeletedLine'
            },
            text: "Afficher les lignes supprimées"
        }  
    };


    $scope.reload = function ($location) {
        $scope.$storage.bool = !$scope.$storage.bool;
        //console.log($scope.$storage.bool);
        location.replace('Custom/UserSetting');
    };
    
    

    // Widget Bouton apply
    $scope.applyButton = {
        text: "Sauvegarder",
        type: "success",
        width: 250,
        onClick: function (e) { 
            var colorObj = $scope.ColorValue;                        
            var colorList = 'C=' + colorObj.Commande + ';A=' + colorObj.Ligne + ';P=' + colorObj.Pere + ';N=' + colorObj.Fils + ';V='
                + colorObj.Virtuelle + ';U=' + colorObj.Usinage + ';S=' + colorObj.EtapeUsi + ';G=' + colorObj.MatiereGen + ';I=' + colorObj.IPM + ';F=' + colorObj.Fabrication
                + ';O=' + colorObj.GammeOpe + ';W=' + colorObj.PDC + ';Ip=' + colorObj.InfosProcPDC + ';L=' + colorObj.LigneColis

            User.setColor(User.getID_User(), colorList);   

            console.log($scope.forDeletedLine);

            $http({
                url: 'Api/UpdateSettingDisplayDeletedLine',
                method: 'GET',
                params: {
                    ID_User: User.getID_User(),
                    value: $scope.displayDeletedLine ? 1 : 0
                }
            }).then(function (response) {                
                //console.log(response.data);                
            }), function (response) {
                console.log(response);
                alert(reponse);
            };
        }
    };

    // Widget Bouton cancel
    $scope.cancelButton = {
        text: "Annuler",
        type: "danger",
        width: 150,
        onClick: function (e) {
            User.setColor(User.getID_User(), $scope.colorValueOriginal)           
        }
    };

}
