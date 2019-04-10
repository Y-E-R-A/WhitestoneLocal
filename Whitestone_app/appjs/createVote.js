angular.module('Whitestone').controller('votingController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        //List of active voting questions from database
        this.votingQuestion = [];
        this.votingChoices = [];
        //List of inactive voting question and choices
        this.inActiveVotingQuestion = [];
        this.inActiveVotingChoices = {};
        this.inActiveVotingResult = {};

        //The voting question
        var voting_question = "";
        
        //The objective of the vote
        var voting_objective = "";
        
        //var fecha = $scope.nowdate;
        
        //Date in MM/DD/YYYY
        var vMM = "";
        var vDD = "";
        var vYYYY = "";
        
        //Time: Hour:Minutes
        var vHour = "";
        var vMin = "";

        //The limit of answers
        var vLimit = "";
        this.meetingId =0;
        
        var vid = 0;
        
        //The current active voting question
        this.activeVID = 0;
        //Variable that determines if there is an active voting question
        this.activeVotingQuestion = false;
        //variable that determines if there is an active meeting
        this.activeMeeting = false;
        //List of Users that can participate in voting question
        this.electSenatorList = [];
        this.electStudentSenatosList = [];
        this.exofficioSenatorList = [];
        this.exofficioStudentSenatorList = [];
        
        //Check box selection
        this.titles = [{title:'Elect Student Senator', selected:false},
        {title:'Ex-Officio Student',selected:false},
        {title:'Elect',selected:false},
        {title:'Ex-Officio',selected:false}];
        
        //Table that stores the selected participants
        this.selection = [];
        //Dictionary that stores the different alternatives
        this.votingAlternatives = [{altId:"alt1", valt:''}]
        
        //Add the participants of a voting question to a list
        this.addToSelection = function(title){
            console.log("title"+title)
          if(this.selection.includes(title)){
            this.selection.splice( this.selection.indexOf(title), 1 );
          }else{
            this.selection.push(title);
          }
            console.log("selection: "+this.selection)
        }
        
        //Adds the different alternatives
        this.addAlternative = function(){
          var newAlt = this.votingAlternatives.length+1;
          this.votingAlternatives.push({altId:"alt"+newAlt});
          console.log("voting alternatives: "+this.votingAlternatives)
        }
        //Removes an alternative
        this.removeAlternative = function(index){
          //remove($index) en html
          this.votingAlternatives.splice(index,1);
        }
        //////////////////////////////////////////////////////
        
        this.createVote = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
            var d = new Date();
            data.creatorID = $routeParams.uid;
            //console.log("thisCtrl in create: "+thisCtrl.meetingId)
            data.mID = thisCtrl.meetingId;
            data.vquestion = this.voting_question;
            
            data.vdescription = this.voting_objective;
            
            //data.vdate = this.vMM+"/"+vDD+"/"+vYYYY;
            data.vtime = d.getHours()+":"+d.getMinutes();
            data.vdate = d.getMonth()+"/"+d.getDay()+"/"+d.getFullYear();
            //data.vtime = this.vHour+":"+this.vMin+"pm";
        
            data.selectionlimit = this.vLimit;
            
            data.vstatus = "Active";

            //Ruta para crear voting question y para obtener la voting question por meeting id
            var reqURL = "http://localhost:5000/whitestone/voting";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    
                    thisCtrl.votingQuestion = response.data.Voting;
                    thisCtrl.activeVotingQuestion = true;
                    thisCtrl.selectParticipant(response.data.Voting.vID);
                    thisCtrl.activeVID = response.data.Voting.vID;
                    console.log("choices: "+JSON.stringify(thisCtrl.votingAlternatives));
                    console.log("choices alt: "+thisCtrl.votingAlternatives[0].valt);
                    for(var y=0;y<thisCtrl.votingAlternatives.length;y++){
                        console.log("choices valt loop: "+thisCtrl.votingAlternatives[y].valt);
                        thisCtrl.createChoices(thisCtrl.votingAlternatives[y].valt,response.data.Voting.vID);
                    }
                    
                    
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
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

        this.closeVotingQuestion = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
        
                     
            data.vID = thisCtrl.activeVID;
        
            data.vstatus = "Inactive";

            
            var reqURL = "http://localhost:5000/whitestone/votingstatus/"+thisCtrl.activeVID;
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
                    //alert("New user added with id: " +response.data.User.cid);
                    thisCtrl.activeVotingQuestion = false;
                    
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
        this.selectParticipant = function(vid){
            console.log("selection: "+this.selection);

            for(var i=0;i<this.selection.length;i++){
                if(this.selection[i]==='Elect Student Senator'){
                    thisCtrl.getAllUsersByElectStudent(vid);
                }else if(this.selection[i]==='Ex-Officio Student'){
                    thisCtrl.getAllUsersByExOfficioStudent(vid);
                }else if(this.selection[i]==='Elect'){
                    thisCtrl.getAllUsersByElect(vid);
                }else if(this.selection[i]==='Ex-Officio'){
                    thisCtrl.getAllUsersByExOfficio(vid);
                }
            }
        };
        this.getAllUsersByElectStudent = function(vid){
            // Get the target part id from the parameter in the url
            console.log("Elect Students")
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/electstudentsenators";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Elect Student: " + JSON.stringify(response.data))
                    thisCtrl.electSenatorList = response.data.User;
                    for(var i=0;i<response.data.User.length;i++){
                        thisCtrl.createVoteIn(vid,response.data.User[i].uID);
                        
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.getAllUsersByExOfficioStudent = function(vid){
            // Get the target part id from the parameter in the url
            console.log("ExOfficio Students");
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/exofficiostudentsenators";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response ExOfficio Student: " + JSON.stringify(response.data))
                    thisCtrl.exofficioStudentSenatorList = response.data.User;
                    
                    for(var i=0;i<response.data.User.length;i++){
                        thisCtrl.createVoteIn(vid,response.data.User[i].uID);
                        
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.getAllUsersByElect = function(vid){
            // Get the target part id from the parameter in the url
            console.log("Elect Senators");
            
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/electsenators";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Elect: " + JSON.stringify(response.data))
                    thisCtrl.electSenatorList = response.data.User;
                    for(var i=0;i<response.data.User.length;i++){
                        thisCtrl.createVoteIn(vid,response.data.User[i].uID);
                        
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.getAllUsersByExOfficio = function(vid){
            // Get the target part id from the parameter in the url
            console.log("ExOfficio Senator");
            
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/exofficiosenators";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Exofficio Senator: " + JSON.stringify(response.data))
                    thisCtrl.exofficioSenatorList = response.data.User;
                    
                    for(var i=0;i<response.data.User.length;i++){
                        thisCtrl.createVoteIn(vid,response.data.User[i].uID);
                        
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        this.createVoteIn = function(vid,uid){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;

            //data.udescription = this.description;
            console.log("vID: "+vid);
            console.log("uID: "+uid);
            var data = {};
            
            data.vID = vid;
            data.uID = uid;
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            //Ruta para crear voting question y para obtener la voting question por meeting id
            var reqURL = "http://localhost:5000/whitestone/"+uid+"/votesIn/"+vid;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response CreateVoteIn: " + JSON.stringify(response.data))

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
                    
                    //thisCtrl.id = response.data.User.cid
                    
                    console.log("response "+response.data);
                    
                    //thisCtrl.credentialList = response.data.User;
                    
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    //console.log("second sign in")
                    
                    //thisCtrl.signUpUser();
                    thisCtrl.activeMeeting = true;
                     console.log("thisCtrl: "+thisCtrl.meetingId);
                    thisCtrl.meetingId = JSON.stringify(response.data.Meeting[0].mID);
                    console.log("response.data.Meet: "+response.data.Meeting[0].mID)
                    console.log("mid: "+thisCtrl.meetingId)
                    thisCtrl.loadInActiveVotingQuestions();
                    thisCtrl.loadActiveVotingQuestions(thisCtrl.meetingId);
                    thisCtrl.activeVotingQuestion = true;
                    
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
                        alert("No active meeting was found.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.loadActiveVotingQuestions = function(meetingID){

        
            //Ruta de results de voting questions

            var reqURL = "http://localhost:5000/whitestone/activevotings/"+meetingID;
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response ACTIVE VOTING QUESTION: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.votingQuestion = response.data.Voting[0];
                    thisCtrl.activeVID = response.data.Voting[0].vID;
                    thisCtrl.loadActiveChoices(response.data.Voting[0].vID);
                    
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
                        alert("No active voting question available.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadActiveChoices = function(vid){

        
            console.log("load Choices: "+vid);    

            var reqURL = "http://localhost:5000/whitestone/voting/"+vid+"/choices";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Load Active Choices: " + JSON.stringify(response.data))
                    thisCtrl.votingChoices = response.data.Choice;


                    
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
        this.loadInActiveVotingQuestions = function(){


            var reqURL = "http://localhost:5000/whitestone/inactivevotings/"+thisCtrl.meetingId;
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

                    thisCtrl.inActiveVotingQuestion = response.data.Voting;
                    
                    console.log("InActive VQ List: "+JSON.stringify(thisCtrl.inActiveVotingQuestion));
                    
                    for(var i=0;i<thisCtrl.inActiveVotingQuestion.length;i++){
                        thisCtrl.loadChoices(thisCtrl.inActiveVotingQuestion[i].vID);
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
                        alert("There are no inactive voting questions");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadChoices = function(vid){

        
            console.log("load Choices: "+vid);    

            var reqURL = "http://localhost:5000/whitestone/voting/"+vid+"/choices";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response Load Choices: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.inActiveVotingChoices[vid] = response.data.Choice;
                    //thisCtrl.loadResult(vid,response.data.Choice);

                    
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
                        alert("There are no choices available");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        this.loadResult = function(vid,choiceTable ){

        
            console.log("load Result vid: "+vid);
            console.log("load Result choiceTabl: "+JSON.stringify(choiceTable));

            // Now create the url with the route to talk with the rest API
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

                    console.log("Inactive Voting Choice 2: "+JSON.stringify(thisCtrl.inActiveVotingChoice2));
                    var num = vid;
                    var table = [];
                    //for(var i=0;i<thisCtrl.inActiveVotingChoice2.length;i++){
                    for(var i=0;i<choiceTable.length;i++){
                        var dic = {};
                        var boolean = false;
                        for(var j=0;j<response.data.VotingResult.length;j++){

                            if(choiceTable[i].choice===response.data.VotingResult[j].vchoice){

                                dic["choice"] = choiceTable[i].choice;
                                dic["votes"] = response.data.VotingResult[j].votes;
                                table.push(dic);
                                boolean = true;
                                break;
                            }else{
                                boolean = false;
                            }
                        }
                        if(!boolean){
                                dic["choice"] = choiceTable[i].choice;
                                dic["votes"] = 0;
                                table.push(dic);
                            }
                    }
                    console.log("table: "+JSON.stringify(table));
                    thisCtrl.inActiveVotingResult[vid]=table;
                    console.log("IAVCT2: "+JSON.stringify(thisCtrl.inActiveVotingResult));
                    //dic[num] =response.data.VotingResult;
                    //var dict =[];
                    
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
                        alert("The are no results available");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
    
        this.createChoices = function(choice,vid){
            // Get the target part id from the parameter in the url

            console.log("In createChoices: "+choice);
            var data = {};
            //data.choice = thisCtrl.votingAlternatives[0].valt;
            data.choice = choice;
            //data.vid = thisCtrl.activeVID;
            data.vID = vid;
            //console.log("data: " + JSON.stringify(data));
            
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/voting/choice";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response CreateCHoices: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
            //Choice
                    thisCtrl.votingChoices.push(response.data.Choice);
                    console.log("Choice List: "+JSON.stringify(thisCtrl.votingChoices));
                    
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
        this.meetingRedirect = function(){
                                   console.log("role"+$routeParams.role)
            console.log("uid"+$routeParams.uid)
            $location.url("/meeting/"+$routeParams.role+'/'+$routeParams.uid);
        }
        this.oldMeetingRedirect = function(){
            console.log("role"+$routeParams.role)
            console.log("uid"+$routeParams.uid)
            $location.url('/oldMeeting/'+$routeParams.role+'/'+$routeParams.uid);
        }
        //this.loadInActiveVotingQuestions();
        this.loadActiveMeeting();
        
}]);