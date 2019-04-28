angular.module('Whitestone').controller('senatorController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object
        var thisCtrl = this;
        
        //Meeting information and status
        this.activeMeeting = false;
        this.meetingId = 0;
        
        //Request status
        this.requestedTurn = false;
        
        //Boolean to determine if a Senator can speak
        this.turnApproved = false;
        
        //Return Id value of interval function.
        //This is utilized to cancel the interval once the Senator has spoken
        this.intervalId;
        this.time = "00:00:00";
        
        this.requestTurn = function(){
            

            // Now create the url with the route to talk with the rest API
            var data = {};
            //Test Values///
            data.uid = parseInt($routeParams.uid);
            data.fname ="Harry";
            data.lname = "Lopez";
            data.requestedTurn = true;
            data.turnApproved = false;
            ////////////////
            var reqURL = "http://localhost:5000/whitestone/requestTurn";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response request turn: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.requestedTurn = true;
                    thisCtrl.timedInterval(10000);
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
                        alert("Could not add user to turn list");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        //Function to setInterval for Senator request
         this.timedInterval = function(timeoutPeriod){
            //this.intervalId = setInterval("",timeoutPeriod);
             //console.log("Time Start")
            //this.intervalId = setInterval(function(){thisCtrl.showTime()},2000); 
             //console.log("interval id: "+this.intervalId);
             
             thisCtrl.intervalId = setInterval(function(){thisCtrl.checkApproval()},timeoutPeriod);
             console.log("interval id: "+thisCtrl.intervalId);
             //this.intervalId = setInterval(function(){thisCtrl.showTime()},2000);
        };
        
        //Testing time events
        this.cancelInterval = function(){
            console.log("cancel Interval");
            clearInterval(this.intervalId);
        };
        this.showTime = function(){
            var d = new Date();
            console.log("Show Time");
            this.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(thisCtrl.time);
            document.getElementById("time").innerHTML = this.time;
        };
        this.cancelTurn = function(){
            

            // Now create the url with the route to talk with the rest API
            var data = {};
            data.uid = parseInt($routeParams.uid);
            data.fname ="";
            data.lname = "";
            var reqURL = "http://localhost:5000/whitestone/cancelTurn";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response cancel turn: " + JSON.stringify(response.data))
                    
                    //Stop polling for approval.
                    clearInterval(thisCtrl.intervalId);
                    
                    //Resetting data
                    thisCtrl.requestedTurn = false;
                    thisCtrl.turnApproved = false;

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
                        alert("Could not cancel turn");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.checkApproval = function(){
            

            // Now create the url with the route to talk with the rest API
            var data = {};
            data.uid = parseInt($routeParams.uid);
            var reqURL = "http://localhost:5000/whitestone/checkapproval";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response check approval: " + JSON.stringify(response.data))
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
                        //alert("There is no active meeting");
                        console.log("Your request is still pending")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.loadActiveMeeting = function(){
            

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/activemeeting";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    
                    console.log("response "+response.data);
                    thisCtrl.meeting = response.data.Meeting[0];
                    //Updating the status of the meeting
                    thisCtrl.activeMeeting = true;
                    thisCtrl.meetingId = response.data.Meeting[0].mID;
                    //Checking if the Senator has made a previous request
                    console.log(typeof($routeParams.uid));
                    thisCtrl.checkRequest();

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
                        alert("There is no active meeting");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.checkRequest = function(){

            var reqURL = "http://localhost:5000/whitestone/checkrequest/"+$routeParams.uid;
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response check request: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                     //Resetting data
                    thisCtrl.requestedTurn = true;
                    thisCtrl.turnApproved = false;
                    thisCtrl.timedInterval(10000);
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
                        //alert("There is no active meeting");
                        console.log("The request does not exist")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadActiveMeeting();
        
        this.voteRedirect = function(){
            thisCtrl.cancelInterval();
            $location.url('/voting/'+$routeParams.role+'/'+$routeParams.uid);
        }

        this.logout= function(){
            thisCtrl.cancelTurn();
            $location.url('/login');
        };
}]);