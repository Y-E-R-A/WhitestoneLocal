angular.module('Whitestone').controller('LoginController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var email = "";
        
        var password = "";

        //For testing purposes
        var role = "";

        // This variable hold the information on the part
        // as read from the REST API
        var credentialList = {};

        this.loginUserTest = function(){
            if(this.role == "Administrator"){
                        $location.url('/createUser/'+"Administrator");
                    }else if(this.role == "Secretary"){
                        $location.url("createMeeting"+'/Secretary/');
                    }else if(this.role == "Senator"){
                        $location.url('/speak/'+"Senator");
                    }else if(this.role == "Chancellor"){
                        $location.url('/cDashboard/'+"Chancellor");
                    }
        }
        this.loginUser = function(){
 

            var data = {};
        
            data.user = this.user;
            
            data.password = this.password;
            
            console.log("data: " + JSON.stringify(data));
            console.log("user: "+this.user);
            console.log("password: "+this.password);
            
            // Now create the url with the route to talk with the rest API
            //var reqURL = "";

            console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
 
                    
                    //Get User Role
                    var role = "";

                    if(role == "Administrator"){
                        $location.url('/createUser/'+"Administrator");
                    }else if(role == "Secretary"){
                        $location.url("createMeeting"+'/Secretary/');
                    }else if(role == "Senator"){
                        $location.url('/speak/'+"Senator");
                    }else if(role == "Chancellor"){
                        $location.url('/cDashboard/'+"Chancellor");
                    }

                    
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
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
                        //Create Warning redirect
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        
}]);