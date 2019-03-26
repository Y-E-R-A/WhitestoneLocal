angular.module('AppChat').controller('activityLogController', ['$http', '$log', '$scope','$location', '$routeParams', 
    function($http, $log, $scope, $location, $routeParams) {
        
        var thisCtrl = this;
        $scope.nowdate = Date();

        var date = "";

        this.newActivityLogList = [];


        this.searchActivity = function(){

            // First set up the url for te route
            var data = [];
            data.date = thisCtrl.date;
            

            var reqURL = "http://localhost:5000/whitestone/activitylog";
            // Now set up the $http object
            // It has two function call backs, one for success and one for error
            var config = { headers : 
                {'Content-Type':'application/json;charset=utf-8;' }
               }

            $http.get(reqURL,data,config).then(// success call back
                function (response){
                // The is the sucess function!
                // Copy the list of parts in the data variable
                    console.log("response: " + JSON.stringify(response))
                    
                    thisCtrl.newActivityLogList = response.data;
                    
                }, // error callback
                function (response){
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    console.log("response2: " + JSON.stringify(response));
                    var status = response.status;
                    if (status == 0){
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401){
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403){
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404){
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
}]);