angular.module('Whitestone').controller('senatorController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object
        var thisCtrl = this;
        
        //Meeting information and status
        this.activeMeeting = false;
        this.meetingId = 0;
        
        //Request status
        this.requestedTurn = false;
        
        //Boolean to determine if a Senator can speak
        this.turnApproved = false;
        
        //Return Id value of interval function.
        //This is utilized to cancel the interval once the Senator has spoken
        this.intervalId;
        this.clearedInterval = true;
        this.time = "00:00:00";
        
        //button ids. This is for enabling and disabling buttons
        this.startId = document.getElementById("start");
        this.stopId = document.getElementById("stop");
        
        //Variables for the mediastream and mediarecorder 
        this.media;
        this.stream;
        this.recorder;
        this.chunks;
        
        this.isRecording = false;
        //This function accesses the user microphone
        this.allowMicrophone = function(){
            //constraints
            var d = new Date();
            console.log(d)
            var mediaOptions = {
                audio: {
                    tag: 'audio',
                    type: 'audio/mpeg',
                    ext: '.mp3',
                    gUM: {audio: true}
                }
            };
            thisCtrl.media = mediaOptions.audio;
            //Storing the MediaStream object to access the user's microphone
            navigator.mediaDevices.getUserMedia(thisCtrl.media.gUM).then(
                //Success. There is a connected microphone.
                //
                function(mediaStream){
                    //thisCtrl.enableStart = false;
                    thisCtrl.startId.removeAttribute('disabled');
                    console.log("Stream")
                    thisCtrl.stream = mediaStream;
                    console.log("Streamer"+thisCtrl.stream)
                    thisCtrl.recorder = new MediaRecorder(thisCtrl.stream);
                    console.log("recorder in allow"+thisCtrl.recorder);
                    
                    //This function listens to an event.
                    //The event is triggered when the user stops recording
                    thisCtrl.recorder.ondataavailable = function(e){
                        thisCtrl.chunks.push(e.data);
                        if(thisCtrl.recorder.state == 'inactive'){
                            thisCtrl.sendFile();
                        }
                        
                    };
                    thisCtrl.startRecording();
                    console.log("Got Media Succesfully");
                }
                //
            );    
        };
        //This function starts recording
        this.startRecording = function(){
            console.log("Start")
            this.startId.disabled = true;
            this.stopId.removeAttribute('disabled');
            thisCtrl.chunks = [];
            thisCtrl.recorder.start();
            thisCtrl.isRecording = true;
        };
        
        //This function stops recording
        this.stopRecording = function(){
            console.log("Stop")
            this.stopId.disabled = true;
            this.startId.removeAttribute('disabled');
            thisCtrl.recorder.stop();
            thisCtrl.isRecording = false;
            //console.log("reqTurn"+thisCtrl.requestedTurn)
            //if(thisCtrl.requestedTurn){
            //    thisCtrl.cancelTurn();
            //}
            
        };
        
        //This functions sends the audio file to server
        this.sendFile = function(){
            var blob = new Blob(thisCtrl.chunks, {type: thisCtrl.media.type});
            console.log(blob);
            
            var d = new Date();
            var date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
            var time = d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds();
            var DT = date+"-"+time;
            console.log(DT)
            var httpRequest = new XMLHttpRequest();
            httpRequest.open("POST", "http://localhost:5000/audio");
            var FileForm = new FormData();
            
            FileForm.append('file', blob, DT);
            httpRequest.onload =function(ev){
                console.log("Request opened.");
            }
            httpRequest.setRequestHeader("Enctype", "multipart/form-data");
            httpRequest.send(FileForm);
            console.log("response: "+JSON.stringify(httpRequest.response))
        };
        
        this.requestTurn = function(){
            

            // Now create the url with the route to talk with the rest API
            var data = {};
            //Test Values///
            data.uid = parseInt($routeParams.uid);
            data.fname ="Harry";
            data.lname = "Lopez";
            data.requestedTurn = true;
            data.turnApproved = false;
            data.requestDenied = false;
            ////////////////
            var reqURL = "http://localhost:5000/whitestone/requestTurn";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response request turn: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.requestedTurn = true;
                    thisCtrl.timedInterval(10000);
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
                        alert("Could not add user to turn list");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        //Function to setInterval for Senator request
         this.timedInterval = function(timeoutPeriod){
            //this.intervalId = setInterval("",timeoutPeriod);
             //console.log("Time Start")
            //this.intervalId = setInterval(function(){thisCtrl.showTime()},2000); 
             //console.log("interval id: "+this.intervalId);
             
             thisCtrl.intervalId = setInterval(function(){thisCtrl.checkApproval()},timeoutPeriod);
             console.log("interval id: "+thisCtrl.intervalId);
             thisCtrl.clearedInterval = false;
             //this.intervalId = setInterval(function(){thisCtrl.showTime()},2000);
        };
        
        //Testing time events
        this.cancelInterval = function(){
            console.log("cancel Interval");
            clearInterval(this.intervalId);
            thisCtrl.clearedInterval = true;
        };
        this.showTime = function(){
            var d = new Date();
            console.log("Show Time");
            this.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(thisCtrl.time);
            document.getElementById("time").innerHTML = this.time;
        };
        this.cancelTurn = function(){
            
            console.log("Cancel")
            // Now create the url with the route to talk with the rest API
            var data = {};
            data.uid = parseInt($routeParams.uid);
            var reqURL = "http://localhost:5000/whitestone/cancelTurn";
            //console.log("reqURL: " + reqURL);
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response cancel turn: " + JSON.stringify(response.data))
                    
                    //Stop polling for approval.
                    //clearInterval(thisCtrl.intervalId);
                    thisCtrl.cancelInterval();
                    
                    //Resetting data
                    thisCtrl.requestedTurn = false;
                    thisCtrl.turnApproved = false;
                    thisCtrl.requestApproved = false;
                    if(thisCtrl.isRecording){
                       thisCtrl.stopRecording();
                       }
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
                        alert("Could not cancel turn");
                    }else if(status == 400){
                        console.log("Could not remove request")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.requestApproved = false;
        this.checkApproval = function(){
            

            // Now create the url with the route to talk with the rest API
            var data = {};
            data.uid = parseInt($routeParams.uid);
            var reqURL = "http://localhost:5000/whitestone/checkapproval";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response check approval: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    if(!thisCtrl.requestApproved){
                        thisCtrl.allowMicrophone();
                        console.log("Allowed")
                        console.log(thisCtrl.requestApproved)
                        thisCtrl.requestApproved = true;
                    }
                    console.log("Hey there")
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
                    else if(status == 400){
                        console.log("Request Denied")
                        thisCtrl.cancelTurn();
                        //if(thisCtrl.isRecording){
                        //    thisCtrl.stopRecording();
                        //}
                    }
                    else if (status == 404) {
                        //alert("There is no active meeting");
                        console.log("Approval not found")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.loadActiveMeeting = function(){
            
            //Disabling the buttons to avoid errors
            this.startId.disabled = true;
            this.stopId.disabled = true;
            console.log(this.startId)
            console.log(this.stopId)

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
                    
                    console.log("response "+response.data);
                    thisCtrl.meeting = response.data.Meeting[0];
                    //Updating the status of the meeting
                    thisCtrl.activeMeeting = true;
                    thisCtrl.meetingId = response.data.Meeting[0].mID;
                    //Checking if the Senator has made a previous request
                    console.log(typeof($routeParams.uid));
                    thisCtrl.checkRequest();

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
                        alert("There is no active meeting");
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.checkRequest = function(){

            var reqURL = "http://localhost:5000/whitestone/checkrequest/"+$routeParams.uid;
        
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response check request: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                     //Resetting data
                    thisCtrl.requestedTurn = true;
                    thisCtrl.turnApproved = false;
                    thisCtrl.timedInterval(10000);
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
                        //alert("There is no active meeting");
                        console.log("The request does not exist")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        this.loadActiveMeeting();
        
        this.voteRedirect = function(){
            if(!thisCtrl.clearedInterval){
                thisCtrl.cancelInterval();
            }
            if(thisCtrl.isRecording){
                thisCtrl.cancelTurn();
                //thisCtrl.stopRecording();
                //if(thisCtrl.requestedTurn){
                    //thisCtrl.cancelTurn();
                //}
            }
            $location.url('/voting/'+$routeParams.role+'/'+$routeParams.uid);
        }

        this.logout= function(){
            if(thisCtrl.requestedTurn){
                thisCtrl.cancelTurn();
            }
            //if(thisCtrl.isRecording){
            //    thisCtrl.stopRecording();
            //}
            $location.url('/login');
        };
}]);