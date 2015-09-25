// (function () {
//   angular.module('mainApp.directives')
//     .directive('adminPopup', ['Restangular','ipCookie', 'Notification', '$translate', function(Restangular, ipCookie, Notification, $translate) {
//       return {
//         restrict: 'E',
//         templateUrl: 'main/admin-popup.html',
//         scope: {
//           displayAdminPopup: '=',
//           showGreyPanel: '=',
//         },
//         link: function(scope) {

//         var error,
//           email_tipo,
//           psw_tipo;

//         $translate(['ERROR', 'EMAIL_ERROR_SIGNIN', 'NE_PSW']).then(function (translations) {
//           error = translations.ERROR;
//           psw_tipo = translations.NE_SIZE;
//           email_tipo = translations.EMAIL_ERROR_SIGNIN;
//         });

//           scope.displayAdminPopup = function(){
//             scope.showAdmin = true;
//             scope.showGreyPanel = true;
//           }
//           scope.hideAdminPopup = function(){
//             scope.showGreyPanel =  false;
//             scope.showAdmin = false;
//           }
//           scope.validateAdmin = function(){
//             var connection = {email: scope.emailInput, password:scope.passwordInput}
//             Restangular.all('users/login').post(connection).then(function(d) {
//               ipCookie('unisphere_api_admin', d.cookie);
//               scope.admin = true;
//               scope.hideAdminPopup();
//             }, function(d){
//               scope.passwordInput = "";

//               console.log("Impossible to connect");
//               console.log(d);
//               if(d.headers.status == 404){
//                 console.log("Error: login | email")
//                 Notification.error(email_tipo)
//               } else if(d.headers.status == 403){
//                 console.log("Error: login | password")
//                 Notification.error(psw_tipo);
//               } else{
//                 console.log("Error: login")
//                 Notification.error(error);
//               }

//               scope.newUniPassword = "";
//             });
//           }
//         }
//       }

//   }]);
// }());
