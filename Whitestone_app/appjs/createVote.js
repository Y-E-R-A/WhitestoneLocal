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
            
        //Check box selection
        var titles = [{title:'Elect Student Senator', selected:false},
        {title:'Ex-Oficio Student',selected:false},
        {title:'Elect',selected:false},
        {title:'Ex-Oficio',selected:false}];

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


            var data = {};
        
                     
            data.voting_question = this.voting_question;
            
            data.voting_objective = this.voting_objective;
            
            data.vdate = this.vMM+"/"+vDD+"/"+vYYYY;
            
            data.vTime = this.vHour+"/"+this.vMin;
            
            data.vlimit = this.vLimit;
        
            

            // Now create the url with the route to talk with the rest API
            //var reqURL = "";
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
                    alert("New vote added with id: ");
 
                    
                    
                    for(var i=0;i<$scope.votingAlternatives.length;i++){
                      thisCtrl.createAlternatives($scope.votingAlternatives[i].valt);
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
                        alert("No se encontro la informacion solicitada.");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.selectParticipant = function(){
            // Get the target part id from the parameter in the url
     
            var data = {};
            
            data.alt = alternative;
            //console.log("data: " + JSON.stringify(data));
            
            // Now create the url with the route to talk with the rest API
            //var reqURL = "";
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
                    //alert("");
        
                    
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
        this.createAlternatives = function(alternative){

            var data = {};
            
            data.alt = alternative;
     
            
            // Now create the url with the route to talk with the rest API
            //var reqURL = "";
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
                    //alert("");
        
                    
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