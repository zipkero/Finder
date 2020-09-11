window.__define_resource && __define_resource("BTN00113","BTN00007","BTN00008","LBL10272","LBL02475","LBL02238","LBL02813","LBL00961","LBL00962","LBL00963","LBL08035","LBL08036","LBL08037","LBL08038","LBL08039","LBL08040","LBL08041","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL04294","LBL03755","LBL01249","LBL02513","LBL02512","LBL05426","BTN00070","LBL02556","LBL01815","LBL30177","MSG01041","BTN00380","BTN80047","LBL02985","LBL03017","LBL03004","LBL80099","LBL02999","LBL06425","LBL06431","LBL35244","BTN00063","BTN00346","BTN00204","MSG02141","MSG00522","MSG04752","MSG00722","MSG00299");
/****************************************************************************************************
1. Create Date : 2015.09.13
2. Creator     : 이일용
3. Description : 특별단가 > 변경
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2019.05.16 [DucThai] A19_01461 - 특별단가 일괄등록의 단가조정 오류 수정
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.07.16 (문요한) - SALE004 MariaDB동기화
****************************************************************************************************/

/* 일괄등록 */
ecount.page.factory("ecount.page.popup.type2", "ESA070P_02", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    currentTabId: null,
    userPermit: '',     // Page permission    

    isShowSearchBtn: true,
    isShowOptionBtn: true,

    formSearchControlType: 'SN030', // 검색컨트롤폼타입
    formTypeCode: 'SR030',
    finalHeaderSearch: null,        // 검색 시 검색 컨트롤 정보 
    ContentCheckFlag: null,
    /**************************************************************************************************** 
    * page initialize    
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            EDIT_FLAG: "U",
            SELECT_GUBUN: 'U',
            PROD_CD: '',
            ALL_GROUP_PROD: '0',
            DEL_GUBUN: '',

            // SORT, PAGING
            PAGE_SIZE: 100, //viewBag.InitDatas.DefaultPageSize,
            PAGE_CURRENT: 0,
            SORT_COLUMN: 'S3.PROD_CD',
            SORT_TYPE: 'ASC',

            // 검색조건
            CODE_CLASS: '',               // 특별단가 LIST
            PROD_CD: '',                     // 품목코드 LIST
            CHANGE_CODE_LIST: this.CHANGE_CODE_LIST,
            PROD_TYPE: '0',             // 품목타입
            CLASS_CD: '',               // 그룹코드1
            CLASS_CD2: '',              // 그룹코드2
            CLASS_CD3: '',              // 그룹코드3
            PROD_LEVEL_GROUP: '',       // 계층그룹 코드
            PROD_LEVEL_GROUP_CHK: '0'   // 하위그룹포함검색
        };
        this.userPermit = this.viewBag.Permission.Permit.Value;
        
    },
    render: function () {
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting    
    ****************************************************************************************************/
    initProperties: function () {
        this.ContentCheckFlag = {
            PriceFlag: false,
            EeFlag: false,
            VatFlag: false,
            CheckedFlag: false
        };
    },

    // Header Initialization
    onInitHeader: function (header, resource) {
        var self = this;
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            form = g.form(),
            grid = g.grid(),
            ctrl = g.control();

        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(ecount.resource.BTN00113))
            .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007))
            .addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008))
        ;

        contents
            .add(toolbar)
        ;

        header
            .notUsedBookmark()
            .setTitle(resource.LBL10272)
            .addContents(contents)
        ;
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid()
        ;
        var _self = this;
        var res = ecount.resource;
        var arrPriceSet = [];

        arrPriceSet.push(["0", ecount.resource.LBL02475]);
        arrPriceSet.push(["1", ecount.resource.LBL02238]);
        arrPriceSet.push(["2", ecount.resource.LBL02813]);
        for (var i = 1; i <= 10; i++) {
            var priceName = "", priceName2 = "";
            switch (i) {
                case 1:
                    priceName = ecount.config.inventory.PRICE_1;
                    priceName2 = res.LBL00961;
                    break;
                case 2:
                    priceName = ecount.config.inventory.PRICE_2;
                    priceName2 = res.LBL00962;
                    break;
                case 3:
                    priceName = ecount.config.inventory.PRICE_3;
                    priceName2 = res.LBL00963;
                    break;
                case 4:
                    priceName = ecount.config.inventory.PRICE_4;
                    priceName2 = res.LBL08035;
                    break;
                case 5:
                    priceName = ecount.config.inventory.PRICE_5;
                    priceName2 = res.LBL08036;
                    break;
                case 6:
                    priceName = ecount.config.inventory.PRICE_6;
                    priceName2 = res.LBL08037;
                    break;
                case 7:
                    priceName = ecount.config.inventory.PRICE_7;
                    priceName2 = res.LBL08038;
                    break;
                case 8:
                    priceName = ecount.config.inventory.PRICE_8;
                    priceName2 = res.LBL08039;
                    break;
                case 9:
                    priceName = ecount.config.inventory.PRICE_9;
                    priceName2 = res.LBL08040;
                    break;
                case 10:
                    priceName = ecount.config.inventory.PRICE_10;
                    priceName2 = res.LBL08041;
                    break;
                default:
                    break;
            }

            if (priceName != "") {
                arrPriceSet.push([(i < 4 ? i + 2 : i + 6).toString(), priceName]);
            } else {
                arrPriceSet.push([(i < 4 ? i + 2 : i + 6).toString(), priceName]);
            }
        }

        var arrEstDons = [];
        var startNum = 10 * 10 * 10 * 10 * 10 * 10;
        var optionName = "";
        while (startNum > 9) {
            switch (startNum) {
                case 1000000:
                    optionName = res.LBL00097;
                    break;
                case 100000:
                    optionName = res.LBL00096;
                    break;
                case 10000:
                    optionName = res.LBL00095;
                    break;
                case 1000:
                    optionName = res.LBL00094;
                    break;
                case 100:
                    optionName = res.LBL00093;
                    break;
                case 10:
                    optionName = res.LBL00084;
                    break;
                default:
                    break;
            }
            arrEstDons.push([startNum.toString(), optionName]);
            startNum = startNum / 10;
        }

        arrEstDons.push(['1', res.LBL00085]);
        arrEstDons.push(['.1', res.LBL00086]);
        arrEstDons.push(['.01', res.LBL00087]);
        arrEstDons.push(['.001', res.LBL00088]);

        var arrddlVat = [];
        arrddlVat.push(['N', res.LBL04294]);
        arrddlVat.push(['Y', res.LBL03755]);

        var arrEstUps = [];
        arrEstUps.push(['0', res.LBL01249]);
        arrEstUps.push(['1', res.LBL02513]);
        arrEstUps.push(['2', res.LBL02512]);

        // 01. 단가변경
        toolbar.addLeft(ctrl.define("widget.checkbox", "PRICE_FLAG", "PRICE_FLAG").label([ecount.resource.LBL05426]).value([0]));
        toolbar.addLeft(ctrl.define("widget.select", "PRICE_SET", "PRICE_SET").option(arrPriceSet).select("0").hide());
        toolbar.addLeft(ctrl.define("widget.button", "ApplyPrice").label(ecount.resource.BTN00070).hide().css("btn btn-default btn-sm"));
        // 02. 조정
        toolbar.addLeft(ctrl.define("widget.checkbox", "EE_FLAG", "EE_FLAG").label([ecount.resource.LBL02556]).value([0]));
        toolbar.addLeft(ctrl.define("widget.input", "CHANGE_RATE", "CHANGE_RATE").numericOnly().maxLength(10).hide());
        toolbar.addLeft(ctrl.define("widget.select", "EST_GUBUN", "EST_GUBUN").option([['1', '%'], ['2', res.LBL01815]]).select('1').hide());
        toolbar.addLeft(ctrl.define("widget.select", "EST_DONS", "EST_DONS").option(arrEstDons).select('1').hide());
        toolbar.addLeft(ctrl.define("widget.select", "EST_UPS", "EST_UPS").option(arrEstUps).select('0').hide());
        toolbar.addLeft(ctrl.define("widget.button", "ApplyEeFlag").label(ecount.resource.BTN00070).hide().css("btn btn-default btn-sm"));
        // 03. Vat포함여부
        toolbar.addLeft(ctrl.define("widget.checkbox", "VAT_YN", "VAT_YN").label([ecount.resource.LBL30177]).value([0]));
        toolbar.addLeft(ctrl.define("widget.select", "VAT", "VAT").option(arrddlVat).select('1').hide());
        toolbar.addLeft(ctrl.define("widget.button", "ApplyVatYn").label(ecount.resource.BTN00070).hide().css("btn btn-default btn-sm"));

        contents
            .add(toolbar)
            .addGrid("dataGrid", grid)
        ;
    },
    onChangeControl: function (e) {
        if (e.cid == "PRICE_FLAG" || e.cid == "EE_FLAG" || e.cid == "VAT_YN") {
            this.ContentCheckFlag.PriceFlag = this.contents.getControl("PRICE_FLAG").getValue(); //chkflag3
            this.ContentCheckFlag.EeFlag = this.contents.getControl("EE_FLAG").getValue(); //chkflag2
            this.ContentCheckFlag.VatFlag = this.contents.getControl("VAT_YN").getValue(); //chkflag4

            this.contents.getControl("PRICE_SET").hide();
            this.contents.getControl("CHANGE_RATE").hide();
            this.contents.getControl("EST_GUBUN").hide();
            this.contents.getControl("EST_DONS").hide();
            this.contents.getControl("EST_UPS").hide();
            this.contents.getControl("VAT").hide();
            this.contents.getControl("ApplyPrice").hide();
            this.contents.getControl("ApplyEeFlag").hide();
            this.contents.getControl("ApplyVatYn").hide();

            if (this.ContentCheckFlag.EeFlag == true && this.ContentCheckFlag.PriceFlag == true) {
                this.contents.getControl("PRICE_SET").show();
                this.contents.getControl("CHANGE_RATE").show();
                this.contents.getControl("EST_GUBUN").show();
                this.contents.getControl("EST_DONS").show();
                this.contents.getControl("EST_UPS").show();
                this.contents.getControl("VAT").hide();

                this.contents.getControl("ApplyPrice").hide();
                this.contents.getControl("ApplyEeFlag").show();
                this.contents.getControl("ApplyVatYn").hide();
                
                if (this.ContentCheckFlag.VatFlag == true) {
                    this.contents.getControl("VAT").show();

                    this.contents.getControl("ApplyPrice").hide();
                    this.contents.getControl("ApplyEeFlag").hide();
                    this.contents.getControl("ApplyVatYn").show();
                } else {
                    this.contents.getControl("VAT").hide();
                }
            } else if (this.ContentCheckFlag.EeFlag == true && this.ContentCheckFlag.PriceFlag == false) {
                this.contents.getControl("PRICE_SET").hide();
                this.contents.getControl("CHANGE_RATE").show();
                this.contents.getControl("EST_GUBUN").show();
                this.contents.getControl("EST_DONS").show();
                this.contents.getControl("EST_UPS").show();
                this.contents.getControl("VAT").hide();

                this.contents.getControl("ApplyPrice").hide();
                this.contents.getControl("ApplyEeFlag").show();
                this.contents.getControl("ApplyVatYn").hide();

                if (this.ContentCheckFlag.VatFlag == true) {
                    this.contents.getControl("VAT").show();

                    this.contents.getControl("ApplyPrice").hide();
                    this.contents.getControl("ApplyEeFlag").hide();
                    this.contents.getControl("ApplyVatYn").show();
                } else {
                    this.contents.getControl("VAT").hide();
                }
            } else if (this.ContentCheckFlag.EeFlag == false && this.ContentCheckFlag.PriceFlag == true) {
                this.contents.getControl("PRICE_SET").show();
                this.contents.getControl("CHANGE_RATE").hide();
                this.contents.getControl("EST_GUBUN").hide();
                this.contents.getControl("EST_DONS").hide();
                this.contents.getControl("EST_UPS").hide();
                this.contents.getControl("VAT").hide();

                this.contents.getControl("ApplyPrice").show();
                this.contents.getControl("ApplyEeFlag").hide();
                this.contents.getControl("ApplyVatYn").hide();
                
                if (this.ContentCheckFlag.VatFlag == true) {
                    this.contents.getControl("VAT").show();

                    this.contents.getControl("ApplyPrice").hide();
                    this.contents.getControl("ApplyEeFlag").hide();
                    this.contents.getControl("ApplyVatYn").show();
                } else {
                    this.contents.getControl("VAT").hide();
                }
            } else if (this.ContentCheckFlag.EeFlag == true && this.ContentCheckFlag.PriceFlag == false) {
                this.contents.getControl("PRICE_SET").hide();
                this.contents.getControl("CHANGE_RATE").hide();
                this.contents.getControl("EST_GUBUN").hide();
                this.contents.getControl("EST_DONS").hide();
                this.contents.getControl("EST_UPS").hide();
                this.contents.getControl("VAT").hide();

                this.contents.getControl("ApplyPrice").show();
                this.contents.getControl("ApplyEeFlag").hide();
                this.contents.getControl("ApplyVatYn").hide();

                if (this.ContentCheckFlag.VatFlag == true) {
                    this.contents.getControl("VAT").show();

                    this.contents.getControl("ApplyPrice").hide();
                    this.contents.getControl("ApplyEeFlag").hide();
                    this.contents.getControl("ApplyVatYn").show();
                } else {
                    this.contents.getControl("VAT").hide();
                }
            }

            if (this.ContentCheckFlag.VatFlag == true) {
                this.contents.getControl("VAT").show();
                this.contents.getControl("ApplyPrice").hide();
                this.contents.getControl("ApplyEeFlag").hide();
                this.contents.getControl("ApplyVatYn").show();
            }
        }
    },
    // button clicked event
    onContentsApplyPrice: function (cid) {
        this.onContentsClick();
    },
    // button clicked event
    onContentsApplyEeFlag: function (cid) {
        this.onContentsClick();
    },
    // button clicked event
    onContentsApplyVatYn: function (cid) {
        this.onContentsClick();
    },
    //적용 버튼 클릭
    onContentsClick: function () {
        var grid = this.contents.getGrid().grid;
        this.ContentCheckFlag.PriceFlag = this.contents.getControl("PRICE_FLAG").getValue(); //chkflag3
        this.ContentCheckFlag.EeFlag = this.contents.getControl("EE_FLAG").getValue(); //chkflag2
        this.ContentCheckFlag.VatFlag = this.contents.getControl("VAT_YN").getValue(); //chkflag4

        var _self = this;
        $.each(grid.getCheckedObject(), function (i, item) {
            _self.ContentCheckFlag.CheckedFlag = true;
        });

        var res = ecount.resource;
        if (this.ContentCheckFlag.EeFlag == true && this.ContentCheckFlag.PriceFlag == true) {
            if (_self.ContentCheckFlag.CheckedFlag == true) {
                this.fnGetChangePrice();
            } else {
                alert(res.MSG01041);
            }
        } else if (this.ContentCheckFlag.EeFlag == false && this.ContentCheckFlag.PriceFlag == true) {
            if (_self.ContentCheckFlag.CheckedFlag == true) {
                this.fnGetChangePrice();
            } else {
                alert(res.MSG01041);
            }
        } else if (this.ContentCheckFlag.EeFlag == true && this.ContentCheckFlag.PriceFlag == false) {
            this.fnGetChangePriceRate('all');
        }

        if (this.ContentCheckFlag.VatFlag == true) {
            this.fnGetChangePriceVatYn();
        }
    },
    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00380));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        //toolbar.addLeft(ctrl.define("widget.button", "DeleteAll").label(ecount.resource.BTN80047));
        footer.add(toolbar);
    },
    /**************************************************************************************************** 
    * define common event listener    
    ****************************************************************************************************/
    // After the document is loaded
    onLoadComplete: function () {
        var res = ecount.resource;
        this._keyWord = "ESA070P_02" + this.viewBag.ComCode_L + ecount.user.WID + new Date()._tick();
        this.currentTabId = this.contents.currentTabId;
        this.onHeaderSearch();
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        config.parentPageID = this.pageID;
        config.popupType = false;
        config.additional = false;
        config.responseID = this.callbackID;

        if (control.id == "PROD_CD") {
            config.width = 430;
            config.height = 645;
            config.isCheckBoxDisplayFlag = false;
            config.name = ecount.resource.LBL02985;
        } else if (control.id == "CODE_CLASS") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
            config.isCheckBoxDisplayFlag = false;
        }
        handler(config);
    },
    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'ES020P') {
            this.header.getControl("PROD_CD").addCode({
                label: message.data.PROD_DES, value: message.data.PROD_CD
            });
        } else if (page.pageID == 'CM020P') {
            this.header.getControl("CODE_CLASS").addCode({
                label: message.data.CLASS_DES, value: message.data.CODE_CLASS
            });
        }

        message.callback && message.callback();  // The popup page is closed   
    },
    // Search button click event
    onContentsSearch: function (e, value) {
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    // Sorting function
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.PAGE_CURRENT = 1;
        this.searchFormParameter.SORT_COLUMN = data.columnId;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },
    
    dataSearch: function (initFlag) {
        var res = ecount.resource;
        var thisObj = this;
        var decP = "9" + ecount.config.inventory.DEC_P;
        var settings = widget.generator.grid(),
            gridObj = this.contents.getGrid("dataGrid");

        // Initialize Grid
        settings
            .setEditable(true, 0, 0)
            .setRowDataUrl('/Inventory/Basic/GetListPriceLevelInsertBatch')
            .setRowDataParameter(this.searchFormParameter)
            .setKeyColumn(["PROD_CD", 'CODE_CLASS'])
            .setColumnFixHeader(true)
            .setHeaderTopMargin(this.header.height())
            .setColumns([
                { propertyName: 'PROD_CD', id: 'PROD_CD', controlType: 'widget.label', title: ecount.resource.LBL03017, width: '80' },
                { propertyName: 'PROD_DES', id: 'PROD_DES', controlType: 'widget.label', title: ecount.resource.LBL03004, width: '' },
                { propertyName: 'SIZE_DES', id: 'SIZE_DES', controlType: 'widget.label', title: ecount.resource.LBL80099, width: '' },
                { propertyName: 'GROUP_CLASS_DES', id: 'GROUP_CLASS_DES', controlType: 'widget.label', title: ecount.resource.LBL02999, width: '130' },
                { propertyName: 'CLASS_DES', id: 'CLASS_DES', controlType: 'widget.label', title: ecount.resource.LBL06425, width: '150' },
                { propertyName: 'PRICE', id: 'PRICE', title: ecount.resource.LBL06431, width: '100', align: 'right', controlType: 'widget.input.number', editableState: 1, dataType: "96", isCheckZero: false, controlOption: { decimalUnit: [18, 6] } },
                { propertyName: 'PRICE_VAT_YN', id: 'PRICE_VAT_YN', controlType: 'widget.select', title: ecount.resource.LBL30177, width: '100', select: 1 },
                { propertyName: 'DEL_GUBUN', id: 'DEL_GUBUN', controlType: 'widget.select', title: ecount.resource.LBL35244, width: '100', select: 1 },
                { propertyName: 'ROW_SAVE', id: 'ROW_SAVE', controlType: 'widget.link', title: ecount.resource.BTN00063, width: '70', align: "center" }
            ])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')

            // Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(100, true)
            .setPagingUseDefaultPageIndexChanging(true)

            // Sorting
            .setColumnSortable(true)
            .setColumnSortDisableList(['DEL_GUBUN', 'ROW_SAVE'])
            .setColumnSortExecuting(this.onColumnSortClick.bind(this))

            // CheckBox
            .setCheckBoxUse(true)
            .setCheckBoxMaxCount(100)
            .setCheckBoxRememberChecked(false)

            // Custom cells
            .setCustomRowCell("PRICE", this.setGridDateLinkPrice.bind(this))
            .setCustomRowCell("PRICE_VAT_YN", this.setGridDateLinkPriceVatYn.bind(this))
            .setCustomRowCell("DEL_GUBUN", this.setDelColumnValues.bind(this))
            .setCustomRowCell("ROW_SAVE", this.setRowSaveColumnValues.bind(this))
        ;

        this.gridSettings = settings;
        gridObj.grid.settings(settings);
        gridObj.draw(this.searchFormParameter);

        return true;
    },
    // Set [TaxStatus] value
    setTaxStatusValue: function (value, rowItem) {
        var option = {};
        option.data = ['Y'].contains(value) ? ecount.resource.LBL03755 : ecount.resource.LBL04294;
        return option;
    },
    /****************************************************************************************************
    * define grid event listener    
    ****************************************************************************************************/
    onGridInit: function (e, data) {
        this._super.onGridInit.apply(this, arguments);
    },
    // OnInitContents 후에 실행(맨처음 로딩 될때 한번만 실행됨)
    onGridRenderBefore: function (gridId, settings) {
        var self = this;
        this.setGridParameter(settings);
        settings.setPagingIndexChanging(function (e, data) {
            self.contents.getGrid("dataGrid").grid.settings().setPagingCurrentPage(data.pageIndex);
            self.contents.getGrid("dataGrid").grid.render();
        });
    },
    // After grid rendered
    onGridRenderComplete: function (e, data) {
        this._super.onGridRenderComplete.apply(this, arguments);
        
        var grid = this.contents.getGrid().grid;
        var items = grid.getRowList();
        for (var i = 0; i < items.length; i++) {
            var rowKey = items[i][ecount.grid.constValue.keyColumnPropertyName];
            grid.addChecked(rowKey);
        }
    },
    // Set row color
    setRowBackgroundColor: function (data) {
        if (data["DEL_GUBUN"] == "Y")
            return true;
        return false;
    },
    // 적용단가
    setGridDateLinkPrice: function (value, rowItem) {
        var option = {},
            grid = this.contents.getGrid().grid;
        var hidData = "";
        option.event = {
            'focus': function (event, data) {
                grid.setActiveCellColorClass('bg-danger');
            }.bind(this),
            'click': function (event, data) {
            }.bind(this),
            'change': function (event, data) {
                //if (rowItem.PRICE != "" && rowItem.PRICE != undefined) {
                //    grid.addChecked(rowItem.PROD_CD + rowItem.CODE_CLASS);
                //} else {
                //    grid.removeChecked(rowItem.PROD_CD + rowItem.CODE_CLASS);
                //}
            }.bind(this),
            'keyup': function (event, data) {
            }.bind(this),
            'blur': function (event, data) {
                grid.setActiveCellColorClass('');
                grid.removeCellClass('PRICE', data.rowKey, 'bg-warning');
            }.bind(this)
        };
        return option;
    },
    // VAT 포함여부
    setGridDateLinkPriceVatYn: function (value, rowItem) {
        var selectOption = new Array();
        selectOption.push(['Y', ecount.resource.LBL03755]);
        selectOption.push(['N', ecount.resource.LBL04294]);
        
        var option = {},
            grid = this.contents.getGrid().grid;
        var hidData = "";
        option.optionData = selectOption;
        option.data = rowItem.PRICE_VAT_YN == "" ? "N" : rowItem.PRICE_VAT_YN;
        option.event = {
            'change': function (event, data) {
                if (rowItem.PRICE != "" && rowItem.PRICE != undefined) {
                    grid.addChecked(data.rowKey);
                } else {
                    grid.removeChecked(data.rowKey);
                }
            }.bind(this)
        };
        return option;
    },
    // Set Active column values
    setDelColumnValues: function (value, rowItem) {
        var option = {
            controlType: 'widget.empty'
        };
        if (rowItem.PRICE_RISE != "") {
            option.controlType = 'widget.select';
            var selectOption = new Array();
            selectOption.push(['N', ecount.resource.BTN00346, '']);
            selectOption.push(['Y', ecount.resource.BTN00204, '']);
            option.optionData = selectOption;
        }
        return option;
    },
    setRowSaveColumnValues: function (value, rowItem) {
        var option = {
            controlType: 'widget.empty'
        };
        var thisObj = this;
        option.controlType = 'widget.link';
        option.data = ecount.resource.BTN00063;
        option.event = {
            'click': function (event, data) {
                if (data.rowItem.PRICE == undefined || data.rowItem.PRICE == "") {
                    ecount.alert(ecount.resource.MSG02141);
                    return false;
                }
                var arrPriceLevelBatch = [];
                var param = {
                    CUST: data.rowItem.CODE_CLASS,
                    CODE_CLASS: data.rowItem.CODE_CLASS,
                    PROD_CD: data.rowItem.PROD_CD,
                    PRICE: parseFloat(data.rowItem.PRICE),
                    PRICE_VAT_YN: data.rowItem.PRICE_VAT_YN,
                    DEL_GUBUN: data.rowItem.DEL_GUBUN,
                    EDIT_MODE: ecenum.editMode.modify
                };

                arrPriceLevelBatch.push(param);
                var formData = Object.toJSON({
                    Request:
                    {
                        Data: arrPriceLevelBatch
                    }
                });

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/UpdateBatchPriceLevelForItem",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            ecount.alert(ecount.resource.MSG00522);
                        }
                    }
                });
            }.bind(this)
        }
        return option;
    },

    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]    
    ****************************************************************************************************/
    // 검색창 검색 event
    onHeaderSearch: function (forceHide) {
        var self = this;
        if (self.dataSearch(true)) {
        }
    },
    onHeaderSimpleSearch: function (e) {
        this.onHeaderSearch(e);
    },
    // 다시작성 
    onHeaderRewrite: function (e) {
        this.header.lastReset(this.finalHeaderSearch);
    },
    // 검색창 닫기
    onHeaderClose: function () {
        this.header.toggle();
    },
    // New button clicked event
    onFooterSave: function (e) {
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var arrPriceLevelBatch = [];
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        var item = grid.getRowList();
        for (var i = 0; i < item.length; i++) {
            var rowKey = item[i][ecount.grid.constValue.keyColumnPropertyName];
            if (grid.isChecked(rowKey)) {
                if (item[i].PRICE != undefined && item[i].PRICE != "") { //&& item['PRICE'] != "0" 
                    var param = {                        
                        CUST: item[i].CODE_CLASS,
                        CODE_CLASS: item[i].CODE_CLASS,
                        PROD_CD: item[i].PROD_CD,
                        PRICE: parseFloat(item[i].PRICE),
                        PRICE_VAT_YN: item[i].PRICE_VAT_YN,
                        DEL_GUBUN: item[i].DEL_GUBUN,
                        EDIT_MODE: ecenum.editMode.modify
                    };
                    arrPriceLevelBatch.push(param);
                } else {
                    //grid.removeChecked(item['PROD_CD']);
                    ecount.alert(ecount.resource.MSG02141);
                    grid.setCellFocus('PRICE', rowKey, true);
                    return false;
                }
            }
        }

        if (arrPriceLevelBatch.length <= 0) {
            ecount.alert(ecount.resource.MSG04752);
            return false;
        }
        var formData = Object.toJSON({
            Request: {
                Data: arrPriceLevelBatch
            }
        });
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateBatchPriceLevelForItem",
            data: formData,
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                }
                else {
                    thisObj.setTimeout(function () { thisObj.close(); }, 0);
                    thisObj.sendMessage(thisObj, "UpdateBatch");
                }
            }
        });
        return true;
    },
    // New button clicked event
    onFooterDeleteAll: function (e) {
        var thisObj = this;
        var grid = this.contents.getGrid().grid;
        var btn = this.footer.get(0).getControl("DeleteAll");
        var arrPriceLevelBatch = [];
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        $.each(grid.getCheckedObject(), function (i, item) {
            if (item['PRICE'] != undefined) {
                var param = {
                    CUST: item['CODE_CLASS'],
                    CODE_CLASS: item['CODE_CLASS'],
                    PROD_CD: item['PROD_CD'],
                    PRICE: item['PRICE'],
                    PRICE_VAT_YN: item['PRICE_VAT_YN']
                };
                arrPriceLevelBatch.push(param);
            }
        });
        if (arrPriceLevelBatch.length <= 0) {
            ecount.alert(ecount.resource.MSG00722);
            return false;
        }
        var formData = Object.toJSON(arrPriceLevelBatch);
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status) {
                ecount.common.api({
                    url: "/Inventory/Basic/DeleteBatchPriceLevelForItem",
                    data: formData,
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        }
                        else {
                            thisObj.setTimeout(function () { thisObj.close(); }, 0);
                            thisObj.sendMessage(thisObj, "DeleteBatch");
                        }
                    }
                });
            }
            btn.setAllowClick();
        });
        return true;
    },
    // Close button clicked event
    onFooterClose: function (e) {
        this.close();
    },
    /**************************************************************************************************** 
    *  define hotkey event listener    
    ****************************************************************************************************/
    // F8
    ON_KEY_F8: function (e, target) {
        this.onFooterSave();
    },
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    fnGetChangePriceVatYn: function () {
        var grid = this.contents.getGrid().grid;
        var ddlVat = this.contents.getControl("VAT").getValue(); //$("#ddlVat").get(0).value;
        $.each(grid.getChecked(), function (i, item) {
            grid.setCell('PRICE_VAT_YN', item[ecount.grid.constValue.keyColumnPropertyName], ddlVat, { isRunChange: true });
        });
    },
    fnGetChangePriceRate: function (pCodeClass) {        
        var res = ecount.resource;
        var grid = this.contents.getGrid().grid;
        var dec_p = 0;
        dec_p = 6; //ecount.config.inventory.DEC_P
        //조정율  
        if ($.isEmpty(this.contents.getControl("CHANGE_RATE").getValue())) this.contents.getControl("CHANGE_RATE").setValue("0");       // [A17_02299단가조정Null값반올림]
        var change_rate = Number(this.contents.getControl("CHANGE_RATE").getValue());
        
        //%와 숫자의 구분
        var est_gubun = this.contents.getControl("EST_GUBUN").getValue();
        //자리수의 구분
        var est_dons = this.contents.getControl("EST_DONS").getValue();
        // 반올림(0), 절상(1), 절사(2)의 구분
        var est_ups = this.contents.getControl("EST_UPS").getValue();

        //숫자와 %에 따른 값세팅
        var change_amt = Number(change_rate);
        if (est_gubun == "1") {
            change_amt = (Number(change_rate) + 100) * 10000;
        }
        $.each(grid.getChecked(), function (i, item) {
            var price = Number(item.PRICE);
            var new_price = 0;

            if (est_gubun == "1") {
                switch (est_ups) {
                    case "0": 	//반올림
                        new_price = Math.round((price * change_amt) / 1000000 * est_dons) / est_dons;
                        break;
                    case "1":     //절상
                        new_price = Math.ceil((price * change_amt) / 1000000 * est_dons) / est_dons;
                        break;
                    case "2":     //절사
                        new_price = Math.floor((price * change_amt) / 1000000 * est_dons) / est_dons;
                        break;
                }
            } else {
                switch (est_ups) {
                    case "0":
                        new_price = Math.round((price + change_amt) * est_dons) / est_dons;
                        break;
                    case "1":
                        new_price = Math.ceil((price + change_amt) * est_dons) / est_dons;
                        break;
                    case "2":
                        new_price = Math.floor((price + change_amt) * est_dons) / est_dons;
                        break;
                }
            }

            if (pCodeClass=="all")
                grid.setCell('PRICE', item[ecount.grid.constValue.keyColumnPropertyName], new_price, { isRunChange: true });
            else
                grid.setCell('PRICE', ecount.grid.makeRowKey([item.PROD_CD, pCodeClass]), new_price, { isRunChange: true });
        });

        return false;            
       
    },
    fnGetChangePrice: function () {
        var _self = this;
        var codeClassInfo = new Array();
        var prodInfo = new Array(100);
        var searchParam = $.extend({}, this.searchFormParameter, this.header.serialize().result);
        var grid = this.contents.getGrid().grid;

        _self.ContentCheckFlag.PriceFlag = this.contents.getControl("PRICE_FLAG").getValue(); //chkflag3
        _self.ContentCheckFlag.EeFlag = this.contents.getControl("EE_FLAG").getValue(); //chkflag2
        _self.ContentCheckFlag.VatFlag = this.contents.getControl("VAT_YN").getValue(); //chkflag4

        var price_set = _self.contents.getControl("PRICE_SET").getValue();
        var change_rate = _self.contents.getControl("CHANGE_RATE").getValue();
        var est_gubun = _self.contents.getControl("EST_GUBUN").getValue();
        var est_dons = _self.contents.getControl("EST_DONS").getValue();
        var est_ups = _self.contents.getControl("EST_UPS").getValue();
        var ddlVat = _self.contents.getControl("VAT").getValue();

        var pageGubun = "";
        if (price_set == "0") {
            //$.each(grid.getChecked(), function (i, item) {
            //    grid.setCell('PRICE', item.PROD_CD + item.CODE_CLASS, item.PRICE, { isRunChange: true });
            //});
            return false;
        }
        $.each(grid.getChecked(), function (i, item) {
            var isChk = false;
            $.each(codeClassInfo, function (index, value) {
                if (item.CODE_CLASS == value) {
                    isChk = true;
                }
            });
            if (!isChk) {
                codeClassInfo.push(item.CODE_CLASS);
            }
            prodInfo.push(item.PROD_CD);
        });
        if (price_set == "1") {
            pageGubun = "2";
            price_set = "19";
        }
        else if (price_set == "2") {
            pageGubun = "1";
            price_set = "19";
        }

         // [A17_02299단가조정Null값반올림]
        if ($.isEmpty(this.contents.getControl("CHANGE_RATE").getValue())) {
            this.contents.getControl("CHANGE_RATE").setValue("0");
        }
        var change_rate = Number(this.contents.getControl("CHANGE_RATE").getValue());
        
        //$.each(codeClassInfo, function (index, value) {
            var data = {
                PROD_CD: prodInfo,
                CUST_CD: "",
                VatYn: ddlVat,
                VatRate: change_rate,
                WH_CD: "",
                SelectGubun: price_set,
                PageGubun: pageGubun
            }
            ecount.common.api({
                url: "/Inventory/Common/GetChangePrice",
                data: Object.toJSON(data),
                success: function (result) {
                    $.each(grid.getChecked(), function (i, item) {
                        grid.setCell('PRICE', ecount.grid.makeRowKey([result.Data[i].PROD_CD, item[ecount.grid.constValue.keyColumnPropertyName].split('∮')[1]]), result.Data[i].PROD_PRICE, { isRunChange: true });
                        grid.addCellClass('PRICE', ecount.grid.makeRowKey([result.Data[i].PROD_CD, item[ecount.grid.constValue.keyColumnPropertyName].split('∮')[1]]), 'bg-warning');
                    });                    
                    if (_self.ContentCheckFlag.EeFlag && _self.ContentCheckFlag.PriceFlag) {
                        _self.fnGetChangePriceRate("all");
                    }                    
                }
            });
        //});
    }
});
