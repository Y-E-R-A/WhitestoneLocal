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
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);
                    console.log("response "+response.data);

                    thisCtrl.activeMeetingId = response.data.Meeting[0].mID;
                    //thisCtrl.meetingId = JSON.stringify(response.data.Meeting[0].mID);
                    //console.log("response.data.Meet: "+response.data.Meeting[0].mID)
                    //console.log("mid: "+thisCtrl.meetingId)
                    console.log("mID: "+thisCtrl.activeMeetingId);
                    thisCtrl.loadVotingQuestion(response.data.Meeting[0].mID);
                    
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
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);
                   thisCtrl.votingId = response.data.Voting[0].vID;
                    thisCtrl.checkParticipation(response.data.Voting[0].vID);
                    thisCtrl.VotingQuestion = response.data.Voting[0];
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
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
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList));

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
                    //alert("New user added with id: " +response.data.User.cid);
                    //this.newChoiceList = response.data;
                    
                    thisCtrl.votingChoices = response.data.Choice;
                    console.log("votingChoices: "+JSON.stringify(thisCtrl.votingChoices));
                    for(var i=0;i<thisCtrl.votingChoices.length;i++){
                        thisCtrl.votingChoices[i]["checked"] = false;
                    }
                    console.log("votingChoices: "+JSON.stringify(thisCtrl.votingChoices));
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList));
                    //console.log("Error: " + reqURL);
                    //alert("Cristo");
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
                    // assing the part details to the variable in the controller

                    
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList));
                    //console.log("Error: " + reqURL);
                    //alert("Cristo");
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
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialsList));
                    //console.log("Error: " + reqURL);
                    //alert("Cristo");
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
        
        this.loadActiveMeeting();
}]);