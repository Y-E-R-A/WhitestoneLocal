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

        this.titles = [{ title: 'Elect Student Senator', selected: false },
        { title: 'Ex-Officio Student Senator', selected: false },
        { title: 'Elect Senator', selected: false },
        { title: 'Ex-Officio Senator', selected: false },
                       { title: 'Staff', selected: false }];

        this.roles = [{ role: 'Secretary', selected: false },
        { role: 'Senator', selected: false },
        { role: 'Chancellor', selected: false },
        { role: 'Administrator', selected: false }];

        //$scope.rol = '';
        //$scope.selected = [];
        //$parent.rol

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
                
            }else{
                this.roleSelect.selected = thisCtrl.selectedUser.role;
                this.titleSelect.selected = thisCtrl.selectedUser.classification;
                this.uID = thisCtrl.selectedUser.uid;
                this.cID = thisCtrl.selectedUser.cid;
                this.first_name = thisCtrl.selectedUser.firstname;
                this.last_name = thisCtrl.selectedUser.lastname;
                this.about = thisCtrl.selectedUser.about;
                this.email = thisCtrl.selectedUser.email;
                this.password = thisCtrl.selectedUser.localpassword;
                thisCtrl.showForm = true;
            }
            thisCtrl.showMessage = false;
            console.log("role"+this.role);
            console.log("title"+this.roleSelect.selected);
             console.log("title"+this.titleSelect.selected);
        }

        this.editTest = function(){
            var data = {};
            console.log("edit Test");
            console.log(this.first_name);
            data.uname = this.first_name;
            data.ulastname = this.last_name;
            data.uabout = this.about;
            data.uemail = this.email;
            data.urole = this.roleSelect.selected;
            data.uclassification = this.titleSelect.selected;   
            console.log("data test: "+JSON.stringify(data));
        }
        this.editCredentials = function () {

            var data = {};

            data.email = this.email;
            data.pin = this.password;
            data.cID = thisCtrl.cID;
            // Now create the url with the route to talk with the rest API
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
                    // assing the part details to the variable in the controller
                    thisCtrl.editUser();

                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    
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
        
        this.editUser = function () {

            var data = {};

            data.ufirstname = this.first_name;
            data.ulastname = this.last_name;
            data.udescription = this.about;
            data.urole = this.roleSelect.selected;
            data.uclassification = this.titleSelect.selected;
            //Resetting data
            thisCtrl.titleSelect.selected = '';
            thisCtrl.roleSelect.selected = '';
            thisCtrl.showForm = false;
            thisCtrl.myUser = {};
            
            // Now create the url with the route to talk with the rest API
            console.log("data: "+JSON.stringify(data));
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
                    thisCtrl.loadUsers();

                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    
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
        this.deleteUser = function () {

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/users";

            var config = {
                headers:
                    { 'Content-Type': 'application/json;charset=utf-8;' }
            }

            // Now issue the http request to the rest API
            $http.delete(reqURL, config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);
                    
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    console.log("thiscredentialList: " + JSON.stringify(thisCtrl.credentialsList));
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
        this.loadUsers = function () {

            // Now create the url with the route to talk with the rest API
            console.log("load users");
            var reqURL = "http://localhost:5000/whitestone/users";

            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);
                    thisCtrl.newUserList = response.data.User;
                    console.log("new User List: "+JSON.stringify(thisCtrl.newUserList));
                    
                    //thisCtrl.newUserSList = response.data;
                    //thisCtrl.showMessage = true;
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    console.log("thiscredentialList: " + JSON.stringify(thisCtrl.credentialsList));
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
        this.loadUsers();

        this.createUserRedirect = function () {
            $location.url("/createUser/" + $routeParams.role + '/' + $routeParams.uid);
        }

        this.activityLogRedirect = function () {
            $location.url("/activityLog/" + $routeParams.role + '/' + $routeParams.uid);
        }

        this.settingsRedirect = function () {

        }
    }]);