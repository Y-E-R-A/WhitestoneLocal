angular.module('Whitestone').controller('submitVoteController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        //List of voting voting questions from database
        this.VotingQuestion = [];
        this.votingChoices = [];
        this.limit =0;
        this.count =0;
        this.participation = true;
        //The voting question
        var voting_question = "";
        
        //The objective of the vote
        var voting_objective = "";
        
        this.activeMeeting = false;
        this.activeVotingQuestion = false;
        
        
        this.selectedChoice = [];

        this.activeMeetingId =0;
        this.votingId =0;
        var altId =0;
        var selection = [];
        
        //Testing Purposes
        this.votingquestion = [{"voting_question":"Aprobacion del curso ICOM5016","Voting_date":"3/21/2019","Voting_Time":"5:10 PM"}];
        this.alternatives = [{"alt1":"Yes","alt2":"No","alt3":"Abstain"}];

        //Testing purposes
        this.construct = function(){
            for (var i=0;i<thisCtrl.alternatives[0].length;i++){
                thisCtrl.alternatives[i]["checked"] = false;
            }
        }

        this.checkChoice = function(choice) {
            console.log("Limit: "+thisCtrl.limit);
            
            console.log("voting Choice: "+JSON.stringify(thisCtrl.votingChoices));
            if (thisCtrl.selectedChoice.includes(choice.choice)) {
                console.log("its included")
                    thisCtrl.count--;
                    //console.log('--');
                    //item.checked = false;
                    var findId = thisCtrl.selectedChoice.indexOf(choice.choice);
                    thisCtrl.selectedChoice.splice(findId, 1);
            } else {
                    console.log("not included")
                    //console.log('++' + item.name);
                    thisCtrl.count++;
                    //item.checked = true;
                    thisCtrl.selectedChoice.push(choice.choice);
            };
            console.log("selectedChoice: "+JSON.stringify(thisCtrl.selectedChoice));
        };

        this.checkSubmit = function(){
            if (confirm("Are you sure you want to submit your answer?")) {
              //thisCtrl.submitVote();
                var x = thisCtrl.selectedChoice.length;
                console.log("x: "+x);
                
                for(var i=0;i<x;i++){
                    console.log("selected Choice Loop: "+thisCtrl.selectedChoice[i]);
                    thisCtrl.submitVote(thisCtrl.selectedChoice[i]);
                }
                thisCtrl.recordActivity();
                thisCtrl.disableParticipation();
            } else {
            }
        }
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
                    thisCtrl.activeMeetingId = response.data.Meeting[0].mID;

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
                        alert("There is currently no active meeting");
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
                    //Storing the voting ID of the voting question
                    thisCtrl.votingId = response.data.Voting[0].vID;
                    //
                    thisCtrl.checkParticipation(response.data.Voting[0].vID);
                    //Storing the voting question
                    thisCtrl.VotingQuestion = response.data.Voting[0];
                    //Storing the limit of choices
                    thisCtrl.limit = response.data.Voting[0].selectionlimit;
                    console.log("VQ: "+JSON.stringify(thisCtrl.VotingQuestion));
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
                        alert("There is currently no active voting question");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        //Function to determine if the user can participate in the voting question
        this.checkParticipation = function(vid){

            // Now create the url with the route to talk with the rest API
            console.log("vid: "+vid);
            console.log("uid: "+$routeParams.uid);
            var reqURL = "http://localhost:5000/whitestone/"+$routeParams.uid+"/votesIn/"+vid;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Participation: " + JSON.stringify(response.data))
                    thisCtrl.participation = response.data.Participant.exercise_vote;

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
                        alert("User is not a participant in the voting question");
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
                    
                    //Adding a boolean parameter to determine afterwards which choices the user selects
                    for(var i=0;i<thisCtrl.votingChoices.length;i++){
                        thisCtrl.votingChoices[i]["checked"] = false;
                    }
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
                        alert("No voting choices were found");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };    
        this.submitVote = function(choices){

            console.log("choice: "+choices);
            var data = {};
            data.choice = choices;
            // Now create the url with the route to talk with the rest API
            console.log("data: "+JSON.stringify(data));
            var reqURL = "http://localhost:5000/whitestone/voting/choicesnew";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    alert("Your vote has been submitted");
                    // assing the part details to the variable in the controller
                    
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        //Function to disable the participation once a user has submitted his/her vote
        this.disableParticipation = function(){

            var data = {};
            data.uID = $routeParams.uid;
            data.vID = thisCtrl.votingId;
            // Now create the url with the route to talk with the rest API
            console.log("data: "+JSON.stringify(data));
            var reqURL = "http://localhost:5000/whitestone/"+$routeParams.uid+"/votesIn/"+thisCtrl.votingId;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.put(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response disable: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.participation = true;
                    
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.recordActivity = function(action){
            
            var d = new Date();
            
            //Dictionary that will store the data for the database
            var data = {};
            data.urole = $routeParams.role;
            data.uemail = this.email;
            data.date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
            data.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            data.logmessage = "Submitted Vote";

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
        this.turnsRedirect = function(){
            $location.url('/Turns/'+$routeParams.role+'/'+$routeParams.uid);
        };
        this.logout= function(){
            $location.url('/login');
        };
        
        this.loadActiveMeeting();
}]);