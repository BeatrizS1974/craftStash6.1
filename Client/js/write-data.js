var app= angular.module("addProductsApp", [])

    app.controller("addProductsCtrl", function($scope, $http){
        $scope.submitProduct = function(){
            console.log(dog);
        if($scope.name == "" || $scope.color == "" || $scope.manufacturer == "" || $scope.type == "" || $scope.location == "" ||$scope.quantity == "" ){
        return;
        }
        $http({
            method: "post",
            url: indexURL + "/write_record",
            data:{
                ProductName: $scope.productName,
                Color: $scope.color,
                Manufacturer: $scope.manufacturer,
                ProductType: $scope.type.toLowerCase(),
                Location: $scope.location,
                Quantity: $scope.quantity

            }
        }).then(function(response){
            if(response.data.msg == "SUCCESS"){
                $scope.addResults = "Item is added!";
                $scope.productName = "";
                $scope.color ="";
                $scope.manufacturer="";
                $scope.type = "";
                $scope.location= "";
                $scope.quantity= "";
            }else{
                $scope.addResults = response.data.msg;
   
            }

        }), function(err){
            console.log(err);
        }
    }
    $scope.addResults = "";
})