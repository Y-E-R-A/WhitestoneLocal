angular.module('Whitestone').controller('submitVoteSenController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;
        
        //List of voting voting questions from database
        this.votingQuestions = [];
        
        //The voting question
        var voting_question = "";
        
        //The objective of the vote
        var voting_objective = "";

        
        this.newChoiceList = [];
        this.Limit =0;
        this.count =0;
        this.selectedChoice = [];

        this.meetingId =0;
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
            if (thisCtrl.selectedChoice.includes(choice)) {
                    thisCtrl.count--;
                    //console.log('--');
                    //item.checked = false;
                    var findId = $scope.checkedItems.indexOf(item.id);
                    thisCtrl.selectedChoice.splice(findId, 1);
            } else {
                    //console.log('++' + item.name);
                    thisCtrl.count++;
                    //item.checked = true;
                    thisCtrl.selectedChoice.push(item.id)
            };
        };

        this.checkSubmit = function(){
            if (confirm("Are you sure you want to submit your answer?")) {
              thisCtrl.submitVote();
            } else {
            }
        }
        
        this.loadChoices = function(){

        
            
            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/MessagingAppP1/credentials";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    alert("New user added with id: " +response.data.User.cid);
                    
                    //thisCtrl.id = response.data.User.cid
                    
                    //console.log("ctrl cid "+this.id )
                    
                    //thisCtrl.newChoiceList = response.data.User;

                    for (var i=0;i<thisCtrl.newChoiceList.length;i++){
                        thisCtrl.newChoiceList[i]["checked"] = false;
                    }
                    //thisCtrl.Limit = dblimit;
                    
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    //console.log("second sign in")
                    
                    
                    for(var i=0;i<$scope.votingAlternatives.length;i++){
                      thisCtrl.createAlternatives($scope.votingAlternatives[i].valt);
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };    
        this.submitVote = function(){

        
            var data = [];
            data.uid = uid;
            data.altid = altid;
            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/votesubmission";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.get(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    alert("New user added with id: " +response.data.User.cid);
                    
                    //thisCtrl.id = response.data.User.cid
                    
                    //console.log("ctrl cid "+this.id )
                    

                    //thisCtrl.Limit = dblimit;
                    
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    //console.log("second sign in")
                    
                    
                    for(var i=0;i<$scope.votingAlternatives.length;i++){
                      thisCtrl.createAlternatives($scope.votingAlternatives[i].valt);
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };  
}]);