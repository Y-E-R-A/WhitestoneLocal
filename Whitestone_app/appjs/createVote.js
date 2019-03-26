angular.module('Whitestone').controller('votingController', ['$http', '$log', '$scope', '$location', '$routeParams',
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
            
        //
        var vid = 0;
        //Check box selection
        var titles = [{title:'Elect Student Senator', selected:false},
        {title:'Ex-Officio Student',selected:false},
        {title:'Elect',selected:false},
        {title:'Ex-Officio',selected:false}];

        var selection = [];
        
        //Alternative Handler////////////////////////////////
        var votingAlternatives = [{altId:"alt1", valt:''}]
        
        this.addToSelection = function(title){
          if(selection.includes(title)){
            this.selection.splice( this.selection.indexOf(title), 1 );
          }else{
            this.selection.push(title);
          }
        }
        
        this.addAlternative = function(){
          var newAlt = $scope.votingAlternatives.length+1;
          $scope.votingAlternatives.push({altId:"alt"+newAlt});
          
        }
        this.removeAlternative = function(index){
          //remove($index) en html
          $scope.votingAlternatives.splice(index,1);
        }
        //////////////////////////////////////////////////////
        
        this.createVote = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
        
                     
            data.voting_question = this.voting_question;
            
            data.voting_objective = this.voting_objective;
            
            data.vdate = this.vMM+"/"+vDD+"/"+vYYYY;
            
            data.vTime = this.vHour+"/"+this.vMin;
        
            data.vlimit = this.vLimit;
            
            data.voting_status = "Active";
            
            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
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
                    // assing the part details to the variable in the controller
                    alert("New user added with id: " +response.data.User.cid);
                    
                    //thisCtrl.id = response.data.User.cid
                    
                    //console.log("ctrl cid "+this.id )
                    
                    //thisCtrl.credentialList = response.data.User;
                    
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    //console.log("second sign in")
                    
                    this.selectParticipant();
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

        this.closeVotingQuestion = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            
            var data = {};
        
                     
            data.vid = thisCtrl.vid;
        
            data.voting_status = "Inactive";
            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            //Ruta para crear voting question y para obtener la voting question por meeting id
            var reqURL = "http://localhost:5000/whitestone/votingstatus/"+thisCtrl.vid;
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
                    alert("New user added with id: " +response.data.User.cid);
                    
                    //thisCtrl.id = response.data.User.cid
                    
                    //console.log("ctrl cid "+this.id )
                    
                    //thisCtrl.credentialList = response.data.User;
                    
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    //console.log("second sign in")
                    
                    this.selectParticipant();
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
        this.selectParticipant = function(){

            for(var i=0;i<thisCtrl.selected.length;i++){
                if(selected[i]==='Elect Student Senator'){
                    this.getAllUsersByElecStudent();
                }else if(selected[i]==='Ex-Officio Student'){
                    this.getAllUsersByExOfficioStudent();
                }else if(selected[i]==='Elect'){
                    this.getAllUsersByElect();
                }else if(selected[i]==='Ex-Officio'){
                    this.getAllUsersByExOfficio();
                }
            }
        };
        this.getAllUsersByElectStudent = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            var data = {};
            
            data.alt = alternative;
            //console.log("data: " + JSON.stringify(data));
            
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
                    //console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.uid);
        
                    
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
        this.getAllUsersByExOfficioStudent = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            var data = {};
            
            data.alt = alternative;
            //console.log("data: " + JSON.stringify(data));
            
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
                    //console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.uid);
        
                    
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
        this.getAllUsersByElect = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            var data = {};
            
            data.alt = alternative;
            //console.log("data: " + JSON.stringify(data));
            
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
                    //console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.uid);
        
                    
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
        this.getAllUsersByExOfficio = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            var data = {};
            
            data.alt = alternative;
            //console.log("data: " + JSON.stringify(data));
            
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
                    //console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.uid);
        
                    
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

        this.createVoteIn = function(){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;

            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            //Ruta para crear voting question y para obtener la voting question por meeting id
            var reqURL = "http://localhost:5000/whitestone/votesIn/"+thisCtrl.vid;
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
                    alert("New user added with id: " +response.data.User.cid);
                    
                    //thisCtrl.id = response.data.User.cid
                    
                    //console.log("ctrl cid "+this.id )
                    
                    //thisCtrl.credentialList = response.data.User;
                    
                    //console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    //console.log("second sign in")
                    
                    this.selectParticipant();
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

        this.loadActiveVotingQuestions = function(){

        
            //Ruta de results de voting questions
            //var reqURL = "http://localhost:5000/whitestone/voting/"+thisCtrl.vid+"/results";

            //data.udescription = this.description;
            
            //console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/activevotings/+meetingID";
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
            var reqURL = "http://localhost:5000/whitestone/voting/+vid+/choices";
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

        this.createAlternatives = function(alternative){
            // Get the target part id from the parameter in the url
            // using the $routerParams object
            //var userId = $routeParams.uid;
            var data = {};
            
            data.alt = alternative;
            data.vid = vid;
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
                    //console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.uid);
        
                    
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
            
}]);