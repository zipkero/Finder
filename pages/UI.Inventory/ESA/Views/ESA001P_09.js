window.__define_resource && __define_resource("LBL06093","LBL01595","LBL00219","LBL35235","LBL06083","LBL00351","LBL06204","LBL00315","LBL90008","LBL00420","LBL00672","LBL02586","LBL07386","LBL05319","LBL90101","LBL02283","LBL01550","LBL03962","LBL04030","LBL00692","LBL01489","LBL09840","LBL90113","LBL04937","LBL04366","LBL04321","LBL16416","LBL16534","LBL85190","LBL01708","LBL35158","MSG00339","MSG05137","MSG05134","BTN00065","BTN00008","BTN00037","MSG03839","MSG05340","MSG00456","MSG00342","LBL07157","MSG00303","MSG07365","MSG07363","MSG07364","MSG00296","MSG01931","MSG00008","LBL70053","LBL02263","MSG05135","MSG05136","LBL12268","LBL04936","LBL16316","LBL04785");

/*--- ESA001P_09.js ---*/
/****************************************************************************************************
1. Create Date : 2015.09.23
2. Creator     : YoungjunJeon 전영준
3. Description : MultiRegist Moblie/Email Popup(청구서 EMAil 보내기  편집 팝업)
4. Precaution  : 
5. History     : 2016.05.12 이정민 - Email보내기 팝업에서 사용하기 위해 저장시 기존에는 firstRow만 send하던것을 Email보내기에서 편집할때는 모든Row send하도록
                 2017.05.04(Hao) - Add PURCHASE_MAIL
                 2017.08.04(Hao) - Add RELEASESALESORDER_MAIL (Release Sales Order)
                 2019.04.30(이현택) - 3.0 호출로 변경
                 2019.11.07(한재국) - Add DEPOSITSLIP_MAIL
                 2019.11.30(최준영) - 거래처정보관리 관련 수정(EGCARDCOM_FLAG)
                 2020.01.02(강정민) - WMS 입고예정, 출고예정, 입고처리, 출고처리 추가
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA001P_09", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    columns: null,

    gridObject: null, //getGrid

    dataLoad: null,

    state_code: ecount.company.STATE_CODE,

    ectax_flag: ecount.config.nation.USE_E_TAX_INVOICE,

    columns: [],

    err: 0,

    checkMails: ['TAX_MAIL', 'ETAX_MAIL', 'CUST_MAIL', 'CUST_MAIL1', 'STATE_MAIL', 'PACKING_MAIL', 'EST_MAIL', 'DEM_MAIL', 'ORD_MAIL', 'PRICEREQ_MAIL', 'REPAIR_MAIL', 'CONT_MAIL', 'INTERNAL_USE_MAIL', 'GOODSISSUE_MAIL', 'SHIPPING_ORDER_MAIL', 'SHIP_MAIL', 'PURCHASE_MAIL', 'JOB_ORDER_MAIL', 'QUALITY_INSPECTION_MAIL', 'RELEASESALESORDER_MAIL', 'GOODS_RECEIPT_MAIL', 'DEPOSITSLIP_MAIL', 'REPAIR2_MAIL', 'SCHEDULEDRECEIPT_MAIL', 'SCHEDULEDRELEASE_MAIL'],

    isClickedAddColumns: false,

    isChanged: false, 

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            DOC_GUBUN: this.DOC_GUBUN,
            CUST: this.CUST
        };
        this.initProperties();

        if (this.state_code == null) {
            this.state_code = "KR"
        }
    },

    initProperties: function () {
        if ($.isEmpty(this.CUST) && $.isEmpty(this.viewBag.InitDatas.ListLoad)) {
            this.dataLoad = [{
                UNAME: '',
                EMAIL: '',
                HP_NO: '',
                TAX_MAIL: 'T',
                ETAX_MAIL: 'T',
                CUST_MAIL: 'T',
                CUST_MAIL1: 'T',
                STATE_MAIL: 'T',
                PACKING_MAIL: 'T',
                EST_MAIL: 'T',
                DEM_MAIL: 'T',
                ORD_MAIL: 'T',
                PRICEREQ_MAIL: 'T',
                REPAIR_MAIL: 'T',
                CONT_MAIL: 'T',
                INTERNAL_USE_MAIL: 'T',
                GOODSISSUE_MAIL: 'T',
                SHIPPING_ORDER_MAIL: 'T',
                SHIP_MAIL: 'T',
                PURCHASE_MAIL: 'T',
                JOB_ORDER_MAIL: 'T',
                QUALITY_INSPECTION_MAIL: 'T',
                RELEASESALESORDER_MAIL: 'T',
                GOODS_RECEIPT_MAIL: 'T',
                DEPOSITSLIP_MAIL: 'T',
                REPAIR2_MAIL: 'T',
                SCHEDULEDRECEIPT_MAIL: 'T',
                SCHEDULEDRELEASE_MAIL: 'T',
            }];
        }
        else {
            this.dataLoad = this.viewBag.InitDatas.ListLoad;

        }
    },

    render: function () {
        this._super.render.apply(this);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //onInitHeader(헤더 옵션 설정)
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();
        header.setTitle(resource.LBL06093)
    },
    //onInitContents(본문 옵션 설정)
    onInitContents: function (contents, resource) {

        var generator = widget.generator,
            toolbar = generator.toolbar(),
            toolbarEdit = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid(),
            settingPanel = widget.generator.settingPanel();

        this.columns.push({ propertyName: 'UNAME', id: 'UNAME', title: ecount.resource.LBL01595, controlType: 'widget.input', width: 150, validation: this.CheckSpecialCharacterEtc.bind(this) })
        this.columns.push({ propertyName: 'EMAIL', id: 'EMAIL', title: ecount.resource.LBL00219, controlType: 'widget.input', width: 150, controlOption: { maxLength: 100 }, validation: this.CheckSpecialCharacterForCode.bind(this) });
        this.columns.push({ propertyName: 'HP_NO', id: 'HP_NO', title: ecount.resource.LBL35235, controlType: 'widget.input.numberOnlyAndSign', width: 150, controlOption: { maxLength: 50 }, validation: this.CheckSpecialCharacterForCode.bind(this) });
        this.columns.push({ propertyName: 'TAX_MAIL', id: '44', isHideColumn: true, title: ecount.resource.LBL06083, width: 120, controlType: 'widget.select', editableState: 1 });
        if (this.ectax_flag) {// 리소스만 변경해서 사용
            this.columns.push({ propertyName: 'ETAX_MAIL', id: '45', isHideColumn: true, title: this.getTaxResource(), width: 120, controlType: 'widget.select', editableState: 1 });                        //Electronic (Tax) Invoice(전자(세금)계산서) 45
        }
        this.columns.push({ propertyName: 'CUST_MAIL', id: '88', isHideColumn: true, title: ecount.resource.LBL00351, width: 120, controlType: 'widget.select', editableState: 1 });                           //CUST_MAIL(거래처관리대장1) 88
        this.columns.push({ propertyName: 'CUST_MAIL1', id: '89', isHideColumn: true, title: ecount.resource.LBL06204, width: 120, controlType: 'widget.select', editableState: 1 });                          //CUST_MAIL1(거래처관리대장II) 89
        this.columns.push({ propertyName: 'STATE_MAIL', id: '66', isHideColumn: true, title: ecount.resource.LBL00315, width: 120, controlType: 'widget.select', editableState: 1 });                          //STATE_MAIL(거래명세서) 66
        this.columns.push({ propertyName: 'PACKING_MAIL', id: '46', isHideColumn: true, title: ecount.resource.LBL90008, width: 120, controlType: 'widget.select', editableState: 1 });                        //Invoice / Packing List 46
        this.columns.push({ propertyName: 'EST_MAIL', id: '22', isHideColumn: true, title: ecount.resource.LBL00420, width: 120, controlType: 'widget.select', editableState: 1 });                            //EST_MAIL(견적서) 22
        this.columns.push({ propertyName: 'DEM_MAIL', id: '33', isHideColumn: true, title: ecount.resource.LBL00672, width: 120, controlType: 'widget.select', editableState: 1 });                            //DEM_MAIL(발주서) 33
        this.columns.push({ propertyName: 'ORD_MAIL', id: '23', isHideColumn: true, title: ecount.resource.LBL02586, width: 120, controlType: 'widget.select', editableState: 1 });                            //ORD_MAIL(주문서) 23
        this.columns.push({ propertyName: 'PRICEREQ_MAIL', id: '24', isHideColumn: true, title: ecount.resource.LBL07386, width: 120, controlType: 'widget.select', editableState: 1 });                       //PRICEREQ_MAIL(단가요청서) 24
        this.columns.push({ propertyName: 'REPAIR_MAIL', id: '92', isHideColumn: true, title: ecount.resource.LBL05319, width: 120, controlType: 'widget.select', editableState: 1 });                        //REPAIR_MAIL(A/S접수) 92
        this.columns.push({ propertyName: 'CONT_MAIL', id: '48', isHideColumn: true, title: ecount.resource.LBL90101, width: 120, controlType: 'widget.select', editableState: 1 });                           //CUST_MAIL(거래처관리대장1) 48
        this.columns.push({ propertyName: 'INTERNAL_USE_MAIL', id: '70', isHideColumn: true, title: ecount.resource.LBL02283, width: 120, controlType: 'widget.select', editableState: 1 }); //INTERNAL_USE_MAIL 70
        this.columns.push({ propertyName: 'GOODSISSUE_MAIL', id: '36', isHideColumn: true, title: ecount.resource.LBL01550, width: 120, controlType: 'widget.select', editableState: 1 });
        this.columns.push({ propertyName: 'SHIPPING_ORDER_MAIL', id: '26', isHideColumn: true, title: ecount.resource.LBL03962, width: 120, controlType: 'widget.select', editableState: 1 });                  //SHIPPING ORDER 26
        this.columns.push({ propertyName: 'SHIP_MAIL', id: '27', isHideColumn: true, title: ecount.resource.LBL04030, width: 120, controlType: 'widget.select', editableState: 1 });                           //SHIP_MAIL 27
        this.columns.push({ propertyName: 'PURCHASE_MAIL', id: '34', isHideColumn: true, title: ecount.resource.LBL00692, width: 120, controlType: 'widget.select', editableState: 1 }); //Purchase
        this.columns.push({ propertyName: 'JOB_ORDER_MAIL', id: '35', isHideColumn: true, title: ecount.resource.LBL01489, width: 120, controlType: 'widget.select', editableState: 1 }); //Job Order
        this.columns.push({ propertyName: 'QUALITY_INSPECTION_MAIL', id: '72', isHideColumn: true, title: ecount.resource.LBL09840, width: 120, controlType: 'widget.select', editableState: 1 }); //Quality Insp.
        this.columns.push({ propertyName: 'RELEASESALESORDER_MAIL', id: '28', isHideColumn: true, title: ecount.resource.LBL90113, width: 120, controlType: 'widget.select', editableState: 1 }); //Quality Insp.
        this.columns.push({ propertyName: 'GOODS_RECEIPT_MAIL', id: '37', isHideColumn: true, title: ecount.resource.LBL04937, width: 120, controlType: 'widget.select', editableState: 1 }); //Goods Receipt
        this.columns.push({ propertyName: 'DEPOSITSLIP_MAIL', id: '29', isHideColumn: true, title: ecount.resource.LBL04366, width: 120, controlType: 'widget.select', editableState: 1 }); // DEPOSITSLIP_MAIL(입금표) 29
        this.columns.push({ propertyName: 'REPAIR2_MAIL', id: '73', isHideColumn: true, title: ecount.resource.LBL04321, width: 120, controlType: 'widget.select', editableState: 1 }); // A/S수리증

        this.columns.push({ propertyName: 'SCHEDULEDRECEIPT_MAIL', id: '82', isHideColumn: true, title: ecount.resource.LBL16416, width: 120, controlType: 'widget.select', editableState: 1 }); // 입고예정
        this.columns.push({ propertyName: 'SCHEDULEDRELEASE_MAIL', id: '83', isHideColumn: true, title: ecount.resource.LBL16534, width: 120, controlType: 'widget.select', editableState: 1 }); // 출고예정
        


        settings
            .setEditRowDataSample({ ISCHANGE: 'N' })
            .setCheckBoxUse(true)
            .setRowData(this.dataLoad)
            .setRowDataParameter(this.searchFormParameter)
            .setRowDataUrl('/Common/Infra/GetListForEmailEdit') //Common.Infra
            .setColumns(this.columns)
            .setEditable(true, 3, 3)
            .setEventAutoAddRowOnLastRow(true, 3)
            .setCustomRowCell(ecount.grid.constValue.checkBoxPropertyName, function (value, rowItem) {
                var option = {};
                if (rowItem[ecount.grid.constValue.keyColumnPropertyName] == "0") {
                    option.attrs = {
                        'disabled': true
                    }
                }
                return option;
            })
            .setCustomRowCell('UNAME', this.setIsChangeProperty.bind(this))
            .setCustomRowCell('EMAIL', this.setIsChangeProperty.bind(this))
            .setCustomRowCell('HP_NO', this.setIsChangeProperty.bind(this))

        for (var i = 3, len = this.columns.length; i < len; i++) {

            settings.setCustomRowCell(this.columns[i].id, function (value, rowItem) {

                var option = {};
                var selectOption = new Array();

                selectOption.push(['N', ecount.resource.LBL85190]); // NoUse(사용안함)
                selectOption.push(['T', ecount.resource.LBL01708]); // Default(기본) 수신
                selectOption.push(['C', ecount.resource.LBL35158]); // Use(사용) 참조

                option.optionData = selectOption;
                option.data = value;
                option.event = {
                    'change': function (e, data) {
                        //1.  해당 로우에 수신이나 참조가 있는데 이메일이 없으면 이메일에 밸리데이션
                        //1.  validate a case when there is a column set to "use" or "default" but no email exist, triggered 

                        //2.  해당 로우에서 해당 칼럼이 기본으로 바뀌었는데 같은 칼럼에 (기본)이 있으면 그 칼럼은 "해당없음" 으로 변경  
                        //2.  action when "Default" set to one of any relevant column, previous is set to "Nouse" 

                        // 컨트롤 변경때 해당 로우에 이메일이 없는경우 체크
                        if (data.newValue != 'N' && data.rowItem.EMAIL == "") {
                            var option = {};
                            option.message = ecount.resource.MSG00339; //  Enter an [Email Address]. (수신자 이메일을 입력바랍니다.)
                            this.gridObject.setCellShowError("EMAIL", data.rowKey, option);
                            this.gridObject.setCell(data.columnId, data.rowIdx, data.oldValue, { isRunChange: false })
                            this.gridObject.setCellFocus(data.columnId, data.rowIdx);
                            return false;
                        }
                        // 변경된 값이  NoUse(사용안함) OR Use(사용) 일때 해당 칼럼에서 Default(기본) 으로 설정된 컨트롤이  있는지 판단 하는 로직
                        if (data.newValue == 'N' || data.newValue == 'C') {

                            var arrGridData = this.gridObject.getRowList(),
                                include = 0;
                            $.each(arrGridData, function (i, item) {
                                if (item[data.columnProperty] == 'T') {
                                    include++;
                                }
                            }.bind(this));
                            if (include == 0) {
                                var colume = data.columnInfo.propertyName === "TAX_MAIL" ? ecount.resource.LBL06083 : data.columnInfo.title;
                                ecount.alert(String.format(ecount.resource.MSG05137, data.columnInfo.title), function () { // {0}에 수신 Email이 설정되지 않았습니다. 
                                    this.gridObject.setCell(data.columnId, data.rowIdx, data.oldValue, { isRunChange: false });
                                    this.gridObject.setCellFocus(data.columnId, data.rowIdx);
                                    if (data.rowItem.EMAIL == "") {
                                        var option = {};
                                        option.message = ecount.resource.MSG00339; //  Enter an [Email Address]. (수신자 이메일을 입력바랍니다.)
                                        this.gridObject.setCellShowError("EMAIL", data.rowKey, option);
                                    }
                                }.bind(this));
                                return false;
                            }
                        }
                        // 변경된 값이 Default(기본) 일때 기존의 기본 값을  NoUse(사용안함) 으로 변경 하는 로직
                        if (data.newValue == 'T') {
                            var arrGridData = this.gridObject.getRowList();
                            $.each(arrGridData, function (i, item) {
                                if (item[data.columnProperty] == 'T' && item[ecount.grid.constValue.keyColumnPropertyName] !== data.rowKey)
                                    this.gridObject.setCell(data.columnId, item[ecount.grid.constValue.keyColumnPropertyName], 'N');
                            }.bind(this));
                        }
                        this.isChanged = true;


                        this.gridObject.setCellFocus(data.columnId, data.rowIdx);
                        this.gridObject.setCell('ISCHANGE', data.rowKey, 'Y');
                    }.bind(this)
                }
                return option;
            }.bind(this))
        }
        //Toolbar(툴바)
        toolbar.setId("AddColumns")
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.label", "Info", "Info").label("<span class=\"wrapper-sub-title\">" + ecount.resource.MSG05134 + "</span>").useHTML())
            ;
        //settingPanel.header(ecount.resource.MSG05134)
        if (this.DOC_GUBUN !== "ALL")
            toolbar.addRight(ctrl.define("widget.button", "AddColumns").label("+"))

        settingPanel.setId("settingPanel");

        contents.add(settingPanel)
            .add(toolbar)
            .addGrid("dataGrid", settings)
    },
    //onInitFooter(풋터 옵션 설정)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar();
        ctrl = widget.generator.control();

        toolbar
            .addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065).clickOnce())
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
            .addLeft(ctrl.define("widget.button", "DeleteMulti").label(ecount.resource.BTN00037).clickOnce())
            .addLeft(ctrl.define("widget.button", "History").label("H"));

        footer.add(toolbar);
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    //onLoadComplete(페이지 완료 이벤트)
    onLoadComplete: function () {

        if (!$.isNull(this.keyword)) {
            this.contents.getControl('search').setValue(this.keyword);
        }
        var grid = this.contents.getGrid('dataGrid');
        grid.getSettings().setHeaderTopMargin(this.header.height());

        var gridEditable = this.contents.getGrid("dataGrid").grid;
        for (var i = 3, len = this.columns.length; i < len; i++) {
            //if (this.DOC_GUBUN == "ALL")
            //    this.gridObject.setColumnVisibility(this.columns[i].id, true);
            //else {

            if (this.isClickedAddColumns || this.DOC_GUBUN == "ALL") {
                gridEditable.setColumnVisibility(this.columns[i].id, true);
            }
            else if (this.DOC_GUBUN != "ALL") {
                if (this.searchFormParameter.DOC_GUBUN == this.columns[i].id) {
                    gridEditable.setColumnVisibility(this.columns[i].id, true);
                }
            }
        }
        gridEditable.setCellFocus('UNAME', 0);
    },
    //onGridLoadComplete: function() {
    //    for (var i = 3, len = this.columns.length; i < len; i++) {
    //        //if (this.DOC_GUBUN == "ALL")
    //        //    this.gridObject.setColumnVisibility(this.columns[i].id, true);
    //        //else {
    //        if (this.isClickedAddColumns) {
    //            gridEditable.setColumnVisibility(this.columns[i].id, true);
    //        }
    //        else if (this.searchFormParameter.DOC_GUBUN != "ALL") {
    //            if (this.searchFormParameter.DOC_GUBUN == this.columns[i].id) {
    //                gridEditable.setColumnVisibility(this.columns[i].id, true);
    //            }
    //        }
    //    }
    //},
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    //setItemCountMessage(체크박스 체크갯수 제한)
    setItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG03839, count));
    },
    //setGridDateLink(grid row의 특정 date관련) 
    setGridDateLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var message = {
                    name: "CODE_DES",
                    code: "CODE_NO",
                    data: data.rowItem,
                    isAdded: this.isCheckBoxDisplayFlag,
                    addPosition: "current",
                    callback: this.close.bind(this)
                };
                this.sendMessage(this, message);
            }.bind(this)
        };
        return option;
    },
    //onGridRenderComplete(검색값이 한건일경우 자동으로 입력되도록)
    onGridRenderComplete: function (e, data, gridObj) {
        this.gridObject = this.contents.getGrid().grid;
        var cnt = this.isOthersDataFlag != "N" ? 2 : 1;
        if (data.dataCount === cnt && this.contents.getGrid().settings.getPagingCurrentPage() === 1) {
            var obj = {};
            var rowItem = data.dataRows[0];

            var message = {
                name: "CODE_DES",
                code: "CODE_NO",
                data: rowItem,
                isAdded: this.isCheckBoxDisplayFlag,
                addPosition: "current",
                callback: this.close.bind(this)
            };
            this.sendMessage(this, message);
        } else {
            ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
        }
    },
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //onBeforeEventHandler(버튼 이벤트 클릭전 호출)
    onBeforeEventHandler: function (e) {
        this._super.onBeforeEventHandler.apply(this, arguments);    //Check Permission(권한 체크)
        return true;
    },

    onContentsAddColumns: function (event) {
        var width = 0;
        var windowSize = this.getWindowSize();
        this.isClickedAddColumns = true;

        for (var i = 1, len = this.columns.length; i < len; i++) {
            this.gridObject.setColumnVisibility(this.columns[i].id, true);
            width += this.columns[i].width;
        }
        this.contents.getControl("AddColumns").hide();
        this.resizeLayer(Math.min(width, windowSize.screenWidth));
    },
    //
    setIsChangeProperty: function () {

        var option = {};
        option.event = {
            'keydown': function (e, data) {

                var target = data.newValue.trim();

                if (ecount.common.ValidCheckSpecial(target).result == false) {
                    var option = {};
                    //option.message = "특수문자를 입력할수 없습니다."
                    option.message = ecount.resource.MSG05340;
                    option.showDirect = true;
                    this.gridObject.setCellShowError(data.columnId, data.rowKey, option);
                    this.gridObject.setCellFocus(data.columnId, data.rowKey);

                } else {
                    var validateResult = this.gridObject.getCellValidateResult(data.columnId, data.rowKey, "custom");
                    if (validateResult != null)
                        this.gridObject.removeValidate(data.columnId, data.rowKey);
                }
                this.gridObject.setCell('ISCHANGE', data.rowKey, 'Y');

            }.bind(this)
        }
        return option;
    },
    //onFooterSave(저장)
    onFooterSave: function () {

        var self = this;

        //Permission check
        var UserPermit = this.viewBag.Permission.Permit.Value;
        if (UserPermit == "R") {
            ecount.alert(ecount.resource.MSG00456);//"읽기 권한자는 사용할 수 없는 기능입니다.!!!");
            this.footer.getControl('Save').setAllowClick();
            return false;
        }
        else if (["U", "X"].contains(UserPermit)) {
            ecount.alert(ecount.resource.MSG00342);//"수정 권한이 없습니다.!!!");
            this.footer.getControl('Save').setAllowClick();
            return false;
        }

        //  ∬
        //Default Validation Check
        if (!this.gridObject.validate().result) {
            this.footer.getControl('Save').setAllowClick();
            return false;
        }

        this.dataValidation(function () {

            var gridFilteringData = this.gridObject.getRowList().where(function (entity, i) {

                return entity.ISCHANGE == 'Y' &&
                    (!$.isEmpty(entity.SER_NO) ||  //Modify(수정인경우)
                        //($.isEmpty(entity.SER_NO) && !$.isEmpty(entity.UNAME) || !$.isEmpty(entity.TEL_NO) || !$.isEmpty(entity.EMAIL) || !$.isEmpty(entity.HP_NO)) //New(신규인경우)
                        ($.isEmpty(entity.SER_NO) && !$.isEmpty(entity.UNAME) || !$.isEmpty(entity.EMAIL) || !$.isEmpty(entity.HP_NO)) //New(신규인경우)
                    );
            });

            var param = [];

            $.each(gridFilteringData, function (i, item) {
                var arraySaveData = {
                    IDX : i,
                    DOC_GUBUN: this.searchFormParameter.DOC_GUBUN,
                    MAIN_GUBUN: item[ecount.grid.constValue.keyColumnPropertyName] === "0" ? 'Y' : '',
                    CUST: this.searchFormParameter.CUST || '',
                    SER_NO: (item.SER_NO) ? item.SER_NO : 0,
                    UNAME: item.UNAME,
                    EMAIL: item.EMAIL,
                    HP_NO: item.HP_NO,
                    SEND_COMMNET: item.SEND_COMMNET && item.SEND_COMMNET,
                    WDATE: "",// Dac에서 Init 해주고 있음
                    WID: this.dataLoad.length != 0 ? this.dataLoad[0].WID : null,
                    DOC_LIST: (function (_item) {
                        var docGubunList = '';
                        if (_item.TAX_MAIL != 'N')
                            docGubunList += '44' + ecount.delimiter

                        if (this.ectax_flag) {
                            if (_item.ETAX_MAIL != 'N')
                                docGubunList += '45' + ecount.delimiter
                        }
                        if (_item.CUST_MAIL != 'N')
                            docGubunList += '88' + ecount.delimiter
                        if (_item.CUST_MAIL1 != 'N')
                            docGubunList += '89' + ecount.delimiter
                        if (_item.STATE_MAIL != 'N')
                            docGubunList += '66' + ecount.delimiter
                        if (_item.PACKING_MAIL != 'N')
                            docGubunList += '46' + ecount.delimiter
                        if (_item.EST_MAIL != 'N')
                            docGubunList += '22' + ecount.delimiter
                        if (_item.DEM_MAIL != 'N')
                            docGubunList += '33' + ecount.delimiter
                        if (_item.ORD_MAIL != 'N')
                            docGubunList += '23' + ecount.delimiter
                        if (_item.PRICEREQ_MAIL != 'N')
                            docGubunList += '24' + ecount.delimiter
                        if (_item.REPAIR_MAIL != 'N')
                            docGubunList += '92' + ecount.delimiter
                        if (_item.CONT_MAIL != 'N')
                            docGubunList += '48' + ecount.delimiter
                        if (_item.INTERNAL_USE_MAIL != 'N')
                            docGubunList += '70' + ecount.delimiter
                        if (_item.GOODSISSUE_MAIL != 'N')
                            docGubunList += '36' + ecount.delimiter
                        if (_item.SHIPPING_ORDER_MAIL != 'N')
                            docGubunList += '26' + ecount.delimiter
                        if (_item.SHIP_MAIL != 'N')
                            docGubunList += '27' + ecount.delimiter
                        if (_item.PURCHASE_MAIL != 'N')
                            docGubunList += '34' + ecount.delimiter
                        if (_item.JOB_ORDER_MAIL != 'N')
                            docGubunList += '35' + ecount.delimiter
                        if (_item.QUALITY_INSPECTION_MAIL != 'N')
                            docGubunList += '72' + ecount.delimiter
                        if (_item.RELEASESALESORDER_MAIL != 'N')
                            docGubunList += '28' + ecount.delimiter
                        if (_item.GOODS_RECEIPT_MAIL != 'N')
                            docGubunList += '37' + ecount.delimiter
                        if (_item.DEPOSITSLIP_MAIL != 'N')
                            docGubunList += '29' + ecount.delimiter
                        if (_item.REPAIR2_MAIL != 'N')
                            docGubunList += '73' + ecount.delimiter

                        if (_item.SCHEDULEDRECEIPT_MAIL != 'N')
                            docGubunList += '82' + ecount.delimiter
                        if (_item.SCHEDULEDRELEASE_MAIL != 'N')
                            docGubunList += '83' + ecount.delimiter


                        docGubunList = docGubunList.substring(0, docGubunList.length - 1);
                        return docGubunList;
                    }.bind(this))(item),
                    APP_LIST: (function (_item) {
                        var headYnList = '';
                        if (_item.TAX_MAIL != 'N')
                            headYnList += _item.TAX_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter

                        if (this.ectax_flag) {
                            if (_item.ETAX_MAIL != 'N')
                                headYnList += _item.ETAX_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        }
                        if (_item.CUST_MAIL != 'N')
                            headYnList += _item.CUST_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.CUST_MAIL1 != 'N')
                            headYnList += _item.CUST_MAIL1 == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.STATE_MAIL != 'N')
                            headYnList += _item.STATE_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.PACKING_MAIL != 'N')
                            headYnList += _item.PACKING_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.EST_MAIL != 'N')
                            headYnList += _item.EST_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.DEM_MAIL != 'N')
                            headYnList += _item.DEM_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.ORD_MAIL != 'N')
                            headYnList += _item.ORD_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.PRICEREQ_MAIL != 'N')
                            headYnList += _item.PRICEREQ_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.REPAIR_MAIL != 'N')
                            headYnList += _item.REPAIR_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.CONT_MAIL != 'N')
                            headYnList += _item.CONT_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.INTERNAL_USE_MAIL != 'N')
                            headYnList += _item.INTERNAL_USE_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.GOODSISSUE_MAIL != 'N')
                            headYnList += _item.GOODSISSUE_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.SHIPPING_ORDER_MAIL != 'N')
                            headYnList += _item.SHIPPING_ORDER_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.SHIP_MAIL != 'N')
                            headYnList += _item.SHIP_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.PURCHASE_MAIL != 'N')
                            headYnList += _item.PURCHASE_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.JOB_ORDER_MAIL != 'N')
                            headYnList += _item.JOB_ORDER_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.QUALITY_INSPECTION_MAIL != 'N')
                            headYnList += _item.QUALITY_INSPECTION_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.RELEASESALESORDER_MAIL != 'N')
                            headYnList += _item.RELEASESALESORDER_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.GOODS_RECEIPT_MAIL != 'N')
                            headYnList += _item.GOODS_RECEIPT_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.DEPOSITSLIP_MAIL != 'N')
                            headYnList += _item.DEPOSITSLIP_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.REPAIR2_MAIL != 'N')
                            headYnList += _item.REPAIR2_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter

                        if (_item.SCHEDULEDRECEIPT_MAIL != 'N')
                            headYnList += _item.SCHEDULEDRECEIPT_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter
                        if (_item.SCHEDULEDRELEASE_MAIL != 'N')
                            headYnList += _item.SCHEDULEDRELEASE_MAIL == 'T' ? 'Y' + ecount.delimiter : 'N' + ecount.delimiter


                        headYnList = headYnList.substring(0, headYnList.length - 1);
                        return headYnList;
                    }.bind(this))(item)
                };
                if (this.EGCARDCOM_FLAG == 'Y') {
                    arraySaveData.EGCARDCOM_CUST_IDX = this.EGCARDCOM_CUST_IDX; // 실제 잠재거래처 CUST_IDX 넘김
                }
                param.push({ Data: arraySaveData });
            }.bind(this))

            ecount.common.api({
                url: '/SVC/Common/Infra/SaveMailInfoEdit', //Common.Infra
                data: Object.toJSON(Request = { Data: param }),
                success: function (result) {
                    this.footer.getControl('Save').setAllowClick();
                    var docGubun = this.DOC_GUBUN;
                    var custCode = this.CUST;
                    var _firstData = this.gridObject.getRowList().first();
                    var message;

                    //Email보내기에서 편집할시 모든row send
                    if (this.controlID == "custMailEdit") {
                        var tempArray = new Array();

                        $.each(this.gridObject.getRowList(), function () {
                            var sendType = "N";

                            if ($.isEmpty(this.EMAIL) == false) {
                                if (docGubun == "66") { //거래명세서
                                    sendType = this.STATE_MAIL;
                                } else if (docGubun == "44") { //세금계산서
                                    sendType = this.TAX_MAIL;
                                } else if (docGubun == "45") { //전자세금계산서
                                    sendType = this.ETAX_MAIL;
                                } else if (docGubun == "88") { //거래처관리대장1
                                    sendType = this.CUST_MAIL;
                                } else if (docGubun == "89") { //거래처관리대장II
                                    sendType = this.CUST_MAIL1;
                                } else if (docGubun == "22") { //견적서
                                    sendType = this.EST_MAIL;
                                } else if (docGubun == "33") { //발주서
                                    sendType = this.DEM_MAIL;
                                } else if (docGubun == "23") { //주문서
                                    sendType = this.ORD_MAIL;
                                } else if (docGubun == "24") { //단가요청서
                                    sendType = this.PRICEREQ_MAIL;
                                } else if (docGubun == "46") { //Invoice / Packing List
                                    sendType = this.PACKING_MAIL;
                                } else if (docGubun == "92") { //A/S접수
                                    sendType = this.REPAIR_MAIL;
                                } else if (docGubun == "26") { //A/S접수
                                    sendType = this.SHIPPING_ORDER_MAIL;
                                }
                                else if (docGubun == "48") {
                                    sendType = this.CONT_MAIL;
                                } else if (docGubun == "36") {
                                    sendType = this.GOODSISSUE_MAIL;
                                }
                                else if (docGubun == "70") {
                                    sendType = this.INTERNAL_USE_MAIL;
                                }
                                else if (docGubun == "27") {
                                    sendType = this.SHIP_MAIL;
                                }
                                else if (docGubun == "34") { // Purchase
                                    sendType = this.PURCHASE_EMAIL;
                                }
                                else if (docGubun == "35") {
                                    sendType = this.JOB_ORDER_MAIL;
                                }
                                else if (docGubun == "72") {
                                    sendType = this.QUALITY_INSPECTION_MAIL;
                                }
                                else if (docGubun == "28") {
                                    sendType = this.RELEASESALESORDER_MAIL;
                                }
                                else if (docGubun == "37") {
                                    sendType = this.GOODS_RECEIPT_MAIL;
                                }
                                else if (docGubun == "29") {
                                    sendType = this.DEPOSITSLIP_MAIL;
                                }
                                else if (docGubun == "73") { //A/S수리증
                                    sendType = this.REPAIR2_MAIL;
                                }
                                else if (docGubun == "82") { //입고예정
                                    sendType = this.SCHEDULEDRECEIPT_MAIL;
                                }
                                else if (docGubun == "83") { //출고예정
                                    sendType = this.SCHEDULEDRELEASE_MAIL;
                                }


                                if (sendType == "T" || sendType == "C") { //수신or참조 데이터만 전송
                                    tempArray.push({
                                        CUST: custCode,
                                        UNAME: this.UNAME,
                                        EMAIL: this.EMAIL,
                                        HP_NO: this.HP_NO,
                                        SER_NO: $.isEmpty(this.SER_NO) ? "0" : this.SER_NO,
                                        SEND_TYPE: sendType // 수신or참조                                                                            
                                    });
                                }
                            }
                        });

                        //수신 -> 참조 순으로 sort
                        var message = tempArray.sort(function (a, b) {
                            if (a.SEND_TYPE == "T") {
                                return -1;
                            } else if (b.SEND_TYPE == "T") {
                                return 1;
                            } else {
                                return 0;
                            }
                        });
                    } else { //거래처등록에서 팝업띄울시 한건만 send                        
                        message = {
                            EMAIL: _firstData.EMAIL,
                            HP_NO: _firstData.HP_NO,
                            callback: this.close.bind(this)
                        };
                    }

                    this.sendMessage(this, message);
                    this.close();
                }.bind(this)
            })
        }.bind(this));
    },
    //onFooterClose(닫기버튼)
    onFooterClose: function () {
        this.close();
        return false;
    },
    //onRefreshFooter하단 버튼 갱신)
    onRefreshFooter: function () {

    },
    //onFooterHistory(히스토리)
    onFooterHistory: function (e) {
        var wdate = this.lastEditTime,
            wid = this.lastEditId;
        var param = {
            HISTORY_TYPE: 'M',
            HISTORY_NO: 0,
            CUST_CD: this.CUST,
            LAST_DATA: $.isEmpty(wdate) ? "" : String.format("{0}[{1}]", ecount.infra.getECDateFormat('date11', false, wdate.toDatetime()), wid),
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            width: 450,
            height: 250
        };
        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/SVC/EGM/EGM002P_06', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },
    // New button click event
    onFooterDeleteMulti: function (cid) {

        //Permission check
        //this.viewBag.Permission.Permit.Value
        var _self = this;
        var btnDeleteMulti = this.footer.get(0).getControl("DeleteMulti"),
            delItem = this.contents.getGrid().grid.getChecked(),
            uniqueItems = new Array(),
            rawItems = new Array(),
            UserPermit = this.viewBag.Permission.Permit.Value;

        if (UserPermit == "R") {
            ecount.alert(ecount.resource.MSG00456);//"읽기 권한자는 사용할 수 없는 기능입니다.!!!");
            btnDeleteMulti.setAllowClick();
            return false;
        }
        else if (["U", "X"].contains(UserPermit)) {
            ecount.alert(ecount.resource.MSG00342);//"수정 권한이 없습니다.!!!");
            btnDeleteMulti.setAllowClick();
            return false;
        }
        if (delItem.length == 0) {
            ecount.alert(ecount.resource.MSG00303);//삭제할 항목을 선택 바랍니다.
            btnDeleteMulti.setAllowClick();
            return false;
        }
        if (this.isChanged) {
            ecount.alert(ecount.resource.MSG07365);//삭제할 항목을 선택 바랍니다.
            btnDeleteMulti.setAllowClick();
            return false;
        }




        ////선택한 데이터 중 수싱항목이 있으면 안된다.
        var validateColumnList = ['TAX_MAIL', 'ETAX_MAIL', 'CUST_MAIL', 'CUST_MAIL1', 'STATE_MAIL', 'STATE_MAIL', 'PACKING_MAIL'
            , 'EST_MAIL', 'DEM_MAIL', 'ORD_MAIL', 'PRICEREQ_MAIL', 'REPAIR_MAIL', 'CONT_MAIL', 'INTERNAL_USE_MAIL'
            , 'GOODSISSUE_MAIL', 'SHIPPING_ORDER_MAIL', 'SHIP_MAIL', 'PURCHASE_MAIL', 'RELEASESALESORDER_MAIL'
            , 'JOB_ORDER_MAIL', 'QUALITY_INSPECTION_MAIL', 'GOODS_RECEIPT_MAIL', 'DEPOSITSLIP_MAIL', 'REPAIR2_MAIL'
            , 'SCHEDULEDRECEIPT_MAIL', 'SCHEDULEDRELEASE_MAIL'];
        var noticeErrorColumn = new Array();

        $.each(delItem, function (i, item) {
            $.each(validateColumnList, function (j, item2) {
                if (item[item2] == 'T') {
                    // 추후 포커스 이동 및 기능 추가 가능성이 있어 컬럼 push는 남겨둔다
                    switch (item2) {
                        case 'TAX_MAIL':
                            noticeErrorColumn.push("44");
                            break;
                        case 'ETAX_MAIL':
                            noticeErrorColumn.push("45");
                            break;
                        case 'CUST_MAIL':
                            noticeErrorColumn.push("88");
                            break;
                        case 'CUST_MAIL1':
                            noticeErrorColumn.push("89");
                            break;
                        case 'STATE_MAIL':
                            noticeErrorColumn.push("66");
                            break;
                        case 'PACKING_MAIL':
                            noticeErrorColumn.push("46");
                            break;
                        case 'EST_MAIL':
                            noticeErrorColumn.push("22");
                            break;
                        case 'DEM_MAIL':
                            noticeErrorColumn.push("33");
                            break;
                        case 'ORD_MAIL':
                            noticeErrorColumn.push("23");
                            break;
                        case 'PRICEREQ_MAIL':
                            noticeErrorColumn.push("24");
                            break;
                        case 'REPAIR_MAIL':
                            noticeErrorColumn.push("92");
                            break;
                        case 'CONT_MAIL':
                            noticeErrorColumn.push("48");
                            break;
                        case 'INTERNAL_USE_MAIL':
                            noticeErrorColumn.push("70");
                            break;
                        case 'GOODSISSUE_MAIL':
                            noticeErrorColumn.push("36");
                            break;
                        case 'SHIPPING_ORDER_MAIL':
                            noticeErrorColumn.push("26");
                            break;
                        case 'SHIP_MAIL':
                            noticeErrorColumn.push("27");
                            break;
                        case 'PURCHASE_MAIL':
                            noticeErrorColumn.push("34");
                            break;
                        case 'RELEASESALESORDER_MAIL':
                            noticeErrorColumn.push("28");
                            break;
                        case 'JOB_ORDER_MAIL':
                            noticeErrorColumn.push("35");
                            break;
                        case 'QUALITY_INSPECTION_MAIL':
                            noticeErrorColumn.push("72");
                            break;
                        case 'GOODS_RECEIPT_MAIL':
                            noticeErrorColumn.push("37");
                            break;
                        case 'DEPOSITSLIP_MAIL':
                            noticeErrorColumn.push("29");
                            break;
                        case 'REPAIR2_MAIL':
                            noticeErrorColumn.push("73");
                            break;

                        case 'SCHEDULEDRECEIPT_MAIL':
                            noticeErrorColumn.push("82");
                            break;
                        case 'SCHEDULEDRELEASE_MAIL':
                            noticeErrorColumn.push("83");
                            break;

                    }
                }
            }.bind(_self));
        }.bind(this));


        if (!$.isEmpty(noticeErrorColumn)) {
            ecount.alert(String.format("{0}\n{1}", ecount.resource.MSG07363, ecount.resource.MSG07364));
            btnDeleteMulti.setAllowClick();
            return false;
        }

        $.each($.makeArray(delItem), function (i, el) {

            if (el.SER_NO != undefined) {
                //this.gridObject.setChecked(i, false);
                uniqueItems.push(el.SER_NO);
            } else {
                rawItems.push(el);
            }
        }.bind(this));

        if (uniqueItems.length == 0 && rawItems.length != 0) {
            this.contents.getGrid().draw(this.searchFormParameter);
            btnDeleteMulti.setAllowClick();
            return false;
        }

        if (uniqueItems.length > 0)
            var formData = Object.toJSON({
                SER_NO_LIST: uniqueItems.join(ecount.delimiter),
                CUST: this.CUST
            });

        var strUrl = "/SVC/Common/Infra/DeleteMultiEmailEdit"; //Common.Infra

        ecount.confirm(ecount.resource.MSG00296 + "?\n" + ecount.resource.MSG01931, function (status) {

            if (status) {


                //for (var i = 0; i < noticeErrorColumn.length; i++) {
                //    this.gridObject.setCell(noticeErrorColumn[i], 0, 'T');
                //}
                //btnDeleteMulti.setAllowClick();
                //return false;

                ecount.common.api({
                    url: strUrl,
                    async: false,
                    data: formData,
                    success: function (result) {
                        this.footer.getControl('DeleteMulti').setAllowClick();
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else {
                            this.contents.getGrid().draw(this.searchFormParameter);
                        }
                    }.bind(this)
                });
                btnDeleteMulti.setAllowClick();
            } else {
                this.footer.getControl('DeleteMulti').setAllowClick();
            }
        }.bind(this));
    },
    // dataValidation저장버튼 클릭 시 Validation)
    dataValidation: function (callback) {
        var checkMails = this.checkMails,
            _saveFlag = true,
            _email = [],
            _mobile = [],
            gridList = this.gridObject.getRowList(),
            duplicates = {
                email: [],
                mobile: [],
            },
            local_err = 0;

        //빈값, 이메일 형식, 중복항목 캐싱
        $.each(gridList, function (i, item) {

            //1.수신 참조가 되있는데 빈값일 경우 체크
            if ($.isEmpty(item.EMAIL) && getNotIncluded(item)) {
                var option = {};
                option.message = option.message = ecount.resource.MSG00339; //Enter an email "이메일 주소를 입력 바랍니다"
                this.gridObject.setCellShowError("EMAIL", item[ecount.grid.constValue.keyColumnPropertyName], option);
                this.gridObject.setCellFocus('EMAIL', i);
                this.err++;
                local_err++
                this.executeCallback();
                return false;
            }
            //2. 입력한 이메일에 대한 형식 체크
            if (!$.isEmpty(item.EMAIL)) {
                var regex = /^([\w-+]+(?:\.[\w-+]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,15}(?:\.[a-zA-Z]{2})?)$/;
                if (!regex.test(item.EMAIL)) {
                    var option = {};
                    option.message = option.message = ecount.resource.MSG00008; //Please enter an email address in the correct format.(이메일 형식에 맞춰 입력 바랍니다.)
                    this.gridObject.setCellShowError("EMAIL", item[ecount.grid.constValue.keyColumnPropertyName], option);
                    this.gridObject.setCellFocus('EMAIL', i);
                    this.err++;
                    local_err++
                    this.executeCallback();
                    return false;
                }
            }
            if (this.duplicateCheck(_email, item.EMAIL)) {
                if (!$.isEmpty(item.EMAIL)) {
                    duplicates.email.push({ idx: i, name: item.EMAIL, message: ecount.resource.LBL70053 + ' ' + ecount.resource.LBL02263 })
                }
            }
            _email.push(item.EMAIL);
            if (this.duplicateCheck(_mobile, item.HP_NO)) {

                if (!$.isEmpty(item.HP_NO)) {
                    duplicates.mobile.push({ idx: i, name: item.HP_NO, message: ecount.resource.LBL70053 + ' ' + ecount.resource.LBL02263 })
                }
            }
            _mobile.push(item.HP_NO);
            function getNotIncluded(_item) {
                var _check = false;
                $.each(checkMails, function (i, entity) {
                    if (_item[entity] == 'C' || _item[entity] == 'T') {
                        _check = true;
                        return false;
                    }
                })
                return _check;
            }
        }.bind(this));

        if (local_err == 0) {
            if (duplicates.email.length !== 0) {
                this.validateEmail(duplicates, callback);
            } else {
                this.validateMobile(duplicates, callback);
            }
        }
    },
    // 중복 체크 duplicate check
    duplicateCheck: function (_bunch, _currentValue) {

        // if (_bunch.length > 1) {
        var _result = _bunch.where(function (entity, i) {
            return entity == _currentValue;
        });
        if (_result.length > 0)
            return true;
        //  }
        return false;
    },
    // 특수 문자 체크 check special character code type
    CheckSpecialCharacterForCode: function (value, rowItem) {


        var resultObject = ecount.common.ValidCheckSpecialForCodeType(value);

        return {
            result: resultObject.result,
            error: {
                popover: {
                    visible: !resultObject.result,
                    message: resultObject.message,
                    placement: 'right'
                }, css: {
                    visible: !resultObject.result
                }
            }
        };
    },
    // 특수 문자 체크 check special character 기타
    CheckSpecialCharacterEtc: function (value, rowItem) {

        var resultObject = ecount.common.ValidCheckSpecial(value);

        return {
            result: resultObject.result,
            error: {
                popover: {
                    visible: !resultObject.result,
                    message: resultObject.message,
                    placement: 'right'
                }, css: {
                    visible: !resultObject.result
                }
            }
        };
    },
    // 콜백 실행 execute callback
    executeCallback: function (callback) {

        if (this.err === 0) {
            callback();
        } else {
            this.err = 0;
            this.footer.getControl('Save').setAllowClick();
        }
    },
    // 메시지 생성 create message
    createvalidateString: function (obj) {

        var duplicates = obj,
            string = "";
        for (var i = 0, len = duplicates.length; i < len; i++) {
            string += duplicates[i].name + "\n"
        }
        return string;
    },
    // 이메일 중복 여부 체크 email duplicate check
    validateEmail: function (duplicates, callback) {

        var string = this.createvalidateString(duplicates.email);

        if (!$.isEmpty(string)) {
            ecount.confirm(String.format(ecount.resource.MSG05135, string), function (status) {
                if (!status) {

                    var duplicateEmail = duplicates.email,
                        option = {}
                    option.message = option.message = ecount.resource.MSG00339; //Enter an email "이메일 주소를 입력 바랍니다"
                    for (var i = 0, len = duplicateEmail.length; i < len; i++) {
                        this.gridObject.setCellShowError("EMAIL", duplicateEmail[i].idx, option);
                    }
                    this.footer.getControl('Save').setAllowClick();
                    this.gridObject.setCellFocus('EMAIL', duplicateEmail[0].idx);
                } else {
                    this.validateMobile(duplicates, callback);
                }
            }.bind(this));
        } else {
            this.validateMobile(duplicates, callback);
        }
    },
    // 모바일 중복 여부 체크 mobile duplicate check
    validateMobile: function (duplicates, callback) {
        var string = this.createvalidateString(duplicates.mobile);
        if (!$.isEmpty(string)) {
            ecount.confirm(String.format(ecount.resource.MSG05136, string), function (status) {
                if (!status) {
                    var duplicateMobile = duplicates.mobile,
                        option = {}
                    option.message = ecount.resource.LBL35235 + ' ' + ecount.resource.LBL02263; //모바일 입력"
                    for (var i = 0, len = duplicateMobile.length; i < len; i++) {
                        this.gridObject.setCellShowError("HP_NO", duplicateMobile[i].idx, option);
                    }
                    this.footer.getControl('Save').setAllowClick();
                    this.gridObject.setCellFocus('HP_NO', duplicateMobile[0].idx);
                } else {
                    this.validateForm(callback, duplicates);
                }
            }.bind(this));
        } else {
            this.validateForm(callback, duplicates);
        }
    },
    // 양식 관련 유효성 체크 form select box validation 
    validateForm: function (callback, duplicates) {
        var checkMails = this.checkMails,
            gridList = this.gridObject.getRowList();

        var isOkMail = false;

        $.each(checkMails, function (idx, entity) {
            if (gridList.select(function (item) {
                return item[entity]
            }).indexOf('T') == 0) {
                isOkMail = true;

            }
        }.bind(this));

        if (!isOkMail) {
            //4. 각각의 서식구분 유효성 검사  
            $.each(checkMails, function (idx, entity) {

                if (gridList.select(function (item) {
                    return item[entity]
                }).indexOf('T') == -1) {



                    switch (entity) {
                        case 'TAX_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL06083), function () {
                                this.gridObject.setCellFocus("44", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'ETAX_MAIL':
                            if (this.ectax_flag) {
                                ecount.alert(String.format(ecount.resource.MSG05137, this.getTaxResource()), function () {
                                    this.gridObject.setCellFocus('45', 0);
                                }.bind(this));
                                this.err++;
                            }
                            break;
                        case 'CUST_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL00351), function () {
                                this.gridObject.setCellFocus("88", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'CUST_MAIL1':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL06204), function () {
                                this.gridObject.setCellFocus("89", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'STATE_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL00315), function () {
                                this.gridObject.setCellFocus("66", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'PACKING_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL90008), function () {
                                this.gridObject.setCellFocus("46", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'EST_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL00420), function () {
                                this.gridObject.setCellFocus("22", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'DEM_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL00672), function () {
                                this.gridObject.setCellFocus("33", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'ORD_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL02586), function () {
                                this.gridObject.setCellFocus("23", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'PRICEREQ_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL07386), function () {
                                this.gridObject.setCellFocus("24", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'REPAIR_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL05319), function () {
                                this.gridObject.setCellFocus("92", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'CONT_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL12268), function () {
                                this.gridObject.setCellFocus("48", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'INTERNAL_USE_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL02283), function () {
                                this.gridObject.setCellFocus("70", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'GOODSISSUE_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL04936), function () {
                                this.gridObject.setCellFocus("36", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'SHIPPING_ORDER_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL03962), function () {
                                this.gridObject.setCellFocus("26", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'SHIP_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL04030), function () {
                                this.gridObject.setCellFocus("27", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'PURCHASE_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL00692), function () {
                                this.gridObject.setCellFocus("34", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'JOB_ORDER_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL01489), function () {
                                this.gridObject.setCellFocus("35", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'QUALITY_INSPECTION_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL09840), function () {
                                this.gridObject.setCellFocus("72", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'RELEASESALESORDER_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL90113), function () {
                                this.gridObject.setCellFocus("28", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'GOODS_RECEIPT_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL09840), function () {
                                this.gridObject.setCellFocus("37", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'DEPOSITSLIP_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL04366), function () {
                                this.gridObject.setCellFocus("29", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'REPAIR2_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL04321), function () {
                                this.gridObject.setCellFocus("73", 0);
                            }.bind(this));
                            this.err++;
                            break;

                        case 'SCHEDULEDRECEIPT_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL16416), function () {
                                this.gridObject.setCellFocus("82", 0);
                            }.bind(this));
                            this.err++;
                            break;
                        case 'SCHEDULEDRELEASE_MAIL':
                            ecount.alert(String.format(ecount.resource.MSG05137, ecount.resource.LBL16534), function () {
                                this.gridObject.setCellFocus("83", 0);
                            }.bind(this));
                            this.err++;
                            break;

                    }
                    return false;
                }
            }.bind(this));
        }

        this.executeCallback(callback);

    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F2
    ON_KEY_F2: function () {

    },
    // ON_KEY_F8
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
        target && this.onContentsSearch(target.control.getValue());
    },
    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
        this.gridFocus && this.gridFocus();
    },
    // ON_KEY_UP
    ON_KEY_UP: function () {
        this.gridFocus && this.gridFocus();
    },
    // onMouseupHandler
    onMouseupHandler: function () {
        this.gridFocus = function () {
            var gridObj = this.contents.getGrid().grid;
            gridObj.focus();
            this.gridFocus = null;
        }.bind(this);
    },
    // ON_KEY_TAB
    ON_KEY_TAB: function () {
        var gridObj = this.contents.getGrid().grid;
        this.setTimeout(function () { gridObj.focus(); }, 0);
    },
    // gridFocus(그리드 포커스를 위한 함수)
    gridFocus: function () {

    },

    getTaxResource: function () {
        var res = ecount.resource;
        var result = null;
        switch (this.viewBag.Nation) {
            case "TW":
                result = res.LBL16316;
                break;
            case "KR":
            default:
                result = res.LBL04785;
                break;
        }
        return result;
    }
});

