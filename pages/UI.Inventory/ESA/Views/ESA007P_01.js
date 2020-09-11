window.__define_resource && __define_resource("LBL03034","LBL03037","BTN00204","LBL01845","LBL10018","LBL10019","LBL01418","LBL35244","LBL13531","LBL04417","BTN00553","LBL03146","LBL02389","LBL00757","LBL00793","LBL03638","LBL09409","LBL93038","MSG01390","MSG07493","MSG00710","MSG00522","LBL08030","LBL00243","MSG00636");
/****************************************************************************************************
1. Create Date : 2018.02.12
2. Creator     : Nguyen Thanh Trung
3. Description : Change project selection
4. Precaution  : 
5. History     : 2019.02.21 (PhiVo) A19_00558-FE 리팩토링_페이지 일괄작업 8차 apply getSelectedItem() method
                 [2019.05.03](DucThai) A19_01491 - FE 리팩토링 관련 페이지(프로젝트 선택변경 팝업창) 작업 요청
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
6. Menu Path   : Acct.I > Setup > Project > Checked one or all project > Change > In 'Search Field' popup check 'Project Group 1', 'Project Group 2' > Apply(F8)
****************************************************************************************************/

ecount.page.factory("ecount.page.changeItem", "ESA007P_01", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    selectedPjtCd: [],
    isShowSaveButtonByRow: true,
    selectedRow: {},
    selectedObject: {},
    filter_control: [],
    userPermit: "",
    incomeFlag: 0,
    updateBalanceList: null,
    iniYymm: null,
    acctDate: null,
    currRow: {},
    menuChkList: {},
    _useChangeSelectedForm: true,
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties(options);
    },

    initProperties: function (options) {

        incomeFlag = Number(ecount.config.company.INCOME_FLAG);
        this.setSettings();
        var willCheckItems = [];
        $.each(this.selectedPjtCd["pjt_cd"], function (i, data) {
            if ((data.IsSelected || "") != "") {
                willCheckItems.push(data["PJT_CD"]); /*체크박스에 체크할 목록*/
            };
        });

        var res = ecount.resource;

        options = $.extend({}, options, { data: (this.selectedPjtCd["pjt_cd"] || []) }); /*그리드에 매칭할 데이터를 공통변수에 넣는다.*/
        var columns = [
            { id: 'PJT_CD', propertyName: "PJT_CD", width: "80", title: res.LBL03034, editable: false },
            { id: 'PJT_DES_OLD', width: "100", title: res.LBL03037, editable: false, controlType: "widget.label" },
            { id: 'CANCEL_OLD', width: "100", title: res.BTN00204, align: 'center', editable: false, controlType: "widget.label" },
            { id: 'PJT_DES', propertyName: "PJT_DES", width: "100", title: res.LBL03037, isHideColumn: true, controlType: "widget.input.codeName" },
            { id: 'MENU_CHK', propertyName: "MENU_CHK", width: "250", title: res.LBL01845, isHideColumn: true },
            { id: 'PJT_CODE1', propertyName: "PJT_CODE1", width: "200", title: res.LBL10018, isHideColumn: true, controlType: "widget.code.processCode" },
            { id: 'PJT_CODE2', propertyName: "PJT_CODE2", width: "200", title: res.LBL10019, isHideColumn: true, controlType: "widget.code.processCode" },
            { id: 'REMARKS', propertyName: "REMARKS", width: "200", title: res.LBL01418, isHideColumn: true, controlType: "widget.input.general" },
            { id: 'CANCEL', propertyName: "CANCEL", width: "100", title: res.LBL35244, isHideColumn: true, controlType: "widget.select" },
        ]; /*화면에 출력할 그리드 컬럼을 정의한다.*/

        options = $.extend({}, options, { columns: columns, keycolumns: ["PJT_CD"], checkedItem: willCheckItems });  /*페이지별로 환경설정 변수.*/
        this._super.initProperties.call(this, options);  /*공통 페이지를 호출한다.*/
    },

    render: function ($parent) {
        this.userPermit = this.viewBag.Permission.Permit.Value;
        this._super.render.apply(this);
    },
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header) {
        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control();

        header
            .setTitle(ecount.resource.LBL13531)
            .notUsedBookmark()
    },

    onInitContents: function (contents) {

        var generator = widget.generator,
            ctrl = generator.control(),
            subCtrl = generator.control()
        res = ecount.resource;

        var controls = this._super.onInitContents.apply(this); /*contents를 알수 없어서 공통페이지를 호출해서 받아온다.*/

        /*하위 로직, 받아온 object들을 override 하는 과정. - 다른 페이지에서 필요없음 안해도 됨*/
        controls.grid
            .setCustomRowCell('PJT_DES_OLD', this.setGridDatePjtDesOld.bind(this))
            .setCustomRowCell('CANCEL_OLD', this.setGridDateCancelOld.bind(this))
            .setCustomRowCell('MENU_CHK', this.setGridMenuChk.bind(this))
            .setCustomRowCell('PJT_CODE1', this.setGridPjt.bind(this))
            .setCustomRowCell('PJT_CODE2', this.setGridPjt.bind(this))
            .setCustomRowCell('REMARKS', this.setGridRemarks.bind(this))
            .setCustomRowCell('CANCEL', this.setGridDateCancel.bind(this))
            ;

        var optionCancel = [];
        optionCancel.push(["N", res.LBL04417]);
        optionCancel.push(["Y", res.BTN00204]);

        controls.form
            .add(subCtrl.define("widget.input.codeName", "PJT_DES").end()).add(ctrl.define("widget.link", "btnApply1", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.checkbox", "MENU_CHK").label([res.LBL03146, res.LBL02389, res.LBL00757, res.LBL00793]).value(["acct", "inv", "gw", "payroll"]).end()).add(ctrl.define("widget.link", "btnApply", "btnApply2").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.code.processCode", "PJT_CODE1").end()).add(ctrl.define("widget.link", "btnApply3", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.code.processCode", "PJT_CODE2").end()).add(ctrl.define("widget.link", "btnApply4", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.input.general", "REMARKS").end()).add(ctrl.define("widget.link", "btnApply5", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            .add(subCtrl.define("widget.select", "CANCEL").option(optionCancel).end()).add(ctrl.define("widget.link", "btnApply6", "btnApply").label(ecount.resource.BTN00553).handler({ "click": function (e) { this.setApply(); }.bind(this) }).end())
            ;

        controls.form.setColSize(2);
        controls.form.useBaseForm({ _isThShow: true, _isToolbarType: true })
        controls.form.colgroup([{}, {}, { width: 50 }]);
        controls.form.rowspan(23, 0);
        controls.form.hide();
        /*~여기까지*/

        if (this.IsFromBalanceAdjustment == false)
            contents.add(controls.toolbar);

        contents.add(controls.form)
            .addGrid("dataGrid", controls.grid); /*공통 내부에서 grid의 id는 "dataGrid"로 사용하기 때문에, 이름을 바꾸면 안됨.*/
    },

    onInitFooter: function (footer) {
        var controls = this._super.onInitFooter.apply(this); /*공통페이지를 호출한다. footer를 알수 없어서 받아온다.*/
        footer.add(controls.toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/
    // Message Handler for popup
    onMessageHandler: function (page, data) {
        switch (page.pageID) {
            case "ESA007P_02": /*변경항목 팝업에서 선택한 항목을 해당 페이지에 바인딩하는 과정*/
                this.contents.getForm()[0].show();
                this.adjustContentsDimensions();

                this.setCheckSettingsItem(data.data);
                this.setTimeout(function () {
                    data.callback && data.callback(false);
                }.bind(this), 0);
                break;
            case "CM021P": /*일괄저장시 보안창에서 처리한 결과를 받아와서 페이지에서 처리하는 과정*/
                this.setTimeout(function () {
                    data.callback && data.callback(false);
                }.bind(this), 0);
                if ((data.data || "") == "close") {
                    var btn = this.footer.get(0).getControl("save");
                    btn.setAllowClick();
                }
                else {
                    this.SaveData(); /*실제 데이터 저장로직을 호출한다.*/
                };
                break;
        };
    },
    /*상위페이지에서 구현한 부분을 override 한다.*/
    onLoadComplete: function (e) {
        this._super.onLoadComplete.apply(this);
        this.adjustContentsDimensions();
    },

    /*상위 페이지 내부에서 onLoadComplete-event 이후에 해당 함수를 호출하도록 구현함. 페이지별로 구현해야됨-변경항목 팝업항목은 각 페이지별로 다르므로.*/
    onContentsChange: function (e) {
        if (this.IsFromBalanceAdjustment == false) {
            var params = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 600,
                dataOfPjtCd: Object.toJSON(this.selectedPjtCd["settings"])
            };

            this.openWindow({
                url: '/ECERP/ESA/ESA007P_02',
                name: ecount.resource.LBL03638,
                param: params,
                fpopupID: this.ecPageID,
                popupType: false,
            });
        }
        else {
            this.contents.getForm()[0].show();
            var settingData = [];
            var rowData = { COLUMN: "PJT_CODE2", DES: ecount.resource.LBL09409, _TREE_SET: { _DEPTH: 1, _PARENT_GROUP_ID: "1" } }
            settingData.push(rowData);

            this.setCheckSettingsItem(settingData);
        }
    },

    //닫기
    onFooterClose: function (e) {
        var thisObj = this;
        thisObj.sendMessage(this, {});
        thisObj.setTimeout(function () {
            thisObj.close();
        }, 0);
    },

    onFooterSave: function (e) {
        var btn = this.footer.get(0).getControl("save");
        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL93038, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }
        //체크하기
        var o = (this.contents.getGrid("dataGrid").grid.getChecked() || []);
        var send_data = [];
        var isRaisedError = false;
        var self = this;
        updateBalanceList = [];
        var _error = [];

        if (o.length <= 0) {
            btn.setAllowClick();
            ecount.alert(ecount.resource.MSG01390);
            return;
        };

        for (var i = 0; i < o.length; i++) {
            var __check = this.getSendData({ rowItem: o[i], rowIdx: i });

            if (__check["PJT_CD"] != null) {
                isRaisedError = false;
                send_data.push(__check);
            }
            else {
                isRaisedError = true;
                _error.push({ isRaisedError: isRaisedError });
            }
        };

        if (_error.length > 0) {
            btn.setAllowClick();
            return false;
        }

        if (isRaisedError == false) {
            var listOfPjtCd = [];

            for (var i = 0; i < send_data.length; i++) {
                listOfPjtCd.push(send_data[i].PJT_CD);
            };

            if (listOfPjtCd.length > 0) {
                if (self.siteCheck == "Y" || self.pjtCheck == "Y") {
                    ecount.common.api({
                        url: "/SelfCustomize/Config/GetMypagecompany",
                        data: Object.toJSON({
                            COM_CODE: this.viewBag.InitDatas.ComCode
                        }),
                        success: function (result) {
                            if (result.Status != "200") {
                                ecount.alert("error");
                            }
                            else {
                                if (self.siteCheck == "Y" && result.Data.USE_ACC102_SITE == "0") {
                                    ecount.alert(ecount.resource.MSG07493);
                                    btn.setAllowClick();
                                    return false;
                                }

                                if (self.pjtCheck == "Y" && result.Data.USE_ACC102_PJT == "0") {
                                    ecount.alert(ecount.resource.MSG07493);
                                    btn.setAllowClick();
                                    return false;
                                }

                                self._super.onFooterSave.apply(self);
                            }
                        }
                    });
                }
                else {
                    this._super.onFooterSave.apply(this);
                }

                btn.setAllowClick();
            };
        };

        btn.setAllowClick();
    },

    SaveData: function () {
        var o = this.contents.getGrid("dataGrid").grid.getChecked();
        var send_data = [];
        updateBalanceList = [];

        for (var i = 0; i < o.length; i++) {
            o[i].ACCT_CHK = o[i]["ACCT_CHK"];
            o[i].SALE_CHK = o[i]["SALE_CHK"];
            o[i].EGW_CHK = o[i]["EGW_CHK"];
            o[i].PAY_CHK = o[i]["PAY_CHK"];

            var __check = this.getSendData({ rowItem: o[i], rowIdx: i });
            if (__check["PJT_CD"] != null) {
                send_data.push(__check);
            };
        };

        var self = this;
        var btn = this.footer.get(0).getControl("save");

        var listOfPjtCd = [];
        for (var i = 0; i < send_data.length; i++) {
            listOfPjtCd.push(send_data[i].PJT_CD);
        };

        if (listOfPjtCd.length > 0) {
            save.call(this);
        }
        else {
            btn.setAllowClick();
        };

        function save() {
            ecount.common.api({
                url: "/SVC/Account/Basic/UpdateSitePjtChange",
                data: Object.toJSON({
                    Request: {
                        Data: send_data
                    }
                }),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(ecount.resource.MSG00710, function () {
                            self.close(false);
                            btn.setAllowClick();
                        });
                        return;
                    }
                    else {
                        ecount.alert(ecount.resource.MSG00522, function () {
                            self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: listOfPjtCd, unfocus: true, checkByPass: true }); /*부모페이지 refresh*/
                            btn.setAllowClick();

                            self.sendMessage(this, {});
                            self.setTimeout(function () {
                                self.close();
                            }, 0);
                        }); /*팝업창을 닫지 않음.*/
                    }
                }
            });
            btn.setAllowClick();
        }
    },

    /*라인별 저장시 사용한다. - 상위페이지에서 이미 구현해두었으므로, 해당 함수를 구현하면 된다.*/
    onSaveDataByRow: function (e, data) {
        updateBalanceList = [];
        var __self = this;
        var send_data = this.getSendData(data);

        if (send_data["PJT_CD"] == null) {
            return;
        };

        var o = this.contents.getGrid("dataGrid").grid.getRowList();

        var listOfPjtCd = [];
        listOfPjtCd.push(send_data["PJT_CD"]);

        //부서, 프로젝트별 집계 사용시 회사설정 다시한번 확인
        __self.saveKey = data.rowItem["K-E-Y"];
        if (send_data.ACC105_SITE == 1 || send_data.ACC105_PJT == 1) {
            ecount.common.api({
                url: "/SelfCustomize/Config/GetMypagecompany",
                data: Object.toJSON({
                    COM_CODE: this.viewBag.InitDatas.ComCode
                }),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert("error");
                    } else {
                        if (__self.contents.getGrid().grid.getRowItem(__self.saveKey)["PJT_CODE2"][3].contains("1") == true && result.Data.USE_ACC102_SITE == "0") {
                            ecount.alert(ecount.resource.MSG07493);
                            btn.setAllowClick();
                            return false;
                        }

                        if (__self.contents.getGrid().grid.getRowItem(__self.saveKey)["PJT_CODE2"][3].contains("2") == true && result.Data.USE_ACC102_PJT == "0") {
                            ecount.alert(ecount.resource.MSG07493);
                            btn.setAllowClick();
                            return false;
                        }

                        save.call(this);
                    }
                }
            });
        } else {
            if (listOfPjtCd.length > 0) {
                save.call(this);
            }
        }

        function save() {
            ecount.common.api({
                url: "/SVC/Account/Basic/UpdateSitePjtChange",
                data: Object.toJSON({
                    Request: {
                        Data: [send_data]

                    }
                }),
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(ecount.resource.MSG00710, function () {
                            __self.close(false);
                        });
                        return;
                    }
                    else {
                        ecount.alert(ecount.resource.MSG00522, function () {
                            __self.getParentInstance(self.parentPageID)._ON_REDRAW({
                                serialIdx: listOfPjtCd, unfocus: true, checkByPass: true
                            });
                        }); /*팝업창을 닫지 않음.*/
                    }
                }
            });
        }
    },

    setSettings: function () {
        this.selectedPjtCd = (this.viewBag.InitDatas.ListsOfPjtCd || []);
        $.each(this.selectedPjtCd["settings"], function (i, data) {
            data["IsSelected"] = "";
        });
        $.each(this.selectedPjtCd["pjt_cd"], function (i, data) {
            data["IsSelected"] = "1";
        });
        return this.selectedPjtCd;
    },


    /*변경항목에서 선택한 항목을 그리드에 세팅, 변경항목영역에 항목을 세팅함 - 다른페이지는 다를 수 있음 (참고만)*/
    setCheckSettingsItem: function (selectedItem) {
        this.modifyItems = (selectedItem || []);
        var settingObject = this.selectedPjtCd["settings"];
        var grid = this.contents.getGrid("dataGrid").grid;
        var columns = grid.getColumnInfoList();
        for (var i = 0; i < columns.length; i++) {
            if ((columns[i].id == "PJT_CD") || (columns[i].id == "PJT_DES_OLD") || (columns[i].id == "CANCEL_OLD") || (columns[i].id == "save")) continue;
            grid.setColumnVisibility((columns[i].id), false); /*그리드에 항목들 초기화 - 계정코드, 저장 컬럼은 계속 보이도록 처리한다.*/
        };
        for (var i = 0; i < settingObject.length; i++) {
            settingObject[i].IsSelected = "";
        };

        $.each(selectedItem, function (i, data) {
            for (var i = 0; i < settingObject.length; i++) {
                if (settingObject[i].COLUMN == data.COLUMN) {
                    settingObject[i].IsSelected = "1"; /*항목선택 팝업창에서 체크박스에 체크를 할 수 있도록 한다. - 페이지끼리 사용하는 변수*/
                };
            };

            grid.setColumnVisibility((data.COLUMN), true); /*그리드에 숨겼던 항목 보이게 처리-선택된 항목만 보이게 한다.*/
        });
        /*일괄변경 영역 처리 시작 ~*/
        var vOptions = [];

        for (var i = 0; i < this.modifyItems.length; i++) {
            if (this.modifyItems[i]["_TREE_SET"]._PARENT_GROUP_ID == "0000") continue;
            vOptions.push([this.modifyItems[i].COLUMN, this.modifyItems[i].DES]);
        };

        this.contents.getControl("selApply").show();
        this.contents.getControl("selApply").removeOption();
        this.contents.getControl("selApply").addOption(vOptions);

        //dev30048
        this.contents.getForm()[0].showTd("selApply");

        var selectedItem = this.contents.getControl("selApply").getSelectedItem();
        this.setSelApplyFocus(selectedItem.value);
        /*~일괄변경 영역 처리 끝*/
    },

    onChangeControl: function (control, data, command) {
        switch (control.cid) {
            case "selApply":
                this.setSelApplyFocus(control.value);
                break;
        };
    },

    setSelApplyFocus: function (value) {
        this.contents.getForm()[0].hideTdAll();

        this.contents.getForm()[0].showTd(value);

        /*항목에 따라 일괄변경항목을 초기화 이후 출력여부 결정*/
        switch (value) {
            case "MENU_CHK":
            case "PJT_DES":
                this.contents.getControl(value).setValue("");
                break;
            case "CANCEL":
                this.contents.getControl(value).setValue("N");
                break;
            case "PJT_CODE1":
            case "PJT_CODE2":
            default:
                break;
        };
    },

    setGridDatePjtDesOld: function (value, rowItem) {
        var option = {};
        option.data = rowItem["PJT_DES"];
        return option;
    },

    setGridPjt: function (value, rowItem) {
        var option = {};
        var _self = this;
        option.controlOption = {
            controlEvent: {
                itemSelect: function (rowKey, arg) {

                    if (arg.message.data) {
                        var grid = _self.contents.getGrid("dataGrid").grid;
                        var item_grid = grid.getRowList()[arg.control.rowIdx];
                        grid.setCell(arg.control.id, item_grid[ecount.grid.constValue.keyColumnPropertyName], arg.message.data["CODE_NO"], { isRefresh: true, isRunChange: false });
                    }
                },
            },
        };

        return option;
    },

    setGridPjtDes: function (value, rowItem) {
        var option = {};
        option.value = rowItem["PJT_DES"];
        return option;
    },

    setGridMenuChk: function (value, rowItem) {
        var option = {};
        var _self = this;
        option.controlType = "widget.checkbox.multi";
        // Init data for check box multi
        option.data = [];
        option.data.push({ id: 'acct', label: ecount.resource.LBL03146 })
        option.data.push({ id: 'inv', label: ecount.resource.LBL02389 })
        option.data.push({ id: 'gw', label: ecount.resource.LBL00757 })
        option.data.push({ id: 'payroll', label: ecount.resource.LBL00793 })

        option.attrs = {};
        option.attrs['checked'] = {};
        option.attrs['disabled'] = {};

        if (rowItem.ACCT_CHK == "Y")
            option.attrs['checked']['acct'] = 'checked';

        if (rowItem.SALE_CHK == "Y")
            option.attrs['checked']['inv'] = 'checked';

        if (rowItem.EGW_CHK == "Y")
            option.attrs['checked']['gw'] = 'checked';

        if (rowItem.PAY_CHK == "Y")
            option.attrs['checked']['payroll'] = 'checked';

        if (rowItem.MENU_CHK) {
            option.attrs['checked']['acct'] = '';
            option.attrs['checked']['inv'] = '';
            option.attrs['checked']['gw'] = '';
            option.attrs['checked']['payroll'] = '';

            if (value.ACCT_CHK == "Y")
                option.attrs['checked']['acct'] = 'checked';

            if (value.SALE_CHK == "Y")
                option.attrs['checked']['inv'] = 'checked';

            if (value.EGW_CHK == "Y")
                option.attrs['checked']['gw'] = 'checked';

            if (value.PAY_CHK == "Y")
                option.attrs['checked']['payroll'] = 'checked';
        }

        option.event = {
            'click': function (e, data) {
                var grid = _self.contents.getGrid().grid,
                    childElementId = data['childElementId'];

                if (childElementId === 'acct') {
                    grid.setCell('ACCT_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'inv') {
                    grid.setCell('SALE_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'gw') {
                    grid.setCell('EGW_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'payroll') {
                    grid.setCell('PAY_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
            }.bind(this),

            'change': function (e, data) {
                var grid = _self.contents.getGrid().grid,
                    childElementId = data['childElementId'];

                if (childElementId === 'acct') {
                    grid.setCell('ACCT_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'inv') {
                    grid.setCell('SALE_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'gw') {
                    grid.setCell('EGW_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
                else if (childElementId === 'payroll') {
                    grid.setCell('PAY_CHK', data['rowKey'], data['checked'][childElementId] ? "Y" : "N");
                }
            }.bind(this)
        }

        return option;
    },

    setGridDateCancelOld: function (value, rowItem) {
        var option = {};
        var res = ecount.resource;
        switch (rowItem["CANCEL"]) {
            case "Y":
                option.data = res.LBL08030;
                break;
            case "N":
                option.data = res.LBL00243;
                break;
        }

        return option;
    },

    setGridDateCancel: function (value, rowItem) {
        var option = {};
        var res = ecount.resource;
        var optionList = new Array();
        optionList.push(["N", res.LBL04417]);
        optionList.push(["Y", res.BTN00204]);
        option.optionData = optionList;

        return option;
    },

    /*디비에 저장할 데이터 가공하는 영역*/
    getSendData: function (data) {
        var return_value = this._super.CheckSaveData.apply(this);

        if (return_value == true) {
            var object_data = this._super.getSaveRowData(data.rowItem);
            var _keys = this._super._KeysOfJson(object_data);
            for (var i = 0; i < _keys.length; i++) {
                if (object_data[(_keys[i])] == null) continue;
            };
        }
        else {
            return {}; /*실패처리해야된다.*/
        };

        var objGrid = this.contents.getGrid("dataGrid").grid;
        var _send_data = {}; /*업데이트할 데이터만 가공해서 넘긴다.*/
        var isRaisedError = false;

        if ((this.modifyItems || []).length > 0) {
            for (var i = 0; i < this.modifyItems.length; i++) {
                var option = {};

                if (this.modifyItems[i].COLUMN == "PJT_DES" && object_data[(this.modifyItems[i].COLUMN)] == "") {
                    option.message = ecount.resource.MSG00636;
                    objGrid.setCellShowError("PJT_DES", object_data["PJT_CD"], option);
                    isRaisedError = true;
                }
                else if (this.modifyItems[i].COLUMN == "MENU_CHK") {
                    _send_data["ACCT_CHK"] = "N";
                    _send_data["SALE_CHK"] = "N";
                    _send_data["EGW_CHK"] = "N";
                    _send_data["PAY_CHK"] = "N";

                    if (object_data["PJT_CD"] === data.rowItem["PJT_CD"]) {
                        _send_data["ACCT_CHK"] = object_data["ACCT_CHK"];
                        _send_data["SALE_CHK"] = object_data["SALE_CHK"];
                        _send_data["EGW_CHK"] = object_data["EGW_CHK"];
                        _send_data["PAY_CHK"] = object_data["PAY_CHK"];
                    }
                }
                else {
                    _send_data[(this.modifyItems[i].COLUMN)] = object_data[(this.modifyItems[i].COLUMN)];
                }
            };

            _send_data["PJT_CD"] = data.rowItem["PJT_CD"];
        };

        if (isRaisedError == true)
            return {};

        return _send_data;
    },

    setGridRemarks: function (value, rowItem) {
        var option = {};
        option.data = rowItem["REMARKS"];
        return option;
    },

    onAutoCompleteHandler: function (control, keyword, param, handler) {
        switch (control.id) {
            case "PJT_CODE1":
                param.CODE_CLASS = "G10";
                break;
            case "PJT_CODE2":
                param.CODE_CLASS = "G11";
                break;
        }

        handler(param);
    },
    /*팝업창 호출시 팝업창에 넘겨주는 값들 정의*/
    onPopupHandler: function (control, param, handler) {
        this.selectedRow = { "rowIdx": (control.rowKey || 0), "row_id": control.id };

        switch (control.id) {
            case "PJT_CODE2":
                param.custGroupCodeClass = "G11";
                param.CODE_CLASS = "G11";
                break;
            case "PJT_CODE1":
                param.custGroupCodeClass = "G10";
                param.CODE_CLASS = "G10";
                break;
        };

        handler(param);
    },

    setApply: function (e) {
        var selectedItem = this.contents.getControl("selApply").getSelectedItem();
        var row_id = (selectedItem.value || "");
        var row_value = this.contents.getControl(row_id);

        var grid = this.contents.getGrid("dataGrid").grid;

        for (var i = 0; i < grid.getRowList().length; i++) {
            var item_grid = grid.getRowList()[i];

            if (this.getCheckedItem(item_grid.PJT_CD) == true) {
                switch (row_id) {
                    case "MENU_CHK":
                        item_grid["ACCT_CHK"] = "N";
                        item_grid["SALE_CHK"] = "N";
                        item_grid["EGW_CHK"] = "N";
                        item_grid["PAY_CHK"] = "N";

                        grid.setCell('ACCT_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "N");
                        grid.setCell('SALE_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "N");
                        grid.setCell('EGW_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "N");
                        grid.setCell('PAY_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "N");

                        var checkedList = row_value.getCheckedItems();
                        _.forEach(checkedList, function (item) {
                            switch (item.value) {
                                case "acct":
                                    item_grid["ACCT_CHK"] = "Y";
                                    grid.setCell('ACCT_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "Y");
                                    break;
                                case "inv":
                                    item_grid["SALE_CHK"] = "Y";
                                    grid.setCell('SALE_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "Y");
                                    break;
                                case "gw":
                                    item_grid["EGW_CHK"] = "Y";
                                    grid.setCell('EGW_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "Y");
                                    break;
                                case "payroll":
                                    item_grid["PAY_CHK"] = "Y";
                                    grid.setCell('PAY_CHK', item_grid[ecount.grid.constValue.keyColumnPropertyName], "Y");
                                    break;
                            }
                        });

                        grid.setCell("MENU_CHK", item_grid[ecount.grid.constValue.keyColumnPropertyName], item_grid, { isRefresh: true, isRunChange: false });
                        break;
                    case "CANCEL":
                    case "PJT_DES":
                    case "CANCEL":
                        grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value.getValue(), { isRefresh: true, isRunChange: false });
                        break;
                    case "PJT_CODE1":
                    case "PJT_CODE2":
                        grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value.getSelectedItem()[0].value, { isRefresh: true, isRunChange: false });
                        break;
                    default:
                        this.contents.getGrid("dataGrid").grid.setCell(row_id, item_grid[ecount.grid.constValue.keyColumnPropertyName], row_value.getValue(), { isRefresh: true, isRunChange: false });
                        break;
                }
            };
        };
    },

    getCheckedItem: function (value) {
        var o = (this.contents.getGrid("dataGrid").grid.getChecked() || []);
        if (o.length <= 0) { return false; };
        var isReturnValue = false;
        for (var i = 0; i < o.length; i++) {
            if (o[i].PJT_CD == value) {
                isReturnValue = true;
                break;
            };
        };
        return isReturnValue;
    },
});