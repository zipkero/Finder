window.__define_resource && __define_resource("BTN00113","LBL03017","LBL06069","LBL12489","LBL00926","LBL08629","MSG00205","MSG02158","LBL06100","BTN00027","LBL09446","LBL00004","LBL02072","MSG00456","MSG03847","MSG03848");
/****************************************************************************************************
1. Create Date : 2017.05.11
2. Creator     : 김정수
3. Description : 재고2 > 시리얼/로트등록 > 리스트 > 연간미사용코드
4. Precaution  : 
5. History     : 2019.08.27(Hao) Link Serial / Lot No. Slip List to NF3.0
****************************************************************************************************/
ecount.page.factory("ecount.page.list.unusedCode", "EMV002P_04", {
	/********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    maxCount: 30000,
    checkMaxCount: 100, // checkbox 최대 선택 갯수   
    strFirstFlag: "0",
    finalSearchParam: null,
    cSerialIdx: "",
    finishList: "",        //종결/종결취소 리스트 -  list items 
    rightHtml: "",
    isMoreFlag: false,          // "천건이상" 버튼 클릭 여부   
    inputFormDetail: null,

    strUserPermit: null,
    strSettingPermits: null,
    useYN: '',
	/**********************************************************************
    *  page init
    **********************************************************************/
	init: function (options) {
	    this._super.init.apply(this, arguments);
	    this.strSettingPermits = this.viewBag.Permission.E040617.Value;
	    if (this.USER_FLAG == "M" || this.USER_FLAG == "E")
	        this.strSettingPermits = "W";
	},

	/**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
	setTitleOnHeader: function (header) {
	    var g = widget.generator,
           contents = g.contents(),
           toolbar = g.toolbar(),
		   form = g.form(),
           ctrl = g.control();

	    toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "Search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113));
	    form.add(ctrl.define("widget.input.search", "PROD_CD", "PROD_CD", ecount.resource.LBL03017).end())
	    form.add(ctrl.define("widget.input.search", "SERIAL_IDX", "SERIAL_IDX", ecount.resource.LBL06069).end())
	    form.add(ctrl.define("widget.radio", "YEARLY", "YEARLY", ecount.resource.LBL12489).value(["1", "2", "3"]).label(["1" + ecount.resource.LBL00926, "2" + ecount.resource.LBL00926, "3" + ecount.resource.LBL00926]).select("1").end());
	    contents.add(form).add(toolbar);
	    header.useQuickSearch();

	    header
            .notUsedBookmark()
            .setTitle(ecount.resource.LBL08629)
            .add("search", null, false)
            .addContents(contents);
	},

	setGirdOnContents: function (contents) {
	    var generator = widget.generator,
            ctrl = generator.control(),
            toolbar = generator.toolbar(),
            settings = generator.grid(),
            grid = generator.grid();
	    grid
            .setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl("/Inventory/Serial/GetListYearlyUnused")
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })
            .setKeyColumn(['sale011.serial_idx'])

            .setColumnFixHeader(true)
            .setHeaderFix(true)
            .setEmptyGridMessage(ecount.resource.MSG00205)
            //Paging
            .setPagingUse(true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCheckBoxUse(true)
            .setCustomRowCell(' sale011.TO_EXPIRATION_DATE', this.setGridExpirationDate.bind(this))
            //Custom cells                        
            .setCustomRowCell('sale011.serial_idx', this.setGridSerialIdxLink.bind(this))
            .setCustomRowCell('sale011.detail', this.setGridDetailLink.bind(this))
            .setCustomRowCell('sale003.prod_size', this.setGridProdDes.bind(this))
            .setCustomRowCell('sale011.to_expiration_date', this.setGridExpirationDate.bind(this))
            .setCustomRowCell('sale003_img.prod_img', this.setGridImage.bind(this)) // 이미지
            //
            .setCheckBoxMaxCount(this.checkMaxCount)
            .setCheckBoxMaxCountExceeded(function (maxcount) { ecount.alert(String.format(self.ecount.resource.MSG02158, maxcount)) });

	    contents
            .add(toolbar)
            .addGrid("dataGrid", grid);
	},

	/**********************************************************************
	* user function	
	**********************************************************************/
	clickSearch: function () {
	    var _self = this;

	    if (_self.dataSearch()) {
	        if (!_self._userParam) _self.header.toggle(forceHide);
	    }

	    _self.contents.getGrid().grid.clearChecked();
	},

	//정렬 (Sort)
	setGridSort: function (e, data) {
		this.header.toggle(true);
		this.finalSearchParam.SORTCOL_INDEX = Number(data.propertyName.replace("A", "")) + 1;
		// 컬럼 숫자만 리턴(Only returns the column number)
		this.finalSearchParam.SORT_COLUMN = data.columnId;
		this.finalSearchParam.SORT_TYPE = data.sortOrder;
		this.contents.getGrid().draw(this.finalSearchParam);
	},

    /**********************************************************************
	* Events Handlers
	**********************************************************************/
	BeforedataSearchForSerial: function () {
	    var _self = this;
	    if (this._userParam) {
	        if (this._userParam.C_param.PARAM != "") {
	            this.header.getQuickSearchControl().setValue(this._userParam.C_param.PARAM);
	            this.finalSearchParam = this._userParam.C_param;
	        }
	    } else {
	        this.finalSearchParam.PARAM = "";
	    }
	    if (_self.dataSearch()) {
	        if (!_self._userParam) _self.header.toggle(forceHide);
	    }
	    _self.contents.getGrid().grid.clearChecked();
	},
    
	BeforequickSearchForSerial: function () {
	    var grid = this.contents.getGrid("dataGrid");
	    var _self = this;
	    this.header.lastReset(this.finalHeaderSearch);
	    this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
	    this.contents.getGrid().grid.removeShadedColumn();
	    this.contents.getGrid().grid.clearChecked();
	    grid.getSettings().setPagingCurrentPage(1); //Paging Page 1
	    grid.draw(this.finalSearchParam);
	},

	BeforeDeactivateForSerial: function () {
	    this.useYN = 'Y';
	    this.fnChangeStatus('Y');
	},

	reloadPage: function () {
	    this.header.toggle(true);
	    this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
	    this.contents.getGrid().draw(this.finalSearchParam);
	},

	setGridSerialIdxLink: function (value, rowItem) {
	    var option = {};
	    var self = this;
	    option.controlType = "widget.link";
	    option.event = {
	        'click': function (e, data) {
	            var params = {
	                width: ecount.infra.getPageWidthFromConfig(1),
	                height: 420,
	                SERIAL_IDX: data.rowItem.SERIAL_IDX,
	                PROD_CD: data.rowItem.PROD_CD,
	                PROD_DES: data.rowItem.PROD_DES,
	                USE_YN: data.rowItem.USE_YN,
	                editFlag: 'M',
	                hidPage: '1',
	                PARAM: '',
	                PAGE: '/ECERP/ESQ/ESQ202M',
	            };
	            self.openWindow({
	                url: '/ECERP/ESA/ESA009P_09',
	                name: String.format(ecount.resource.LBL06100),
	                param: params,
	                popupType: false,
	                additional: false
	            });
	            self.cSerialIdx = '';
	        }
	    };
	    if (this._userParam) {
	        this.cSerialIdx = this._userParam.C_SerialIdx;
	        if (this._userParam.C_SerialIdx == (rowItem['SERIAL_IDX'])) {
	            option.attrs = { 'class': ['text-primary-inverse'] }
	        }
	    }
	    else {
	        if (this.cSerialIdx == (rowItem['SERIAL_IDX'])) {
	            option.attrs = { 'class': ['text-primary-inverse'] }
	        }
	    };
	    return option;
	},

	setGridDetailLink: function (value, rowItem) {
	    var option = {};
	    var self = this;
	    option.controlType = "widget.link";
	    option.data = ecount.resource.BTN00027 == undefined ? 'View' : ecount.resource.BTN00027;
	    option.event = {
	        'click': function (e, data) {
	            var params = {
	                width: ecount.infra.getPageWidthFromConfig(1),
	                height: 420,
	                Request: {
	                    AFlag: '4',
	                    editFlag: 'M',
	                    pageSize: 100,
	                    Data: {
	                        SERIAL_IDX: data.rowItem.SERIAL_IDX,
	                        isDetail: '1'
	                    }
	                }
	            };
	            self.openWindow({
	                url: '/ECERP/SVC/ESQ/ESQ200M',
	                name: String.format(ecount.resource.LBL09446),
	                param: params,
	                popupType: false,
	                additional: false
	            });
	        }
	    }
	    if (rowItem.SL_USE_FG != '0') {
	        option.attrs = {
	            'class': 'text-warning-inverse'
	        };
	    };
	    return option;
	},

    // Rename Prod_Des
	setGridProdDes: function (value, rowItem) {
	    var option = {};
	    if (rowItem.PROD_CNT != '' && rowItem.PROD_CNT > 1)
	        option.data = String.format(ecount.resource.LBL00004, value, (rowItem.PROD_CNT - 1));
	    else
	        option.data = value;
	    return option;
	},

    // 이미지 링크 click
	setGridImage: function (value, rowItem) {
	    var option = {};
	    if (!$.isNull(rowItem.ATTACH_INFO) && !$.isNull(rowItem.FS_OWNER_KEY)) {
	        option.data = rowItem.FILE_FULLPATH;
	        option.controlType = "widget.thumbnailLink";
	    }
	    else {
	        option.data = '';
	        option.controlType = "widget.link";
	    }
	    option.dataType = "1";
	    option.event = {
	        'click': function (e, data) {
	            var param = {
	                width: 400,
	                height: 420,
	                PROD_CD: data.rowItem.PROD_CD,
	                isViewOnly: true
	            };

	            this.openWindow({
	                url: '/ECERP/EGG/EGG024M',
	                name: ecount.resource.LBL02072,
	                param: param,
	                popupType: false,
	                additional: true
	            });

	            data.event.preventDefault();
	        }.bind(this)
	    };
	    return option;
	},

    // Set row color
	setRowBackgroundColor: function (data) {
	    if (data["USE_YN"] == "Y")
	        return true;
	},

	dataSearch: function (e) {
	    var gridObj = this.contents.getGrid("dataGrid"),
            settings = gridObj.settings;
	    this.setGridParameter(settings);
	    gridObj.draw(this.finalSearchParam);
	    this.header.toggle(true);
	},
	fnChangeStatus: function (value) {
	    var userpermit = this.strSettingPermits;
	    if (userpermit != "W") {
	        ecount.alert(ecount.resource.MSG00456);
	        return false;
	    };
	    this.finishList = this.contents.getGrid().grid.getChecked();
	    if (this.finishList.length == 0) {
	        if (value == 'N')
	            ecount.alert(ecount.resource.MSG03847);
	        else
	            ecount.alert(ecount.resource.MSG03848);
	        return false;
	    };
	    this.fnChangeStatusListApi(this.finishList);
	},

	fnChangeStatusListApi: function (arrayData) {
	    var formData = this.setListJsonDataForDelete(arrayData, '');
	    var self = this;	    
	    self.showProgressbar(true);
	    ecount.common.api({
	        url: "/Inventory/Serial/ChangeListStatus",
	        data: formData,
	        success: function (result) {
	            if (result.Status != "200") {
	                ecount.alert(result.fullErrorMsg + result.Data);
	            }
	            else {
	                self.contents.getGrid().grid.clearChecked();
	                self.contents.getGrid().draw(self.finalSearchParam);
	            }
	        },
	        complete: function () {
	            self.hideProgressbar(true);
	            self.sendMessage(self, { callback: self.close.bind(self) });
	        }
	    });
	},

	setListJsonDataForDelete: function (arrayData, editFlag) {
	    var data = "";
	    var serialLists = [];
	    if (arrayData.length > 0) {
	        for (var i = 0; i < arrayData.length; i++) {
	            serialLists.push({
	                SerialIdx: arrayData[i].SERIAL_IDX,
	                ProdCD: arrayData[i].PROD_CD,
	                UseYN: this.useYN,
	                EditFlag: editFlag
	            });
	        }

	        data = Object.toJSON({
	            SerialListInfo: serialLists
	        });
	    };
	    return data;
	}
});