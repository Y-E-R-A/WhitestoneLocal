angular.module('Whitestone').controller('submitVoteChanController', ['$http', '$log', '$scope', '$location', '$routeParams',
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



        var selection = [];
        

        this.loadChoices = function(){

        
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
                    alert(" ");

                    for (var i=0;i<thisCtrl.newChoiceList.length;i++){
                        thisCtrl.newChoiceList[i]["checked"] = false;
                    }
  
                    
                    
                    //for(var i=0;i<$scope.votingAlternatives.length;i++){
                    //  thisCtrl.createAlternatives($scope.votingAlternatives[i].valt);
                    //}
                    
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
        this.submitVote = function(){

            data = [];

            data.alt = "";
            
            var reqURL = "";
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
                    alert(" ");
                    

                    
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
}]);