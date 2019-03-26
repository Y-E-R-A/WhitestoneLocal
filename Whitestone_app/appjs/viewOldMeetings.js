angular.module('AppChat').controller('oldMeetingsController', ['$http', '$log', '$scope','$location', '$routeParams', 
    function($http, $log, $scope, $location, $routeParams) {
        var thisCtrl = this;
        $scope.nowdate = Date();
        
        this.messageList = [];

        this.newOldMeetingList = [];
        this.votingQuestionList = [];
        this.newChoiceList = [];

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
		this.checkMeeting = function(item) {
				if (item.checked) {
					for(var i=0;i<$scope.items.length;i++){
						thisCtrl.newOldMeetingList[i].checked = false;
					}
                    item.checked = true;
                    thisCtrl.loadVotingQuestion();
					//thisCtrl.list = [];
					thisCtrl.selected = true;
				} else {
					//$scope.checkedCount--;
                    thisCtrl.selected = false;
                    item.checked = false;
					var length = thisCtrl.list.length;
					for(var i = 0; i<length;i++){
						thisCtrl.list.pop();
					}
				};

		};
       this.loadMeetings = function(){

            // First set up the url for te route
            var url = "";
            // Now set up the $http object
            var reqURL = "http://localhost:5000/whitestone/meeting/oldmeetings";

            var config = { headers : 
                {'Content-Type':'application/json;charset=utf-8;' }
               }
            // It has two function call backs, one for success and one for error

            $http.get(url).then(// success call back
                function (response){
                // The is the sucess function!
                // Copy the list of parts in the data variable
                
                for (var i=0;i<thisCtrl.newOldMeetingList.length;i++){
                    thisCtrl.newOldMeetingList[i]["checked"] = false;
                }

                }, // error callback
                function (response){
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    console.log("response2: " + JSON.stringify(response));
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
        this.loadInActiveVotingQuestions = function(){

            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/inactivevotings/+meetingID";
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

        this.loadChoices = function(){

        
            
            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/voting/"+thisCtrl.vid+"/choices";
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
        this.loadResults = function(){

        
            //Ruta de results de voting questions
            var reqURL = "http://localhost:5000/whitestone/voting/"+thisCtrl.vid+"/results";

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

        this.loadMeetings();
}]);