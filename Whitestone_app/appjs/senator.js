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

        this.requestTurn = function(){
            
            this.requestedTurn = true;
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/activemeeting";

        };   
        
        this.cancelTurn = function(){

            this.requestedTurn = false;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/meetingstatus";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
       
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
                    thisCtrl.activeMeeting = true;
                    thisCtrl.meetingId = response.data.Meeting[0].mID;

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

        this.loadActiveMeeting();
        
        this.voteRedirect = function(){
            $location.url('/voting/'+$routeParams.role+'/'+$routeParams.uid);
        }

        this.logout= function(){
            $location.url('/login');
        };
}]);