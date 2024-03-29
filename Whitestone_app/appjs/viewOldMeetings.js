angular.module('Whitestone').controller('oldMeetingsController', ['$http', '$log', '$scope','$location', '$routeParams', 
    function($http, $log, $scope, $location, $routeParams) {
        var thisCtrl = this;
        
        this.messageList = [];
        
        //Old Meeting List
        this.oldMeetingList = [];
        //Voting Questions List
        this.votingQuestionList = [];
        //Choice List
        this.votingChoiceList = {};
        
        var meetingId = 0;

        var votingQuestionId = 0;

        var currentMeetingId = 0;

        var vid = 0;
        
        
        this.addToSelection = function(title){
            if(selection.includes(title)){
              this.selection.splice( this.selection.indexOf(title), 1 );
            }else{
              this.selection.push(title);
            }
        }
        thisCtrl.list = [];
		thisCtrl.selected = false;
        
		this.checkMeeting = function(meeting) {
            console.log("meeting: "+JSON.stringify(meeting))
				if (meeting.checked) {
					for(var i=0;i<thisCtrl.oldMeetingList.length;i++){
						thisCtrl.oldMeetingList[i].checked = false;
					}
                    meeting.checked = true;
                    thisCtrl.selected = true;
                    thisCtrl.loadInActiveVotingQuestions(meeting.mID);
                    thisCtrl.recordActivity("View");
					//thisCtrl.list = [];
					
				} else {
					//$scope.checkedCount--;
                    thisCtrl.selected = false;
                    meeting.checked = false;
					//var length = thisCtrl.list.length;
					//for(var i = 0; i<length;i++){
					//	thisCtrl.list.pop();
					//}
				};

		};
       this.loadMeetings = function(){

            var reqURL = "http://localhost:5000/whitestone/meeting/oldmeetings";

            var config = { headers : 
                {'Content-Type':'application/json;charset=utf-8;' }
               }
            // It has two function call backs, one for success and one for error

            $http.get(reqURL).then(// success call back
                function (response){
                    console.log("response: " + JSON.stringify(response.data))
                // The is the sucess function!
                // Copy the list of parts in the data variable
                    
                    thisCtrl.oldMeetingList = response.data.Meeting;
                    //Adding a boolean value to determine afterwards which meeting is selected
                    for (var i=0;i<thisCtrl.oldMeetingList.length;i++){
                        thisCtrl.oldMeetingList[i]["checked"] = false;
                    }
                    console.log("meeting list: "+JSON.stringify(thisCtrl.oldMeetingList))

                }, // error callback
                function (response){
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    
                    if (status == 0){
                        alert("No hay conexion a Internet");
                    }
                    else if (status == 401){
                        alert("Su sesion expiro. Conectese de nuevo.");
                    }
                    else if (status == 403){
                        alert("No esta autorizado a usar el sistema.");
                    }
                    else if (status == 404){
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.loadInActiveVotingQuestions = function(meetingId){
            thisCtrl.votingQuestionList =  [];
            thisCtrl.votingChoiceList = {};
            console.log("Meeting Id: "+meetingId);
            var reqURL = "http://localhost:5000/whitestone/inactivevotings/"+meetingId;
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Voting Question: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.votingQuestionList = response.data.Voting;
                    
                    //Loading the choices with respect to the loaded voting question
                    for(var i=0;i<response.data.Voting.length;i++){
                        thisCtrl.loadChoices(response.data.Voting[i].vID);
                    }
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
                        alert("The meeting does not have any questions");
                        thisCtrl.votingQuestionList = [];
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        this.loadChoices = function(vid){
            console.log("loadCh: "+vid)
            
            var reqURL = "http://localhost:5000/whitestone/voting/"+vid+"/choices";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Choices: " + JSON.stringify(response.data))
                    
                    thisCtrl.votingChoiceList[vid] = response.data.Choice;

                    
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
                        alert("The question does not have any choices");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadResults = function(vid,choice){

            console.log("loadRes vid: "+vid);
            console.log("choice: "+JSON.stringify(choice))
            //Ruta de results de voting questions
            var reqURL = "http://localhost:5000/whitestone/voting/"+vid+"/results";

            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Load Result: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.votingChoiceList;
                    var table = [];
                    for(var i=0;i<choice.length;i++){
                        var dic = {};
                        var boolean = false;
                        for(var j=0;j<response.data.VotingResult.length;j++){

                            if(choice[i].choice===response.data.VotingResult[j].vchoice){

                                dic["choice"] = choice[i].choice;
                                dic["votes"] = response.data.VotingResult[j].votes;
                                table.push(dic);
                                boolean = true;
                                break;
                            }else{
                                boolean = false;
                            }
                        }
                        if(!boolean){
                                dic["choice"] = choice[i].choice;
                                dic["votes"] = 0;
                                table.push(dic);
                            }
                    }
                    //console.log("table: "+JSON.stringify(table));
                    thisCtrl.votingChoiceList[vid]=table;
                    console.log("VCL: "+JSON.stringify(thisCtrl.votingChoiceList));
                    //dic[num] =response.data.VotingResult;
                    //var dict =[];

                  
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
            if(action=="View"){
                data.logmessage= "View Old Meeting";
            }else if(action=="Listen"){
                data.logmessage = "Listened to Audio File";     
            }

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
        this.meetingRedirect = function(){
            $location.url("/meeting/"+$routeParams.role+'/'+$routeParams.uid);
        }
        
        this.voteRedirect = function(){
            $location.url('/Vote/'+$routeParams.role+'/'+$routeParams.uid);
        }
        this.logout= function(){
            $location.url('/login');
        };
        this.loadMeetings();
}]);