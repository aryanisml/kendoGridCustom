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
		 vm.Calculation = {
            ssvmethod: '',
            siteCount: '',
            firstSSV: '',
            lastSSV: '',
            ssvStartDate: '',
            ssvRate: '',
            ssvSitesPer: ''

        };
 vm.ssvSpread = function () {
            vm.ssvSpreadShow = true;
        };
        vm.ssvRates = function () {
            vm.ssvSpreadShow = false;
        };
        vm.siMinMax = function () {
            vm.siMinMaxSsuShow = true;
            vm.siRateShow = false;
        };
        vm.siRates = function () {
            vm.siRateShow = true;
            vm.siMinMaxSsuShow = false;
        };
        vm.siEndDate = function () {
            vm.siRateShow = false;
            vm.siMinMaxSsuShow = false;
        };
		   vm.ssvCalculate = function () {

            vm.initialSICalculation = true;
            vm.Calculation.ssvmethod = vm.ssvMethod;
            vm.Calculation.siteCount = vm.site;
            vm.Calculation.firstSSV = vm.firstSSV;
            vm.Calculation.lastSSV = vm.lastSSV;
            vm.Calculation.ssvStartDate = vm.ssvStartDate;
            vm.Calculation.ssvRate = vm.ssvRate;
            vm.Calculation.ssvSitesPer = vm.ssvMethod != "ssvSpread" ? vm.ssvSitesPer : vm.Calculation.ssvSitesPer;

            console.log(vm.Calculation);
        };

		function onInit() {
			//vm.manualEditType=true;
			   vm.ssvMethod = "ssvSpread";
            vm.ssvSitesPer = "M";
            vm.ssvSpreadShow = true;

            vm.siMethod = "siMinMaxSSU";
            vm.siSitesPer = "M";
            vm.siMinMaxSsuShow = true;
            vm.siRateShow = false;
            vm.siEndDateShow = false;
            vm.initialSSVCalculation = false;
            vm.initialSICalculation = false;
			vm.tempOff=true;
			vm.disabled=true;
			vm.Studies = [
				{
					SiteId: 'GFR774-49-01',
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
					SiteId: 'GFR774-49-02',
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
					SiteId: 'GFR774-49-03',
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
					SiteId: 'GFR774-49-04',
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
					SiteId: 'GFR774-49-05',
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
					SiteId: 6,
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
					SiteId: 7,
					StudyTrailId: ["1", "2", "3", "4", "5"],
					StudyName: 'FRRR',
					SIDate: '22 May 2017',
					SIActual: 'N',
					SSVDate: '29 Apr 2017',
					SSVActual: 'N',
					SSU: '30',
					validDates: 'Y'
				},
				{
					SiteId: 8,
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

			// angular.element('#myChange').on('change',function(){
				
			// });

			vm.dataSource = new kendo.data.DataSource({
				pageSize: 50,
				data: vm.Studies,
				autoSync: true,
				schema: {
					model: {
						id: "SiteId",
						fields: {
							SiteId: { editable: false, nullable: true },
							StudyName: { nullable: true },
						}
					}
				}
			});

			// vm.ManualEdit=function(){
			// 	vm.disabled=false;
			// };

			vm.mainGridOptions = {
				//	dataSource:vm.dataSource,
				columns: [
					{ field: "SiteId", title: "Site ID", width: "7%" },
					//{field:"StudyName", title:"StudyName" ,	width: "170px" },
					{ field: "SSVDate", title: "SSV Date", template: kendo.template($("#myTemplate3").html()), width: "12%" },
					{ field: "SSU", title: "SSU", template: kendo.template($("#myTemplate4").html()), width: "5%" },
					{ field: "SIDate", title: "SI Date", template: kendo.template($("#myTemplate2").html()), width: "12%" }//,
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

		vm.ManualEdit=function(){
			if(vm.manualEditType){
				vm.disabled=false;
			}else{
				vm.disabled=true;
			}	
		};

		vm.AddRows = function () {
			//Add new rows in exisiting grid 
 vm.initialSSVCalculation = true;
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
					db.push({ SiteId: db.length + 1, StudyTrailId: ["1"], StudyName: '', SIDate: '', SIActual: 'N', SSVDate: '', SSVActual: 'N', SSU: '', validDates: 'Y' });
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
