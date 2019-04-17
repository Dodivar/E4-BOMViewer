'use strict';

angular.module('BOMViewer')
    .controller('view', view)
    .controller('customView', customView)    
    .controller('customViewField', customViewField)
    .controller('customViewLine', customViewLine);   

// Injection des dépendances des contrôleurs
view.$inject = ['$scope', '$http', '$window', 'User'];
customView.$inject = ['$scope', '$location', '$http', '$window', '$route', 'ViewSetting', 'ViewSettingQuery', 'User'];
customViewField.$inject = ['$scope', '$http', '$q', '$timeout', 'User', 'ViewSetting', 'ViewSettingQuery'];
customViewLine.$inject = ['$scope', '$http', 'ViewSetting', 'ViewSettingQuery', 'User'];

// HOME | SELECT - CREATE - DELETE \\
function view($scope, $http, $window, User) {

    $scope.viewName = "";
    $scope.viewDesc = "";

    $scope.init = function () {

        // API - Get view list
        $http.get('api/Views/GetViews', { params: { id_User: User.getID_User() } }).then(function (response) {
            $scope.viewList = response.data;
        });

        // API - Get view list created by user or Team view
        $http.get('api/Views/GetUserViews', { params: { id_User: User.getID_User() } }).then(function (response) {
            $scope.userViewList = response.data;
        });        
    };

    // FUNCTION - Allow to reload list of view when we delete or add a new view
    var reloadList = function () {
        // API - Get view list
        $http.get('api/Views/GetViews', { params: { id_User: User.getID_User() } }).then(function (response) {
            $scope.viewList = response.data;
        });

        // API - Get view list created by user
        $http.get('api/Views/GetUserViews', { params: { id_User: User.getID_User() } }).then(function (response) {
            $scope.userViewList = response.data;
        });       
    };

    //WIDGET List of view to modify
    $scope.listOfView = {
        bindingOptions: {
            items: "userViewList"
        },
        showPopupTitle: false,
        closeOnOutsideClick: true,
        placeholder: "Sélectionner une vue",
        displayExpr: "ViewName",        
        onItemClick: function (e) {
            let custom = window.open("View/Custom");
            custom.viewName = e.itemData.ViewName;
            custom.viewDesc = e.itemData.ViewDesc;
            custom.IdViewSelected = e.itemData.ID_View;
        }
    };

    // WIDGET - INPUT VIEW NAME
    $scope.viewNameInput = {
        bindingOptions: {
            value: 'viewName'
        },
        placeholder: "Nom de la vue...",
        showClearButton: true
    };

    // WIDGET - INPUT VIEW DESC
    $scope.viewDescInput = {
        bindingOptions: {
            value: 'viewDesc'
        },
        placeholder: "Description de la vue...",
        showClearButton: true
    };

    // WIDGET - Btn Créer
    $scope.createViewBtn = {
        text: "Créer",
        type: "success",
        width: 200,
        onClick: function (e) {
            if ($scope.viewName == "" || $scope.viewDesc == "")
                DevExpress.ui.notify("Le nom ou la description de la vue n'est pas renseigné", "error", 2000);
            else {                
                $http.post('api/Views/CreateView?id_User=' + User.getID_User() + '&name='+ $scope.viewName +'&desc='+ $scope.viewDesc).then(function (response) {                
                    DevExpress.ui.notify("Votre vue a bien été enregistrée !", "success", 2000);
                    reloadList();
                }).catch(function (response) {
                    console.log(response);                   
                    DevExpress.ui.notify("Votre vue n'a pas pus être enregistrée...", "error", 2000);                    
                });
            }

        }
    };

    //WIDGET List of the user view 
    $scope.listOfViewDeletable = {
        bindingOptions: {
            items: "userViewList"
        },
        showPopupTitle: false,
        closeOnOutsideClick: true,
        placeholder: "Sélectionner une vue",
        displayExpr: "ViewName",     
        onContentReady: function(e) {
            $scope.listOfViewDeletableComponent = e.component;
        },
        onItemClick: function (e) {
            $scope.ViewNameToDelete = e.itemData.ViewName;
            $scope.ViewDescToDelete = e.itemData.ViewDesc;
            $scope.IdViewToDelete = e.itemData.ID_View;
        }
    };

    // WIDGET - Btn Supprimer
    $scope.deleteViewBtn = {
        text: "Supprimer",
        type: "danger",
        width: 200,
        onClick: function (e) {
            $http.delete('api/Views/DeleteView', { params: { id_User: User.getID_User(), id_View: $scope.IdViewToDelete } }).then(function (reponse) {
                DevExpress.ui.notify("Suppression de la vue [" + $scope.ViewNameToDelete + "] validé !", "success", 2000);
                reloadList();
            }).catch(function (response) {
                console.log(response);
                DevExpress.ui.notify("Suppression de la vue [" + $scope.ViewNameToDelete + "] en échec...", "error", 2000);
            });

        }
    };
}

function customView($scope, $location, $http, $window, $route, ViewSetting, ViewSettingQuery, User) {    

    // Accordion
    $scope.animationDuration = 300;
    $scope.collapsible = true;
    $scope.multiple = true;
    $scope.selectedItems = false; // No one will be expanded by defaultz    
    $scope.listColumnViewEnable = false; /// To enable the saving of preference column view

    ViewSetting.setIsChangedField(false); // De base les 2 options ne peuvent être sauvegarder tant qu'il n'y a pas de modification
    ViewSetting.setIsChangedLine(false);

    // IF COME FROM TV CONTEXT MENU 
    if (window.lineTable && window.lineType && window.view) {
        DevExpress.ui.notify("La ligne peut être modifiée", "info", 2000);
    }
    else {    
        // GET DATA OF VIEW FROM 'view' ControllerJS
        $scope.view = {
            name: window.viewName,
            desc: window.viewDesc,
            id: window.IdViewSelected
        };                
    }


    // WIDGET - Btn apply
    $scope.applyButtonOptions = {
        text: "Sauvegarder",
        type: "success",
        width: 300,    
        onClick: function (e) {
            //console.log($scope.view.id, ViewSetting.getIdTypeLine(), ViewSetting.getPrimaryList(), ViewSetting.getSecondaryList());

            if (ViewSetting.getIsChangedField() === true) {
                ViewSettingQuery.updatePreferenceColumnOfView($scope.view.id, ViewSetting.getIdTypeLine(), ViewSetting.getPrimaryList(), ViewSetting.getSecondaryList());
            }

            $scope.lineSelectedFiltered = [];
            $(".line.selected").each(function (index) {
                let lineId = $(this).data("id");                
                $scope.lineSelectedFiltered.push(lineId);
            });

            ViewSetting.setListLine($scope.lineSelectedFiltered.join(','));

            // API - Update Preference Line Of View
            $http.post('api/Views/UpdatePreferenceLineOfView?id_View=' + $scope.view.id + '&listLine=' + ViewSetting.getListLine())
                .then(function (response) {                     
                    if (response.data == -1)                      
                        DevExpress.ui.notify('Sauvegarde du filtrage des lignes réussie', "success", 2000);
                    
                }).catch(function (response) {
                    console.log(response);
                    DevExpress.ui.notify("Erreur lors de la sauvegarde des modifications du filtrage des lignes...", "error", 2000);
                });
            
        }
    };

    // WIDGET - Btn cancel
    /*$scope.cancelButtonOptions = {
        text: "Annuler",
        type: "danger",
        width: 150,   
        onClick: function (e) {                     
             DON'T CANCEL FIELD BECAUSE REQUEST IS TOO LONG TO PERFORM
             * if (ViewSetting.getIsChangedField()) 
            {
                //Only if one column is selected in primary list
                ViewSettingQuery.updatePreferenceColumnOfViewAll($scope.view.id, ViewSetting.getPrimaryListInitial(), ViewSetting.getSecondaryListInitial());

                $scope.selectedItemsPrimary = ViewSetting.getPrimaryListInitial();
                $scope.selectedItemsSecondary = ViewSetting.getSecondaryListInitial();
                ViewSetting.setPrimaryList($scope.selectedItemsPrimary);
                ViewSetting.setSecondaryList($scope.selectedItemsSecondary);
            }

            // API - Update Preference Line Of View
            $http.post('api/Views/UpdatePreferenceLineOfView?id_View=' + $scope.view.id + '&listLine=' + ViewSetting.getListLineInitial())
            .then(function (response) {
                if (response.data == -1)
                    DevExpress.ui.notify('Annulation des moficiations du filtrage des lignes réussie', "success", 2000);
            }).catch(function (response) {
                console.log(response);
                DevExpress.ui.notify("Erreur lros de l\'annulation des modifications du filtrage des lignes...", "error", 2000);
            });
        }
    };*/



}

// COLUMNS LIST \\
function customViewField($scope, $http, $q, $timeout, User, ViewSetting, ViewSettingQuery) {
    

    var firstTime = true;    
    $scope.listOptionsPrincipaleInstance = null;
    $scope.listOptionsDetailInstance = null;

    $scope.view = $scope.$parent.view;

    //Une fois une vue sélectionnée, on charge tous ses paramètres de départ dans le cas
    // où l'utilisateur annule ses changements, on pourra revenir en arrière grâce à ce chargement
    ViewSettingQuery.getPreferenceColumnOfViewAll($scope.view.id);
    

    $scope.init = function () {
      
        // Affiche la liste des tables 
        $http({
            url: 'AllApi/getTableList',
            method: 'GET'
        }).then(function (response) {
            $scope.resultTable = response.data;
        }).catch(function (response) {
            console.log(response);
            alert(reponse);
        });
    }

    // WIDGET List of Table
    $scope.lookupOptionsTable = {
        bindingOptions: {
            dataSource: 'resultTable'
        },
        showPopupTitle: false,
        closeOnOutsideClick: true,
        placeholder: "Sélectionner une table",
        displayExpr: "TableName",
        onValueChanged: function (e) {
            //console.log($scope.valueLine);
            $scope.toDisplay = false;
            $scope.SystemName = e.value.SystemName;
            $scope.LibraryName = e.value.LibraryName;
            $scope.TableName = e.value.TableName;
            getValueLine($scope.TableName);

            $http({
                url: 'AllApi/GetTypeLineOfTable',
                method: 'GET',
                params: {
                    tableName: $scope.TableName
                }
            }).then(function (response) {
                $scope.resultTypeLine = response.data;
                //console.log($scope.resultTypeLine);
                $scope.listColumnViewEnable = true; // To enable the saving of preference column view


            }), function (response) {
                console.log(response);
                alert(reponse);
            };
        }
    };

    // WIDGET List of Line type
    $scope.lookupOptionsLine = {
        bindingOptions: {
            dataSource: "resultTypeLine",
            value: "valueLine"
        },
        valueExpr: "ID_TableSubLevel",
        showPopupTitle: false,
        closeOnOutsideClick: true,
        placeholder: "Sélectionner un type de ligne",
        displayExpr: "TableSubLevelType",
        onValueChanged: function (e) {
            //console.log(e);

            $scope.Id_SubLevel = e.value;
            ViewSetting.setIdTypeLine($scope.Id_SubLevel);
            ViewSetting.setIsChangedField(true); // Enable Saving/Canceling data of customisation column view 

            // Charge les listes pour les deux zones, avec les items sélectionnés en avant, selon leurs positions
            var waitList = function () {
                getListOfTypeLine(0).then(function () {
                    getListOfTypeLine(1).then(function () {

                        if (!firstTime) {
                            // A partir de la deuxième recherche, on enregistre les préférences de la table précédente
                            $scope.previousIdSubLevel = e.previousValue;
                            //console.log($scope.primarySelectedItems, $scope.secondarySelectedItems);
                            ViewSettingQuery.updatePreferenceColumnOfView($scope.view.id, $scope.previousIdSubLevel, $scope.primarySelectedItems, $scope.secondarySelectedItems);
                        }
                        $scope.toDisplay = true;
                        firstTime = false;

                        getPreferenceColumnOfView();

                        // Useless without promise on getPreferenceColumnOfView(), because it take older value
                        //console.log($scope.Id_SubLevel, " | ", $scope.primarySelectedItems, " | ", $scope.secondarySelectedItems);

                    }).catch(function () {
                        console.log("Error getListOfTypeLine(1)");
                    })
                }).catch(function () {
                    console.log("Error getListOfTypeLine(0)");
                })

            };

            waitList();
        }
    }

    // WIDGET contenant la liste des paramètres pour la zone d'arboresence
    $scope.listOptionsPrincipale = {
        height: 650,
        keyExpr: "key",
        bindingOptions: {
            dataSource: "listTreeView",
            selectedItemKeys: "primarySelectedItems",
            selectAllMode: "allPages"
        },
        selectionMode: "multiple",
        pageLoadMode: "scrollBottom",
        pageLoadingText: "Chargement...",
        allowItemReordering: true,
        showSelectionControls: true,
        searchEnabled: true,
        searchMode: "contains",
        searchExpr: ['ColumnName', 'ColumnDesc'],
        onContentReady: function (e) {
            $scope.listOptionsPrincipaleInstance = e.component;
        },
        onItemClick: function (item) {
            //console.log(item);
            ViewSetting.setPrimaryList($scope.primarySelectedItems);            
        },
        onItemReordered: function (e) {
            // Besoin de le re-seléctionner une fois bouger car sinon la liste ne prend pas en compte sa position
            if ($scope.listOptionsPrincipaleInstance.isItemSelected(e.toIndex)) {
                $scope.listOptionsPrincipaleInstance.unselectItem(e.toIndex);
                $scope.listOptionsPrincipaleInstance.selectItem(e.toIndex);
            }
            ViewSetting.setPrimaryList($scope.primarySelectedItems);
            $scope.listOptionsPrincipaleInstance.repaint();
        }
    };

    // WIDGET contenant la liste des paramètres pour la zone de détail
    $scope.listOptionsSecondaire = {
        height: 650,
        keyExpr: "key",
        bindingOptions: {
            dataSource: "listDetailView",
            selectedItemKeys: "secondarySelectedItems",
            selectAllMode: "allPages"
        },
        selectionMode: "all",
        pageLoadMode: "scrollBottom",
        pageLoadingText: "Chargement...",
        allowItemReordering: true,
        showSelectionControls: true,
        searchEnabled: true,
        searchMode: "contains",
        searchExpr: ['ColumnName', 'ColumnDesc'],
        onContentReady: function (e) {
            $scope.listOptionsDetailInstance = e.component;
        },
        onItemClick: function (item) {
            //console.log(item);
            ViewSetting.setSecondaryList($scope.secondarySelectedItems);            
        },
        onItemReordered: function (e) {
            if ($scope.listOptionsDetailInstance.isItemSelected(e.toIndex)) {
                $scope.listOptionsDetailInstance.unselectItem(e.toIndex);
                $scope.listOptionsDetailInstance.selectItem(e.toIndex);
            }
            ViewSetting.setSecondaryList($scope.secondarySelectedItems);
            $scope.listOptionsDetailInstance.repaint();
        }
    };


    // Return the list of type line with specification if the line is marked in the configuration of the view depending of DetailLevel
    function getListOfTypeLine(detailLevel) {
        var defer = $q.defer();      

        $http({
            url: 'AllApi/getListOfTypeLine',
            method: 'GET',
            params: {
                systemName: $scope.SystemName,
                libraryName: $scope.LibraryName,
                tableName: $scope.TableName,
                ID_SubLevel: $scope.Id_SubLevel,
                ID_View: $scope.view.id,
                DetailLevel: detailLevel
            }
        }).then(function (response) {
            //console.log(detailLevel, response.data);
            if (detailLevel === 0) {
                $scope.listTreeView = response.data;
            }
            else {                
                $scope.listDetailView = response.data;                
            }
            defer.resolve("SUCCESS");            

        }), function (response) {
            console.log(response);
            defer.reject(response);
            alert(reponse);
            };

        //console.log(defer.promise);
        return defer.promise;
    };

    function getPreferenceColumnOfView() {
            $http({
                url: 'AllApi/GetPreferenceColumnOfView',
                method: 'GET',
                params: {
                    idView: $scope.view.id,
                    idSubLevel: $scope.Id_SubLevel
                }
            }).then(function (response) {
                var primaryList = [];
                var secondaryList = [];
                var i = 0;
                while (i !== response.data.length) {
                    if (response.data[i].DetailLevel === 0) {
                        primaryList.push(response.data[i].key); // KEY = ID_Column + '_' + ID_TableSubLevel
                    }
                    else {
                        secondaryList.push(response.data[i].key);
                    }
                    i++;
                }
                //console.log(primaryList);
                //console.log(secondaryList);

                $scope.primarySelectedItems = primaryList;
                $scope.secondarySelectedItems = secondaryList

                ViewSetting.setPrimaryList(primaryList);
                ViewSetting.setSecondaryList(secondaryList);
            }).catch(function (response) {
                console.log(response);
            });

    };  

    function getValueLine(table) {
        switch (table) {
            case 'CDENT':
                $scope.valueLine = 25;
                break;
            case 'CDLGN':
                $scope.valueLine = 26;
                break;
            case 'NGCPP':
                $scope.valueLine = 1;
                break;
            case 'NGMAT':
                $scope.valueLine = 5;
                break;
            case 'NGUSI':
                $scope.valueLine = 10;
                break;
            case 'NGFAB':
                $scope.valueLine = 13;
                break;
            case 'NGINF':
                $scope.valueLine = 27;
                break;
            case 'NGIPR':
                $scope.valueLine = 18;
                break;
            case 'NGPDC':
                $scope.valueLine = 22;
                break;
            case 'NGFMC':
                $scope.valueLine = 28;
                break;
            default:
                console.log("Nom de table inconnu ! getValueLine()");
                break;
        }
            
    }
    
}

// Type LINE FILTER \\ 
function customViewLine($scope, $http, ViewSetting, ViewSettingQuery, User) {

    $scope.view = $scope.$parent.view;

    $scope.init = function () {

        // API - Get the list of Sub level filtered or not by the view used
        $http.get('api/Views/GetPreferenceLineOfView', { params: { id_View: $scope.view.id } })
        .then(function (response) {            

            let filterTypeLineArray = response.data;

            $scope.selectedItemsLine = [];            
            for (let i = 0; i < filterTypeLineArray.length; i++) {
                $scope.selectedItemsLine.push(filterTypeLineArray[i].ID_TableSubLevel);                
            }            

            ViewSetting.setListLine($scope.selectedItemsLine.join(','));        
            // keep the original data in the case when the user want to cancel his changes
            ViewSetting.setListLineInitial($scope.selectedItemsLine.join(','));
            
            // Create a obj with table name for key and list of table sub level type
            $scope.filterTypeLineObj = {}
            filterTypeLineArray.forEach(function (elt) {
                if ($scope.filterTypeLineObj.hasOwnProperty(elt.TableName))
                    $scope.filterTypeLineObj[elt.TableName].push(elt.TableSubLevelType);
                else
                    $scope.filterTypeLineObj[elt.TableName] = [elt.TableSubLevelType];
            })
            console.log("%cLignes filtrées par la vue :", "color: red;");
            console.log($scope.filterTypeLineObj);

            /*  TO CHECK RED SQUARE  */            
            // Get all id in conf view and select square that data-id tag HTML is the same id
            for (let id in $scope.selectedItemsLine) {
                $(".line").each(function (index) {
                    let lineId = $(this).data("id");
                    if ($scope.selectedItemsLine[id] == lineId) {
                        $(this).addClass("selected");
                    }
                });
            }
        }).catch(function (response) {
            DevExpress.ui.notify("Le chargement des lignes filtrés a échoué", "error", 3000);
            console.log(response);
        });
    }


    /*
    // Load all the list of each type line of tables
    $http({
        url: 'AllApi/GetTableSubLevels',
        method: 'GET'
    }).then(function (response) {
        $scope.resultLine = response.data;
        //console.log($scope.resultLine);

        //Load every ID of the table for the onSelectAllValueChanged
        $scope.allItemsLine = [];
        var i = 0;
        while ($scope.resultLine.length != i) {
            $scope.allItemsLine.push($scope.resultLine[i].ID_TableSubLevel)
            i++;            
        }
        //console.log($scope.allItemsLine);

        
        // Groupe the array with a selector
        var dataSourceGrouped = new DevExpress.data.DataSource({
            store: {
                type: 'array',
                key: "ID_TableSubLevel",
                data: $scope.resultLine
            },
            group: { selector: "TableName" }
            //select: ["ID_TableSubLevel", "TableName", "TableSubLevelDesc", "TableSubLevelType"]
        });
       
        // WIDGET List of Line
        $scope.listOptionsLine = {
            height: 650,
            dataSource: dataSourceGrouped,
            keyExpr: "ID_TableSubLevel",            
            bindingOptions: {                
                selectAllMode: "allPages",
                selectedItemKeys: 'selectedItemsLine'
            },
            selectionMode: "all",
            showSelectionControls: true,
            searchEnabled: true,
            searchMode: "contains",
            searchExpr: ['TableSubLevelType'],
            grouped: true,
            collapsibleGroups: true,
            onItemClick: function (item) {
                console.log(item.itemData);
                console.log($scope.selectedItemsLine);
                ViewSetting.setListLine($scope.selectedItemsLine.join(','));
                console.log(ViewSetting.getListLine());
            },
            onSelectAllValueChanged: function (e) {
                //console.log(e)
                if (e.value) 
                    ViewSetting.setListLine($scope.allItemsLine.join(','));
                else
                    ViewSetting.setListLine("");                                      
            }
        };

        ViewSetting.setIsChangedLine(true); // Enable Saving/Canceling data of customisation column view 
        

    }).catch(function (response) {
        console.log(response);
        alert("Erreur lors du chargement de la liste des types de lignes...");
        });
    */

    // FILTER SUB LEVEL TYPE TABLE 
    let line = document.getElementsByClassName("line");
    let table = document.getElementsByClassName("table");

    // EVENT on line - add/remove selected class on HTML tag and update Object '$scope.filterTypeLineObj'
    for (let i = 0; i < line.length; i++) {
        line[i].addEventListener("click", function () {
            let eventTable = $(this).data("table");
            let eventLine = $(this).data("line");

            if (line[i].classList.contains("selected")) {
                line[i].classList.remove("selected");
                if ($scope.filterTypeLineObj[eventTable].length > 1)
                    $scope.filterTypeLineObj[eventTable].splice($scope.filterTypeLineObj[eventTable].indexOf(eventLine), 1);
                else
                    delete $scope.filterTypeLineObj[eventTable];
            }
            else {
                line[i].classList.add("selected");
                if ($scope.filterTypeLineObj.hasOwnProperty(eventTable)) {
                    $scope.filterTypeLineObj[eventTable].push(eventLine);
                }
                else {
                    $scope.filterTypeLineObj[eventTable] = [eventLine];
                }
            }
        });
    }

    // EVENT on table - add/remove selected class on HTML tag and update Object '$scope.filterTypeLineObj'
    for (let i = 0; i < table.length; i++) {
        table[i].addEventListener("click", function () {
            var childLines = table[i].parentNode.parentNode.childNodes[3].childNodes;
            var oneSelected = false;

            for (let i = 1; i < childLines.length; i += 2) {
                if (childLines[i].classList.contains("selected"))
                    oneSelected = true;
            }
            selectedGroup(childLines, oneSelected);
        });
    }

    // If one line is selected, remove all. Else select all
    function selectedGroup(lines, oneSelected) {
        let linesLen = lines.length;
        let eventTable = $(lines[1]).data("table");

        if (oneSelected) {
            for (let i = 1; i < linesLen; i += 2) {
                if (lines[i].classList.contains("selected"))
                    lines[i].classList.remove("selected");
            }
            delete $scope.filterTypeLineObj[eventTable];
        }
        else {
            let tmpEventLine = [];
            for (let i = 1; i < linesLen; i += 2) {
                lines[i].classList.add("selected");
                let eventLine = $(lines[i]).data("line");
                tmpEventLine.push(eventLine);
            }
            $scope.filterTypeLineObj[eventTable] = tmpEventLine;
        }
    }

}

