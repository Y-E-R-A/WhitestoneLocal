angular.module('Whitestone').controller('createUserController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var first_name = "";
        
        var last_name = "";
        
        var about = "";
        
        var email = "";
        
        var role = "";

        

        var title = "";


            
        var id = 0;

        // This variable hold the information on the part
        // as read from the REST API
        var credentialList = {};
        
    
        
        this.createNewUser = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
        
                     
            data.first_name = this.first_name;
            
            data.last_name = this.last_name;
            
            data.about = this.about;
        
            data.email = this.email;

            data.role = this.role;

            data.title = this.title;
            

            //var reqURL = "";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    alert("New user added with id:");
                    
                    
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList));

                    if (status == 0) {
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404) {
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        }; 
}]);