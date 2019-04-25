angular.module('Whitestone').controller('editUserController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {
        var thisCtrl = this;
        this.newUserList = [];

       var first_name = "";
        var last_name = "";
        var about = "";
        var email = "";
        var password = "";
        var role = "";
        var title = "";
        this.selectedUser;
        this.uID = 0;
        this.cID = 0;
        this.roleSelect = { selected: '' };
        this.titleSelect = { selected: '' };

        this.showForm = false;
        this.showMessage = false;
        this.userForm;

        this.firstnameVal = false;
        this.lastnameVal = false;
        this.pinVal = false;
        this.emailVal = false;
        
        this.titles = [{ title: 'Elect Student Senator', selected: false },
        { title: 'Ex-Officio Student Senator', selected: false },
        { title: 'Elect Senator', selected: false },
        { title: 'Ex-Officio Senator', selected: false },
                       { title: 'Staff', selected: false }];

        this.roles = [{ role: 'Secretary', selected: false },
        { role: 'Senator', selected: false },
        { role: 'Chancellor', selected: false },
        { role: 'Administrator', selected: false }];

         this.loadForm = function () {
            console.log("My User: "+JSON.stringify(thisCtrl.selectedUser));
            console.log("selected User: "+thisCtrl.selectedUser);
            if(thisCtrl.selectedUser === null){
                this.roleSelect.selected = '';
                this.titleSelect.selected = '';
                this.first_name = "";
                this.last_name = "";
                this.email = "";
                this.about = "";
                thisCtrl.uID = 0;
                thisCtrl.cID = 0;
                this.showForm = false;
                this.password = "";
                
            }else{
                this.roleSelect.selected = thisCtrl.selectedUser.role;
                this.titleSelect.selected = thisCtrl.selectedUser.classification;
                this.uID = thisCtrl.selectedUser.uid;
                this.cID = thisCtrl.selectedUser.cid;
                this.first_name = thisCtrl.selectedUser.firstname;
                this.last_name = thisCtrl.selectedUser.lastname;
                this.about = thisCtrl.selectedUser.about;
                this.email = thisCtrl.selectedUser.email;
                this.password = thisCtrl.selectedUser.pin;
                thisCtrl.showForm = true;
            }
            thisCtrl.showMessage = false;
            console.log("role"+this.role);
            console.log("title"+this.roleSelect.selected);
            console.log("title"+this.titleSelect.selected);
        }
         this.cancel = function(){
                this.roleSelect.selected = '';
                this.titleSelect.selected = '';
                this.first_name = "";
                this.last_name = "";
                this.about = "";
                this.email = "";
                thisCtrl.uID = 0;
                thisCtrl.cID = 0;
                this.showForm = false;
                this.selectedUser = {};
                this.password = "";
        }

        this.checkForm = function(){
                var fnPattern = new RegExp("^[a-zA-Z]+$");
                var lnPattern = new RegExp("^[a-zA-Z]+$");
                var pinPattern = new RegExp("^[0-9]{1,4}$");
                var emailPattern = new RegExp("^[a-z]+\.[a-z]*[0-9]*@upr\.edu$");
            
                if(this.roleSelect.selected=="Secretary" && this.titleSelect.selected!="Staff"){
                    alert("Secretaries can only have the 'Staff' classification");
                }else if(this.roleSelect.selected=="Senator" && this.titleSelect.selected=="Staff"){
                    alert("Senators cannot have the 'Staff' classification");
                }else if(this.roleSelect.selected=="Chancellor" && this.titleSelect.selected!="Ex-Officio Senator"){
                         alert("Chancellors can only have the 'Ex-Officio' classification");
                }else if(this.roleSelect.selected=="Administrator" && this.titleSelect.selected!="Staff"){
                    alert("Administrators can only have the 'Staff' classification")
                }else{
                    if(!fnPattern.test(this.first_name)){
                        this.firstnameVal = true;
                    }else{
                        this.firstnameVal = false;
                    }
                    if(!lnPattern.test(this.last_name)){
                        this.lastnameVal = true;
                    }else{
                        this.lastnameVal = false;
                    }
                    if(!pinPattern.test(this.password)){
                        this.pinVal = true;
                    }else{
                        this.pinVal = false;
                    }
                    if(!emailPattern.test(this.email)){
                        this.emailVal = true;
                    }else{
                        this.emailVal = false;
                    }
                    
                    console.log("fn: "+this.firstnameVal);
                    console.log("ln: "+this.lastnameVal);
                    console.log("pin: "+this.pinVal);
                    console.log("email: "+this.email)
                    console.log("regexp email"+emailPattern.test(this.email));
                    console.log("email: "+this.emailVal);
                    if(!this.firstnameVal&&!this.lastnameVal&&!this.pinVal&&!this.emailVal){
                        //alert("Form is valid");
                        thisCtrl.editCredentials();
                    }else{
                        alert("the form is incorrect");
                    }
                    //thisCtrl.editCredentials();
                }
                
            
        }
        this.editCredentials = function () {
            
            //Dictionary that will store the data for the database
            var data = {};
            data.email = this.email;
            data.pin = this.password;
            data.cID = thisCtrl.cID;
            
            //url with the route to talk with the rest API
            console.log("data: "+JSON.stringify(data));
            var reqURL = "http://localhost:5000/whitestone/credentials";

            var config = {
                headers:
                    { 'Content-Type': 'application/json;charset=utf-8;' }
            }

            // Now issue the http request to the rest API
            $http.put(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    thisCtrl.editUser();

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
                    }else if(status == 400){
                        alert("The given email already exist");
                    }else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };
        
        this.editUser = function () {
            //Dictionary that will store the data for the database
            var data = {};
            data.ufirstname = this.first_name;
            data.ulastname = this.last_name;
            data.udescription = this.about;
            data.urole = this.roleSelect.selected;
            data.uclassification = this.titleSelect.selected;
            
            //Resetting data
            //thisCtrl.titleSelect.selected = '';
            //thisCtrl.roleSelect.selected = '';
            //thisCtrl.showForm = false;
            //thisCtrl.myUser = {};
            
            //url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/edituser/"+thisCtrl.uID;

            var config = {
                headers:
                    { 'Content-Type': 'application/json;charset=utf-8;' }
            }

            // Now issue the http request to the rest API
            $http.put(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    thisCtrl.cancel();
                    thisCtrl.loadUsers();
                    thisCtrl.recordActivity("Edit");
                    alert("The user has been edited");
                    
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
        
        this.checkDelete = function(){
            if (confirm("Are you sure you want to delete the user?")) {
                thisCtrl.deleteUser();
            }
        }
        
        this.deleteUser = function () {

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/delete/user/"+thisCtrl.uID;
            var data = {};
            data.uID = thisCtrl.uID;
            var config = {
                headers:
                    { 'Content-Type': 'application/json;charset=utf-8;' }
            }

            // Now issue the http request to the rest API
            $http.post(reqURL,data,config).then(
                // Success function
                function (response) {
                    console.log("response Delete: " + JSON.stringify(response.data))
                    thisCtrl.cancel();
                    thisCtrl.loadUsers();
                    thisCtrl.recordActivity("Delete");
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
        this.loadUsers = function () {

            // Now create the url with the route to talk with the rest API
            console.log("load users");
            var reqURL = "http://localhost:5000/whitestone/users";

            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    thisCtrl.newUserList = response.data.User;
                    console.log("new User List: "+JSON.stringify(thisCtrl.newUserList));
                    

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
        
        this.recordActivity = function(action){
            
            var d = new Date();
            
            //Dictionary that will store the data for the database
            var data = {};
            data.urole = $routeParams.role;
            data.uemail = "m.melendez@upr.edu";
            data.date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
            data.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            if(action=="Delete"){
                data.logmessage = "Deleted User";
            }else if(action=="Edit"){
                data.logmessage = "Edit User";
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
        
        this.loadUsers();

        this.createUserRedirect = function () {
            $location.url("/createUser/" + $routeParams.role + '/' + $routeParams.uid);
        }

        this.activityLogRedirect = function () {
            $location.url("/activityLog/" + $routeParams.role + '/' + $routeParams.uid);
        }

        this.settingsRedirect = function () {

        }
        this.logout= function(){
            $location.url('/login');
        };
    }]);