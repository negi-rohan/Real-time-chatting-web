(function () {
    'use strict';

    angular
        .module('chatWeb')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController($http, $state) {
    var vm = this;

    vm.slides = ["assets/images/slide1.png"];//, "assets/images/slide2.png", "assets/images/slide3.png"
    vm.loginError = false;
      vm.isNew = false;
    vm.user = {
      username:'',
      password: ''
    };
      
      vm.login = login;

    activate();

    function activate() {
    }
      
    function login(){
        $http.post('http://localhost:3000/login', vm.user).then(
            function(response){
                var data = response.data;
                if(data.is_logged){
                    vm.loginError = false;
                    $state.go("home", { id: data.id });
                }else{
                    vm.loginError = true;
                }
            },
            function(response){
                console.log(response);
            }
        );
    };
  }
})();
