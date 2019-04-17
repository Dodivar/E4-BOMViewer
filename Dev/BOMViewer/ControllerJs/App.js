'use strict';

var app = angular.module('BOMViewer', ['ngRoute', 'ngStorage', 'dx']);


  // Système de routages
app.config(["$routeProvider", "$locationProvider",
        function ($routeProvider, $locationProvider) {
            

            
            $routeProvider.when("/", {
                templateUrl: "Home/Index",
                controller: "homeAccueil"
            })
            
            .when("/Search/Recherche", {
                templateUrl: "Search/Recherche",
                controller: "searchRecherche"
            })

            .when("/Search", {
                templateUrl: "Search",
                controller: "searchRecherche"
            })
/*
            // Route to display order with some params
            .when("/Search/:agence/:order:/bib", {
                templateUrl: "Search/Index",
                controller: "searchRecherche"
            })
*/                        
            .when("/View/", {
                templateUrl: "View",
                controller: "view"
            })
            .when("/View/Custom", {
                templateUrl: "View/Custom",
                controller: "customView"
            })

            .when("/UserSetting", {
                templateUrl: "UserSetting",
                controller: "UerSetting"
            })
            /*
            $routeProvider.otherwise({
                redirectTo: '/'
            });*/

            $locationProvider.html5Mode(true).hashPrefix("!");            
        }
    ]);


// Au lancement de l'application
app.run(function ($rootScope, $http) {
    // Ne s'exécute seulement après les autres controlleurs..
});


app
    .factory('User', ['$http', 'localstorage', function ($http, localstorage) {
        var ID_User = 2;
        var color; // texte JSON de la couleur des types de ligne 
        var colorValue; // Objet avec toutes les valeurs de couleur par nom de ligne (ex : Commande, Père, Fils...)
        var ID_View;

        return {
            getID_User: function () {
                return ID_User;
            },

            setID_User: function (value) {
                ID_User = value;
            },

            getColor: function (ID_User) {
                return $http({
                    url: 'AllApi/GetUserColorSetting',
                    method: 'GET',
                    params: {
                        ID_User: ID_User
                    }
                }).then(function (response) {
                    var userColorSetting = response.data;
                    //console.log(userColorSetting);

                    var colorValue = {
                        Commande: userColorSetting[0].Color,
                        Ligne: userColorSetting[1].Color,
                        Pere: userColorSetting[2].Color,
                        Fils: userColorSetting[3].Color,
                        Virtuelle: userColorSetting[4].Color,
                        Usinage: userColorSetting[5].Color,
                        EtapeUsi: userColorSetting[6].Color,
                        MatiereGen: userColorSetting[7].Color,
                        IPM: userColorSetting[8].Color,
                        Fabrication: userColorSetting[9].Color,
                        GammeOpe: userColorSetting[10].Color,
                        PDC: userColorSetting[11].Color,
                        InfosProcPDC: userColorSetting[12].Color,
                        LigneColis: userColorSetting[13].Color
                    };
                    localstorage.setObject('colorValue', colorValue);
                })

                //console.log(localstorage.getObject('colorValue', "colorValue erreur"));
            },

            setColor: function (ID_User, colorValueList) {
                $http({
                    url: 'AllApi/UpdateUserColorSetting',
                    method: 'GET',
                    params: {
                        ID_User: ID_User,
                        ColorValueList: colorValueList
                    }
                }).then(function (response) {
                    //console.log(response.data);
                    DevExpress.ui.notify("Jeu de couleur sauvegardé pour votre profil !", "success", 3000)

                }), function (response) {
                    console.log(response);
                };
            },

            setID_View: function (user, view) {
                $http({
                    url: 'AllApi/UpdateLastViewUsed',
                    method: 'GET',
                    params: {
                        ID_User: user,
                        ID_View: view
                    }
                }).then(function (response) {
                    //console.log(response.data);                    
                }), function (response) {
                    console.log(response);
                    alert(reponse);
                };

                localstorage.set('ID_View', view)
                ID_View = view;
            },

            getID_View: function (user) {
                $http({
                    url: 'AllApi/GetLastViewUsed',
                    method: 'GET',
                    params: {
                        ID_User: user
                    }
                }).then(function (response) {
                    //console.log(response.data);                
                    localstorage.set('ID_View', response.data[0].ID_View)

                }), function (response) {
                    console.log(response);
                    alert(reponse);
                };

                ID_View = localstorage.get('ID_View', null)
                return ID_View;
            }
        };
    }]);

app
    .factory('Order', ['$http', 'localstorage', function ($http, localstorage) {
        // All data needed for an order
        var Order = {
            IdOrder: 0,
            OrderNumber: 0, 
            Library: '',
            Agency: '',
            AgencyText: '',
            Line: 0,
            Version: 0
        };        

        return {
            // Open new tab to load TreeView
            sendToTreeView: function (data) {
                let TreeViewPage = window.open("Search/Treeview");
                TreeViewPage.idOrder = data.idOrder;
                TreeViewPage.orderNumber = data.orderNumber;
                TreeViewPage.library = data.library;
                TreeViewPage.agency = data.agency;
                TreeViewPage.agencyText = data.agencyText;
                TreeViewPage.line = data.line;
                TreeViewPage.lineText = data.lineText;
                TreeViewPage.version = data.version;
            },

            importOrderLineFromAS400: function (order) {
                $http({
                    url: 'AllApi/ImportOrderLineFromAS400',
                    method: 'GET',
                    params: {
                        Library: order.library,
                        Agency: order.agency,
                        Order: order.order,
                        Line: order.line
                    }
                }).then(function (response) {                    
                    var IdOrderNumber = response.data;

                    if (isNaN(IdOrderNumber) || IdOrderNumber === -1) {
                        DevExpress.ui.notify('Aucune commande trouvée ! [' + order.orderNumber + '] - [' + order.agency + '] (' + order.library + ')', "error", 3000);
                        $scope.popup = false;
                    }
                    else {
                        var OrderData = {
                            IdOrder: IdOrderNumber,
                            OrderNumber: order.orderNumber,
                            Library: order.library,
                            Agency: order.agency,
                            AgencyText: '',
                            Line: order.Line,
                            Version: 1
                        }
                    }
                    console.log(OrderData);
                }), function (response) {
                    console.log(response);
                    alert(reponse);
                };
            }
        }
    }]);

app
    .factory('ViewSetting', [function () {
        var primaryList; // Liste principal après modification (champ colonne)
        var secondaryList; // Liste détail après modification
        var primaryListInitial; // Liste principal initiale (lors du chargement de la vue)
        var secondaryListInitial; // Liste détail initiale
        var listLine; // liste de filtrage des types de ligne
        var listLineInitial; // liste intiale de filtrage des types de ligne
        var idTypeLine;
        var isChangedField; // Savoir si la conf. des colonnes  doit être sauvegarder lors du clique Sauvegade/Annule
        var isChangedLine;// Savoir si la conf. des lignes  doit être sauvegarder lors du clique Sauvegade/Annule
        var view;

        return {
            getPrimaryList: function () {
                return primaryList;
            },
            setPrimaryList: function (value) {
                primaryList = value;
            },
            getSecondaryList: function () {
                return secondaryList;
            },
            setSecondaryList: function (value) {
                secondaryList = value;
            },
            getPrimaryListInitial: function () {
                return primaryListInitial;
            },
            setPrimaryListInitial: function (value) {
                primaryListInitial = value;
            },
            getSecondaryListInitial: function () {
                return secondaryListInitial;
            },
            setSecondaryListInitial: function (value) {
                secondaryListInitial = value;
            },
            getIdTypeLine: function () {
                return idTypeLine;
            },
            setIdTypeLine: function (value) {
                idTypeLine = value;
            },
            getListLine: function () {
                return listLine;
            },
            setListLine: function (value) {
                listLine = value;
            },
            setListLineInitial: function (value) {
                listLineInitial = value;
            },
            getListLineInitial: function () {
                return listLineInitial;
            },
            setIsChangedField: function (value) {
                isChangedField = value;
            },
            getIsChangedField: function () {
                return isChangedField;
            },
            setIsChangedLine: function (value) {
                isChangedLine = value;
            },
            getIsChangedLine: function () {
                return isChangedLine;
            }
        };
    }]);

app
    .factory('ViewSettingQuery', ['$http', 'ViewSetting', function ($http, ViewSetting) {
        var primaryList;
        var primaryListInitial;
        var secondaryList;
        var secondaryListInitial;
        var i;

        return {

            getPreferenceColumnOfView: function (ID_View, ID_SubLevel) {
                $http({
                    url: 'AllApi/GetPreferenceColumnOfView',
                    method: 'GET',
                    params: {
                        idView: ID_View,
                        idSubLevel: ID_SubLevel
                    }
                }).then(function (response) {
                    primaryList = [];
                    secondaryList = [];
                    i = 0;
                    while (i !== response.data.length) {
                        if (response.data[i].DetailLevel === 0) {
                            primaryList.push(response.data[i].key); // KEY = ID_Column + _ + ID_TableSubLevel
                        }
                        else {
                            secondaryList.push(response.data[i].key);
                        }
                        i++;
                    }
                    //console.log(primaryList);
                    //console.log(secondaryList);

                    ViewSetting.setPrimaryList(primaryList);
                    ViewSetting.setSecondaryList(secondaryList);
                    
                }), function (response) {
                    console.log(response);
                    };
            },

            getPreferenceColumnOfViewAll: function (ID_View) {
                $http({
                    url: 'AllApi/GetPreferenceColumnOfViewAll',
                    method: 'GET',
                    params: {
                        idView: ID_View
                    }
                }).then(function (response) {
                    let primaryListInitial = [];
                    let secondaryListInitial = [];
                    i = 0;
                    while (i !== response.data.length) {
                        if (response.data[i].DetailLevel === 0) {
                            primaryListInitial.push(response.data[i].key);
                        }
                        else {
                            secondaryListInitial.push(response.data[i].key);
                        }
                        i++;
                    }
                    //console.log(primaryListInitial);
                    //console.log(secondaryListInitial);

                    ViewSetting.setPrimaryListInitial(primaryListInitial);
                    ViewSetting.setSecondaryListInitial(secondaryListInitial);
                }).catch(function (response) {
                    console.log(response);
                });
            },

            updatePreferenceColumnOfView: function (ID_View, ID_SubLevel, primaryList, secondaryList) {
                $http({
                    url: 'AllApi/UpdatePreferenceColumnOfView',
                    method: 'GET',
                    params: {
                        idView: ID_View,
                        idSubLevel: ID_SubLevel,
                        primaryList: primaryList,
                        secondaryList: secondaryList
                    }
                }).then(function (response) {
                    //console.log(response.data);
                    if (response.data === 'False') {
                        DevExpress.ui.notify('Erreur ! Sauvegarde échouée... (field)', "error", 1500)
                    }
                    else {
                        DevExpress.ui.notify('Sauvegarde de la ligne réussie (field)', "success", 300);
                    }

                }), function (response) {
                    console.log(response);
                    alert(reponse);
                };
            },

            updatePreferenceColumnOfViewAll: function (ID_View, primaryList, secondaryList) {
                $http({
                    url: 'AllApi/UpdatePreferenceColumnOfViewAll',
                    method: 'POST',
                    // params: FOR URL, data is for body
                    data: {
                        idView: ID_View,
                        primaryList: primaryList,
                        secondaryList: secondaryList
                    }
                }).then(function (response) {
                    //console.log(response.data);
                    if (response.data === 'False') {
                        DevExpress.ui.notify('Erreur ! Annulation des modifications échouée... (field)', "error", 1500)
                    }
                    else {
                        DevExpress.ui.notify('Annulation des modifications de l\'affichage des champs réussie', "success", 1500);
                    }
                }).catch(function (response) {
                    console.log(response);                    
                });
            }
        };
    }]);

app
    .factory('localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue || false;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key, defaultValue) {
                if ($window.localStorage[key] != undefined) {
                    return JSON.parse($window.localStorage[key]);
                } else {
                    return defaultValue || false;
                }
            },
            remove: function (key) {
                $window.localStorage.removeItem(key);
            },
            clear: function () {
                $window.localStorage.clear();
            }
        }
    }]);
