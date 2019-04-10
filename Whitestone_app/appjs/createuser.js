angular.module('Whitestone').controller('createUserController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var first_name = "";
        
        var last_name = "";
        
        var about = "";
        
        var password = "";
        
        var email = "";
        
        var role = "";

        this.userForm;

        var title = "";


            
        var id = 0;
        
        var cID = 0;
        // This variable hold the information on the part
        // as read from the REST API
        var credentialList = {};
        
        this.checkForm = function(){
            if(this.userForm.$valid){
                if(this.role=="Secretary" && this.title!="Staff"){
                    alert("Secretaries can only have the 'Staff' classification");
                }else if(this.role=="Senator" && this.title=="Staff"){
                    alert("Senators cannot have the 'Staff' classification");
                }else if(this.role=="Chancellor" && this.title!="Ex-Officio"){
                         alert("Chancellors can only have the 'Ex-Officio' classification");
                }else if(this.role=="Administrator" && this.title!="Staff"){
                    alert("Administrators can only have the 'Staff' classification")
                }else{
                    console.log(this.role+this.title);
                    //thisCtrl.createNewCredentials();
                }
                
            }else{
                alert("Please fill the fields correctly");
            }
        }
        
        this.createNewCredentials = function(){
            // Get the target part id from the parameter in the url
            console.log("Creating Credentials");
            var data = {};
        
        
            data.email = this.email;
            data.pin = this.password;


            console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/credentials";

            //EditUser
            //var reqURL = "http://localhost:5000/whitestone/edituser/"+route.uid;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response createCredentials: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);
                    var cID = response.data.Credential.cID;
                    console.log("cID: "+cID);
                    thisCtrl.createNewUser(cID);

                    
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.createNewUser = function(cID){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            console.log("creating User");
            var data = {};
        
            data.cID = cID;
            
            data.ufirstname = this.first_name;
            
            data.ulastname = this.last_name;
            
            data.udescription = this.about;
        
            //data.email = this.email;

            data.urole = this.role;

            data.uclassification = this.title;
            
            //data.udescription = this.description;
            
            console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/users";

            //EditUser
            //var reqURL = "http://localhost:5000/whitestone/edituser/"+route.uid;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response createUser: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller

                    
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        }; 
        this.activityLogRedirect = function(){
            $location.url('/activityLog/'+$routeParams.role+'/'+$routeParams.uid);
        }
        
        this.editUserRedirect = function(){
            $location.url('/editUser/'+$routeParams.role+'/'+$routeParams.uid);
        }
        this.redirectLogOut = function(){
            $location.url('/ActivityLog/'+$routeParams.role+'/'+$routeParams.uid);
        }
}]);