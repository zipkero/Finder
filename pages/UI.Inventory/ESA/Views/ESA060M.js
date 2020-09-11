window.__define_resource && __define_resource("LBL35896","LBL35895","LBL80071","LBL02997","LBL02475","LBL02025","LBL01387","LBL02538","LBL01250","LBL01523","LBL03289","LBL03290","LBL03291","LBL07243","LBL35244","LBL01448","BTN00204","LBL00870","LBL10548","BTN00113","BTN00007","LBL10901","BTN00330","MSG03839","BTN00043","LBL10908","BTN00818","BTN00959","BTN00033","BTN00203","LBL10783","LBL10648","LBL09924","MSG00722","MSG01561","LBL93709","LBL10909","LBL03696","MSG02237","MSG10104","LBL00141","LBL08030","LBL00243");
/****************************************************************************************************
1. Create Date : 2016.05.16
2. Creator     : Pham Van Phu
3. Description : InvII > Quantity Controll > Inspection Type
4. Precaution  :
5. History     : 2018.01.16(Thien.Nguyen) add function scroll top for page,add shaded grid option, modify onMessageHandler function
                 2018.06.13(Ngo Thanh Lam) add function Form Settings pop-up
                 [2019.01.09] (Ngọc Hân) A19_00045_1_FE 리팩토링_페이지 일괄작업 3차 - Han  change use function  data.length => getComponentSize() at  onHeaderQuickSearch,  setGridParameter, setReload
                 2019.03.06 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
6. Old file: ESA060M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA060M", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    userPermit: '',                 // Page permission    
    selectHearderControl: '',
    isShowSearchBtn: true,
    isShowOptionBtn: true,
    finalSearchParam: null,
    inspectionType: "inspectionType",
    formTypeCode: 'SR902',
    pageSize: 100,
    header: null,
    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.finalSearchParam = {
            PARAM: this.PARAM,
            ITEM_CD2: this.ITEM_CD2,
            ITEM_NM: this.ITEM_NM,
            PAGE_SIZE: 100,
            PAGE_CURRENT: 0,
            SORT_COLUMN: '0',
            SORT_TYPE: 'A',
            PROD_CD: this.PROD_CD,
            PROD_CATEGORY: this.PROD_CATEGORY,
            PROD_CLASS_CD1: this.PROD_CLASS_CD1,
            PROD_CLASS_CD2: this.PROD_CLASS_CD2,
            PROD_CLASS_CD3: this.PROD_CLASS_CD3,
            PROD_LEVEL_GROUP: this.PROD_LEVEL_GROUP,
            PROD_LEVEL_GROUP_CHK: this.PROD_LEVEL_GROUP_CHK,
            BASE_DATE_CHK: this.BASE_DATE_CHK,
            USE_YN: this.USE_YN
        };
        //this.finalSearchParam = this.searchFormParameter;
        this.userPermit = this.viewBag.Permission.Permit.Value;
        this.pageSize = this.viewBag.FormInfos[this.formTypeCode].option.pageSize;
    },
    render: function () {
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/
    // Header Initialization
    onInitHeader: function (header) {
        var self = this;
        var g = widget.generator;
        var contents = g.contents();
        var toolbar = g.toolbar();
        var ctrl = g.control();
        var form = g.form();
        var res = ecount.resource;

        //Search form
        form.add(ctrl.define('widget.input.codeName', 'txtTypeCode', 'ITEM_CD2', res.LBL35896, null).value(this.QC_INSP_TYPE_CODE).end());
        form.add(ctrl.define('widget.input.codeName', 'txtTypeName', 'ITEM_NM', res.LBL35895, null).value(this.QC_INSP_TYPE_NAME).end());
        form.add(ctrl.define("widget.multiCode.prod", "txtSProdCd", "PROD_CD", ecount.resource.LBL80071).setOptions({ groupId: "prod_code", defaultParam: { isApplyDisplayFlag: true } }).maxSelectCount(100).end())
        form.add(ctrl.define("widget.checkbox.prodType", "rbProdChk", "PROD_CATEGORY", ecount.resource.LBL02997).setOptions({ groupId: "prod_code" }).label([ecount.resource.LBL02475, ecount.resource.LBL02025, ecount.resource.LBL01387, ecount.resource.LBL02538, ecount.resource.LBL01250, ecount.resource.LBL01523]).value(['-1', '0', '4', '1', '2', '3']).select('-1').select('0').select('4').select('1').select('2').select('3').end())
        form.add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd1", "PROD_CLASS_CD1", ecount.resource.LBL03289).setOptions({ groupId: "prod_code", defaultParam: { isApplyDisplayFlag: true } }).maxSelectCount(100).end())
        form.add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd2", "PROD_CLASS_CD2", ecount.resource.LBL03290).setOptions({ groupId: "prod_code", defaultParam: { isApplyDisplayFlag: true } }).maxSelectCount(100).end())
        form.add(ctrl.define("widget.multiCode.prodGroup", "txtClassCd3", "PROD_CLASS_CD3", ecount.resource.LBL03291).setOptions({ groupId: "prod_code", defaultParam: { isApplyDisplayFlag: true } }).maxSelectCount(100).end())
        form.add(ctrl.define("widget.multiCode.prodLevelGroup", "txtTreeGroupCd", "PROD_LEVEL_GROUP", ecount.resource.LBL07243).setOptions({ groupId: "prod_code", defaultParam: { isApplyDisplayFlag: true } }).end())
        form.add(ctrl.define('widget.radio', 'rdUseYN', 'USE_YN', res.LBL35244, null)
            .label([res.LBL02475, res.LBL01448, res.BTN00204])
            .value(["A∬N∬Y", "Y", "N"])
            .select("Y")
            .end());
        form.add(ctrl.define("widget.checkbox", "cbEtcVal", "cbEtcVal", ecount.resource.LBL00870)
                                 .label([ecount.resource.LBL10548])
                                 .value(["Y"]).end());

        //Toolbar
        toolbar.setOptions({ css: 'btn btn-default btn-sm', ignorePrimaryButton: true })
        .addLeft(ctrl.define('widget.button', 'search').css('btn btn-sm btn-primary').label(res.BTN00113))
            .addLeft(ctrl.define("widget.button", "rewrite").label(res.BTN00007));

        //Content
        contents.add(form).add(toolbar);

        //Header
        header.setTitle(ecount.resource.LBL10901)
            .useQuickSearch()
            .add('search', null, false)
            .add("option", [
                { id: "templateSetting", label: ecount.resource.BTN00330 }
            ], false)
            .addContents(contents);
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {

        var self = this;
        var g = widget.generator;
        var toolbar = g.toolbar();
        var grid = g.grid();

        // Initialize Grid
        grid.setRowData(this.viewBag.InitDatas.LoadData)
            .setRowDataUrl('/Inventory/QcInspection/GetListForSearchStqcInspectType')
            .setRowDataParameter(this.finalSearchParam)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1, ExtendedCondition: {} })
            .setKeyColumn(["ITEM_CD2"])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setColumnFixHeader(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['INSPECT_ITEM_SETTING', 'ITEM_SETTING', 'USE_YN'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            //Setting checkBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e))
            })

            //shadow 
            .setEventShadedColumnId(['ITEM_CD2'], { isAllRememberShaded: true })

            // Custom Cells
            .setCustomRowCell("ITEM_CD2", this.setItemCodeLink.bind(this))
            .setCustomRowCell("INSPECT_ITEM_SETTING", this.setButtonSettingInspection.bind(this))
            .setCustomRowCell("ITEM_SETTING", this.setButtonSettingItem.bind(this))
            .setCustomRowCell('USE_YN', this.setDataUsed.bind(this));

        contents.add(toolbar).addGrid("dataGrid", grid);
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "New").label(ecount.resource.BTN00043)); //New button
        toolbar.addLeft(ctrl.define("widget.button", "RegInspection").label(ecount.resource.LBL10908));// Reg. Inspection
        toolbar.addLeft(ctrl.define("widget.button", "RegInspectionByItem").label(ecount.resource.BTN00818));//Insp. setting by Item
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
                        .addGroup([
                            { id: "Deactivate", label: ecount.resource.BTN00204 },
                            { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                            { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));

        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function (e) {

        var self = this;
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());
        this._keyWord = "ESA060M" + this.COM_CODE + ecount.user.WID + new Date()._tick();

        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.popupType = false;
        this.selectHearderControl = control.id;
        switch (control.id) {
            case "txtSProdCd":
                config.IO_TYPE = "10";
                config.POS = "1";
                config.CUST = "";
                config.CLASS_TYPE = "9";
                config.PROD_SEARCH = "5";
                config.SFLAG = "N";
                config.REQ_TYPE = "0";
                config.DEL_GUBUN = "N";
                config.BARCODE2 = "N";
                config.BARCODE_SEARCH = "N";
                config.MAIN_YN = "";
                config.SERIAL_DATE = "";
                config.NEWITEM = "";
                config.isincludeinactive = true;
                break;
            case "txtClassCd1":
            case "txtClassCd2":
            case "txtClassCd3":
                config.isincludeinactive = true;
                break;
        }
        handler(config);
    },
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        switch (control.id) {
            case "txtSProdCd":
                parameter.IO_TYPE = "10";
                parameter.POS = "1";
                parameter.CUST = "";
                parameter.CLASS_TYPE = "9";
                parameter.PROD_SEARCH = "5";
                parameter.SFLAG = "N";
                parameter.REQ_TYPE = "0";
                parameter.DEL_GUBUN = "N";
                parameter.BARCODE2 = "N";
                parameter.BARCODE_SEARCH = "N";
                parameter.MAIN_YN = "";
                parameter.SERIAL_DATE = "";
                parameter.NEWITEM = "";
                config.isincludeinactive = true;
                break;
            case "txtClassCd1":
            case "txtClassCd2":
            case "txtClassCd3":
                config.isincludeinactive = true;
                break;
        }
        parameter.PARAM = keyword;
        handler(parameter);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ESA060P_01') {
            //this.setReload();
            this._ON_REDRAW();
        }
        else if (page.pageID == 'ESA060P_03')
            this.setReload();
        else if (page.pageID == 'ESA060P_05')
            this.setReload();
        else if (page.pageID == "ESA063P_02")
            this.setReload();
        else if (page.pageID == "NoticeCommonDeletable")
            this.setReload();
        else if (page.pageID == "CM100P_02")
            this.reloadPage();

        message.callback && message.callback();  // The popup page is closed   
    },
    // quick Search button click event
    onHeaderQuickSearch: function (e, value) {
        this.header.lastReset(this.header.extract().merge());
        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();

        this.finalSearchParam = $.extend({}, this.finalSearchParam, this.header.serialize().result);

        // Set param USE_YN
        if (this.finalSearchParam.USE_YN.indexOf(ecount.delimiter) > -1)
            this.finalSearchParam.USE_YN = "";

        // Set param BASE_DATE_CHK
        this.finalSearchParam.BASE_DATE_CHK = this.finalSearchParam.cbEtcVal.length > 0 ? this.finalSearchParam.cbEtcVal[0] : ''

        // Set param PROD_CATEGORY
        if (this.finalSearchParam.PROD_CATEGORY.split(ecount.delimiter).length >= this.header.getControl("rbProdChk", "all").getComponentSize() - 1)
            this.finalSearchParam.PROD_CATEGORY = "";

        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.finalSearchParam);
    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        this.header.reset();
    },

    // Sorting function
    onColumnSortClick: function (e, data) {
        this.finalSearchParam.SORT_COLUMN = data.columnIndex;
        this.finalSearchParam.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.finalSearchParam);
    },

    //Form Settings pop-up
    onDropdownTemplateSetting: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formTypeCode,
            FORM_SEQ: 1,
            isSaveAfterClose: true
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    //Event click search button
    onHeaderSearch: function (forceHide) {
        this.finalSearchParam.PARAM = "";
        this.header.getQuickSearchControl().setValue(this.finalSearchParam.PARAM);

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },

    checkHeaderValidate: function () {
        return this.header.validate();
    },

    //Draw grid
    dataSearch: function () {
        var invalid = this.checkHeaderValidate();
        if (invalid.result.length > 0) {
            var targetControl;

            var invalidControl = this.header.getControl(invalid.result[0][0].control.id);
            if (invalidControl) {
                targetControl = invalidControl;
            } else {
                this.header.changeTab(invalid.tabId, true);
                targetControl = invalid.result[0][0].control;
            }

            if (targetControl.id == "rbProdChk") {
                this.header.showGroupRow("txtSProdCd");
            }
            this.header.toggleContents(true, function () {
                targetControl.setFocus(0);
            });
            targetControl.setFocus(0);

            return;
        }

        var gridObj = this.contents.getGrid("dataGrid");
        var settings = gridObj.settings;

        this.setGridParameter(settings);
        gridObj.grid.removeShadedColumn();
        gridObj.draw(this.finalSearchParam);

        this.header.toggle(true);
    },
    //Grid parameter settings
    setGridParameter: function (settings) {
        var searchParam = { PARAM: '' };

        // Grid Setting & Search        
        settings.setPagingCurrentPage(1); //Paging Page 1
        searchParam = $.extend({}, this.finalSearchParam, this.header.serialize().result);
        searchParam.PARAM = this.finalSearchParam.PARAM;
        // Set param USE_YN
        if (searchParam.USE_YN.indexOf(ecount.delimiter) > -1)
            searchParam.USE_YN = '';

        // Set param BASE_DATE_CHK
        searchParam.BASE_DATE_CHK = searchParam.cbEtcVal.length > 0 ? searchParam.cbEtcVal[0] : ''

        // Set param PROD_CATEGORY
        if (searchParam.PROD_CATEGORY.split(ecount.delimiter).length >= this.header.getControl("rbProdChk", "all").getComponentSize() - 1)
            searchParam.PROD_CATEGORY = "";

        this.header.getQuickSearchControl().setValue(searchParam.PARAM);
        settings.setHeaderTopMargin(this.header.height());
        //this.finalHeaderSearch = this.header.extract(true).merge();
        this.finalSearchParam = searchParam;
    },

    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        // this._super.onGridInit.apply(this, arguments);
        ecount.page.list.prototype.onGridInit.apply(this, arguments);
    },

    // After grid rendered
    onGridRenderComplete: function (e, data) {
        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.finalSearchParam.PARAM);
            control.setFocus(0);
        }
    },
    // Set [Item Code] column link
    setItemCodeLink: function (value, rowItem) {
        var option = {};
        var res = this.resource;

        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(1),
                    height: 197,
                    editFlag: 'M',
                    INSPECT_TYPE_NM: data.rowItem.ITEM_NM,
                    INSPECT_TYPE_CD2: data.rowItem.ITEM_CD2,
                    INSPECT_TYPE_CD: data.rowItem.ITEM_CD,
                    USE_YN: data.rowItem.USE_YN
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA060P_01',
                    name: ecount.resource.LBL10783,
                    param: param,
                    popupType: false,
                    additional: false
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Set [Inspection setting] column button (Cài đặt cho nút cài đặt mục giám sát)
    setButtonSettingInspection: function (value, rowItem) {

        var option = {};

        option.controlType = "widget.flow.slide";

        option.data = ecount.resource.LBL10648;

        if (rowItem.INSPECT_ITEM_SETTING == 0)
            option.buttonType = ecount.grid.constValue.buttonType.gray;

        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(1),
                    height: 685,
                    editFlag: 'M',
                    ITEM_CD2: data.rowItem.ITEM_CD2,
                    ITEM_NM: data.rowItem.ITEM_NM,
                    INSPECT_TYPE_CD: data.rowItem.ITEM_CD
                };
                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA060P_05',
                    name: ecount.resource.LBL10648,
                    param: param,
                    popupType: false,
                    additional: false,
                    fpopupID: this.ecPageID
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Set [Item setting] column button (Cài đặt cho nút cài đặt mặt hàng giám sát)
    setButtonSettingItem: function (value, rowItem) {
        var option = {};
        var res = this.resource;

        option.controlType = "widget.flow.slide";
        option.data = ecount.resource.LBL09924;

        if (rowItem.ITEM_SETTING == 0)
            option.buttonType = ecount.grid.constValue.buttonType.gray;
        //option.data = 'Cài đặt mặt hàng';

        option.event = {
            'click': function (e, data) {
                // Define data transfer object
                var param = {
                    width: ecount.infra.getPageWidthFromConfig() + 50,
                    //width: 800,
                    height: 650,
                    editFlag: 'M',
                    INSPECT_TYPE_CD: data.rowItem.ITEM_CD
                };

                // Open popup
                this.openWindow({
                    url: '/ECERP/ESA/ESA063P_02',
                    name: String.format(res.LBL09924),
                    param: param,
                    popupType: false,
                    additional: false,
                    parentPageID: this.pageID,
                    responseID: this.callbackID,
                });

                e.preventDefault();
            }.bind(this)
        };
        return option;
    },

    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["USE_YN"] == "N")
            return true;
        return false;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        // Check user authorization
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var grid = self.contents.getGrid().grid;
        var lsInspectTypeCd = [];
        var searchParam = $.extend({}, self.finalSearchParam, self.header.serialize().result);

        $.each(grid.getCheckedObject(), function (i, item) {
            if (item['ITEM_CD'] != undefined) {
                var data = item['ITEM_CD'] + "-" + item['ITEM_CD2'] + "-" + item['ITEM_NM'] + ecount.delimiter
                lsInspectTypeCd += data;
            }
        });

        if (lsInspectTypeCd.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            btnDelete.setAllowClick();
            return false;
        }

        if (!['W'].contains(self.userPermit)) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        var formData = {
            lsInspectTypeCd: lsInspectTypeCd,
            TYPE: 'INSPECTION_TYPE'
        };

        ecount.confirm(ecount.resource.MSG01561, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/QcInspection/DeleteInspectionType",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            if (result.Data.length > 0 && result.Data[0].IsShowErr == 1) {
                                self.ErrShow(result);
                            }
                            else
                                self.setReload();
                        }
                    },
                    complete: function () {
                        btnDelete.setAllowClick();
                    }
                });
            }
            btnDelete.setAllowClick();
        });
        return true;
    },
    // New button clicked event (Đăng ký mục giám sát)
    onFooterNew: function (cid) {
        var res = this.resource;
        var btn = this.footer.get(0).getControl("New");
        // Check user authorization
        if (!['W', 'U'].contains(this.userPermit)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
        // Define data transfer object
        var param = {};
        //param.width = 756;
        param.width = ecount.infra.getPageWidthFromConfig(1),
        param.height = 197;
        param.editFlag = 'I';

        this.openWindow({
            url: '/ECERP/ESA/ESA060P_01',
            name: ecount.resource.LBL93709,
            param: param,
            popupType: false
        });

        btn.setAllowClick();
    },
    //Reg. Inspection (Đăng ký giám sát)
    onFooterRegInspection: function (cid) {

        // Define data transfer object
        var param = {
            width: 900,
            height: 600,
        };
        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA060P_03',
            name: ecount.resource.LBL10909,
            param: param,
            popupType: false,
            additional: false,
            fpopupID: this.ecPageID,
            parentPageID: this.pageID,
            responseID: this.callbackID,
        });
    },


    //Reg. Inspection (Đăng ký giám sát)
    onFooterRegInspectionByItem: function (cid) {

        // Define data transfer object
        var param = {
            width: 900,
            height: 600,
        };
        // Open popup
        this.openWindow({
            url: '/ECERP/ESA/ESA063M',
            name: ecount.resource.LBL03696,
            param: param,
            popupType: false,
            additional: false,
            parentPageID: this.pageID,
            responseID: this.callbackID,
        });
    },

    ErrShow: function (result) {
        var res = ecount.resource;
        var strJSON = [];
        var msg1 = [res.MSG02237];
        var msg2 = [res.MSG10104];
        $.each(result.Data, function (i, value) {
            if (result.Data[i].IsShowErr == 1)// Exists error show message
            {
                //msg.push(res.LBL00141);
                if (result.Data[i].ERRFLAG == "2") {
                    strJSON.push({
                        IO_DATE: result.Data[i].InspCodeNoDelete,
                        CUS_NAME: result.Data[i].InspCodeNameNoDelete,
                        MESSAGE: msg1
                    });
                }
                if (result.Data[i].ERRFLAG == "1") {
                    strJSON.push({
                        IO_DATE: result.Data[i].InspCodeNoDelete,
                        CUS_NAME: result.Data[i].InspCodeNameNoDelete,
                        MESSAGE: msg2
                    });
                }
            }
        });
        var formErrMsg = Object.toJSON(strJSON);

        var param = {
            width: 720,
            height: 500,
            datas: formErrMsg,
            checkType: "TypeCode"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeCommonDeletable",
            name: 'SendingEC',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    // Close button clicked event
    onFooterClose: function () {
        this.close();
    },
    /****************************************************************************************************
    *  define hotkey event listener    
    ****************************************************************************************************/
    // F2
    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },
    // F8
    ON_KEY_F8: function (e, target) {
        //this.resetParam();
        //this.setReload();
        this.onHeaderSearch(false);
    },
    // ENTER
    ON_KEY_ENTER: function (e, target) {
        //this.header.getControl("search").setFocus(0);
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // Reload grid
    setReload: function () {
        
        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
        this.finalSearchParam = $.extend({}, this.finalSearchParam, this.header.serialize().result);

        // Set param USE_YN
        if (this.finalSearchParam.USE_YN.indexOf(ecount.delimiter) > -1)
            this.finalSearchParam.USE_YN = '';

        // Set param BASE_DATE_CHK
        this.finalSearchParam.BASE_DATE_CHK = this.finalSearchParam.cbEtcVal.length > 0 ? this.finalSearchParam.cbEtcVal[0] : ''

        // Set param PROD_CATEGORY
        if (this.finalSearchParam.PROD_CATEGORY.split(ecount.delimiter).length >= this.header.getControl("rbProdChk", "all").getComponentSize() - 1)
            this.finalSearchParam.PROD_CATEGORY = "";

        var _gridObj = this.contents.getGrid();
        if (_gridObj) {
            _gridObj.grid.clearChecked();
            _gridObj.draw(this.finalSearchParam);
        }
        this.header.getQuickSearchControl().hideError();
    },
    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }
        this.setReload();
    },
    resetParam: function () {
        this.contents.getGrid().getSettings().setPagingCurrentPage(1);
        this.searchFormParameter.PARAM = '';
        this.header.getQuickSearchControl().setValue(this.searchFormParameter.PARAM);
        this.searchFormParameter.PAGE_SIZE = 100;
        this.searchFormParameter.PAGE_CURRENT = 1;
    },
    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnInspectionType(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnInspectionType(this.getSelectedListforActivate("N"));
    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            debugger
            updatedList.Data.push({
                USE_YN: cancelYN,
                INSPECT_TYPE_CD: data.ITEM_CD,
                TYPE: "UPDATE_USEYN_TYPE"
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnInspectionType: function (updatedList) {

        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL10901, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnDelete.setAllowClick();
            return false;
        }
        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00722);
            btn.setAllowClick();
            return;
        }
        debugger
        ecount.common.api({
            url: "/Inventory/QcInspection/UpdateListInspectionItem",
            data: Object.toJSON(updatedList),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);
                }
            }.bind(this),
            complete: function (e) {
                btnDelete.setAllowClick();
            }
        });
    },

    //reloadPage
    reloadPage: function () {

        this.finalSearchParam.PARAM = this.header.getQuickSearchControl().getValue();
        this.finalSearchParam = $.extend({}, this.finalSearchParam, this.header.serialize().result);

        // Set param USE_YN
        if (this.finalSearchParam.USE_YN.indexOf(ecount.delimiter) > -1)
            this.finalSearchParam.USE_YN = "";

        if (this.finalSearchParam.USE_YN == "")
            this.finalSearchParam.USE_YN = "A";

        // Set param PROD_CATEGORY
        if (this.finalSearchParam.PROD_CATEGORY.split(ecount.delimiter).length >= this.header.getControl("rbProdChk", "all").getComponentSize() - 1)
            this.finalSearchParam.PROD_CATEGORY = "";

        this.onAllSubmitSelf({
            url: "/ECERP/ESA/ESA060M",
            param: this.finalSearchParam
        });
    },

    //set data USE_YN
    setDataUsed: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(rowItem.USE_YN) ? ecount.resource.LBL08030 : ecount.resource.LBL00243;
        return option;
    }

});
