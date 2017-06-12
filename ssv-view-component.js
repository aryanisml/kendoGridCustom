(function () {

	'use strict';
	angular.module("KendoDemos", ["kendo.directives", "angularMoment","uiSwitch"])
		.component('ssvView', {
			templateUrl: 'ssv-view-component.html',
			controller: MyCtrl

		});
	MyCtrl.$inject = ['$scope']
	function MyCtrl($scope) {
		console.log(angular.element("#myTemplate3").html());
		var vm = this;
		vm.$onInit = onInit;
		// vm.$onDestroy = onDestroy;

		function onInit() {
			vm.disabled=true;
			vm.Studies = [
				{
					StudyId: 1,
					StudyTrailId: ["1", "2", "3"],
					StudyName: 'ABC',
					SIDate: '10 May 2017',
					SIActual: 'Y',
					SSVDate: '01 Apr 2017',
					SSVActual: 'Y',
					SSU: '39',
					validDates: 'Y'
				},

				{
					StudyId: 2,
					StudyTrailId: ["1", "2"],
					StudyName: 'BEX',
					SIDate: '12 May 2017',
					SIActual: 'Y',
					SSVDate: '10 Apr 2017',
					SSVActual: 'Y',
					SSU: '32',
					validDates: 'Y'
				},
				{
					StudyId: 3,
					StudyTrailId: ["1"],
					StudyName: 'CDE',
					SIDate: '15 May 2017',
					SIActual: 'Y',
					SSVDate: '09 Apr 2017',
					SSVActual: 'Y',
					SSU: '36',
					validDates: 'Y'
				},
				{
					StudyId: 4,
					StudyTrailId: ["1", "2", "3", "4"],
					StudyName: 'DERR',
					SIDate: '18 May 2017',
					SIActual: 'Y',
					SSVDate: '12 Apr 2017',
					SSVActual: 'Y',
					SSU: '36',
					validDates: 'Y'
				},
				{
					StudyId: 5,
					StudyTrailId: ["1", "2", "3"],
					StudyName: 'ERRR',
					SIDate: '18 May 2017',
					SIActual: 'N',
					SSVDate: '15 Apr 2017',
					SSVActual: 'Y',
					SSU: '33',
					validDates: 'Y'
				},
				{
					StudyId: 6,
					StudyTrailId: ["1", "2"],
					StudyName: 'FRRR',
					SIDate: '20 May 2017',
					SIActual: 'N',
					SSVDate: '28 Apr 2017',
					SSVActual: 'N',
					SSU: '30',
					validDates: 'Y'
				},
				{
					StudyId: 7,
					StudyTrailId: ["1", "2", "3", "4", "5"],
					StudyName: 'FRRR',
					SIDate: '22 May 2017',
					SIActual: 'N',
					SSVDate: '29 Apr 2017',
					SSVActual: 'N',
					SSU: '30',
					validDates: 'Y'
				}, {
					StudyId: 8,
					StudyTrailId: ["1", "2", "3"],
					StudyName: 'ERRR',
					SIDate: '18 May 2017',
					SIActual: 'N',
					SSVDate: '15 Apr 2017',
					SSVActual: 'Y',
					SSU: '33',
					validDates: 'Y'
				},
				{
					StudyId: 9,
					StudyTrailId: ["1", "2"],
					StudyName: 'FRRR',
					SIDate: '31 May 2017',
					SIActual: 'N',
					SSVDate: '30 Apr 2017',
					SSVActual: 'N',
					SSU: '30',
					validDates: 'Y'
				},

			];
			vm.dataSource = new kendo.data.DataSource({
				pageSize: 50,
				data: vm.Studies,
				autoSync: true,
				schema: {
					model: {
						id: "StudyId",
						fields: {
							StudyId: { editable: false, nullable: true },
							StudyName: { nullable: true },
						}
					}
				}
			});

			vm.ManualEdit=function(){
				vm.disabled=false;
			};

			vm.mainGridOptions = {
				//	dataSource:vm.dataSource,
				columns: [
					{ field: "StudyId", title: "StudyId", width: "05%" },
					//{field:"StudyName", title:"StudyName" ,	width: "170px" },
					{ field: "SSVDate", title: "SSV", template: kendo.template($("#myTemplate3").html()), width: "38%" },
					{ field: "SSU", title: "SSU", template: kendo.template($("#myTemplate4").html()), width: "7%" },
					{ field: "SIDate", title: "SI", template: kendo.template($("#myTemplate2").html()), width: "38%" }//,
					// { field: "filters", title: "filters", template: kendo.template($("#myTemplate").html()), width: "20%" }
				], sortable: true
			};
			$scope.$on('kendoWidgetCreated', widgetCreated_handler);

		}

		//TO DO controller initalized after the login
		function widgetCreated_handler(event, widget) {
			if (widget === vm.mainGrid) {
				vm.mainGrid.dataSource.data(vm.Studies);
			}
		}



		vm.AddRows = function () {
			//Add new rows in exisiting grid 

			if (vm.sites === 0) {
				alert('Enter sites');
				// return;
			}
		//	vm.dataSource.fetch();
			var db = vm.mainGrid.dataSource.data();
			var loopNumber = 0;

			var increaseSymbol = false;
			///Increase Sites
			if (db.length < vm.sites) {
				loopNumber = vm.sites - db.length;
				increaseSymbol = true;
			}
			///Decrease Sites
			if (db.length > vm.sites) {
				loopNumber = vm.sites;
			}
			var i = 0;
			if (increaseSymbol) {
				for (i = 0; i < loopNumber; i++) {
					db.push({ StudyId: db.length + 1, StudyTrailId: ["1"], StudyName: '', SIDate: '', SIActual: 'N', SSVDate: '', SSVActual: 'N', SSU: '', validDates: 'Y' });
				}
			} else {
				/*
				var dbActual=[];
				var dbProject=[];
				var dbfinal=[];
				angular.forEach(db,function(v,k){
					if(v.SSVActual=='Y'){
						dbActual.push(v);
					}else{
						dbProject.push(v);
					}
				});
				var dbLoopCount= db.length-dbActual.length;
				var dbLoop=db.length-vm.sites;
				console.log(dbLoopCount);
				console.log(dbLoop);
				
				for(i=dbLoopCount;i>=dbLoop-1;i--){
					dbProject.splice(i,1);
				}
				console.log(dbActual);
				console.log(dbProject);
			
				angular.forEach(dbActual,function(v,k){
					dbfinal.push(v);
					
				});
				angular.forEach(dbProject,function(v,k){
					dbfinal.push(v);
					
				});
				db=dbfinal;
				*/

				for (i = db.length - 1; i >= loopNumber; i--) {
					db.splice(i, 1);
				}
			}

			vm.mainGrid.dataSource.data(db);
		    vm.mainGrid.refresh();
		};


		vm.CheckValidation = function () {
			var selectedGridData = vm.mainGrid.dataSource.data();
			console.log(selectedGridData);
			// angular.forEach(selectedGridData, function (v, k) {

			// });
			console.log(selectedGridData);
		};
		vm.HideRows = function () {
			// var selectedGridData = vm.mainGrid.dataSource.data();
			// console.log(selectedGridData);
			var ViewData = vm.mainGrid.dataSource.view();
			angular.forEach(ViewData, function (v, k) {
				if (v.SSVActual == 'Y') {
					angular.element('#mainGrid').find("tr[data-uid='" + v.uid + "']").hide();
				}
			});
		};
		vm.ShowRows = function () {
			// var selectedGridData = vm.mainGrid.dataSource.data();
			// console.log(selectedGridData);
			var ViewData = vm.mainGrid.dataSource.view();
			console.log(ViewData);
			var sortDates=[];
			angular.forEach(ViewData, function (v, k) {
				angular.element('#mainGrid').find("tr[data-uid='" + v.uid + "']").show();
				sortDates.push(v.SSVDate);
			});
			sortDates= sortDates.sort(date_sort_asc);
			console.log(sortDates);
		};

		var date_sort_asc = function (date1, date2) {
			date1= moment(date1).format("MM/DD/YYYY");
			date2= moment(date2).format("MM/DD/YYYY");
			if (date1 > date2) return 1;
			if (date1 < date2) return -1;
			return 0;
		};

		vm.changesSIDate = function (dataItem) {
			if (dataItem.SSVDate !== '' && dataItem.SIDate !== '') {
				if (!moment(dataItem.SIDate).isAfter(dataItem.SSVDate)) {
					dataItem.validDates = 'N';
					alert('SI date is less then SSV date');
					dataItem.SIDate = "";
					return;
				}
			}
			dataItem.SSU =
				moment(dataItem.SIDate).diff((moment(dataItem.SSVDate)), 'days');
			//moment('2010-10-20').isAfter('2010-10-19');	
			console.log(dataItem);
		};
		vm.changesSSVDate = function (dataItem) {
			vm.dataSource.fetch();
			var db = vm.dataSource.data();
			//console.log(db);
			if (dataItem.SSVDate !== '' && dataItem.SIDate !== '') {
				if (!moment(dataItem.SSVDate).isBefore(dataItem.SIDate)) {
					dataItem.validDates = 'N';
					alert('SSV date is less then SI date');
					dataItem.SSVDate = "";
					return;
				}
			}
			dataItem.SSU =
				moment(dataItem.SIDate).diff((moment(dataItem.SSVDate)), 'days');
			console.log(dataItem);
		};


	}


})();