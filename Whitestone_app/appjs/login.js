angular.module('Whitestone').controller('LoginController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var email = "";
        
        var password = "";


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
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
        
            data.email = this.email;
            
            data.password = this.password;
            
            console.log("data: " + JSON.stringify(data));
            console.log("email: "+this.email);
            console.log("password: "+this.password);
            
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/credentials/user";

            console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
            console.log("bitch");
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    
                    // assing the part details to the variable in the controller
                    thisCtrl.credentialsList = response.data.User;
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList))
                    console.log("uid without JSON: " + response.data)
                    console.log("uid with JSON: " +JSON.stringify(response))
                    
                    //this.group(response.data.User.uid);
                    //console.log("uid: " + JSON.stringify(response.data.User[0].uid))
                    
                    //Get User Role
                    var role = response.data.User.role;
                    console.log("role"+role)
                    var uid = response.data.User.uid;
                    console.log("uid"+uid)
                    if(role == "Administrator"){
                        $location.url('/createUser/'+role+'/'+uid);
                    }else if(role == "Secretary"){
                       console.log("Secretary")
                        $location.url("/meeting/"+role+'/'+uid);
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
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList));
                    //console.log("Error: " + reqURL);
                    //alert("Cristo");
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