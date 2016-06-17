(function () {
    'use strict';
    
    angular
        .module('chatWeb')
        .controller('HomeController', HomeController)
        .factory('socket', socket);
    
    /** @ngInject */
    function socket($rootScope) {
        var socket = io.connect('http://localhost:3000');
        return {
            on: function (eventName, callback) {
                socket.on(eventName, function () {  
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (eventName, data, callback) {
                socket.emit(eventName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                })
            }
        };
    };
    
    
//    function Socketio(socketFactory) {
//        return socketFactory();
////        var myIoSocket = io.connect('http://localhost:3000');
////        return socketFactory({
////            ioSocket: myIoSocket
////        });
//    };
    
    /** @ngInject */
    function HomeController($http, $stateParams, socket) {
        var vm = this;
        
        vm.user = "";
        
        vm.getRoomMsgs = getRoomMsgs;
        vm.scrollDiv = scrollDiv;
      
        activate();
      
        function activate() {
            vm.userId = $stateParams.id;
            getUserInfo(vm.userId, function(result){
                if(result && result.data && result.data.data)
                    vm.user = result.data.data;
            });
            getChatRooms(vm.userId, function(result){
                if(result && result.data){
                    vm.rooms = result.data;
                    getRoomMsg(vm.rooms[0].id, function(result){
                        if(result && result.data)
                            vm.msgs = result.data;
                    })
                }
            })
        }
        
        function getRoomMsgs(id){
            getRoomMsg(id, function(result){
                if(result && result.data)
                    vm.msgs = result.data;
            })
        }
      
        function getUserInfo(id, callback){
            var data={
                url:'http://localhost:3000/get_userinfo',
                data_server:{
                    uid:id
                }
            };
            callAjax(data,function(userdata){        
                callback(userdata);
            });
        };
      
        function getChatRooms(id, callback){
            var data={
                url:'http://localhost:3000/get_chats_rooms',
                data_server:{
                    uid:id
                }
            };
            callAjax(data,function(userdata){
                callback(userdata);
            });
        };
      
        function getRoomMsg(roomId,callback){
            var data={
                url:'http://localhost:3000/get_room_msgs',
                data_server:{
                    room_id: roomId
                }
            }
            callAjax(data,function(userdata){        
                callback(userdata);
            });
        };
      
        function scrollDiv(){
            var scrollDiv = angular.element( document.querySelector( '.msg-container' ) );
            $(scrollDiv).animate({scrollTop: scrollDiv[0].scrollHeight}, 900);
        };
      
        function callAjax(data, callbackFn){
            $http.post(data.url, data.data_server).then(
                function(response){
                    callbackFn(response);
                },
                function(response){
                    callbackFn(response);
                }
            );
        }
        
        socket.on('getRoomMsg',function(data){
            if(data != ""){
                getRoomMsgs(data);   
            }
        });
        
        socket.on('exit',function(data){
            getUserInfo(vm.userId, function(userinfo){
                socket.emit('userInfo',userinfo.data); // sending user info to the server  
            });
        });
    }
})();
