'use strict';

angular.module('BOMViewer')
    .controller('headerLayout', headerLayout);

headerLayout.$inject = ['$scope', '$location'];



function headerLayout($scope, $location) {
    /*
    var showSubmenuModes = [{
        name: "onHover",
        delay: { show: 0, hide: 500 }
    }, {
        name: "onClick",
        delay: { show: 0, hide: 300 }
    }];

    $scope.showFirstSubmenuMode = showSubmenuModes[0];
    $scope.orientation = "horizontal";
    $scope.submenuDirection = "rightOrBottom";
    $scope.closeOnMouseLeave = true;

    /* old menu with DX
    // WIDGET MENU
    $scope.menuOptions = {
        dataSource: menu,
        displayExpr: "name",
        onItemClick: function (data) {
            location.replace(data.itemData.url);
        },
        bindingOptions: {
            showFirstSubmenuMode: "showFirstSubmenuMode",
            orientation: "orientation",
            submenuDirection: "submenuDirection",
            hideSubmenuOnMouseLeave: "closeOnMouseLeave"
        }
    };*/

    
    $scope.loadAccueil = function (e) {
        location.replace("Home/index");
    }
}