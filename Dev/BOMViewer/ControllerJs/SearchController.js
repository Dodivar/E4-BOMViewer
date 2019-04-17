'use strict';

angular.module('BOMViewer')
    .controller('searchRecherche', searchRecherche)
    .controller('searchTreeView', searchTreeView);

// Injection des dépendances des contrôleurs
searchRecherche.$inject = ['$scope', '$http', '$timeout', '$q', 'localstorage', 'User', 'Order'];
searchTreeView.$inject = ['$scope', '$http', '$window', '$location', '$q', 'localstorage', 'User', 'Order'];



// FORM \\
function searchRecherche($scope, $http,  $timeout, $q, localstorage, User, Order) {   

    var Agency = [
        { id: '1', age: '   ', libelle: 'FRA' },
        { id: '2', age: '100', libelle: 'ALL' },
        { id: '3', age: '200', libelle: 'ANG' }];

    var Library = [
        { id: '1', lib: 'HISTOTEC', libelle: 'Historique (20 j) ' },
        { id: '2', lib: 'DCEXPLF', libelle: 'Dernier traitement' }];

    $scope.orderData = {
        idOrder: 0,
        orderNumber: 0,
        library: '',
        agency: '',
        agencyText: '',
        line: 0,
        version: 0
    }

    var search = {
        orderNumber: null,
        line: null,
        agency: Agency[0],
        library: Library[0]
    }

    // FUNCTION - Load every useful data for user
    $scope.init = function () {

        // API - Get top 10 nb of imported orders for Charts
        $http({
            url: 'AllApi/GetTop10ImportedOrder',
            method: 'GET',
            params: {
                ID_User: User.getID_User()
            }
        }).then(function (response) {            
            $scope.resultTable = response.data;

            // WIDGET Pie chart
            $scope.chartOptions = {
                type: "doughnut",
                palette: "DarkMoon",
                dataSource: $scope.resultTable,
                title: "TOP 10 version",
                tooltip: {
                    enabled: true,
                },
                legend: {
                    horizontalAlignment: "right",
                    verticalAlignment: "bottom",
                    margin: 0
                },
                export: {
                    enabled: true,
                    fileName: 'TOP10Order_BOMViewer'
                },
                series: [{
                    argumentField: "OrderNumber",
                    valueField: "MaxVersion",
                    label: {
                        visible: true,
                        connector: {
                            visible: true
                        }
                    }
                }],
                onTooltipShown: function (e) {
                    //console.log(e);
                }
            };

        }).catch(function (response) {
            console.log(response);
            DevExpress.ui.notify("Erreur lors de la récupération du top 10 des commandes importées", "error", 2500);
        });



        // API - Get list of View
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
                $scope.lastViewUsed = response.data;

                // Activate the widget line tagBox
                $(function () {
                    var form = $("#form").dxForm("instance");

                    form.getEditor("Vue active")
                        .option("dataSource", $scope.viewList);
                    form.getEditor("Vue active")
                        .option("value", $scope.lastViewUsed[0].ID_View);
                });

            }).catch(function (response) {
                console.log(response);
            });

        }).catch(function (e) {
            console.log(e);
            DevExpress.ui.notify("Erreur lors de la récupération de la liste des vues", "error", 2500);
        });

        // API - To get the last order displayed by the user
        $http({
            url: 'AllApi/GetLastOrderDisplayed',
            method: 'GET',
            params: {
                ID_User: User.getID_User()
            }
        }).then(function (response) {
            $scope.lastOrderView = response.data[0];

            let nbLineLastOrder = $scope.lastOrderView.line.slice(0, -1).split(',');

            if ($scope.lastOrderView.line != "" && $scope.lastOrderView.line != null)
                $scope.lastOrderViewId = $scope.lastOrderView.orderNumber + ' - ' + $scope.lastOrderView.agency + ' [' + nbLineLastOrder.length + ' ligne(s)]';
            else
                $scope.lastOrderViewId = $scope.lastOrderView.orderNumber + ' - ' + $scope.lastOrderView.agency;
        }).catch(function (e) {
            console.log(e);
            DevExpress.ui.notify("Erreur lors de la récupération de la dernière commande recherchée", "error", 2500);
        });

        // API - Load user color settings in localStorage 
        $http({
            url: 'AllApi/GetLastOrderDisplayed',
            method: 'GET',
            params: {
                ID_User: User.getID_User()
            }
        }).then(function (response) {
            $scope.lastOrderView = response.data[0];

            let nbLineLastOrder = $scope.lastOrderView.line.slice(0, -1).split(',');

            if ($scope.lastOrderView.line != "" && $scope.lastOrderView.line != null)
                $scope.lastOrderViewId = $scope.lastOrderView.orderNumber + ' - ' + $scope.lastOrderView.agency + ' [' + nbLineLastOrder.length + ' ligne(s)]';
            else
                $scope.lastOrderViewId = $scope.lastOrderView.orderNumber + ' - ' + $scope.lastOrderView.agency;
        }).catch(function (e) {
            console.log(e);
            DevExpress.ui.notify("Erreur lors de la récupération de la dernière commande recherchée", "error", 2500);
        });


    }



    // FUNCTION To update the last order displayed by the user
    var updateLastOrderDisplay = function (searchData) {
        var strLine = "";

        // TO IMPROVE:: Find mthod to separate each value of array in string with separator ', '
        if (searchData.line.length > 0) {
            for (var i = 0, len = searchData.line.length; i < len; i++) {
                strLine += searchData.line[i].CDLG$D + ',';
            }
        }

        $http({
            url: 'AllApi/UpdateLastOrderDisplayed',
            method: 'GET',
            params: {
                ID_User: User.getID_User(),
                orderNumber: searchData.orderNumber,
                agency: searchData.agencyText,
                line: strLine
            }
        }).then(function (response) {
            //console.log(response.data);
            $scope.lastOrderView = {
                orderNumber: searchData.orderNumber,
                agency: searchData.agencyText,
                line: strLine
            }
            let nbLineLastOrder = $scope.lastOrderView.line.slice(0, -1).split(',');

            if ($scope.lastOrderView.line != "")
                $scope.lastOrderViewId = $scope.lastOrderView.orderNumber + ' - ' + $scope.lastOrderView.agency + ' [' + nbLineLastOrder.length + ' lignes(s)]';
            else
                $scope.lastOrderViewId = $scope.lastOrderView.orderNumber + ' - ' + $scope.lastOrderView.agency;

        }).catch(function (response) {
            console.log(response);
            DevExpress.ui.notify("Erreur lors de la mise à jour de la dernière commande recherchée", "error", 2500);
        });
    }

    // WIDGET Pop-Up visible when import a order
    $scope.popupOptions = {
        bindingOptions: {
            visible: "popup",
            title: "titleForPopUp"
        },
        //visible: true,
        width: 500,
        height: 500,
        showTitle: true,
        closeOnOutsideClick: function (e) {
            $(function () {
                $(".dx-progressbar-range").removeClass("error");
                $(".dx-progressbar-range").addClass("loading");
            });
        }
    };

    // WIDGET List of Order Line to import 
    $scope.listOrderLineImport = {
        bindingOptions: {
            dataSource: "orderLineToImport"
        },
        height: 250,
        pageLoadMode: "scrollBottom",
        pageLoadingText: "Chargement...",
        noDataText: "Aucune donnée"
    }

    // WIDGET Button cancel import order
    $scope.btnCancelImport = {
        text: 'Annuler',
        type: 'danger',
        width: 200,
        onClick: function (e) {
            clearInterval($scope.stopProgressBar);
            $scope.withoutOrderMsg = "Importation de la commande annulée !";
            $scope.popup = false;
            DevExpress.ui.notify('Annulation de l\'importation de la commande [' + $scope.toDisplayOrderNumber + ']', "info", 2000);
            $scope.canceler.resolve();
        }
        /*$(function () {
            $(".dx-progressbar").removeClass("loading");
            $(".dx-progressbar").addClass("error");                
            
        });*/
    };

    // WIDGET Button for last order displayed
    $scope.orderButtonOptions = {
        bindingOptions: {
            text: 'lastOrderViewId'
        },
        type: "success",
        icon: "search",
        onClick: function (e) {
            var tableLine = [];
            var lineObj = {};

            if ($scope.lastOrderView.line != "") {
                // First delete first char -> ',' then split each value separate by ',' + Store it in Array
                var lineSplit = $scope.lastOrderView.line.slice(0, -1).split(',');

                if (lineSplit.length > 0) {
                    for (var i = 0, len = lineSplit.length; i < len; i++) {
                        lineObj = {
                            CDLG$D: lineSplit[i]
                        }
                        tableLine.push(lineObj);
                    }
                }
            }

            search = {
                orderNumber: $scope.lastOrderView.orderNumber,
                line: tableLine,
                agency: agencyLibelleToText($scope.lastOrderView.agency),
                library: "HISTOTEC"
            };            
            getOrder(search.orderNumber, search.line, search.agency, search.library);
        }
    };

    // FUNCTION - To convert agency ref to libelle
    var agencyTextToLibelle = function (a) {
        if (a === '100')
            return 'ALL';
        else if (a === '200')
            return 'ESP';
        else
            return 'FRA';
    }

    // FUNCTION - To convert agency libelle to ref
    var agencyLibelleToText = function (a) {
        if (a === 'ALL')
            return '100';
        else if (a === 'ESP')
            return '200';
        else
            return '   ';
    }

    // FUNCTION - Do this method for each order line selected (reload this same method in promise --> .then)
    var importLines = function (library, agency, orderNumber, line, nb, i, idOrder, complete) {

        // Only first time
        if (i === 0) {
            $scope.orderLineToImport = line; // Show it on Popup
        }

        $scope.nbLineImported = i; // Show it on Popup
        $scope.orderLineToImport[i].load = true; // Set the current element on load

        $http({
            url: 'AllApi/ImportOrderLineFromAS400',
            method: 'GET',
            timeout: $scope.canceler.promise,
            params: {
                library: library,
                agency: agency,
                orderNumber: orderNumber,
                line: line[i].CDLG$D,
                idOrder: idOrder
            }
        }).then(function (response) {
            var IdOrderNumber = response.data;

            // Update data of line
            $scope.orderLineToImport[i].load = false;
            $scope.orderLineToImport[i].isImported = true;

            i++;
            if (i < nb) {
                $scope.orderLineToImport[i].load = true; // Set the next one on load
                importLines(library, agency, orderNumber, line, nb, i, IdOrderNumber, complete)
            }
            else {
                // + 1 To be equals as '$scope.nbLineToImport'
                $scope.nbLineImported++;

                // If order is marked 'complete', update field 'IsComplete' in TAB_Orders
                if (complete) {
                    $http({
                        url: 'AllApi/SetOrderIsComplete',
                        method: 'GET',
                        params: {
                            idOrder: IdOrderNumber
                        }
                    }).then(function (response) {
                        //console.log("Commande [" + orderNumber + "] en complète OK")

                    }).catch(function (response) {
                        console.log("Erreur du placement 'IsComplete' de la commande [" + orderNumber + "]");
                        console.log(response);
                    });
                }

                $scope.orderData = {
                    idOrder: IdOrderNumber,
                    orderNumber: orderNumber,
                    library: library,
                    agency: agency,
                    agencyText: '',
                    line: line,
                    Version: 1
                }
                $scope.SendToTreeView($scope.orderData);
            }
        }).catch(function (response) {
            console.log("Annulation de l'importation de la commande : " + orderNumber);
            //console.log(response);
        });
    }

    // FUNCTION - To call when a order is searched
    var getOrder = function (orderNumber, line, agency, library ) { 

        $scope.toDisplayOrderNumber = orderNumber;
        var lineLen = line.length;  // Get the nb of line
        var idOrderComplete;        // Check if order is complete
        var containLines = false;   // Know if the searched contain lines                

        if (lineLen > 0) {
            //line.map(a => a.TODISPLAY);  // Get all 'TODISPLAY' value in array of each line selected            
            line.forEach(function (l) { l.isImported = false; l.load = false; }); // Add 2 properties to line
            containLines = true;            
        }        
        
        $http({ // Check if we have this order in DBB
            url: 'AllApi/GetNumberOrderVersion',
            method: 'GET',
            params: {
                OrderAgence: agency,
                OrderNumber: orderNumber
            }
        }).then(function (response) {            
            var numberOrderVersion = response.data.length;  // Get the nb of existed order in
                                               
            // Permet d'annuler la poursuite de la requête grâce au param timeout
            $scope.canceler = $q.defer();           

            // If order number isn't already imported
            if (numberOrderVersion === 0) {

                // Check if the order exist before import it
                $http({
                    url: 'AllApi/GetNumberOrderLineFromOrder',
                    method: 'GET',
                    params: {
                        orderNumber: orderNumber,
                        OrderAgence: agency,
                        systemName: 'MURPHY_CT'
                    }
                }).then(function (response) {                  
                    let orderLineFromOrder = response.data;

                    //Order contains lines
                    if (orderLineFromOrder.length > 0) {

                        $scope.popup = true;                        
                        $scope.titleForPopUp = "Commande : " + orderNumber;

                        // Si la recherche comporte des lignes
                        if (containLines) {                            
                            $scope.withoutOrderMsg = "Importation de " + lineLen + " ligne(s) de commande";                            
                            importLines(library, agency, orderNumber, line, lineLen, 0, null, false);                                                  
                        }

                        // Sinon on importe la commande entière
                        else {                                          
                            $scope.withoutOrderMsg = "Importation de " + orderLineFromOrder.length + " ligne(s) de commande";
                            
                            orderLineFromOrder.forEach(function(line) { line.isImported = false; line.load = false; });         // Add 2 properties to lines                           
                            importLines(library, agency, orderNumber, orderLineFromOrder, orderLineFromOrder.length, 0, null, true);  // Send all line to be imported
                        }
                    }
                    // Order doesn't have lines
                    else
                        DevExpress.ui.notify('Aucune donnée trouvée pour cette commande [' + orderNumber + '] - ' + agency, "error", 2000);

                }).catch(function (response) {
                    console.log(response);
                });


            }

            // If order number is already in our DB
            else {

                // Search the last idOrder whom is imported completely
                for (var i = 0; i < numberOrderVersion; i++) {
                    if (response.data[i].IsComplete === 1) {
                        idOrderComplete = response.data[i].ID_Order                        
                    }
                }
                
                // If a complete order exist we take the last one 
                if (idOrderComplete != null) {
                    $scope.orderData = {
                        idOrder: idOrderComplete,
                        orderNumber: orderNumber,
                        library: library,
                        agency: agency,
                        agencyText: '',
                        line: line,
                        version: numberOrderVersion + 1
                    };
                    
                    $scope.SendToTreeView($scope.orderData);
                }

                // If order doesn't have a complete version, import it again
                else {            
                    $scope.popup = true;
                    $scope.titleForPopUp = "Commande : " + orderNumber;

                    // If lines are selected
                    if (containLines) {                             
                        $scope.withoutOrderMsg = "Importation de " + lineLen + " ligne(s) de commande";
                        importLines(library, agency, orderNumber, line, lineLen, 0, null, false)
                    }

                    // Sinon on réimporte tous
                    else {

                        // Check if the order exist before import it
                        $http({
                            url: 'AllApi/GetNumberOrderLineFromOrder',
                            method: 'GET',
                            params: {
                                orderNumber: orderNumber,
                                OrderAgence: agency,
                                systemName: 'MURPHY_CT'
                            }
                        }).then(function (response) {
                            let orderLineFromOrder = response.data;
                            if (orderLineFromOrder.length > 0) {
                                
                                $scope.withoutOrderMsg = "Importation de " + orderLineFromOrder.length + " ligne(s) de commande";
                               
                                orderLineFromOrder.forEach(function (l) { l.isImported = false; l.load = false; });                 // Add 2 properties to lines                             
                                importLines(library, agency, orderNumber, orderLineFromOrder, orderLineFromOrder.length, 0, null, true);  // Send all line to be imported

                            }
                            else
                                DevExpress.ui.notify('Aucune donnée trouvée pour cette commande [' + orderNumber + '] - ' + agency, "error", 2000);

                        }).catch(function (response) {
                            console.log(response);
                        });
                    }
                }
            }            
            }).catch(function (error) {
                console.log(error);
                DevExpress.ui.notify("Une erreur est survenue, veuillez recharger la page.", "error");
        });
    };

    // WIDGET Form item
    $scope.itemsForm = [{
        itemType: "group",
        caption: "Informations requises",
        items: [{
            dataField: "Librairie",
            editorType: "dxRadioGroup",
            editorOptions: {
                items: Library,
                displayExpr: "libelle",
                valueExpr: "lib",
                layout: "horizontal",
                focusStateEnabled: true,
                onContentReady: function (e) {
                    $(".dx-radiobutton-icon-dot").css("background-color", "#CEA54A");
                }
            }
        }, {
            dataField: "Agence",
            editorType: "dxRadioGroup",
            editorOptions: {
                items: Agency,
                displayExpr: "libelle",
                valueExpr: "age",
                layout: "horizontal",
                focusStateEnabled: true,
                onContentReady: function (e) {
                    $(".dx-radiobutton-icon-dot").css("background-color", "#CEA54A");
                }
            }
        }, {
            dataField: "N° de commande",
            editorType: "dxTextBox",
            editorOptions: {
                placeholder: "N° de commande",
                showClearButton: true,
                maxLength: 9 // Format Commande AS400
            },
            validationRules: [{
                type: "required",
                message: "Numéro de commande requis",
                validationMessageMode: "always"
            }, {
                type: "pattern",
                pattern: "^[0-9]+$",
                message: "Le numéro de commande peut uniquement contenir  des chiffres"
            }]
        }]
    }, {
        itemType: "group",
        caption: "Options",
            items: [{            
            dataField: "btnLigne",
            itemType: "button",
            alignment: "left",
            buttonOptions: {
                type: "default",
                text: 'Recherche des lignes pour ce N° de commande',
                width: "100%",
                icon: "menu",
                onClick: function (e) {
                    var valueOrderNumber = $scope.formOptionsInstance.getEditor('N° de commande').option('value');
                    if (valueOrderNumber === null || valueOrderNumber === undefined)
                        DevExpress.ui.notify('N° de commande non renseignée', "error", 2000);
                    else {
                        //before insert lines of order, delete previous data
                        $(function () {
                            $("#form").dxForm("instance").getEditor("Ligne").option("value", []);
                        });

                        // Search orderline of this order
                        $http({
                            url: 'AllApi/GetNumberOrderLineFromOrder',
                            method: 'GET',
                            params: {
                                orderNumber: valueOrderNumber,
                                OrderAgence: $scope.formOptionsInstance.getEditor('Agence').option('value'),
                                systemName: 'MURPHY_CT'
                            }
                        }).then(function (response) {
                            //console.log(response.data);
                            let orderLineFromOrder = response.data;                            
                            if (orderLineFromOrder.length != 0) {
                                DevExpress.ui.notify("Vous pouvez désormais filtrer sur [" + orderLineFromOrder.length + "] ligne(s) de la commande [" + valueOrderNumber + "]", "info", 2500);

                                // Activate the widget line tagBox                                
                                $(function () {
                                    var form = $("#form").dxForm("instance");

                                    form.getEditor("Ligne")
                                        .option("disabled", false);
                                    form.getEditor("Ligne")
                                        .option("items", orderLineFromOrder);                                    
                                });        

                                // Open Tag box for show the selection of line
                                $scope.btnLigneComponent.open();
                            }
                            else
                                DevExpress.ui.notify('N° de commande non valide [' + valueOrderNumber + ']', "error", 2000);
                        }).catch(function (response) {
                            DevExpress.ui.notify('N° de commande non valide [' + valueOrderNumber + ']', "error", 2000);
                            console.log(response);
                        });
                    }
                }
            }
        }, {
            dataField: "Ligne",
            editorType: "dxTagBox",
            editorOptions: {
                items: null,
                disabled: true,
                displayExpr: "TODISPLAY",
                showSelectionControls: true,
                applyValueMode: "useButtons",
                showClearButton: true,
                searchEnabled: true,
                searchMode: "contains",
                placeholder: "Facultafif",
                noDataText: "Aucne ligne disponible pour ce N° de commande",
                onInitialized: function (e) {                    
                    $scope.btnLigneComponent = e.component;
                }
            }
        }, {
            dataField: "Vue active",
            editorType: "dxLookup",
            editorOptions: {
                closeOnOutsideClick: true,
                placeholder: 'Sélectionner une vue',
                displayExpr: 'ViewName',
                valueExpr: 'ID_View',
                onItemClick: function (e) {
                    User.setID_View(User.getID_User(), e.itemData.ID_View);
                }
            }
        }]
        }, {
            itemType: "button",
            horizontalAlignment: 'center',
            buttonOptions: {
                text: "Rechercher",
                type: "success",
                width: "100%",
                accessKey: "Enter",
                useSubmitBehavior: true,
                icon: "search",
                onClick: function (e) {
                    getFormValue();
                }
            }
        }, {
            itemType: "button",            
            buttonOptions: {
                text: "Reset",
                type: "danger",
                width: "40%",                
                icon: "close",
                onClick: function (e) {
                    var form = $("#form").dxForm("instance");

                    form.getEditor("Librairie").option("value", Library[0].lib);
                    form.getEditor("Agence").option("value", Agency[0].age);
                    form.getEditor("N° de commande").option("value", "");
                    form.getEditor("Ligne").option("value", "");
                }
            }
        }     
    ];

    // WIDGET Form
    $scope.formOptions = {
        bindingOptions: {
            items: 'itemsForm'            
        },        
        colCount: 1,
        onInitialized: function (e) {
            $scope.formOptionsInstance = e.component;
        },        
        onContentReady: function (e) {            
            $scope.formOptionsInstance.getEditor("Librairie").option("value", Library[0].lib);
            $scope.formOptionsInstance.getEditor("Agence").option("value", Agency[0].age);            
        },
        onEditorEnterKey: function (e) {
            getFormValue();
        }      
    }

    // Get all data from Form and pass it to ''getOrder''
    var getFormValue = function () {        
        search.orderNumber = $scope.formOptionsInstance.getEditor('N° de commande').option('value');
        search.library = $scope.formOptionsInstance.getEditor('Librairie').option('value');
        search.agency = $scope.formOptionsInstance.getEditor('Agence').option('value');
        search.line = $scope.formOptionsInstance.getEditor('Ligne').option('value');

        console.log("%cDonnées de la recherche :", "color:red;");
        console.log(search);

        if (search.orderNumber === undefined) 
            DevExpress.ui.notify("N° de commadne non défini", "error", 2000);
        else
            getOrder(search.orderNumber, search.line, search.agency, search.library);
    }

    $scope.SendToTreeView = function (searchData) {
        searchData.agencyText = agencyTextToLibelle(searchData.agency);

        //User.getColor(User.getID_User()); // On charge les préférences couleurs        
        updateLastOrderDisplay(searchData); // On sauvegarde la dernière commmande recherchée
        Order.sendToTreeView(searchData); // On envoie les données sur une autre page dédié au TV  
    }

}

// TREEVIEW \\
function searchTreeView($scope, $http, $window, $location, $q, localstorage, User, Order) {

    $scope.TVerror = "";
    $scope.toolTipOfNodeText = "";    
    $scope.loadingIndicator = true;
    $scope.colorBoxModifyLine = false;
    var toScrollY = 0, toScrollYtmp = 0;
    $scope.fontFamilyTreeView = fontFamily[2].font;
    $scope.fontSizeTreeView = 21;
    $scope.fontSizeDetail = 12;
    $scope.lineMarginTreeView = -5;    
    $scope.toolTipActive = false;
    $scope.detailZoneVisible = false;
    $scope.decompo = false;        
    $scope.toolTipTarget = 'null'; // Need to bind with the défault value of tool tip checkbox
    var loc = $location.search();


    $scope.init = function () {

        // Get color from user setting
        User.getColor(User.getID_User()).then(function (response) {
            $scope.colorObj = localstorage.getObject('colorValue', 'erreur colorValue');            
        }).catch(function (error) {
            DevExpress.ui.notify('Erreur ! Importation des couleurs en échec', "error", 5000)
            console.log(error);
        });


        // API - Get the list of Sub level filtered or not by the view used      
        $http({
            url: 'AllApi/GetPreferenceLineOfView',
            method: 'GET',
            params: {
                ID_View: User.getID_View(User.getID_User())
            }
        }).then(function (response) {
            let filterTypeLineArray = response.data;

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

            // Get all [table : line] checked in view, then find the right square using data-table & data-line of HTML tag to select it
            for (let table in $scope.filterTypeLineObj) {                                    
                let nbLine = $scope.filterTypeLineObj[table].length;

                for (let i = 0; i < nbLine; i++) {
                    let value = $scope.filterTypeLineObj[table][i];
                    //console.log(table + " : " + $scope.filterTypeLineObj[table][i]);

                    $(".line").each(function (index) {
                        let lineTable = $(this).data("table");
                        let lineType = $(this).data("line");

                        //console.log("nb : " + index + ", table : " + lineTable + ", line : " + lineType);
                        if (lineTable == table && lineType == value) {
                            $(this).addClass("selected");
                        }
                    });
                }                
            }

        }).catch(function (response) {
            DevExpress.ui.notify("Le chargement des lignes filtrées a échoué", "error", 3000);
            console.log(response);
        });
       


        // API - To know if the user want to see deleted lines
        $http({
            url: 'AllApi/GetSettingDisplayDeletedLine',
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

        }).catch(function (response) {
            DevExpress.ui.notify("Le chargement de la préférence des lignes supprimées a échoué", "error", 3000);
            console.log(response);
        });
        
    }

    // FUNCTION to get first line of order from DB_BOM_VIEWER
    var GetCustomJsonOrderFirstLine = function (IdOrder, OrderLine) {
        $http({
            url: 'AllApi/GetCustomJsonOrderFirstLine',
            method: 'GET',
            params: {
                ID_Order: IdOrder,
                ID_View: User.getID_View(User.getID_User()),
                OrderLine: OrderLine
            }
        }).then(function (response) {            
            $scope.jsonOrder = response.data;
            // Si aucune donnée n'est chargée
            if ($scope.jsonOrder.length === 0) {
                DevExpress.ui.notify("Aucune donnée chargée !", "error", 1000);
                $scope.TVerror = "Erreur lors du chargement des données de la commande ! Aucune donnée n'a pu être obtenue.";
            }

            $scope.loadingIndicator = false;

        }).catch(function (response) {
            console.log(response);
            alert(reponse);
        });
    }

    // FUNCTION to test if a node have chidren or not
    var nodeHasChildren = function (node) {
        if (node.children.length === 0) {
            return false;
        }
        else
            return true;
    };

   // DECOMPOSITION INTERACTIVE 
    if (loc.table /*&& loc.mode === 'TST'*/) {   
        // Data come from parameteres URL
        $scope.decompo = true;
        $scope.tableDecompoInt = loc.table;

        var OrderDataInt = {
            IdOrder: 999,
            OrderNumber: 999,
            Library: loc.table,
            Agency: 999,
            AgencyText: 'INT',
            Line: 0,
            Version: 0
        }        

        $http({
            url: 'AllApi/ImportOrderLineFromAS400',
            method: 'GET',
            params: {
                Library: OrderDataInt.Library,
                Agency: OrderDataInt.Agency,
                Order: OrderDataInt.OrderNumber,
                Line: OrderDataInt.Line,
                idOrder: null
            }
        }).then(function (response) {
            var IdOrderNumber = response.data;
            if (isNaN(IdOrderNumber)) {
                DevExpress.ui.notify('Aucune commande trouvée ! [' + order + '] - [' + agence + '] (' + search.library.Lib + ')', "error", 3000);                
            }
            else {
                $scope.orderData = {
                    idOrder: IdOrderNumber,
                    orderNumber: 999,
                    library: loc.table,
                    agency: 999,
                    agencyText: 'INT',
                    line: null,
                    version: 1                    
                }
                GetCustomJsonOrderFirstLine($scope.orderData.idOrder, $scope.orderData.line);
            }
            console.log("%cDonnées de la commande depuis la décomposition intéractive : ", "color:red;");
            console.log($scope.orderData);
            }).catch(function (response) {
                console.log(response);
                alert(reponse);
            });
               
        //$scope.$watch($scope.orderData, console.log('oui'), true); //GetCustomJsonOrderFirstLine()
        
    }

    // Search come from 'Recherche'
    else {               
        $scope.orderData = {
            idOrder: window.idOrder,
            orderNumber: window.orderNumber,
            library: window.library,
            agency: window.agency,
            agencyText: window.agencyText,
            line: window.line,
            version: window.version
        }
        console.log("%cDonnées de la commande :", "color: red;");
        console.log($scope.orderData);

        // IE11 display json object like [Object object] -> so stringify
        //console.log(JSON.stringify($scope.orderData));
        var tmpIE = $scope.orderData.line.length;
        
        if (tmpIE > 0) {            
            $scope.linesToDisplay = $scope.orderData.line.map(function (a) { return a.CDLG$D });            
            $scope.linesToDisplay = $scope.linesToDisplay.join(',');                        
            GetCustomJsonOrderFirstLine($scope.orderData.idOrder, $scope.linesToDisplay);
        }
        else 
            GetCustomJsonOrderFirstLine($scope.orderData.idOrder, "");
    }    


    // WIDGET show or not the tooltip
    $scope.checkBoxToolTip = {
        bindingOptions: {
            value: 'toolTipActive'
        },
        onOptionChanged: function (e) {
            if ($scope.toolTipActive) {
                $scope.toolTipTarget = 'div.dx-item.dx-treeview-item.dx-state-hover'
            }
            else {
                $scope.toolTipTarget = 'null'
            }
        }
        //, text: "Afficher l'info-bulle"
    }

    // WIDGET show or not the detail zone
    $scope.checkBoxDetailZone = {
        bindingOptions: {
            value: 'detailZoneVisible'
        }
    }
    
    // WIDGET choose the family font of the treeview    
    $scope.familyFontTreeView = {
        dataSource: fontFamily,
        bindingOptions: {
            value: 'fontFamilyTreeView'
        },
        displayExpr: "text",
        valueExpr: "font",
        width: 300,
        showPopupTitle: false,
        closeOnOutsideClick: true,
        cancelButtonText: "Annuler",
        placeholder: "Sélectionner une typographie",
        fieldTemplate: function (data) {
            // data = Content/fontFamily.js
            return "<div class='custom-field' style='font-family:" + data.font + ";'>" + data.text + "</div>";
        },
        itemTemplate: function (data) {            
            return "<div class='custom-item' style='font-family:" + data.font + ";'>" + data.text + "</div>";
        }
    }
   
    // WIDEGT  - Slider option for TV
    $scope.slider = {
        fontSize: {
            min: 8,
            max: 32,
            step: 0.5,
            width: 300,
            bindingOptions: {
                value: 'fontSizeTreeView'
            },                        
            tooltip: {
                enabled: true,
                format: function (value) {
                    return value + "px";
                },
                showMode: "onHover",
                position: "top"
            },
            label: {
                visible: true,
                format: function (value) {                    
                    if(value === 8)
                        return "<i class='dx-icon dx-icon-growfont' style='font-size:20px;'></i>";
                    else
                        return "<i class='dx-icon dx-icon-shrinkfont' style='font-size:20px;'></i>";
                },
                position: "top"
            }
        },
        margin: {
            min: -10,
            max: 10,
            step: 0.5,
            width: 300,
            bindingOptions: {
                value: 'lineMarginTreeView'
            },
            onValueChanged: function(e) {
                $(function() {
                    let line = $('div.dx-item.dx-treeview-item');
                    line.css("margin-top", $scope.lineMarginTreeView);                    
                    
                })
            },
            tooltip: {
                enabled: true,
                format: function (value) {
                    return value + "px";
                },
                showMode: "onHover",
                position: "top"
            },
            label: {
                visible: true,
                format: function (value) {
                    if (value === -10)
                        return "<i class='dx-icon dx-icon-collapse' style='font-size:24px;'></i>";
                    else
                        return "<i class='dx-icon dx-icon-expand' style='font-size:24px;'></i>";
                },
                position: "top"
            }
        }
    }


    /* ISSUES WITH TreeView :: 
    - Whe item is added to TV, if a closed line contains open child, this parent node will be expanded when the item is added to datSource
        # SOLUTION : We store IdTV that is collapsed by user, and keep it closed when we add item at rendered. If the store IdTV is opened after beeing closed we delete her store IdTV to beeing see. Of course when TV is initialized we delete all IdTV that were used before. [Object used in localStorage : idTreeviewClosedObj]
    - When TV is reload/repaint the height of page is > 0, the scroll is going to top after modifications
        # SOLUTION : After each action of reload/repaint TV, we store the Y position of the scroll and go to this position after the last content rendered (scroll to use in content ready)
    - Item render is trigger before item expand because when expanded a node first we render child already loaded, then load other childs to trigger expand
    */
    //WIDGET TreeView
    $scope.treeView = {
        bindingOptions: {
            items: 'jsonOrder'
            //, hint: 'toolTipOfNodeText'
        },
        dataStructure: "plain",
        parentIdExpr: "IdTreeviewParent",
        keyExpr: "IdTreeview",
        hasItemsExpr: "hasItems",
        displayExpr: "NodeText",
        noDataText: "",
        rootValue: null,

        onInitialized: function (e) {
            // Remove old value
            localstorage.remove("idTreeviewClosedObj");
            $scope.idTreeviewClosedObj = {}; // will contain each idTV who's closed by user
            //console.log($window.localStorage);
        },

        onContentReady: function (e) {
            $scope.TreeViewOptionsInstanceComponent = e.component;
            $scope.TreeViewInstance = $scope.TreeViewOptionsInstanceComponent.instance();

            // Content is ready 2 time when expand a node, first when node already load is render, then after loading child (We only need to scroll at the 2nd time)            
            console.log("%cContentReady scrollY to [" + toScrollY + "]", "color:red;");
            window.scrollTo(0, toScrollY);

            //$scope.allNode = $scope.TreeViewOptionsInstanceComponent.getNodes();                        
            //console.log(allNode.map(an => an.expanded));              
        },

        onItemCollapsed: function (e) {
            //console.log(e);

            // Add / Remove vertical grey line
            $(function () {
                let openLine = $('li.dx-treeview-node:has(> .dx-treeview-toggle-item-visibility-opened)');
                let closeLine = $('li.dx-treeview-node:not(> .dx-treeview-toggle-item-visibility-opened)');
                let classLine = 'dx-treeview-vertical-line';

                $(closeLine).removeClass(classLine);
                $(openLine).addClass(classLine);
            })

            // To store in localstorage if this node his expanded or not            
            let thisNodeId = e.node.itemData.IdTreeview;
            $scope.idTreeviewClosedObj[thisNodeId] = true;
            localstorage.setObject("idTreeviewClosedObj", $scope.idTreeviewClosedObj);
        },

        onItemExpanded: function (e) {
            console.log(e);

            // Get id TV of node expanded
            let thisNodeId = e.node.itemData.IdTreeview;
            console.log(thisNodeId);

            // Highlight item expand (to find it easily) THIS METHOD HIGHLIGHT ALL CHILDREN TOO !!
            //$scope.TreeViewOptionsInstanceComponent.selectItem(e.itemElement);

            // Get value of Y           
            toScrollY = toScrollYtmp;            

            // Add / Remove vertical grey line
            $(function () {
                let openLine = $('li.dx-treeview-node:has(> .dx-treeview-toggle-item-visibility-opened)');
                let closeLine = $('li.dx-treeview-node:not(> .dx-treeview-toggle-item-visibility-opened)');
                let classLine = 'dx-treeview-vertical-line';

                $(closeLine).removeClass(classLine);
                $(openLine).addClass(classLine);
            })

            // Check if this node was collapsed by user, if it is expand it
            if ($scope.idTreeviewClosedObj !== {}) {
                // Si cette ligne est dans l'obj, on l'enlève pour qu'elle puisse être affichée            
                if ($scope.idTreeviewClosedObj.hasOwnProperty(thisNodeId)) {
                    delete $scope.idTreeviewClosedObj[thisNodeId];
                    localstorage.setObject("idTreeviewClosedObj", $scope.idTreeviewClosedObj)
                }
                $scope.idTreeviewClosedObj = localstorage.getObject("idTreeviewClosedObj", {});
            }
            else
                console.log("%cAucun ID dans l'obj", "color:blue");


            // When expanding a node, get the children foreach child of the node
            if (e.node.children.length) {
                $scope.TreeViewOptionsInstanceComponent.beginUpdate();

                let nbChildren = e.node.children.length;
                let nodeChildren = e.node.children;
                let promises = []; // Store promise in array
                $scope.jsonToAdd = [];

                for (var i = 0; i < nbChildren; i++) {
                    //Mettre un loader tant qu'ils n'ont pas été chargés

                    // See if they don't have already children, else we can search 
                    if (!nodeHasChildren(nodeChildren[i])) {

                        var childData = nodeChildren[i].itemData;

                        // Put each 
                        promises.push(
                            $http({
                                url: 'AllApi/GetCustomJsonLine',
                                method: 'GET',
                                params: {
                                    ID_View: User.getID_View(User.getID_User()),
                                    TableName: childData.TableName,
                                    IdDataSource: childData.IdDataSource,
                                    idTreeview: childData.IdTreeview
                                }
                            }).then(function (response) {
                                $scope.jsonToAdd = response.data;

                                $scope.j = 1;
                                // Ajout de son identifiant 'IdTreeview'
                                $scope.jsonToAdd.forEach(function (e) {
                                    e.IdTreeview = $scope.jsonOrder.length + $scope.j;
                                    $scope.j++;
                                })

                                // Ajout dans la source du TV (performe séparément sinon l'un prend le dessus, besoin d'une promise...)
                                $scope.jsonToAdd.forEach(function (e) {
                                    $scope.jsonOrder.push(e);
                                })

                            }).catch(function (response) {
                                console.log(response);
                            })
                        );
                    }
                }

                // When all promise are return
                $q.all(promises)
                    .then(function (e) {
                        $scope.TreeViewOptionsInstanceComponent.endUpdate();
                    }).catch(function (e) { console.log(e); });
            }           
        },

        onItemRendered: function (e) {
            //console.log(e);     

            // Get position Y when first item is render then access it to item expand            
            toScrollYtmp = window.scrollY;

            // Expand the first node (Order)
            if (e.itemIndex === 1) {
                e.node.internalFields.expanded = true;
            }

            // Add vertical grey line
            $(function () {
                let openLine = $('li.dx-treeview-node:has(> .dx-treeview-toggle-item-visibility-opened)');
                let classLine = 'dx-treeview-vertical-line';
                $(openLine).addClass(classLine);
            })

            // To keep the custom value margin-top from UI slider          
            e.itemElement[0].style.margin = $scope.lineMarginTreeView + "px 0px 0px 0px";

            // If some lines were not expanded and have child expand, keep it closed (issue from TV devexpress)
            let thisNodeId = e.node.IdTreeview;
            if ($scope.idTreeviewClosedObj !== {}) {
                if ($scope.idTreeviewClosedObj.hasOwnProperty(thisNodeId)) {
                    //console.log("%cnode to be closed : " + thisNodeId, "color: green;");
                    e.node.internalFields.expanded = false;
                }
            }

            // To see or not the deleted lines
            if (e.itemData.JsonRawData) {

                if (!$scope.displayDeletedLine && !$scope.decompo) {
                    $scope.LineJsonData = angular.fromJson(e.itemData.JsonRawData);
                    //console.log(e.itemData.JsonRawData);

                    var afterATAT = 'ATAT":"'.length;
                    var toFind = e.itemData.JsonRawData.indexOf('ATAT') + afterATAT;

                    if (e.itemData.JsonRawData.charAt(toFind) === '*') {
                        e.itemElement[0].hidden = true;
                    }
                }
            }

            // Hide line filetred by type line with the view used            
            if ($scope.filterTypeLineObj) {
                if (!$scope.filterTypeLineObj.hasOwnProperty(e.itemData.TableName)) {
                    e.itemElement[0].style.fontSize = "0px";
                    e.itemElement[0].style.lineHeight = "30px";
                }
                else {
                    if (!$scope.filterTypeLineObj[e.itemData.TableName].includes(e.itemData.TypeLine)) {
                        e.itemElement[0].style.fontSize = "0px";
                        e.itemElement[0].style.lineHeight = "30px";
                    }
                }
            }
            else
                DevExpress.ui.notify("Les paramaètres du filtrage des lignes provenant de la vue n'a pas pu être chargé", "error", 2000);

            // Change color text from user setting
            if ($scope.colorObj) {
                switch (e.itemData.TypeLine) {
                    case ('C'):
                        e.itemElement.css('color', $scope.colorObj.Commande);
                        break;
                    case ('A'):
                        e.itemElement.css('color', $scope.colorObj.Ligne);
                        break;
                    case ('O'):
                        e.itemElement.css('color', $scope.colorObj.GammeOpe);
                        break;
                    case ('P'):
                        e.itemElement.css('color', $scope.colorObj.Pere);
                        break;
                    case ('N'):
                        e.itemElement.css('color', $scope.colorObj.Fils);
                        break;
                    case ('V'):
                        e.itemElement.css('color', $scope.colorObj.Virtuelle);
                        break;
                    case ('U'):
                        e.itemElement.css('color', $scope.colorObj.Usinage);
                        break;
                    case ('S'):
                        e.itemElement.css('color', $scope.colorObj.EtapeUsi);
                        break;
                    case ('G'):
                        e.itemElement.css('color', $scope.colorObj.MatiereGen);
                        break;
                    case ('I'):
                        e.itemElement.css('color', $scope.colorObj.IPM);
                        break;
                    case ('F'):
                        e.itemElement.css('color', $scope.colorObj.Fabrication);
                        break;
                    case ('W'):
                        e.itemElement.css('color', $scope.colorObj.PDC);
                        break;
                    default:
                        e.itemElement.css('color', "black");
                        //DevExpress.ui.notify("Le type de la ligne n'a pas été trouvé ! [" + e.itemData.TypeLine + "]", "error", 3000); -> TYPE L
                        break;
                }
            }
            else
                DevExpress.ui.notify("Les paramètres de couleurs n'ont pas pu être chargés", "error", 2000);


            //To find the text for tooltip with the mouse hover it
            e.element
                .find(".dx-treeview-item")
                .on("mouseover", function (e) {

                    var data = $(e.currentTarget).data().dxTreeviewItemData;
                    $scope.toolTipOfNodeText = data.NodeToolTip;

                    var element = document.getElementById('toolTipText')
                    if (element != null) {
                        element.innerHTML = $scope.toolTipOfNodeText;
                        $scope.hideToolTip = false;
                    }
                });

            // Expand node loaded from expand-all option of right-click context menu
            if (e.node.expandAll) {
                e.node.internalFields.expanded = true;
            }
        },

        onItemClick: function (node) {
            $scope.nodeData = node.itemData;

            // GET data for detail zone
            if ($scope.detailZoneVisible) {                
                $http({
                    url: 'AllApi/GetDetailLineData',
                    method: 'GET',
                    params: {
                        ID_View: User.getID_View(User.getID_User()),
                        TableSubLevelType: $scope.nodeData.TypeLine,
                        TableName: $scope.nodeData.TableName,
                        JsonField: $scope.nodeData.JsonRawData
                    }
                }).then(function (response) {
                    //console.log(response.data);                    
                    $scope.detailLineData = response.data[0].DetailText

                    // To add <br> (need to pass the text by html and not by string)
                    var element = document.getElementById('zone-detail-text')
                    if (element != null) {
                        element.innerHTML = $scope.detailLineData
                    }

                }).catch(function (response) {
                    console.log(response);
                    alert(reponse);
                });
            }
        },

        // Right-click on Node
        onItemContextMenu: function (e) {
            $scope.parentNode = null;
            $scope.nodeClicked = e;
        }
    };
       


    
    // WIDGET Context menu TV (right-click)
    $scope.contextMenuTreeview = {
        target: 'div.dx-item.dx-treeview-item',
        dataSource: ContextMenuTreeViewItems,

        itemTemplate: function (itemData, itemIndex, itemElement) {
            var template = $('<div></div>');
            //var rootPathImg = 'Content/img/contextMenuTreeView/'
            if (itemData.icon) {
                template.append('<span class="' + itemData.icon + '"><span>');
            }
            template.append(' ' + itemData.text);
            // If node avec children add a ->
            if (itemData.items) {
                template.append('<span class="dx-icon-spinright"><span>');
            }
            return template;
        },

        onItemClick: function (e) {
            
            var key = e.itemData.key;
            //var subKey = e.itemData.subKey;

            switch (key) {
                case 'Expand': {                                        

                    $scope.itemElement = $scope.nodeClicked.itemElement[0];                    
                    //$($scope.itemElement).before("<i class='dx-icon dx-icon-refresh dx-treeview-item-load-expand'></i>");
                    $($scope.itemElement).before("<i class='dx-icon fa fa-spinner dx-treeview-item-load-expand'></i>");
                    
                    $scope.TreeViewOptionsInstanceComponent.beginUpdate();                    

                    let nodeClicked = $scope.nodeClicked.node.itemData
                    let childNodeClicked = $scope.nodeClicked.node.children;
                    $scope.childNodeToExpand = [];
                    let promises = [];                    
                    var i = 0;
                    
                    childNodeClicked.forEach(function (element) {                                                
                        $scope.childNodeToExpand.push(element.itemData.IdTreeview);    

                        i += 100000; // TO IMPROVE :: For expanded node we add 'x'00000 to IdTreeview to keep unique key 

                        // Si l'enfant'a pas d'enfant on les recherche tous
                        if (element.children.length === 0) {
                            promises.push(
                                $http({
                                    url: 'AllApi/GetCustomJsonAllLine',
                                    method: 'GET',
                                    params: {
                                        ID_View: User.getID_View(User.getID_User()),
                                        TableName: element.itemData.TableName,
                                        IdDataSource: element.itemData.IdDataSource,
                                        idTreeview: element.itemData.IdTreeview,
                                        tvLength: $scope.jsonOrder.length + i
                                    }
                                }).then(function (response) {
                                    $scope.jsonToAdd = response.data;                                    
                                    
                                    // Add propertie to expand it in rendered + add it to DataSource
                                    $scope.jsonToAdd.forEach(function (element) {                                        
                                        element.expandAll = true;                                        
                                        $scope.jsonOrder.push(element);
                                    });

                                }).catch(function (response) {
                                    DevExpress.ui.notify("L'expansion de la ligne [" + nodeClicked.NodeText + "] est tombé en échec", "error", 2000)
                                    console.log(response);
                                })
                            );
                        }                        
                    });
                           
                    $q.all(promises)
                        .then(function (e) {              
                            toScrollY = window.scrollY;
                            $(".dx-treeview-item-load-expand").remove();                            
                            DevExpress.ui.notify("L'expansion de la ligne [" + nodeClicked.NodeText + "] est fini", "success");
                            $scope.TreeViewOptionsInstanceComponent.endUpdate();
                            
                            // Expand parent node & his child's, the rest is expanded in rendered with the propertie expandAll
                            $scope.TreeViewOptionsInstanceComponent.expandItem($scope.nodeClicked.itemData.IdTreeview);
                            $scope.childNodeToExpand.forEach(function (e) {
                                $scope.TreeViewOptionsInstanceComponent.expandItem(e);
                            })
                            
                        })
                        .catch(function (e) {                                                        
                            DevExpress.ui.notify("L'expansion de la ligne [" + nodeClicked.NodeText + "] est tombé en échec", "error", 2000);
                            console.log(e);

                            $(".dx-treeview-item-load-expand").remove();
                        });
                    break;
                }
        /*TODO*/case 'ModifyLine': {
                    // Mène à la page de customisation de la vue, sur le type de ligne sélectionné, si la vue est modifiable

                    console.log($scope.nodeClicked);
                    let lineTable = $scope.nodeClicked.itemData.TableName;
                    let lineType = $scope.nodeClicked.itemData.TypeLine;

                    User.getID_View(User.getID_User());
                    let view = localstorage.get("ID_View", "La vue n\'a pas pu être obtenue");
                   

                    let customPage = window.open("Custom/Visualisation");
                    customPage.lineTable = lineTable;
                    customPage.lineType = lineType;
                    customPage.view = view;
                    
                    break;
                }
                case 'ModifyColor': {
                   
                    // Enable visible property of widget ColorBox
                    $scope.colorBoxModifyLineVisible = true;                    

                    // Open the widget directly
                    $scope.colorBoxModifyLineElement.open();
                             
                    // To place the widget at the mouse position                                        
                    $("#colorBoxModifyColor").css("left", e.event.clientX);
                    $("#colorBoxModifyColor").css("top", e.event.clientY);
                    
                    // Take color of current type line selected
                    if ($scope.colorObj) {
                        switch ($scope.nodeClicked.itemData.TypeLine) {
                            case ('C'):
                                $scope.colorObjTMP = $scope.colorObj.Commande;
                                break;
                            case ('A'):
                                $scope.colorObjTMP = $scope.colorObj.Ligne;
                                break;
                            case ('O'):
                                $scope.colorObjTMP = $scope.colorObj.GammeOpe;
                                break;
                            case ('P'):
                                $scope.colorObjTMP = $scope.colorObj.Pere;
                                break;
                            case ('N'):
                                $scope.colorObjTMP = $scope.colorObj.Fils;
                                break;
                            case ('V'):
                                $scope.colorObjTMP = $scope.colorObj.Virtuelle;
                                break;
                            case ('U'):
                                $scope.colorObjTMP = $scope.colorObj.Usinage;
                                break;
                            case ('S'):
                                $scope.colorObjTMP = $scope.colorObj.EtapeUsi;
                                break;
                            case ('G'):
                                $scope.colorObjTMP = $scope.colorObj.MatiereGen;
                                break;
                            case ('I'):
                                $scope.colorObjTMP = $scope.colorObj.IPM;
                                break;
                            case ('F'):
                                $scope.colorObjTMP = $scope.colorObj.Fabrication;
                                break;
                            case ('W'):
                                $scope.colorObjTMP = $scope.colorObj.PDC;
                                break;
                            default:
                                $scope.colorObjTMP = "black";
                                break;
                        }
                    }
                    else {
                        $scope.colorObjTMP = "#eee";
                        DevExpress.ui.notify("Les paramètres de couleurs n'ont pas été chargés", "error", 3000);
                    }
                    break;
                }
                default: {
                    DevExpress.ui.notify("Click inconnu, choix introuvable, veuillez-contacter le support", "error", 5000);
                    break;
                }
            }
             
        }
    }

    // WIDGET - ColorBow to modify color line in treeview
    $scope.colorBox = {
        bindingOptions: {
            value: 'colorObjTMP',
            visible: 'colorBoxModifyLineVisible'
        },        
        applyButtonText: "Valider",
        cancelButtonText: "Annuler",
        onContentReady: function (e) {
            $scope.colorBoxModifyLineElement = e.component;
        },
        onValueChanged: function (e) {      
            switch ($scope.nodeClicked.itemData.TypeLine) {
                case ('C'):
                    $scope.colorObj.Commande = $scope.colorObjTMP;
                    break;
                case ('A'):
                    $scope.colorObj.Ligne = $scope.colorObjTMP;
                    break;
                case ('O'):
                    $scope.colorObj.GammeOpe = $scope.colorObjTMP;
                    break;
                case ('P'):
                    $scope.colorObj.Pere = $scope.colorObjTMP;
                    break;
                case ('N'):
                    $scope.colorObj.Fils = $scope.colorObjTMP;
                    break;
                case ('V'):
                    $scope.colorObj.Virtuelle = $scope.colorObjTMP;
                    break;
                case ('U'):
                    $scope.colorObj.Usinage = $scope.colorObjTMP;
                    break;
                case ('S'):
                    $scope.colorObj.EtapeUsi = $scope.colorObjTMP;
                    break;
                case ('G'):
                    $scope.colorObj.MatiereGen = $scope.colorObjTMP;
                    break;
                case ('I'):
                    $scope.colorObj.IPM = $scope.colorObjTMP;
                    break;
                case ('F'):
                    $scope.colorObj.Fabrication = $scope.colorObjTMP;
                    break;
                case ('W'):
                    $scope.colorObj.PDC = $scope.colorObjTMP;
                    break;
                default:
                    "black";
            }
            $scope.colorBoxModifyLineVisible = false;

            // Get Y position before repaint
            toScrollY = window.scrollY;

            // Reload only the markup (balisage)
            $scope.TreeViewOptionsInstanceComponent.repaint();
        }
    }
    
    //WIDGET ToolTip for node
    $scope.toolTip = {
        position: 'left',
        bindingOptions: {
            target: 'toolTipTarget'
        },
        //visible: $scope.toolTipActive,
        onContentReady: function (e) {
            $scope.toolTipInstance = e.component;
            $scope.toolTipInstance.show();
        },
        showEvent: {
            //name: 'dxpointerenter dxhoverstart',                
            name: 'dxpointerover'
        },
        hideEvent: {
            name: 'dxpointerout dxpointerleave',
        },
        animation: {
            show: {
                type: "pop",
                from: {
                    scale: 0.1,
                    opacity: 0
                },
                to: {
                    opacity: 1,
                    scale: 1
                }
            },
            hide: {
                type: "pop",
                from: {
                    scale: 1,
                    opacity: 1
                },
                to: {
                    scale: 0.1,
                    opacity: 0
                }
            }
        }
    };

    // WIDGET - Display detail of node 
    $scope.zoneDetail = {
        handles: "left"
        // in html ng-if to display it or not
        // Options taille dans le style.CSS        
    };

    // WIDGET - Zone scroll to contain Detail Zone
    $scope.zoneScroll = {
        scrollByContent: true,
        scrollByThumb: true,
        reachBottomText: 'Chargement...',
        showScrollbar: 'onHover',
        bounceEnabled: false        
    }

    $scope.increaseFont = function () {
        if ($scope.fontSizeDetail <= 24) {
            $scope.fontSizeDetail++;
        }
    }

    $scope.decreaseFont = function () {
        if ($scope.fontSizeDetail >= 8) {
            $scope.fontSizeDetail--;
        }
    }



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
            // Get Y position before repaint
            toScrollY = window.scrollY;

            // Reload only the markup (balisage)
            $scope.TreeViewOptionsInstanceComponent.repaint();
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

            // Get Y position before repaint
            toScrollY = window.scrollY;

            $scope.TreeViewOptionsInstanceComponent.repaint();
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


    // ORDER VERSION WITH DX LOOKUP LIST 
    /* FOR SPECIFIC ORDER VERSION
    //console.log($scope.allNumberOrderVersion);
    $scope.toTreeViewAgence = searchData.agency;
    $scope.toTreeViewOrder = searchData.order;
    $scope.toTreeViewLine = searchData.line;
    $scope.toTreeViewLibrary = searchData.library;

    $scope.allNumberOrderVersion.reverse();
        $scope.withOrder = true;
        $scope.forLoadIndicator = false;
    
    // WIDGET List Version in Pop-up
    $scope.lookupOptionsVersion = {
        bindingOptions: {
            dataSource: "allNumberOrderVersion",
            value: 'allNumberOrderVersion[0]',
            visible: "withOrder"
            dataSource: ["1", "2", "3"],
            value: "1"
        },
        popupHeight: 700,
        popupWidth: 250,
        showPopupTitle: true,
        closeOnOutsideClick: true,
        placeholder: "Sélectionner un numéro de version",
        displayExpr: "OrderVersion",
        onInitialized: function () {
            //$scope.orderVersionSelected = $scope.allNumberOrderVersion[0].OrderVersion
            //console.log($scope.orderVersionSelected)
        },
        onItemClick: function (item) {
            //$scope.orderVersionSelected = item.itemData.OrderVersion
        }
    };

    */

}
