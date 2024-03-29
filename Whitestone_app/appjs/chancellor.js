angular.module('Whitestone').controller('chancellorController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object
        var thisCtrl = this;
        
        //Meeting information and status
        this.activeMeeting = false;
        this.meetingId = 0;
        
        //The request list of Senators
        this.requestList = [];
        
        //Return Id value of interval function.
        //This is utilized to cancel the interval once the Senator has spoken
        this.intervalId;

        //
        this.recordingAudio = false;
        
        //button ids. This is for enabling and disabling buttons
        this.startId = document.getElementById("start");
        this.stopId = document.getElementById("stop");
        
        //Variables for the mediastream and mediarecorder 
        this.media;
        this.stream;
        this.recorder;
        this.chunks;
        
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
        };
        
        //This function stops recording
        this.stopRecording = function(){
            console.log("Stop")
            this.stopId.disabled = true;
            this.startId.removeAttribute('disabled');
            thisCtrl.recorder.stop();
            
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
        
        //Testing time events
        this.cancelInterval = function(){
            console.log("cancel Interval");
            clearInterval(this.intervalId);
        };
        this.showTime = function(){
            var d = new Date();
            console.log("Show Time");
            this.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            console.log(thisCtrl.time);
            document.getElementById("time").innerHTML = this.time;
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
                    
                    console.log("response "+JSON.stringify(response.data));
                    thisCtrl.meeting = response.data.Meeting[0];
                    //Updating the status of the meeting
                    thisCtrl.activeMeeting = true;
                    thisCtrl.meetingId = response.data.Meeting[0].mID;
                    thisCtrl.timedInterval(8000);
                    //thisCtrl.getRequestList();


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
        //Function to set Interval for get list of waiting Senators
        this.timedInterval = function(timeoutPeriod){
            //this.intervalId = setInterval("",timeoutPeriod);
             //console.log("Time Start")
            //this.intervalId = setInterval(function(){thisCtrl.showTime()},2000); 
             //console.log("interval id: "+this.intervalId);
             
             thisCtrl.intervalId = setInterval(function(){thisCtrl.getRequestList()},timeoutPeriod);
             console.log("interval id: "+thisCtrl.intervalId);
             //this.intervalId = setInterval(function(){thisCtrl.showTime()},2000);
        };
        
        this.getRequestList = function(){
            

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/getrequestlist";

            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response get reqlist: " + JSON.stringify(response.data))
                    thisCtrl.requestList = response.data.Turn;
                    
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
                        console.log("There are no request in the moment")
                        thisCtrl.requestList = [];
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.grantTurn = function(uid){
            
            var data ={};
            data.uid = uid;
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/grantrequest";
            
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }

            // Now issue the http request to the rest API
            $http.put(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response grant request: " + JSON.stringify(response.data))
                    
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
                        console.log("Could not grant request")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.denyTurn = function(uid){
            
            // Now create the url with the route to talk with the rest API
            var data = {};
            data.uid = uid;
            var reqURL = "http://localhost:5000/whitestone/denyrequest";
            
            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }

            // Now issue the http request to the rest API
            $http.put(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response get deny: " + JSON.stringify(response.data))
                    thisCtrl.requestList = response.data.Turn;
                    
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
                        console.log("Cpuld not find request")
                    }
                    else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.loadActiveMeeting();
        this.disable = true;
        this.disablebut = function(){
            if(this.disable){
                this.disable = false;
            }else{
                this.disable = true;
            }
        };
        this.voteRedirect = function(){
            //thisCtrl.cancelInterval();
            $location.url('/votingChancellor/'+$routeParams.role+'/'+$routeParams.uid);
        }

        this.logout= function(){
            thisCtrl.cancelInterval();
            $location.url('/login');
        };
}]);