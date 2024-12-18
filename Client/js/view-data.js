var spells= [];
var activeSpell = 0;


var app = angular.module('browseProductsApp',[]);

app.controller('browseProductCtrl', function($scope, $http) {

    $scope.get_records = function() {
        $http({
            //send request to the server
            method:'get',
            url: indexURL + "/get-records"

        }).then(function(response){
            //if successfully connected to the server
            if(response.data.msg === "SUCCESS"){
                products = response.data.products;
                $scope.obj = products[activeProduct];
                $scope.showHide;
            
            }else {
                console.log(response.data.msg);

            }
        }), function(error) {
            console.log(error);
        }
    }
    $scope.get_records();

    $scope.changeProduct = function(direction){
        activeProduct += direction;
        $scope.obj = products[activeProduct];
        $scope.showHide;
    }
$scope.showHide = function() {
    $scope.hidePrev = (activeProduct == 0);
    $scope.hideNext = (activProduct == products.length-1);
}

});// End of Controller