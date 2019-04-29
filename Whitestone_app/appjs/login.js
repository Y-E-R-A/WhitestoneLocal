angular.module('Whitestone').controller('LoginController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var email = "";
        
        var password = "";
        
        this.radiusLogin = false;
        this.loginForm;
        this.emailInput;
        this.checkForm = function(){
            if(this.loginForm.$valid){
                thisCtrl.loginUser();
            }else{
                if(this.radiusLogin){
                    alert("Invalid email and/or password. Please try again.");
                }else{
                    alert("Invalid email and/or pin. Please try again.");   
                }
            }
        }


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
            
            data.pin = this.password;
            
            console.log("data: " + JSON.stringify(data));
            console.log("email: "+this.email);
            console.log("password: "+this.password);
            
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/credentials/user";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: "+JSON.stringify(response.data));
                    //Get User Role
                    var role = response.data.User.role;
                    console.log("role"+role)
                    var uid = response.data.User.uid;
                    console.log("uid"+uid)
                    thisCtrl.recordActivity(role);
                    if(role == "Administrator"){
                        $location.url('/createUser/'+role+'/'+uid);
                    }else if(role == "Secretary"){
                       console.log("Secretary")
                        $location.url("/meeting/"+role+'/'+uid);
                    }else if(role == "Senator"){
                        //$location.url('/voting/'+role+"/"+uid);
                        $location.url('/Turns/'+role+"/"+uid);
                    }else if(role == "Chancellor"){
                        $location.url('/ChancellorTurns/'+role+"/"+uid);
                        //$location.url('/votingChancellor/'+role+"/"+uid);
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
                        if(thisCtrl.radius){
                            alert("Invalid email and/or password. Please try again.");
                        }else{
                            alert("Invalid email and/or pin. Please try again.");
                            
                        }
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        
        this.recordActivity = function(role){
            
            var d = new Date();
            
            //Dictionary that will store the data for the database
            var data = {};
            data.urole = role;
            data.uemail = this.email;
            data.date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
            data.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            data.logmessage = "Log in";

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
        //$http.get("https://ipinfo.io/json").then(function (response) 
		//{
		//	$scope.ip = response.data.ip;
		//});
}]);