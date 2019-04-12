angular.module('Whitestone').controller('createMeetingController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        var meeting_name = "";
        
        var meeting_desc = "";
        
        var meeting_status = "";
        
        this.active = false;
        this.meetingId = 0;
        var id = 0;
        
        this.meetingNVal = false;
        this.meetingDVal = false;
        this.meeting = [];
        // This variable hold the information on the part
        // as read from the REST API
        
        this.createMeeting = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            var d = new Date();
            var data = {};
        
            //data.creatorID = $routeParams.uid;       
            
            data.mname = this.meeting_name;
            data.mdescription = this.meeting_desc;
            //data.mdate = this.meeting_month+'/'+this.meeting_date+'/'+this.meeting_year;
            data.mdate = d.getMonth()+"/"+d.getDate()+"/"+d.getFullYear();
            //data.mtime = "11:07pm"
            data.mtime = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            data.mstatus = "Active";
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/activemeeting";
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
                    thisCtrl.active = true;
                    thisCtrl.meetingId = response.data.Meeting.mID;
                    thisCtrl.meeting = response.data.Meeting;
                    //thisCtrl.active = true;
                    
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };   
        
        this.closeMeeting = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object

            var data = {};
            data.mID = thisCtrl.meetingId;
            //data.mstatus = "Inactive";
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/meetingstatus";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.put(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.active = false;
                    
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
                        alert("No se encontro la informacion solicitada.");
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
                    //if(response.data.Meeting[0].mstatus==="Active"){
                    thisCtrl.meeting = response.data.Meeting[0];
                    thisCtrl.active = true;
                    thisCtrl.meetingId = response.data.Meeting[0].mID;
                    //}

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
            console.log("uid: "+$routeParams.uid);
            console.log("role1: "+$routeParams.role);
            console.log("role2: "+$routeParams.Secretary);
        
            $location.url('/Vote/'+$routeParams.role+'/'+$routeParams.uid);
        }
         this.oldMeetingRedirect = function(){
            console.log("role"+$routeParams.role)
            console.log("uid"+$routeParams.uid)
            $location.url('/oldMeeting/'+$routeParams.role+'/'+$routeParams.uid);
        }
        this.logout= function(){
            $location.url('/login');
        };
}]);