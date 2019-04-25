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
                console.log(this.role+this.title);
                if(this.role=="Secretary" && this.title!="Staff"){
                    alert("Secretaries can only have the 'Staff' classification");
                }else if(this.role=="Senator" && this.title=="Staff"){
                    alert("Senators cannot have the 'Staff' classification");
                }else if(this.role=="Chancellor" && this.title!="Ex-Officio Senator"){
                    alert("Chancellors can only have the 'Ex-Officio' classification");
                }else if(this.role=="Administrator" && this.title!="Staff"){
                    alert("Administrators can only have the 'Staff' classification")
                }else{
                    console.log(this.role+this.title);
                    console.log("fn valid: "+this.userForm.fn.$invalid)
                    thisCtrl.createNewCredentials();
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

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/credentials";

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
                    console.log("response status: "+JSON.stringify(response.status))
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
                    }else if(status == 400){
                        alert("The email already exists")
                    }else {
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
        
            data.urole = this.role;

            data.uclassification = this.title;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/users";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response createUser: " + JSON.stringify(response.data))
                    alert("The User has been created")
                    // assing the part details to the variable in the controller
                    thisCtrl.recordActivity();
                    
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
        this.recordActivity = function(){
            
            var d = new Date();
            
            //Dictionary that will store the data for the database
            var data = {};
            data.urole = $routeParams.role;
            data.uemail = "m.melendez@upr.edu";//dummy value
            data.date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
            data.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            data.logmessage = "Create New User";

            //url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/activitylog";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response record AL: " + JSON.stringify(response.data))

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
                        alert("Could not store the activity.");
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
        this.logout= function(){
            $location.url('/login');
        };
}]);