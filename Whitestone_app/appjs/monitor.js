angular.module('Whitestone').controller('monitorController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        //List of voting voting questions from database
        this.votingQuestion = [];
        this.votingChoices = [];

        //The voting question
        var voting_question = "";
        
        //The objective of the vote
        var voting_objective = "";
        
        this.activeMeeting = false;
        this.activeVotingQuestion = false;
        
        this.lastVotingQuestion = false;
        
        this.activeMeetingId =0;
        this.votingId =0;

       
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
                    
                    thisCtrl.activeMeeting = true;
                    console.log("mID: "+thisCtrl.activeMeetingId);
                    thisCtrl.loadVotingQuestion(response.data.Meeting[0].mID);
                    
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
                        console.log("There is currently no active meeting")
                        this.activeMeeting = false;
                        //alert("There is currently no active meeting");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        this.loadVotingQuestion = function(meetingID){

        
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/activevotings/"+meetingID;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Active VQ: " + JSON.stringify(response.data))
                    
                    //An active voting question is running
                    thisCtrl.activeVotingQuestion = true;
                    thisCtrl.lastVotingQuestion = false;
                    //Storing the voting ID of the voting question
                    thisCtrl.votingId = response.data.Voting[0].vID;

                    //Storing the voting question
                    thisCtrl.votingQuestion = response.data.Voting[0];
                    console.log("VQ: "+JSON.stringify(thisCtrl.votingQuestion));
                    
                    thisCtrl.loadActiveChoices(response.data.Voting[0].vID);
                    
 
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;

                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404) {
                        console.log("There is no active voting question")
                        this.activeVotingQuestion = false;
                        thisCtrl.loadLastVotingQuestion(meetingID);
                        //alert("There is currently no active voting question");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadLastVotingQuestion = function(meetingID){

        
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/inactivevotings/"+meetingID;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Last VQ: " + JSON.stringify(response.data))
                    
                    //An active voting question is running
                    thisCtrl.lastVotingQuestion = true;
                    
                    //Storing the voting ID of the voting question
                    thisCtrl.votingId = response.data.Voting[0].vID;

                    //Storing the voting question
                    thisCtrl.votingQuestion = response.data.Voting[0];
                    console.log("VQ: "+JSON.stringify(thisCtrl.votingQuestion));
                    
                    thisCtrl.loadChoices(response.data.Voting[0].vID);
                    
 
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;

                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404) {
                        console.log("There is no voting question");
                        this.lastVotingQuestion = false;
                        //alert("There is currently no active voting question");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadActiveChoices = function(vid){

            // Now create the url with the route to talk with the rest API
            console.log("vid: "+vid);
            var reqURL = "http://localhost:5000/whitestone/activevoting/"+vid+"/choices";
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

                    thisCtrl.votingChoices = response.data.Choice;
                    console.log("votingChoices: "+JSON.stringify(thisCtrl.votingChoices));

                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;;

                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404) {
                        console.log("No voting choices were found");
                        //alert("No voting choices were found");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };    
        this.loadChoices = function(vid){

            // Now create the url with the route to talk with the rest API
            console.log("vid: "+vid);
            var reqURL = "http://localhost:5000/whitestone/voting/"+vid+"/choices";
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

                    thisCtrl.votingChoices = response.data.Choice;
                    console.log("votingChoices: "+JSON.stringify(thisCtrl.votingChoices));

                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;;

                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404) {
                        console.log("No voting choices were found");
                        //alert("No voting choices were found");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };    
        
        this.timedRefresh = function(timeoutPeriod){
            setTimeout("location.reload(true);",timeoutPeriod);
        };
        this.loadActiveMeeting();
        window.onload = thisCtrl.timedRefresh(30000);
}]);