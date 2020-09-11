window.__define_resource && __define_resource("LBL07276","LBL07277","LBL02332","LBL07245","MSG10098","MSG10121","BTN00780","BTN00779","BTN00390","BTN00540","BTN00081","MSG09786","LBL00914","LBL07553","BTN00644","LBL00347","BTN00315","MSG10096","LBL07741","LBL07244","MSG10064","MSG03547","MSG10119","BTN00222");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : Acct.I, Inv.I > Customer/Vendor > Level Group / 회계1, 재고1 > 기초등록 > 거레처등록 > 계층그룹 
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 [2015-10-21] 신희준 : 거래처계층그룹 조회용/검색용 통합 및 코드 리펙토링
                 [2015-12-02] 노지혜 : 헤더버튼클래스추가
                 [2016-02-17] Nguyen Anh Tuong : 창고계층그룹 공통화 Location Level Group Standardization
                 [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
6. Old File    : ESA047M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA047M", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    userPermit: null,           // 거래처 계층그룹 페이지 권한

    viewPermit: null,           // 해당 거래처계층그룹코드에 대해서 권한 체크

    formInfoData: null,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.formInfoData = this.viewBag.FormInfos['SR910'];
        this.searchFormParameter = {
            CD_GROUP: this.PCODE,
            GB_TYPE: this.PType === null ? "IN" : this.PType,
            SEARCH_TEXT: '',
            SORT_COLUMN: "BUSINESS_NO",
            SORT_TYPE: 'A',
            PAGE_SIZE: this.formInfoData.option.pageSize,
            DEL_GUBUN: ""
        };
        this.initProperties();
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    // Set Default Properties
    initProperties: function () {
        this.userPermit = this.viewBag.Permission.PermitTree.Value; // 거래처 계층그룹 페이지 권한

        this.viewPermit = this.viewBag.InitDatas.viewPermit;        // 해당 거래처계층그룹코드에 대해서 권한 체크

    },

    // 헤더 옵션 설정
    onInitHeader: function (header) {
        header.notUsedBookmark().useQuickSearch();
    },

    // 본문 옵션 설정
    onInitContents: function (contents, resource) {
        var toolbar = widget.generator.toolbar(),
            tabContents = widget.generator.tabContents(),
            grid = widget.generator.grid(),
            ctrl = widget.generator.control();

        // ROOT의 조회페이지가 아니고 해당 거래처계층그룹코드에 대해서 권한이 있을 때
        if (this.PCODE !== 'ROOT' && this.viewPermit === 'Y') {
            grid.setRowData(this.viewBag.InitDatas.DataLoad)
                .setRowDataUrl("/Inventory/Basic/GetSearchCustByLevelInfo")
                .setRowDataParameter(this.searchFormParameter);
        }

        var formData = this.viewBag.FormInfos.SP910; // 거래처검색창 양식
        for (var ii = 0; ii < formData.columns.length; ii++) {
            formData.columns[ii].controlType = "widget.label";
        }

        grid
            .setFormData(formData)
            //.setCheckBoxRememberChecked(false)
            .setKeyColumn(['BUSINESS_NO', 'CUST_NAME'])
            .setStyleRowBackgroundColor(function (data) { return data['CANCEL'] == "Y"; }, 'danger')
            .setColumnFixHeader(true)
            .setColumnSortable(true)
            .setColumnSortDisableList(['cust.cancel', 'cust.com_code', 'cust.remarks', 'mem.remarks', 'cust.file', 'cust.detail'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setCheckBoxUse(["CREATE", "AUTH"].contains(this.Type))
            .setPagingUse(true)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('cust.com_code', this.setGridBankAccount.bind(this))
            .setCustomRowCell('cust.file', this.setGridFile.bind(this))
            .setCustomRowCell('cust.detail', this.setGridDetail.bind(this));

        if (["CREATE", "AUTH"].contains(this.Type)) {
            tabContents
                .onSingleMode()
                .createActiveTab("IN", ecount.resource.LBL07276)
                .add(toolbar)
                .addGrid("dataGrid", grid)
                .createTab("OUT", ecount.resource.LBL07277)
                .createRightTab("NO", ecount.resource.LBL02332);
            contents.add(tabContents);
        }
        else {
            contents.add(toolbar).addGrid("dataGrid", grid);
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

    onLoadComplete: function () {
        this.changeTitle(this.PCODE == 'ROOT' ? ecount.resource.LBL07245 : this.PText);

        if (["CREATE", "AUTH"].contains(this.Type))
            this.footer.getControl('ItemAdd').hide();

        var grid = this.contents.getGrid();
        grid.settings.setHeaderTopMargin(this.header.height());

        if (this.PCODE == 'ROOT') {
            grid.settings.setEmptyGridMessage(ecount.resource.MSG10098);
            grid.draw(this.searchFormParameter);
        }
        else if (this.viewPermit == 'N') {
            grid.settings.setEmptyGridMessage(ecount.resource.MSG10121);
            grid.draw(this.searchFormParameter);
        }

        if (this.PCODE == 'ROOT') {
            var parentFrame = ecount.getParentFrame(window); 
            parentFrame.$('[data-cid=searchTree]')[0].focus();
            return;
        }
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.Type != "SEARCH" && this.Type != "SELECT") {
            toolbar
                .addLeft(ctrl.define("widget.button", "ItemAdd").label(ecount.resource.BTN00780))
                .addLeft(ctrl.define("widget.button", "Remove").css("btn btn-primary").label(ecount.resource.BTN00779))
                .addLeft(ctrl.define("widget.button", "Move").label(ecount.resource.BTN00390))
                .addLeft(ctrl.define("widget.button", "GroupList").label(ecount.resource.BTN00540)); //type, button list;
        }
        footer.add(toolbar);
    },
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);

        if (this.PCODE != 'ROOT') {
            var control = this.header.getQuickSearchControl();
            control.setValue(this.searchFormParameter.SEARCH_TEXT);
            control.onFocus(0);
        }
    },

    //Header Quick Search
    onHeaderQuickSearch: function (event) {
        this.header.lastReset(this.searchFormParameter.SEARCH_TEXT);
        this.searchFormParameter.SEARCH_TEXT = this.header.getQuickSearchControl().getValue();
        var grid = this.contents.getGrid();
        grid.getSettings().setPagingCurrentPage(1);
        grid.draw(this.searchFormParameter);
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

    // 그리드에서 정렬을 클릭했을때
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.propertyName;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
    },

    // 그리드에서 파일관리를 클릭했을때
    setGridFile: function (value, rowItem) {
        var self = this;
        var option = {};
        option.data = ecount.resource.BTN00081;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                //var locationAllow = ecount.infra.getGroupwarePermissionByAlert(self.viewBag.InitDatas.GroupwarePermission).Excute();
                if ($.isEmpty(data.rowItem["CUST_IDX"])) {
                    ecount.alert(ecount.resource.MSG09786);
                    return false;
                }
               // if (locationAllow) {
                    var param = {
                        width: 780,
                        height: 600,
                        b_type: "A01",
                        BOARD_CD: 7000,
                        isFileManage: true,
                        //code: data.rowItem['BUSINESS_NO'],
                        //code_des: data.rowItem['CUST_NAME'],
                        TITLE: "[" + data.rowItem.BUSINESS_NO + "] " + data.rowItem.CUST_NAME,
                        BOARD_CD: 7001,
                        custCdAllInOne: data.rowItem["CUST_IDX"],
                        custDesAllInOne: data.rowItem["CUST_DES"],
                        isFileManage: true,
                        Popup_Flag: "Y",
                        ProgramType: "NEW"
                    };
                    this.openWindow({
                        //url: '/ECMAIN/ESA/ESA009P_04.aspx',
                        url: "/ECERP/EGM/EGM024M",
                        //name: data.rowItem['CUST_NAME'] + "[" + data.rowItem['BUSINESS_NO'] + "] " + ecount.resource.LBL00914,
                        name: ecount.resource.LBL07553,
                        param: param,
                        popupType: false,
                        additional: true,
                        fpopupID: this.ecPageID // 추가
                    });
               // }
                e.preventDefault();
            }.bind(this)
        }
        if (value != "0") {
            option.attrs = {
                'Class': 'text-warning'
            };
        }
        return option;
    },

    // 그리드에서 통장을 클릭했을 때
    setGridBankAccount: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource.BTN00644;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 600,
                    height: 400,
                    CUST: data.rowItem['BUSINESS_NO'],
                    CUST_DES: data.rowItem['CUST_NAME']
                };
                this.openWindow({
                    url: '/ECERP/ESA/ESA001P_05',
                    name: ecount.resource.LBL00347,
                    param: param,
                    popupType: false,
                    additional: true
                });
                e.preventDefault();
            }.bind(this)
        }
        if (value != "0") {
            option.attrs = {
                'Class': 'text-warning'
            };
        }
        return option;
    },

    //팝업창에서 부모에게 넘겨준값 컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (page, message) {
        if (message == "CUST") {
            this.contents.getGrid().draw(this.searchFormParameter);
        } else if (page.pageID == 'ESA057P_01')
            this.setReload(this);
    },

    // 그리드에서 상세내역을 클릭했을 때
    setGridDetail: function (value, rowItem) {
        var option = {};
        var sDate = Date.format("yymmdd", new Date(this.viewBag.LocalTime.left(10).toDate()).firstDayOfMonth());
        var eDate = Date.format("yymmdd", new Date(this.viewBag.LocalTime.left(10).toDate()));

        option.data = ecount.resource.BTN00315;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                var param = {
                    width: 800,
                    height: 600,
                    cust: data.rowItem["BUSINESS_NO"],
                    //CustEditType: "ALL_IN_ONE_SEARCH"
                };
                this.openWindow({
                    url: "/ECERP/ESQ/ESQ501M",
                    name: 'ESQ501M',
                    param: param,
                    popupType: false,
                    additional: false,
                    fpopupID: this.ecPageID
                });

                e.preventDefault();
            }.bind(this)
        }
        return option;
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    //Press ENTER key event
    ON_KEY_ENTER: function (e, target) {
        if (e.target.name == "keyword" && target != null) {
            this.onContentsSearch(e);
        }
    },

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    // View Group button click event
    onFooterGroupList: function (e) {
        var btnList = this.footer.getControl('GroupList');
        var cdList = '';
        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnList.setAllowClick();
            return false;
        }

        $.each(selectItem, function (i, data) {
            cdList += data.BUSINESS_NO + ecount.delimiter;
        });

        // Define data transfer object
        var params = {
            width: 480,
            height: 500,
            PCodes: cdList,
            LevelGroupType: 'CUST'
        };

        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA057P_02',
            name: ecount.resource.LBL07741,
            param: params,
            popupType: false,
            additional: false
        });

        btnList.setAllowClick();
    },

    // ItemAdd Item button click event
    onFooterItemAdd: function (e) {
        var btnAdd = this.footer.getControl('ItemAdd');

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07244, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnAdd.setAllowClick();
            return false;
        }

        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnAdd.setAllowClick();
            return false;
        }

        var thisObj = this;
        var cd_parent = this.PCODE;

        ecount.confirm(ecount.resource.MSG10064, function (status) {
            if (status === true) {
                var cdList = '';

                $.each(selectItem, function (i, data) {
                    cdList += data.BUSINESS_NO + ecount.delimiter;
                });

                var data = {
                    Request: {
                        Data: {
                            CD_PARENT: cd_parent,
                            CD_GROUP: cdList,
                            ACTION: "I"
                        }
                    }
                }

                ecount.common.api({
                    url: "/SVC/Account/Basic/RemoveInsertCustToGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else if (result.Data == "1")
                            ecount.alert(ecount.resource.MSG03547);
                        else
                            thisObj.setReload(thisObj);
                    },
                    complete: function () {
                        btnAdd.setAllowClick();
                    }
                });
            } else {
                btnAdd.setAllowClick();
            }
        });
    },

    //Remove button click event
    onFooterRemove: function (e) {
        var btnRemove = this.footer.getControl('Remove');

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07244, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnRemove.setAllowClick();
            return false;
        }

        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnRemove.setAllowClick();
            return false;
        }

        var thisObj = this;
        var cd_parent = this.PCODE;

        ecount.confirm(ecount.resource.MSG10119, function (status) {
            if (status === true) {
                var cdList = '';

                $.each(selectItem, function (i, data) {
                    cdList += data.BUSINESS_NO + ecount.delimiter;
                });

                var data = {
                    Request: {
                        Data: {
                            CD_PARENT: cd_parent,
                            CD_GROUP: cdList,
                            ACTION: "D"
                        }
                    }
                }

                ecount.common.api({
                    url: "/SVC/Account/Basic/RemoveInsertCustToGroup",
                    data: Object.toJSON(data),
                    success: function (result) {
                        if (result.Status != "200")
                            ecount.alert(result.fullErrorMsg);
                        else if (result.Data == "1")
                            ecount.alert(ecount.resource.MSG03547);
                        else
                            thisObj.setReload(thisObj);
                    },
                    complete: function () {
                        btnRemove.setAllowClick();
                    }
                });
            } else {
                btnRemove.setAllowClick();
            }
        });
    },

    //Move button click event
    onFooterMove: function (e) {
        var btnMove = this.footer.getControl('Move');

        if (this.userPermit != "W") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07244, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btnMove.setAllowClick();
            return false;
        }

        var cdList = '';
        var selectItem = this.contents.getGrid().grid.getChecked();

        if (selectItem.count() == 0) {
            ecount.alert(ecount.resource.MSG10096);
            btnMove.setAllowClick();
            return false;
        }

        $.each(selectItem, function (i, data) {
            cdList += data.BUSINESS_NO + ecount.delimiter;
        });

        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            CD_Group: this.PCODE,
            NM_Group: this.PText,
            PCodes: cdList,
            LevelGroupType: 'CUST'
        };

        //Open popup
        this.openWindow({
            url: '/ECERP/Popup.Common/ESA057P_01',
            name: ecount.resource.BTN00222,
            param: params,
            popupType: false,
            additional: false
        });

        btnMove.setAllowClick();
    },

    onChangeContentsTab: function (event) {
        this.searchFormParameter.GB_TYPE = event.tabId;
        switch (event.tabId) {
            case "OUT":
                this.footer.getControl("GroupList").show();
                this.footer.getControl("ItemAdd").show();
                this.footer.getControl("Remove").hide();
                this.footer.getControl("Move").hide();
                break;
            case "NO":
                this.footer.getControl("GroupList").hide();
                this.footer.getControl("ItemAdd").show();
                this.footer.getControl("Remove").hide();
                this.footer.getControl("Move").hide();
                break;
            default:
                this.footer.getControl("GroupList").show();
                this.footer.getControl("ItemAdd").hide();
                this.footer.getControl("Remove").show();
                this.footer.getControl("Move").show();
                break;
        }

        if (this.PCODE != 'ROOT') {
            this.contents.getGrid().draw(this.searchFormParameter);
        }
        this.contents.getGrid().grid.clearChecked();
        //this.contents.getControl("Search").onFocus(0);
    },

    // Reload grid
    setReload: function (e) {
        this.contents.getGrid().draw(this.searchFormParameter);
    }
});