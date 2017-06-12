(function ($) {

    var MyGrid = kendo.ui.Grid.extend({
		
        init: function (element, options) {
			var kendoGrid = element
			options.resizable= true;
			options.scrollable= true;
			// controlled through k-options/config object
			if(options.pageable) {
				options.pageable = {
					input: true,
					numeric: false,
					buttonCount: 5
			   };
				//if pageChange supplied from outside
				if(options.pageChange) {
					options.pageable.change = options.pageChange
				}
			}
			// controlled through k-options/config object
			if(options.sortable) {
				options.sortable = {
					mode: 'multiple',
					allowUnsort: true
				};
			}
			
			options.dataBound = function (e) {
				console.log('----in kendo extended grid for sorting logic----');
				var sortInfoElement = $('#'+ this.element[0].id +' .sortInfo');
				var sortOrderElement = $('#' + this.element[0].id +' .sortOrder')
				var sortStr = "";
				if (this.dataSource.sort()) {
					for (k = 0; k < this.dataSource.sort().length; k++) {
						sortStr += sortInfo(this.columns, this.dataSource.sort()[k])
					}
				}

				if (sortStr.length > 0) { // slice extra chars
					sortStr = sortStr.slice(-sortStr.length, -2);
				}
				
				// display info if sorted
				if(options.pageable) {
					if(sortInfoElement.length > 0 && sortStr.length > 0) {
						sortInfoElement.text(sortStr);
						sortOrderElement.show();
					}
					else if(sortStr.length > 0){
						$("#" + this.element[0].id +" .k-pager-info").after("<span class='sortOrder' style='margin-left:10px'><span><b>Sort Order: </b></span><span class='sortInfo'>" + sortStr + "</span></span>");
					}
					else {
						sortOrderElement.hide();
					}
				}
				else {
					if(sortInfoElement.length > 0 && sortStr.length > 0) {
						sortInfoElement.text(sortStr);
						sortOrderElement.show();
					}
					else if(sortStr.length > 0){
						$("#" + this.element[0].id +" > .k-grid-content").after("<div style='text-align: left; height:28px' class='k-pager-wrap k-grid-pager'><span class='sortOrder' style='margin-left:10px'><span><b>Sort Order: </b></span><span class='sortInfo'>" + sortStr + "</span></span></div>");
					}
					else {
						sortOrderElement.hide();
					}
				}
				
				
				// call custom dataBound to extract grid reference
				if(options.cdataBound) {
					options.cdataBound(e);
				}
				
				if(this.dataSource.data().length == 0) {
					var colCount = this.columns.length;
					$(e.sender.wrapper)
						.find('tbody')
						.append('<tr class="kendo-data-row"><td colspan="' + colCount + '" class="no-data">No data available in table</td></tr>');
				}
			}
			
			setColumnTitle(options.columns);
			
            kendo.ui.Grid.fn.init.call(this, element, options);
			
			this.bind("columnResize", grid_columnResize);
			this.bind("excelExport", grid_excelExport)
   
			

			$(element).kendoTooltip({
				filter: "td:not(:empty), span.k-i-edit, span.k-i-update, span.k-i-cancel, img.rationaleIcon", //this filter selects the first column cells
				autoHide: true,
				position: "right",
				content: function (e) {
					var content = e.target.closest('tr').context;
					/*Check tooltip-type data is present or not*/
					
					if($(content).hasClass('k-i-edit'))
					{
						content = 'Edit';
					}
					else if($(content).hasClass('k-i-update'))
					{
						content = 'Save';
					}
					else if($(content).hasClass('k-i-cancel'))
					{
						content = 'Cancel';
					}
					else if($(content).hasClass('rationaleIcon'))
					{
						content = 'Rationale is required';
					}
					else if($(content).find('div').data('tooltip-type') === 'html'){
						/*find tooltip-type data attribute and replace display none style with block and show html data in tooltip*/
						var tooltipTextContent = $(content).clone().find('div[data-tooltip-type="html"]');
						tooltipTextContent.css('display','block');
						content = tooltipTextContent.html();
					}else{
						content = $(content).context.textContent.trim();
					}
					if (content.trim() != '') {
						$('[role="tooltip"]').css("visibility", "visible");
						return content;
					} 
					else
					{
						$('[role="tooltip"]').css("visibility", "hidden");
					}
					
				}
			}).data("kendoTooltip");

			//seperated for headers to have independent position, tooltip isolation
			$(element).kendoTooltip({
				filter: "th:not(:empty)", //this filter selects header cells
				autoHide: true,
				position: "top",
				content: function (e) {
					/**Check filter class persent if class present then remove filter text*/
					/**TODO: find out better and appropriate solution for this tooltip issue */
					var filterClass = e.target.closest('tr').find('.k-grid-filter');
					if(filterClass.length){
						filterClass.find('span').text('');
					}
					var content = e.target.closest("tr").context.textContent.trim();
					if(e.target.closest("tr").context.colSpan === 1)
						content = getColHeaderTooltip(content, options.columns);
						
					return content;
				}
			}).data("kendoTooltip");

        },
		
        options: {
            name: "DVDataGrid",
            autobind: true,
            template: null
        },
		
		toCSV : function (extraColumnsinHierarchy) {
			if(typeof extraColumnsinHierarchy  === 'undefined')
			{
				extraColumnsinHierarchy = true;
			}
			var csv = '',objColHeader;

			// Get access to basic grid data
			var grid = this,
				datasource = grid.dataSource,
				originalPageSize = datasource.pageSize();

			// Increase page size to cover all the data and get a reference to that data
			//datasource.pageSize(datasource.total());
			var data = datasource.view();
			//add the header row						
			objColHeader = getColumnHeaders(grid.columns, false);

			if (objColHeader.isHierarchy === true) {
				csv += '[Group Header]\r\n';

				if (angular.isDefined(objColHeader.allParentCol)) {
					csv += objColHeader.allParentCol + '\n';
				}
			}

			csv += '[Column Header]\r\n';
			csv += objColHeader.csv;

			csv += '\r\n\r\n[Rows]\r\n';
			var i = 0;
			//add each row of data
			$.each(data, function (index, row) {
				csv += getColumnData(grid.columns, row);
				if (extraColumnsinHierarchy) {
					csv += '\r\n';
					for (i = 0; i < extraColumnsinHierarchy.length; i++) {
						csv += row[extraColumnsinHierarchy[i]] + ' ';
					}
				}
			});

			// Reset datasource
			//datasource.pageSize(originalPageSize);
			console.log('CSV is', csv);
			return csv;
		}
		
    });
    kendo.ui.plugin(MyGrid);
	
	
	
	
	function setColumnTitle(columns) {
		for (var i = 0; i < columns.length; i++) {
			var column = columns[i];
			// if not then create, don't overwrite
			 
			if (!column.longTitle) {
				column.longTitle = column.title;
			}

			if (column.shortTitle && column.shortTitle !== '' && column.width && Number(String(column.width).replace('px','')) < 120) {
				column.title = column.shortTitle;
			}
			
			if(!column.field) {
				column.field = column.name;
				column.name = column.title
			}

			if (column.columns) {
				setColumnTitle(column.columns);
			}
		}
	}
	
	function grid_columnResize(e) {
		
		if (e.newWidth > 120) {
			$("#" + this.element[0].id + " thead [data-field=" + e.column.field + "]").html(e.column.longTitle);
		} else {
			$("#" + this.element[0].id  + " thead [data-field=" + e.column.field + "]").html(e.column.shortTitle);
		}
		
	}
	
	function grid_excelExport(e) {
		var workbookObj = e.workbook.sheets[0];

		workbookObj.freezePane = null;
		workbookObj.columns[0] = {
			width: 100,
			autoWidth: false
		};
		
		if(this.isPrint === true) {
			e.preventDefault();
			var cols = workbookObj.columns;
			var rows = workbookObj.rows;
			var row, strHtml, arrrowObj, strType, fntSz;
			var isIE = false || !!document.documentMode;

			//fntSz = (workbookObj.columns.length > 15) ? '9px' : '11px';

			if(workbookObj.columns.length > 17){
				fntSz = '9px';

				if(isIE === true){
					fntSz = '6px';
				}

			} else{
				fntSz = '10px';
			}

			strHtml = '<style>table.dv-printable-table{background-color:white; font: 11pt sans-serif; font-size: ' + fntSz + ';}.dv-printable-table th{ vertical-align: bottom; color: #fff;font-size: ' + fntSz + ';font-weight: bold;background: #8c8e8c;border-color: #ccc; border:1px solid #ccc;text-align: center;} .dv-printable-table td{text-align:right} .dv-printable-table tr td:first-child{text-align: left}</style>' + '<table class="table table-bordered dv-printable-table" style="border:1px solid grey;">';

			for (var i = 0; i < rows.length; i++) {
				strHtml += '<tr>';
				arrrowObj = rows[i].cells;
				strType = rows[i].type;
				var objRow, backgrnd = null, bgColor = null, val;

				for (var j = 0; j < arrrowObj.length; j++) {
					objRow = arrrowObj[j];
					val = (objRow.value === null || objRow.value === undefined) ? '-' : objRow.value;

					if (strType === 'header') {
						if (angular.isDefined(objRow.background)) {
							backgrnd = 'background:' + objRow.background;
						}

						if (angular.isDefined(objRow.background)) {
							bgColor = 'color:' + objRow.color;
						}

						strHtml += '<td style="' + backgrnd + '; ' + bgColor + '" colspan="' + objRow.colSpan + '" rowspan="' + objRow.rowSpan + '">' + val + '</td>';
					} else {
						strHtml += '<td>' + val + '</td>';
					}
				}
				strHtml += '</tr>';
			}
			strHtml += '</tr></table>';	
			this.printText = strHtml;
		}
		else {
			var excelObj = {
				workbookObj: e.workbook,
				dataObj: e.data
			}
			if(this.customizeExport) {
				this.customizeExport(excelObj)
			}
		}
		
	}
	
	function getColHeaderTooltip(content, columns) {
		for (var i = 0; i < columns.length; i++) {
			if (columns[i].columns) {
				content = getColHeaderTooltip(content, columns[i].columns);
			}
			if ((columns[i].title && content === columns[i].title.trim()) || (columns[i].shortTitle && content === columns[i].shortTitle.trim())) {
				content = columns[i].longTitle;
				return content;
			}
		}
		return content;
	}
	
	function getColumnHeaders(columns, isRecursion, colTitle) {
			var csv = '';

			var colValue;

			var title, field, boolColHierarchy = false,
				mainColHeader, strParentCol = '',
				finalCsv = '',
				objColHeader,
				strAllParentCol = '';

			for (var i = 0; i < columns.length; i++) {
				if (columns[i].columns) {
					//Nested columns
					boolColHierarchy = true;

					objColHeader = getColumnHeaders(columns[i].columns, true, columns[i].title);

					csv += objColHeader.csv;

					if (angular.isDefined(objColHeader.parentCol)) {
						if (strAllParentCol === '') {
							strAllParentCol = objColHeader.parentCol;
						} else {
							strAllParentCol = strAllParentCol + objColHeader.parentCol;
						}
					}
				} else {

					if (columns[i].hidden === undefined || columns[i].hidden === false) {

						if (angular.isDefined(colTitle) && angular.isDefined(strParentCol)) {
							strParentCol = strParentCol + '\t' + colTitle;
						}

						strAllParentCol = strParentCol;

						title = columns[i].title;
						field = columns[i].field;

						if (typeof (field) === "undefined") {
							continue; /* no data! */
						}

						if (typeof (title) === "undefined") {
							title = field
						}

						title = title.replace(/"/g, '""');
						csv += '"' + title + '"';
						if (i < columns.length - 1 || isRecursion) {
							csv += '\t';
						}
					}
				}

			} //ENDS FOR

			return {
				parentCol: strParentCol,
				allParentCol: strAllParentCol,
				csv: csv,
				isHierarchy: boolColHierarchy
			};
		}

		function getColumnData(cols, row, isRecursion) {
			var csv = '';
			var fieldName, value, fieldTitle, content = '';
			for (var i = 0; i < cols.length; i++) {

				if (cols[i].columns) {
					//Nested columns
					csv += getColumnData(cols[i].columns, row, true);
				}
				else {
					if(cols[i].hidden === undefined || cols[i].hidden === false) {
						fieldName = cols[i].field;
						fieldTitle = cols[i].title;

						//template = grid.cols[i].template;

						if (typeof (fieldName) === "undefined") {
							continue;
						}

						value = row[fieldName];

						//To export Notes in Location list
						if (angular.isArray(value) || value instanceof kendo.data.ObservableArray) {
							var len = value.length;

							for (var j = 0; j < len; j++) {
								content += fieldTitle + ' ' + (j + 1) + ': ' + value[j].txt + '\n';
							}

							value = content;
						}
						if (!value) {
							value = '--';
						}
						value = value + '';

						value = value.replace(/"/g, '""');
						csv += '"' + value + '"';
						if (i < cols.length - 1 || isRecursion) {
							csv += "\t";
						}
					}// show only visible
				}

			} //ENDS FOR
			return csv;
		}
	
		function sortInfo(columns, sort) {
			var info = "";
			for (var j = 0; j < columns.length; j++) {
				if (info.length < 1 && columns[j].columns && columns[j].columns.length > 0) {
					info = sortInfo(columns[j].columns, sort)
				} else if (columns[j].field !== undefined && columns[j].field == sort.field) {
					info = columns[j].title + " (" + sort.dir.toUpperCase() + "), ";
					break;
				}
			}
			return info;
		}
	
})(jQuery);
