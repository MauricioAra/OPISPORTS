/**
 * Created by JuanManuel on 09/07/2015.
 */


App.controller('EstablecimientosController', ['$scope','$http', '$stateParams', '$rootScope', 'toaster', '$timeout', '$state', function($scope,$http, $stateParams, $rootScope, toaster, $timeout, $state) {

    $scope.init = function(){  	
	    $http.get('rest/establecimientoDeportivo/getAll')
		.success(function(response) {
			$scope.Establecimientos = response.establecimientosDeportivos;
			
		});
    };
    $scope.init(); 
    
    $scope.buscarServicios = function(establecimiento){
    	cambiarServicios(establecimiento);
    };
    
    function cambiarServicios(establecimiento) {
        $scope.serviciosEstablecimiento = establecimiento.servicios;
    }
    
    $scope.obtenerServicio = function(servicio){
    	$rootScope.$broadcast('enviarServicio',{
    		  idServicio: servicio.idServicio    		 
		});
    }
    
    $scope.eliminar = function(id){
            $http.post('rest/establecimientoDeportivo/delete', id).
            success(function(){
            	var toasterdata = {
			            type:  'success',
			            title: 'Establecimiento',
			            text:  'Se eliminó el establecimiento.'
			    };                
            	$scope.pop(toasterdata);
            	$timeout(function(){ $scope.callAtTimeout(); }, 2000);
            });
    }
    
    //notificacion
    
    $scope.pop = function(toasterdata) {
        toaster.pop(toasterdata.type, toasterdata.title, toasterdata.text);
    };
    
    $scope.callAtTimeout = function(){
    	$state.reload();
    }
	
}]);   

var tipoServicios = [];


App.controller('InformacionPerfilController', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams,$state) {
       
	$scope.init = function(){
		
		$http.get('rest/tipoServicio/getAll')
	    .success(function(data) {
	    	tipoServicios = data.tipoServicio;
	    });
		
		$http.get('rest/establecimientoDeportivo/getAll')
		.success(function(response) {
			var establecimientos = response.establecimientosDeportivos;
			for (var i = 0; i < establecimientos.length; i++) {
                if (establecimientos[i].idEstablecimientoDeportivo == $stateParams.mid){
                    $scope.establecimiento = establecimientos[i];
                    establecimientoCalendario = establecimientos[i];
                }
            }
		});
    };
    
    
    $scope.init();
    $state.go("app.perfil.informacion");
    
    
    $scope.mostrarReservaciones = function() {

    	$state.go("app.perfil.reservaciones");
	}

    $scope.mostrarInformacion = function(){
		$state.go("app.perfil.informacion");
	}
			
	$scope.mostrarServicios = function(){
		$state.go("app.perfil.servicios");
	}

    $scope.init();
    

}]);

App.controller('EstablecimientosFormController', ['$scope','$http', '$stateParams','$state','toaster','$timeout','$route', function($scope,$http, $stateParams,$state,toaster,$timeout,$route) {
	'use strict'; 
	//validación
    $scope.submitted = false;
    $scope.validateInput = function(name, type) {
        var input = $scope.formEstablecimiento[name];
        return (input.$dirty || $scope.submitted) && input.$error[type];
    };
    // Submit form
    $scope.submitForm = function() {
        $scope.submitted = true;
        if ($scope.formEstablecimiento.$valid) {        	
        	$http.post('rest/establecimientoDeportivo/save', {
        		direccion : $scope.establecimiento.direccion,
        		nombre : $scope.establecimiento.nombre,
        		paginaWeb : $scope.establecimiento.paginaWeb,
        		telefono : $scope.establecimiento.telefono,
        		idUsuario : 1
    		 	})
    		.success(function(data){
    			var toasterdata = {
    			            type:  'success',
    			            title: 'Establecimiento',
    			            text:  data.codeMessage
    			        	};
    			$scope.pop(toasterdata);
    			$timeout(function(){ $scope.callAtTimeout(); }, 2000);
    			
    		});        	
        	
        } else {
        	var toasterdata = {
		            type:  'error',
		            title: 'Establecimiento',
		            text:  data.errorMessage
		        	};
        	$scope.pop(toasterdata);
            return false;
        }
    };
    //notificacion
   
    
    $scope.pop = function(toasterdata) {
        toaster.pop(toasterdata.type, toasterdata.title, toasterdata.text);
    };
    
    $scope.callAtTimeout = function(){
    	$state.go("app.index");
    }

}]);

