angular.module('Whitestone').controller('editUserController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {

        this.newUserSList = [];

        var first_name = "";
        var last_name = "";
        var about = "";
        var email = "";
        var password = "";
        var role = "";
        var title = "";
        this.myUser = {};

        // $scope.users = [{
        //     "id": 1,
        //     "fist_name": "Javi",
        //     "last_name": "Star",
        //     "local_password": "1234",
        //     "email": "jav.str@upr.edu",
        //     "role": "Senator",
        //     "classification": "Elect"
        // }, {
        //     "id": 2,
        //     "fist_name": "Juan",
        //     "last_name": "Cesar",
        //     "email": "juan.c@gmail.com",
        //     "local_password": "5678",
        //     "role": "Senator",
        //     "classification": "Ex-Officio"
        // }, {
        //     "id": 3,
        //     "fist_name": "Javi",
        //     "last_name": "Ramos",
        //     "email": "j.ramos@gmail.com",
        //     "local_password": "4680",
        //     "role": "Secretary",
        //     "classification": "Staff"
        // }];

        this.roleSelect = { selected: '' };
        this.titleSelect = { selected: '' };

        this.showForm = false;
        this.showMessage = false;

         this.titles = [{ title: 'Elect Student Senator', selected: false },
         { title: 'Ex-Officio Student', selected: false },
         { title: 'Elect', selected: false },
         { title: 'Ex-Officio', selected: false }];

         this.roles = [{ role: 'Secretary', selected: false },
         { role: 'Senator', selected: false },
         { role: 'Chancellor', selected: false },
         { role: 'Administrator', selected: false }];

        $scope.rol = '';
        $scope.selected = [];
        //$parent.rol

        this.loadForm = function (data) {
            thisCtrl.roleSelect.selected = data.role;
            thisCtrl.titleSelect.selected = data.classification;
            thisCtrl.showMessage = false;
            thisCtrl.showForm = true;
        }
        
        this.loadUsers = function () {

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Whitestone/credentials/user";

            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);

                    thisCtrl.newUserSList = response.data;
                    thisCtrl.showMessage = true;
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
        this.editUser = function () {

            var data = [];

            data.first_name = this.first_name;
            data.last_name = this.last_name;
            data.about = this.about;
            data.email = this.email;
            data.role = this.roleSelect.selected;
            data.title = this.titleSelect.selected;

            //Resetting data
            thisCtrl.titleSelect.selected = '';
            thisCtrl.roleSelect.selected= '';
            thisCtrl.showForm = false;
            thisCtrl.myUser = {};

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/users";

            // Now issue the http request to the rest API
            $http.put(reqURL).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    //alert("New user added with id: " +response.data.User.cid);

                    thisCtrl.newUserSList = response.data;

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
        this.deleteUser = function(){

            //data.udescription = this.description;
            
            console.log("data: " + JSON.stringify(data));
            //console.log("first name: "+this.first_name);
            //console.log("last name: "+this.last_name);
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/whitestone/users";

            var config = { headers : 
                          {'Content-Type':'application/json;charset=utf-8;' }
                         }
        
            // Now issue the http request to the rest API
            $http.delete(reqURL,config).then(
                // Success function
                function (response) {
                    console.log("response: " + JSON.stringify(response.data))
                    // assing the part details to the variable in the controller
                    alert("New user added with id: " +response.data.User.cid);
                    
                    thisCtrl.id = response.data.User.cid
                    
                    console.log("ctrl cid "+this.id )
                    
                    thisCtrl.credentialList = response.data.User;
                    
                    console.log("thiscredentialList: " +JSON.stringify(thisCtrl.credentialList))
                    
                    console.log("second sign in")
                    
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
        this.loadUsers();
    }]);