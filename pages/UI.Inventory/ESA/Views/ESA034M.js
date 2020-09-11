window.__define_resource && __define_resource("LBL09999","LBL01977","LBL06434","LBL01984","LBL06386","LBL03142","LBL04196","LBL02475","LBL07880","LBL35244","LBL07879","BTN00204","LBL00865","LBL10548","BTN00113","BTN00007","LBL00064","BTN00330","BTN00043","BTN00959","BTN00033","BTN00203","BTN00050","LBL93039","MSG00141","LBL09653","LBL03176","MSG00213","MSG00299","LBL08030","LBL00243","MSG02158","LBL01983");
/****************************************************************************************************
1. Create Date : 2015.05.25
2. Creator     : PHI lUONG
3. Description : Inv1 > Setup > Fereign Currency / 재고1 > 기초등록 > 외화등록
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 2018.01.16(Thien.Nguyen) Add option set shaded for grid, set scroll top for page, modify onMessageHandler function., modify event click of grid.
                 2018.06.25(Hoang Linh) Apply header search
                 2018.09.20(Chung Thanh Phuoc) Add link navigation F/X Rate Code/ F/X Rate Type of Menu Foreign Currency
                 2018.10.02 Chung Thanh Phuoc Apply disable search when data search > 1000
                 2018.11.02 (PhiTa) Remove Apply disable sort > 1000
                 2019.03.06 (PhiVo): FE 리팩토링_페이지 일괄작업 6차 - __ecPage__ 제거
                 2019.04.01 (문요한) : 마리아 동기화 작업 - 리스트 영구삭제
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
                 2020.02.04 (PhiVo): A19_04293 - MYSQL조회되록 변경 - 외화(Foreign Currency)
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA034M", {

    pageID: null,

    header: null,

    contents: null,

    footer: null,

    permission: null,

    //ecConfig: ["config.inventory", "config.account", "config.user", "company", "user"],

    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/
    canCheckCount: 100,                                         // 체크 가능 수 기본 100   

    formTypeCode: 'SR990',                                      // 리스트폼타입
    formInfoData: null,                                         // 리스트 양식정보
    cCODE_NO: "",    //  활성화 되었던 전표 정보
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);

        this.formInfoData = this.viewBag.FormInfos[this.formTypeCode];

        this.searchFormParameter = {
            Request: {
                Data: {
                    PARAM: this.PARAM,
                    CODE_CLASS: this.CODE_CLASS,
                    SORT_COLUMN: "CODE_NO",
                    SORT_TYPE: "A",
                    PAGE_SIZE: 100,
                    PAGE_CURRENT: 1,
                    FORM_TYPE: this.formTypeCode,
                    FORM_SER: '1',
                    USE_GUBUN: this.USE_GUBUN,
                    CODE_NO: this.CODE_NO,
                    CODE_DES: this.CODE_DES,
                    EXCHANGE_RATE: this.EXCHANGE_RATE,
                    AMTDIGIT_LEN: this.AMTDIGIT_LEN,
                    BASE_DATE_CHK: this.BASE_DATE_CHK
                }
            }
        };

        //Title
        this.HeaderTitlePopUp = String.format(ecount.resource.LBL09999, ecount.resource.LBL01977);
        this.HeaserTitlePopUpModify = String.format(ecount.resource.LBL06434, ecount.resource.LBL01977);

        // Code title
        this.FxRateCode = ecount.resource.LBL01984;
        // Code Des Title
        this.FxRateType = ecount.resource.LBL06386;
        this.FxRate = ecount.resource.LBL03142;

        //Get Permission 
        this.permission = this.viewBag.Permission.permit;

    },

    render: function () {
        this._super.render.apply(this);
    },

    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator;
        var toolbar = g.toolbar(),
            contents = g.contents(),
            form = g.form();

        var ctrl = g.control();
        var res = ecount.resource;

        //Header search content
        form
            .add(ctrl.define('widget.input', 'CODE_NO', 'CODE_NO', res.LBL01984, null).value('').end())
            .add(ctrl.define('widget.input', 'CODE_DES', 'CODE_DES', res.LBL06386, null).value('').end())
            .add(ctrl.define('widget.input.number', 'EXCHANGE_RATE', 'EXCHANGE_RATE', res.LBL03142).numericOnly(9, 0, null).end())
            .add(ctrl.define('widget.checkbox.whole', 'AMTDIGIT_LEN', 'AMTDIGIT_LEN', res.LBL04196, null)
                .label([res.LBL02475, res.LBL07880, '1', '2', '3', '4'])
                .value(['', '0', '1', '2', '3', '4'])
                .select('', '0', '1', '2', '3', '4')
                .end())
            .add(ctrl.define('widget.radio', 'USE_GUBUN', 'USE_GUBUN', res.LBL35244, null)
                .label([res.LBL02475, res.LBL07879, res.BTN00204])
                .value(['', "Y", "N"])
                .select("Y")
                .end())
            .add(ctrl.define('widget.checkbox', 'EtcChk', 'EtcChk', res.LBL00865, null)
                .label(res.LBL10548).value([1]).select([0]).end())
            ;

        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addLeft(ctrl.define("widget.button", "search").css("btn btn-sm btn-primary").label(res.BTN00113))
            .addLeft(ctrl.define("widget.button", "rewrite").label(ecount.resource.BTN00007));

        contents
            .add(form)
            .add(toolbar);
        /***************************************************************************************/

        header.setTitle(String.format(ecount.resource.LBL00064, ecount.resource.LBL01977))
            .useQuickSearch()
            .add('search', null, false)
            .addContents(contents);

        var dropdownButtons = [];
        dropdownButtons.push({ id: "ListSettings", label: ecount.resource.BTN00330 }); // 리스트설정
        header.add("option", dropdownButtons);
    },

    //setting Contents option
    onInitContents: function (contents) {

        var g = widget.generator,
            toolbar = g.toolbar(),
            grid = g.grid();

        grid
            .setRowData(this.viewBag.InitDatas.ESA034M)
            .setRowDataUrl("/SVC/Account/Basic/GetListForeignCurrency")
            .setRowDataParameter(this.searchFormParameter)
            .setFormParameter({ FormType: this.formTypeCode, FormSeq: 1 })

            .setKeyColumn(['CODE_NO'])
            //Set fixed header
            .setColumnFixHeader(true)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')

            //Sort
            .setColumnSortable(true) // Sort whether from the grid
            .setColumnSortExecuting(this.onColumnSortClick.bind(this)) //Register a callback function to perform the sort.

            //Checkbox Use
            .setCheckBoxUse(true) //Set whether to use checkboxes
            .setCheckBoxMaxCount(100) //Check the maximum number of restrictions
            .setCheckBoxMaxCountExceeded(this.onItemCountMessage.bind(this))

            //Paging
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)

            .setEventShadedColumnId(['CODE_NO'], { isAllRememberShaded: true })

            //To render the row data from the data source before the column attribute settings and data for each cell can be overridden.
            .setCustomRowCell('CODE_NO', this.setGridDataLink.bind(this)) //Click the screen to jump popup
            .setCustomRowCell('CODE_DES', this.setGridDataLink.bind(this)) //Click the screen to jump popup
            .setCustomRowCell('USE_GUBUN', this.setGridToolTip.bind(this)) //Create ToolTip
            .setCheckBoxActiveRowStyle(true)
            .setCheckBoxCallback({
                'click': function (e, data) { }
            });

        contents.add(toolbar)
            .addGrid("dataGrid", grid); // Because there are multiple grids must be put in an arbitrary id, grid have to use the  addGrid()
    },

    //setting Footer option
    onInitFooter: function (footer) {

        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "new").label(ecount.resource.BTN00043));
        toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959)
            .addGroup([
                { id: "Deactivate", label: ecount.resource.BTN00204 },
                { id: 'selectedDelete', label: ecount.resource.BTN00033 },
                { id: "Activate", label: ecount.resource.BTN00203 }
            ]).css("btn btn-default")
            .noActionBtn().setButtonArrowDirection("up"));
        toolbar.addLeft(ctrl.define("widget.button", "excel").label(ecount.resource.BTN00050).end());
        footer.add(toolbar);
    },


    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.searchFormParameter.Request.Data.PARAM = this.header.getQuickSearchControl().getValue();

        var grid = this.contents.getGrid();
        grid.grid.removeShadedColumn();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },

    //Header Search button click event
    onHeaderSearch: function () {
        var self = this;

        self.searchFormParameter.Request.Data = $.extend({}, self.searchFormParameter.Request.Data, self.header.serialize().result);
        self.searchFormParameter.Request.Data.PARAM = "";
        self.searchFormParameter.Request.Data.BASE_DATE_CHK = self.searchFormParameter.Request.Data.EtcChk.length > 0 ? '1' : '';
        self.searchFormParameter.Request.Data.AMTDIGIT_LEN = self.searchFormParameter.Request.Data.AMTDIGIT_LEN == ['', '0', '1', '2', '3', '4'].join(ecount.delimiter) ? '' : self.searchFormParameter.Request.Data.AMTDIGIT_LEN;

        this.contents.getGrid().grid.clearChecked();

        if (this.dataSearch()) {
            this.header.toggle(forceHide);
        }
    },

    // header ReWrite button click event
    onHeaderRewrite: function (e) {
        this.header.reset();
    },

    // After the document is opening.
    onLoadComplete: function (e) {
        //set Fixed header
        this.contents.getGrid().settings.setHeaderTopMargin(this.header.height());

        var A_Len = this.header.getControl('AMTDIGIT_LEN');
        if (this.searchFormParameter.Request.Data.AMTDIGIT_LEN) {
            this.setSelectedControl(A_Len, this.searchFormParameter.Request.Data.AMTDIGIT_LEN);
        }

        if (!e.unfocus) {
            this.header.getQuickSearchControl().setFocus(0);
        }
    },

    // Message Handler for popup
    onMessageHandler: function (page, message) {
        if (page.pageID == "ESA035M") {
            this._ON_REDRAW();
        } else {
            this.reloadPage();
        }
    },
    /****************************************************************************************************
    * define grid event listener
    ****************************************************************************************************/

    onGridInit: function (e, data) {
        ecount.page.list.prototype.onGridInit.apply(this, arguments);
    },

    onGridRenderComplete: function (e, data) {
        var self = this;

        ecount.page.list.prototype.onGridRenderComplete.apply(this, arguments);
        if (!e.unfocus) {
            var control = this.header.getQuickSearchControl();

            control.setValue(self.searchFormParameter.Request.Data.PARAM);
            control.setFocus(0);
        }
    },

    //Grid row of one particular date
    setGridDataLink: function (value, rowItem) {
        var option = {};
        option.data = value;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: ecount.infra.getPageWidthFromConfig(true),
                    height: 250,
                    editFlag: "M",
                    useFlag: data.rowItem['USE_GUBUN'],
                    codeClassNo: data.rowItem['CODE_NO'],
                    codeClassType: this.CODE_CLASS,
                    codeClassDes: this.CLASS_DES,
                    isCloseDisplayFlag: true,
                    popupType: false,
                    additional: false
                };
                // false : Modal , true : pop-up
                this.openWindow(
                    {
                        url: '/ECERP/ESA/ESA035M',
                        name: this.HeaserTitlePopUpModify,
                        param: param
                    });
                e.preventDefault();
            }.bind(this)
        };
       
        return option;
    },

    //Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['USE_GUBUN'] == "N") {
            return true;
        }
    },

    /**************************************************************************************************** 
    * define action event listener
    ****************************************************************************************************/

    //sort : callback function to perform the sort.
    onColumnSortClick: function (e, data) {
        this.searchFormParameter.Request.Data.SORT_COLUMN = data.columnId;
        this.searchFormParameter.Request.Data.SORT_TYPE = data.sortOrder;
        // Put logic to draw a grid search terms
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    // event new  
    onFooterNew: function (cid) {
        if ((this.permission.CW == true) || this.permission.CD == true) {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 250,
                editFlag: "I",
                codeClassType: this.CODE_CLASS,
                codeClassDes: this.CLASS_DES,
                isCloseDisplayFlag: true,
                CHECK_FLAG: 'ESA034M',
                popupType: false,
                additional: false
            };
            // false : Modal , true : pop-up
            this.openWindow({
                url: '/ECERP/ESA/ESA035M',
                name: this.HeaderTitlePopUp,
                param: param
            });
        }
        else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93039, PermissionMode: "W" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }
    },

    onFooterExcel: function () {
        var self = this;
        // Check user authorization
        if (!ecount.config.user.USE_EXCEL_CONVERT) {
            var message = String.format("{0}{1}- {2}", ecount.resource.MSG00141, "\r\n", ecount.resource.LBL09653);
            ecount.alert(message);
            return false;
        }
        self.searchFormParameter.Request.Data.SheeNM = String.format(ecount.resource.LBL00064, ecount.resource.LBL01977);
        self.searchFormParameter.Request.Data.excelTitle = String.format("{0} : {1}", ecount.resource.LBL03176, ecount.company.COM_DES);
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "Y";
        self.EXPORT_EXCEL({
            url: "/SVC/Account/Basic/GetListForeignCurrencyForExcel",
            param: self.searchFormParameter
        });
        self.searchFormParameter.Request.Data.EXCEL_FLAG = "N";
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제(SelectedDelete)
    onButtonSelectedDelete: function (e) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        this.CodeNoList = "";

        var selectItem = this.contents.getGrid().grid.getChecked();
        self.selectedCnt = selectItem.length;

        if (self.selectedCnt == 0) {
            btnDelete.setAllowClick();
            ecount.alert(ecount.resource.MSG00213);
            return;
        }

        if (!this.permission.Value.equals("W")) {
            btnDelete.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: String.format(ecount.resource.LBL00064, ecount.resource.LBL01977), PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            $.each(selectItem, function (i, data) {
                self.CodeNoList += data.CODE_NO + ecount.delimiter;
            });

            if (self.CodeNoList.lastIndexOf(ecount.delimiter) == (self.CodeNoList.length - 1))
                self.CodeNoList = self.CodeNoList.slice(0, -1);

            if (status === false) {
                btnDelete.setAllowClick();
                return;
            }

            //삭제함수
            self.callDeleteListApi(self.CodeNoList, selectItem);
        });
    },

    onDropdownListSettings: function (e) {
        var param = {
            width: 800,
            height: 700,
            FORM_TYPE: this.formTypeCode,
            isSaveAfterClose: true, // Save and close
            FORM_SEQ: 1
        };
        this.openWindow({
            url: "/ECERP/Popup.Form/CM100P_02",
            name: 'CM100P_02',
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

    ON_KEY_F2: function (e, target) {
        this.onFooterNew();
    },

    ON_KEY_F8: function (e, target) {
        this.onHeaderSearch();
    },


    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    //setGridToolTip 
    setGridToolTip: function (value, rowItem) {
        var option = {},
            dt = (!rowItem.WDATE || !rowItem.WDATE.length || rowItem.WDATE.length) ? new Date() : rowItem.WDATE.toDate();

        option.data = ['Y'].contains(rowItem.USE_GUBUN) ? ecount.resource.LBL08030 : ecount.resource.LBL00243;

        option.attrs = {
            'data-toggle': 'tooltip',
            'data-placement': 'auto',
            'data-html': true,  //using html
            'title': ecount.infra.getECDateFormat('DATE33', false, dt)
        };
        return option;
    },
    // Reload
    setReload: function () {
        this.contents.getGrid().draw(this.searchFormParameter);
        this.header.getQuickSearchControl().hideError();
    },

    //Limited number of check checkbox
    onItemCountMessage: function (count) {
        ecount.alert(String.format(ecount.resource.MSG02158, count));
    },

    //삭제 처리
    callDeleteListApi: function (Data, selectItem) {
        var self = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var data = [];

        $.each(Data.split(ecount.delimiter), function (i, val) {
            if (Data.split(ecount.delimiter)[i].toString().length > 0) {
                data.push(val)
            }
        });

        var formdata = {
            Data: {
                PARAMS: data,     // 단일, 선택삭제시 삭제할 거래처코드
            }
        };

        ecount.common.api({
            url: "/SVC/Account/Basic/DeleteSelectedForeignCurrency",
            data: Object.toJSON(formdata),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {

                    //그리드 로우 삭제
                    self.contents.getGrid().grid.removeCheckedRow();

                    self.contents.getGrid().draw(self.searchFormParameter);
                }
            },
            complete: function (e) {
                btnDelete.setAllowClick();
            }
        });
    },

    reloadPage: function () {
        if (this.searchFormParameter.Request.Data.USE_GUBUN == "") {
            this.searchFormParameter.Request.Data.USE_GUBUN = "A";
        }

        this.onAllSubmit({
            url: "/ECERP/ESA/ESA034M",
            param: this.searchFormParameter
        });
    },

    _ON_REDRAW: function (param) {
        ecount.page.prototype._ON_REDRAW.apply(this, arguments);
        if (param && param.unfocus === true) {
            this.setFocusOnPage(true, 1);
        }

        this.setReload();
    },

    // (Activate button click event)
    onButtonActivate: function (e) {
        this.updateActiveYnForeignCurrency(this.getSelectedListforActivate("Y"));
    },

    // (DeActivate button click event)
    onButtonDeactivate: function (e) {
        this.updateActiveYnForeignCurrency(this.getSelectedListforActivate("N"));
    },

    setSelectedControl: function (control, param) {
        var lst = param.split(ecount.delimiter);
        $.each(['', '0', '1', '2'], function (i, data) {
            control.setValue(i, lst.contains(data) ? true : false);
        });

    },

    //(the function for get checked list in order to update CANCEL column (use y/n))
    getSelectedListforActivate: function (cancelYN) {
        var selectItem = this.contents.getGrid().grid.getChecked();
        var updatedList = {
            Data: []
        };
        $.each(selectItem, function (i, data) {
            updatedList.Data.push({
                CODE_NO: data.CODE_NO,
                USE_GUBUN: cancelYN,
            });
        });

        return updatedList;
    },

    // (activate or deactivate the customer)
    updateActiveYnForeignCurrency: function (updatedList) {

        var btn = this.footer.get(0).getControl("deleteRestore");
        if (!this.viewBag.Permission.permit.Value.equals("W")) {
            btn.setAllowClick();
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL01983, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            return false;
        }

        if (updatedList.Data.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            btn.setAllowClick();
            return;
        }
        ecount.common.api({
            url: "/SVC/Account/Basic/UpdateListUseForeignCurrency",
            data: Object.toJSON({
                Request:  updatedList      
            }),
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg + result.Data);
                }
                else {
                    this.contents.getGrid().draw(this.searchFormParameter);
                }
            }.bind(this),
            complete: function (e) {
                btn.setAllowClick();
            }
        });
    },

    // When you press the Search button
    // 검색버튼 눌렀을 때
    dataSearch: function () {
        var gridObj = this.contents.getGrid("dataGrid");

        var tabId = this.header.currentTabId;
        var invalid = this.header.validate(tabId);
        if (invalid.result.length > 0) {
            return;
        }

        this.contents.getGrid().grid.removeShadedColumn();

        gridObj.draw(this.searchFormParameter);

        this.header.toggle(true);
    },

    getTargetTabId: function (allTabId) {
        var tabId = this.header.currentTabId;
        tabId = this.isCustomTab(tabId) ? tabId : (allTabId || "all");

        return tabId;
    },
});
