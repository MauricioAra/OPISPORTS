/**=========================================================
 * Module: reto
 =========================================================*/

var gridReto = {};

App.controller('RetoController', ['$scope','uiGridConstants', '$http', function($scope, uiGridConstants, $http) {

	var data = [];
	gridReto = $scope.gridReto = {
			columnDefs: [
			{ field: 'idReto', visible:false,width : 135},
			{ field: 'fechaGrid', name:"Fecha", width : 135},
			{ field: 'fecha', visible:false},
			{ field: 'horaGrid' , name:'Hora', width : 135},
			{ field: 'hora' , visible:false, width : 135},
			{ field: 'mensaje' , name:'Mensaje', width : 135},
			{ field: 'nombreUsuario' , name:'Retador', width : 135},
			{ field: 'telefonoUsuario' , name:'Telefono', width : 135},
			{ field: 'idServicio', visible:false, width : 135},
			{ field: 'nombreServicio' , name:'Servicio', width : 135},
			{ field: 'idEstablecimiento', visible:false, width : 135},
			{ field: 'nombreEstablecimiento' , name:'Establecimiento', width : 135},
			{name: 'acciones', cellTemplate:
				
			'<div class="btn-group btn-group-justified" role="group" ng-controller="RetoModalController" >' +
			
				'<div class="btn-group" role="group" >'+
					'<button ng-click="modificar(row)" class="btn btn-success" >' +
						'<span class="fa fa-pencil"></span>' +
						'</button>'+
				'</div>'+
				'<div class="btn-group" role="group" >'+
					'<button ng-click="eliminar(row)" class="btn btn-danger" >' +
						'<span class="fa fa-trash"></span>' +
					'</button>'+
				'</div>'+
			
			'</div>'	
			, width : 100}
			],data: data,
				onRegisterApi: function (gridApi) {
					$scope.gridApi = gridApi;
			    }
			};
			var ARetos  = [];
			$http.get('rest/reto/getAll')
				.success(function(data) {
					data.retospojo.forEach( function(reto, index) {
						var retosView = {};
						retosView.idReto = reto.idReto;
						retosView.fechaGrid = reto.fecha.dayOfMonth + '/' + reto.fecha.monthOfYear + '/' + reto.fecha.year;
						retosView.fecha = reto.fecha;
						retosView.horaGrid = getHora(reto.hora.millis);
						retosView.hora = reto.hora;
						retosView.mensaje = reto.mensaje;
						retosView.nombreUsuario = reto.nombreUsuario;
						retosView.telefonoUsuario = reto.telefonoUsuario;
						retosView.idServicio = reto.idServicio;
						retosView.nombreServicio = reto.nombreServicio;
						retosView.idEstablecimiento = reto.idEstablecimiento;
						retosView.nombreEstablecimiento = reto.nombreEstablecimiento;
						retosView.active = reto.active;
						
						if(retosView.active == 0){	
						}else{
							ARetos.push(retosView);
						}
						
			        });
			            $scope.gridReto.data = ARetos;       
			});
			
			function getMonth(mes){ 
				if(mes<=10){
					return mes;
				}else{
					return '0' + mes;
				}
			}		
			function getHora(mil){
				var horaMil = new Date(mil);
				var hora;
					if(horaMil.getHours()>= 10){
						hora = horaMil.getHours() + ':';
					}else{
						hora= '0'+horaMil.getHours() + ':';
					}
					if(horaMil.getMinutes() >= 10){
						hora += horaMil.getMinutes();
					}else{
						hora += '0'+ horaMil.getMinutes();
					}
					return hora;
			}
			
			$scope.$on('actualizarGrid', function (event, responsedata) {
				 $scope.gridReto.data = responsedata.newGrid;    
			});
	
}]);
var retoModificar = {};
var retoEliminar = {};
App.controller('RetoModalController', ['$scope', '$modal','$http','$rootScope','toaster',function ($scope, $modal,$http,$rootScope,toaster) {


//----------------------------------------------------------------------------
	
    $scope.registrar = function () {
        var RegistrarModalInstance = $modal.open({
            templateUrl: '/myRetoModalContent.html',
            controller: RegistrarRetoInstanceCtrl,
            size: 'lg'
        });


    };
    
    $scope.modificar = function ($row) {
    	retoModificar = $row.entity;
        var ModificarModalInstance = $modal.open({
            templateUrl: '/myRetoModalContent.html',
            controller: ModificarRetoInstanceCtrl,
            size: 'lg'
        });
    };

    $scope.eliminar = function ($row) {
    	retoEliminar = $row.entity;
		horaRow = new Date(retoEliminar.hora.millis);
		fechaRow = new Date(retoEliminar.fecha.millis);
		$http.post('rest/reto/delete', {
			idReto : retoEliminar.idReto,
			estado : "En espera",
			mensaje : retoEliminar.mensaje,
			fecha : fechaRow,
			hora : horaRow.getTime(),
			active : 0,
			servicio : retoEliminar.idServicio,
			usuario : $rootScope.usuario.idUsuario
			
			}).success(function(data) {
				   var ARetos = [];
					data.retospojo.forEach( function(reto, index) {
						var retosView = {};
						retosView.idReto = reto.idReto;
						retosView.fechaGrid = reto.fecha.dayOfMonth + '/' + reto.fecha.monthOfYear + '/' + reto.fecha.year;
						retosView.fecha = reto.fecha;
						retosView.horaGrid = getHora(reto.hora.millis);
						retosView.hora = reto.hora;
						retosView.mensaje = reto.mensaje;
						retosView.nombreUsuario = reto.nombreUsuario;
						retosView.telefonoUsuario = reto.telefonoUsuario;
						retosView.idServicio = reto.idServicio;
						retosView.nombreServicio = reto.nombreServicio;
						retosView.idEstablecimiento = reto.idEstablecimiento;
						retosView.nombreEstablecimiento = reto.nombreEstablecimiento;
						retosView.active = reto.active;
						
						if(retosView.active == 0){	
						}else{
							ARetos.push(retosView);
						}	
			     }); 
					
				   var responsedata = {
				              type:  'success',
				              title: 'Reto',
				              text:  data.codeMessage,
				              newGrid: ARetos
				           };
				   
				   toaster.pop(responsedata.type, responsedata.title, responsedata.text);
				   $rootScope.$broadcast('actualizarGrid',responsedata);
				
				});
			};	
			function getMonth(mes){ 
				if(mes<=10){
					return mes;
				}else{
					return '0' + mes;
				}
			}	
			function getHora(mil){
				var horaMil = new Date(mil);
				var hora;
					if(horaMil.getHours()>= 10){
						hora = horaMil.getHours() + ':';
					}else{
						hora= '0'+horaMil.getHours() + ':';
					}
					if(horaMil.getMinutes() >= 10){
						hora += horaMil.getMinutes();
					}else{
						hora += '0'+ horaMil.getMinutes();
					}
					return hora;
			}

    // Please note that $modalInstance represents a modal window (instance) dependency.
    // It is not the same as the $modal service used above.

    var RegistrarRetoInstanceCtrl = function ($scope, $modalInstance,$http,$rootScope) {
    	'use strict'; 
    	//validación
    	$scope.reto = {};
    	$scope.reto.hora = new Date();
    	$scope.reto.fecha = new Date();
    	var servicioActual;
    	
    	$scope.accion = 'Registrar';
        $scope.submitted = false;
        
        $scope.$on('enviarServicio', function (event, Servicio) {
        	  servicioActual = Servicio.idServicio;
        });
        
        $scope.validateInput = function(name, type) {
            var input = $scope.formReto[name];
            return (input.$dirty || $scope.submitted) && input.$error[type];
        };
        // Submit form
        $scope.submitForm = function() {
            $scope.submitted = true;  
            if ($scope.formReto.$valid) {
            	$http.post('rest/reto/save', {
            		estado:'En espera',
            		fecha: $scope.reto.fecha,
            		hora: $scope.reto.hora.getTime(),
            		mensaje: $scope.reto.mensaje,
            		active: 1,
            		servicio: servicioActual,
            		usuario: $rootScope.usuario.idUsuario
        		 	})
        		.success(function(data){
        			var ARetos = [];
   					data.retospojo.forEach( function(reto, index) {
   						var retosView = {};
   						retosView.idReto = reto.idReto;
   						retosView.fechaGrid = reto.fecha.dayOfMonth + '/' + reto.fecha.monthOfYear + '/' + reto.fecha.year;
   						retosView.fecha = reto.fecha;
   						retosView.horaGrid = getHora(reto.hora.millis);
   						retosView.hora = reto.hora;
   						retosView.mensaje = reto.mensaje;
   						retosView.nombreUsuario = reto.nombreUsuario;
   						retosView.telefonoUsuario = reto.telefonoUsuario;
   						retosView.idServicio = reto.idServicio;
   						retosView.nombreServicio = reto.nombreServicio;
   						retosView.idEstablecimiento = reto.idEstablecimiento;
   						retosView.nombreEstablecimiento = reto.nombreEstablecimiento;
   						retosView.active = reto.active;
   						if(retosView.active == 0){	
   						}else{
   							ARetos.push(retosView);
   						}	
   			     });                 
   				 var responsedata = {
   				              type:  'success',
   				              title: 'Reto',
   				              text:  data.codeMessage,
   				              newGrid: ARetos
   				  }; 
   				   toaster.pop(responsedata.type, responsedata.title, responsedata.text);
   				   $rootScope.$broadcast('actualizarGrid',responsedata);	
        		   $modalInstance.close('closed');       			
        		});        	
            	
            } else {
                return false;
            }
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
            
        };
    };
    
    RegistrarRetoInstanceCtrl.$inject = ["$scope", "$modalInstance","$http","$rootScope"];
    
    var ModificarRetoInstanceCtrl = function ($scope, $modalInstance,$http,$rootScope) {
        $scope.accion = "Modificar";
        $scope.reto = {};
        $scope.formReto = {};
        var servicioActual;
        
        $scope.reto.mensaje = retoModificar.mensaje;
        horaModal = new Date(retoModificar.hora.millis);
        fechaModal = new Date(retoModificar.fecha.millis);
        $scope.reto.fecha = fechaModal;
        $scope.reto.hora = horaModal;
        
        $scope.$on('enviarServicio', function (event, Servicio) {
      	  servicioActual = Servicio.idServicio;
        });
        $scope.submitForm = function () {
                $http.post('rest/reto/update',{
                	idReto: retoModificar.idReto,
        			estado:"En espera",
                	mensaje: $scope.reto.mensaje,
                	fecha: $scope.reto.fecha,
                	hora:$scope.reto.hora.getTime(),
                    active: 1,
                    servicio : servicioActual,
                    usuario : $rootScope.usuario.idUsuario
                })
                .success(function(data){
                	var ARetos = [];
                	data.retospojo.forEach( function(reto, index) {
   						var retosView = {};
   						retosView.idReto = reto.idReto;
   						retosView.fechaGrid = reto.fecha.dayOfMonth + '/' + reto.fecha.monthOfYear + '/' + reto.fecha.year;
   						retosView.fecha = reto.fecha;
   						retosView.horaGrid = getHora(reto.hora.millis);
   						retosView.hora = reto.hora;
   						retosView.mensaje = reto.mensaje;
   						retosView.nombreUsuario = reto.nombreUsuario;
   						retosView.telefonoUsuario = reto.telefonoUsuario;
   						retosView.idServicio = reto.idServicio;
   						retosView.nombreServicio = reto.nombreServicio;
   						retosView.idEstablecimiento = reto.idEstablecimiento;
   						retosView.nombreEstablecimiento = reto.nombreEstablecimiento;
   						retosView.active = reto.active;
   						if(retosView.active == 0){	
   						}else{
   							ARetos.push(retosView);
   						}	
   			     });                 
   				 var responsedata = {
   				              type:  'success',
   				              title: 'Reto',
   				              text:  data.codeMessage,
   				              newGrid: ARetos
   				  }; 
   				   toaster.pop(responsedata.type, responsedata.title, responsedata.text);
   				   $rootScope.$broadcast('actualizarGrid',responsedata);	
        		   $modalInstance.close('closed');       			
        		});        	
         
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    ModificarRetoInstanceCtrl.$inject = ["$scope", "$modalInstance","$http","$rootScope"];

}]);