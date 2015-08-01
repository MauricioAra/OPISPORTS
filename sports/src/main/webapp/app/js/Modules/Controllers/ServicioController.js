/**=========================================================
 * Module: Servicio
 =========================================================*/


var gridServicio = {};

App.controller('ServicioController', ['$scope', 'uiGridConstants', '$http', function($scope, uiGridConstants, $http) {

    var data = [];

    gridServicio = $scope.gridServicio = {
        columnDefs: [
            { field: 'idServicio',visible:false},
            {field:'horaInicial.millis', visible:false},
            {field: 'horaFinal.millis', visible:false},
            { field: 'servicio', name:"Servicio"},
            { field: 'precio' , name:'Precio'},
            { field: 'horaApertura' , name:'Hora de apertura'},
            { field: 'horaCierre' , name:'Hora de cierre'},
            { field: 'arbitro' , name:'Arbitro'},
            {name: 'acciones', cellTemplate:'<div ng-controller="ServicioModalController" >' +
            '<button ng-click="modificar(row)" class="btn btn-primary" >' +
            '<span class="fa fa-rocket"></span>' +
            '</button>'+
            '</div>'}
        ],
        data: establecimientoCalendario.servicios
    }
}]);

/**=========================================================
 * Module: modals.js Servicio
 * Implementa el modal de registro y modificacion
 =========================================================*/
var servicioModificar = {};
App.controller('ServicioModalController', ['$scope', '$modal', "$timeout" ,"$http", function ($scope, $modal, $timeout ,$http) {

    $scope.registrar = function () {

        var RegistrarModalInstance = $modal.open({
            templateUrl: '/myServicioModalContent.html',
            controller: RegistrarServicioInstanceCtrl,
            size: 'lg'
        });


    };

    $scope.modificar = function ($row) {
        servicioModificar = $row.entity;
        var ModificarModalInstance = $modal.open({
            templateUrl: '/myServicioModalContent.html',
            controller: ModificarServicioInstanceCtrl,
            size: 'lg'
        });
    };
//------------------------------------------------------------------------------------
    var RegistrarServicioInstanceCtrl = function ($scope, $modalInstance) {
        $scope.accion = "Registrar";
        $scope.servicioForm = {};
        $scope.servicioForm.horaApertura = new Date();
        $scope.servicioForm.horaCierre = new Date();
        $scope.servicioForm.registrar = function () {
        	
            var data = {
            	"servicio": $scope.servicioForm.servicio,
                "precio": $scope.servicioForm.precio,
                "horaApertura": new Date(),
                "horaCierre": $scope.servicioForm.horaCierre,
                "arbitro": $scope.servicioForm.arbitro,
                "establecimiento" : establecimientoCalendario.idEstablecimientoDeportivo,
                "tipoServicio" : 1,
                "accion" : $scope.accion
            };
            $http.post('rest/servicio/save', data).
            success(function(data){
            	var toasterdata = {
			            type:  'success',
			            title: 'Servicio',
			            text:  'Se registro el servicio correctamente.'
			    };
    			$scope.pop(toasterdata);
            	gridServicio.data.push = data.servicio;
            	
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    RegistrarServicioInstanceCtrl.$inject = ["$scope", "$modalInstance", "$http"];
    var ModificarServicioInstanceCtrl = function ($scope, $modalInstance) {
        $scope.accion = "Modificar";
        $scope.servicioForm = {};

        
        $scope.servicioForm.idServicio = servicioModificar.idServicio;
        $scope.servicioForm.servicio = servicioModificar.servicio;
        $scope.servicioForm.precio = servicioModificar.precio;
        $scope.servicioForm.arbitro = servicioModificar.arbitro;
        $scope.servicioForm.tipoServicio = servicioModificar.tipoServicio;
        
        horaInicial = new Date(servicioModificar.horaInicial.millis);
        horaFinal = new Date(servicioModificar.horaFinal.millis);
        
        $scope.servicioForm.horaApertura = horaInicial;
        $scope.servicioForm.horaCierre = horaFinal;
        
        
        $scope.servicioForm.modificar = function () {
        	var data = {
        			"idServicio": servicioModificar.idServicio,
                	"servicio":$scope.servicioForm.servicio,
                    "precio": $scope.servicioForm.precio,
                    "horaApertura": $scope.servicioForm.horaApertura.getTime(),
                    "horaCierre": $scope.servicioForm.horaCierre.getTime(),
                    "arbitro": $scope.servicioForm.arbitro,
                    "establecimiento" : establecimientoCalendario.idEstablecimientoDeportivo,
                    "tipoServicio" : 1,
                    "accion" : $scope.accion
                };
                $http.post('rest/servicio/save', data).
                success(function(data){
                	var toasterdata = {
    			            type:  'success',
    			            title: 'Servicio',
    			            text:  'Se registro los cambios correctamente.'
    			    };
        			$scope.pop(toasterdata);
        			gridServicio.data[data.servicio.idServicio-1] = data.servicio;
                	
                });

            $modalInstance.close('closed');
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };
    ModificarServicioInstanceCtrl.$inject = ["$scope", "$modalInstance"];
}]);