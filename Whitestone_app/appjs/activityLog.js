angular.module('Whitestone').controller('activityLogController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {

        var thisCtrl = this;
        //$scope.nowdate = Date();

        var date = "";

        this.newActivityLogList = [];

        this.searchActivity = function () {

            // First set up the url for te route
            var data = {};
            console.log("date: "+this.date);
            data.date = this.date;

            console.log("Search Activity");
            console.log("data: "+JSON.stringify(data));
            var reqURL = "http://localhost:5000/whitestone/getactivitylog";
            // Now set up the $http object
            // It has two function call backs, one for success and one for error
            var config = {
                headers:
                    { 'Content-Type': 'application/json;charset=utf-8;' }
            }

            $http.post(reqURL,data,config).then(// success call back
                function (response) {
                    // The is the sucess function!
                    // Copy the list of parts in the data variable
                    console.log("response Activity Log: " + JSON.stringify(response))
                    thisCtrl.newActivityLogList = response.data.Log;
                    thisCtrl.recordActivity();
                    //thisCtrl.newActivityLogList = response.data;
                    //thisCtrl.newActivityLogList = response.data;
                }, // error callback
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    console.log("response2: " + JSON.stringify(response));
                    var status = response.status;
                    if (status == 0) {
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 400) {
                        alert("Invalid date format");
                    }
                    else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404) {
                        alert("No activity was found");
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
            data.logmessage = "Search Activity Log";

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
        this.createUserRedirect = function () {
            $location.url("/createUser/" + $routeParams.role + '/' + $routeParams.uid);
        }

        this.editUserRedirect = function () {
            $location.url("/editUser/" + $routeParams.role + '/' + $routeParams.uid);
        }
        this.logout= function(){
            $location.url('/login');
        };
    }]);