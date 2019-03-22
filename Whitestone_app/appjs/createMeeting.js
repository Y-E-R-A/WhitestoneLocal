angular.module('Whitestone').controller('createMeetingController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var meeting_name = "";
        
        var meeting_desc = "";
        
        var meeting_day = "";
        
        var meeting_month = "";
        
        var meeting_year = "";

            
        var id = 0;
        // This variable hold the information on the part
        // as read from the REST API
        var credentialList = {};
        
    
        this.createMeeting = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
        
                     
            data.meeting_name = this.meeting_name;
            
            data.meeting_desc = this.meeting_desc;
            
            data.meeting_month = this.meeting_month;

            data.meeting_day = this.meeting_day;

            data.meeting_year = this.meeting_year;
        
            
            // Now create the url with the route to talk with the rest API
            //var reqURL = "";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert(" ");
                    
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
}]);