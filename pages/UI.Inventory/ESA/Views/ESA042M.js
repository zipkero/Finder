window.__define_resource && __define_resource("MSG03839","LBL07276","LBL07277","LBL02332","LBL08020","MSG10098","MSG10121","BTN00780","BTN00779","BTN00390","BTN00540","LBL02072","BTN00081","LBL00914","LBL18820","MSG04121","MSG00141","MSG04479","MSG10096","LBL07741","LBL07243","MSG10064","MSG03547","MSG10119","BTN00222");
/****************************************************************************************************
1. Create Date : 2015.04.16
2. Creator     : 강성훈
3. Description : 품목 계층그룹 리스트
4. Precaution  : 
5. History     : [2015-08-25] 강성훈 : 코드 리펙토링
                 [2015-12-02] 노지혜 : 헤더버튼클래스추가
                 [2015-11-23] 이일용 : 품목 계층그룹 리스트 통합 및 리펙토링
                 [2019.05.14] 이현택 : 품목 계층그룹에 품목 포함로직 3.0으로 변경
6. Old File    : ESA042M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.list", "ESA042M", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    formInfoData: null,
    /********************************************************************** 
    * page init 
    **********************************************************************/
    // init
    init: function () {
        this._super.init.apply(this, arguments);
        this.userPermit = this.viewBag.Permission.PermitTree.Value;
        this.viewPermit = this.viewBag.InitDatas.viewPermit;
        this.formInfoData = this.viewBag.FormInfos['SR900'];        
        //this.Type = "CREATE";
        this.searchFormParameter = {
            CD_GROUP: this.PCODE,
            GB_TYPE: this.PType == null ? "IN" : this.PType,
            SEARCH_TEXT: '',
            SORT_COLUMN: this.Sort == null ? "PROD_CD" : this.Sort,
            SORT_TYPE: this.SortAd == null ? 'A' : this.SortAd,
            PAGE_SIZE: this.formInfoData.option.pageSize,
            DEL_GUBUN: "",
            
        };
        
    },
    // render
    render: function () {
        this._super.render.apply(this, arguments);
    },
    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정 (Init Header)
    onInitHeader: function (header) {
        header.notUsedBookmark().useQuickSearch();
    },
    //본문 옵션 설정
    onInitContents: function (contents) {
        var toolbar = widget.generator.toolbar(),
            tabContents = widget.generator.tabContents(),
            grid = widget.generator.grid();

        //SR900
        var formData = this.viewBag.FormInfos.SP900;
        for (var ii = 0; ii < formData.columns.length; ii++) {
            formData.columns[ii].controlType = "widget.label";
        }
       

        // Initialize Grid
        if (this.PCODE != 'ROOT' && this.viewPermit == 'Y') {
            grid.setRowData(this.viewBag.InitDatas.DataLoad)
            .setRowDataUrl("/Inventory/Basic/GetSearchProdByLevelInfo")
                .setRowDataParameter(this.searchFormParameter);
        }
        
        grid
            .setFormData(formData)
            .setKeyColumn(['PROD_CD', 'PROD_DES'])
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setCheckBoxUse(["CREATE", "AUTH", "MULTISELECT"].contains(this.Type))
            //.setCheckBoxRememberChecked(false)
            .setColumnSortable(true)
            .setColumnSortDisableList(['sale003.del_gubun', 'sale003.com_code', 'sale003_img.prod_img'])
            .setColumnSortExecuting(this.setColumnSortClick.bind(this))
            .setPagingUse(true)
            .setCheckBoxMaxCountExceeded(function (e) {
                ecount.alert(String.format(ecount.resource.MSG03839, e));
            })
            .setCheckBoxMaxCount(100)
            .setPagingRowCountPerPage(this.formInfoData.option.pageSize, true)
            .setPagingUseDefaultPageIndexChanging(true)
            .setCustomRowCell('SALE003.COM_CODE', this.setGridFile.bind(this))
            .setCustomRowCell('sale003_img.prod_img', this.setGridImage.bind(this)) // 이미지
            .setCustomRowCell('sale003.size_chk', this.setGridSizeChk.bind(this));     // 이미지

        

        if (["CREATE", "AUTH", "MULTISELECT"].contains(this.Type)) {
            tabContents
                .onSingleMode()
                .createActiveTab("IN", ecount.resource.LBL07276)
                .add(toolbar)
                .createTab("OUT", ecount.resource.LBL07277)
                .createRightTab("NO", ecount.resource.LBL02332);
            contents.add(tabContents).addGrid("dataGrid", grid);
        }
        else {
            contents.add(toolbar).addGrid("dataGrid", grid);
        }
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    // Load Complete
    onLoadComplete: function () {
        this.changeTitle(this.PCODE == 'ROOT' ? ecount.resource.LBL08020 : this.PText);

        if (["CREATE", "AUTH", "MULTISELECT"].contains(this.Type))
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
            if (parentFrame.$('[data-cid=searchTree]')[0] != undefined)
                parentFrame.$('[data-cid=searchTree]')[0].focus();
            return;
        } 

        //this.contents.getControl("Search").setFocus(0);
    },

    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();
        if (this.Type != "SEARCH" && this.Type != "SELECT") {
            toolbar
                .addLeft(ctrl.define("widget.button", "ItemAdd").label(ecount.resource.BTN00780))
                .addLeft(ctrl.define("widget.button", "Remove").css("btn btn-primary").label(ecount.resource.BTN00779))
                .addLeft(ctrl.define("widget.button", "Move").label(ecount.resource.BTN00390))
                .addLeft(ctrl.define("widget.button", "GroupList").label(ecount.resource.BTN00540)); //type, button list
        }
        footer.add(toolbar);
    },

    // Render Complete
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

    //팝업창에서 부모에게 넘겨준값 컨트롤 거처서 온건지 판단 플래그 
    onMessageHandler: function (page, message) {
        if (message == "PROD") {
            this.contents.getGrid().draw(this.searchFormParameter);
        } else if (page.pageID == 'ESA057P_01')
            this.setReload(this);
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    //정렬
    setColumnSortClick: function (e, data) {
        this.searchFormParameter.SORT_COLUMN = data.propertyName;
        this.searchFormParameter.SORT_TYPE = data.sortOrder;
        this.contents.getGrid().draw(this.searchFormParameter);
        //this.contents.getControl("Search").setFocus(0);
    },
    setGridSizeChk: function (value, rowItem) {
        var option = {};
        if (rowItem.SIZE_CD != '' && rowItem.SIZE_CD != undefined)
            option.data = ''; //option.data = 'V';
        else
            option.data = '';
        return option;
    },
    /* [grid] 이미지 링크 (grid Image Link) */
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
    //grid row 파일관리
    setGridFile: function (value, rowItem) {
        var option = {};
        option.data = ecount.resource.BTN00081;
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                this.getFileClickOption(data.rowItem);
            }.bind(this)
        }
        if (rowItem.FILE_CNT != undefined && rowItem.FILE_CNT > 0) {
            option.attrs = {
                'Class': 'text-warning'
            };
        }
        return option;
    },
    //파일관리 클릭시 권한 등 체크
    getFileClickOption: function (rowItem) {
        //var BoardFlag = "N";
        //var TrialOverflowFlag = "N";

        //if (ecount.config.groupware.MAX_USERS != "0" && ecount.config.groupware.USE_STATUS != "0") { // 그룹웨어 사용자 수가 0일때
        //    BoardFlag = "Y";
            
        //    if (ecount.config.groupware.USE_STATUS == "1" && !$.isEmpty(ecount.config.groupware.FREE_EXPIRE_DATE)
        //        && parseInt(Date.format("yymmdd", this.viewBag.LocalTime.left(10))) > parseInt(ecount.config.groupware.FREE_EXPIRE_DATE)) {
        //        TrialOverflowFlag = "Y";
        //    }   
        //}
        //else {
        //    BoardFlag = "N";
        //}

        //if (this.viewBag.Permission.File.CR && BoardFlag == "Y") {
        //    if (TrialOverflowFlag == "N") {
                var param = {
                    width: 780,
                    height: 600,
                    b_type: "S01",
                    BOARD_CD: 7000,
                    isFileManage: true,
                    //code: rowItem['PROD_CD'],
                    //code_des: rowItem['PROD_DES'],
                    prodCdAllInOne: rowItem['PROD_CD'],
                    prodDesAllInOne: rowItem['PROD_DES'],
                    Popup_Flag: "Y",
                    ProgramType: "NEW"
                };

                this.openWindow({
                    //url: '/ECMAIN/ESA/ESA009P_04.aspx',
                    url: "/ECERP/EGM/EGM024M",
                    //name: rowItem['PROD_DES'] + "[" + rowItem['PROD_CD'] + "] " + ecount.resource.LBL00914,
                    name: ecount.resource.LBL18820,
                    param: param,
                    popupType: false,
                    additional: true
                });
        //    }
        //    else {
        //        ecount.alert(ecount.resource.MSG04121);
        //        return false;
        //    }
        //}
        //else {
        //    if (!this.viewBag.Permission.File.CR && BoardFlag == "Y") {
        //        if (TrialOverflowFlag == "N") {
        //            ecount.alert(ecount.resource.MSG00141);
        //            return false;
        //        }
        //        else {
        //            ecount.alert(ecount.resource.MSG04121);
        //            return false;
        //        }
        //    }
        //    else {
        //        ecount.alert(ecount.resource.MSG04479.replace('&gt;', '>').replace('&gt;', '>'));
        //        return false;
        //    }
        //}
    },   

    //사용중단row색 변경
    setRowBackgroundColor: function (data) {
        if (data['DEL_GUBUN'] == "Y")
            return true;        
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
            cdList += data.PROD_CD + ecount.delimiter;
        });

        // Define data transfer object
        var params = {
            width: 480,
            height: 500,
            PCodes: cdList,
            LevelGroupType: 'PROD'
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
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07243, PermissionMode: "U" }]);
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
                    cdList += data.PROD_CD + ecount.delimiter;
                });

                var formData = Object.toJSON({
                    Request: {
                        Data: {
                            CD_PARENT: cd_parent,
                            CD_GROUP: cdList,
                            ACTION: "I"
                        }
                    }
                });

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/SaveProdToGroup",
                    data: formData,
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
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07243, PermissionMode: "U" }]);
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
                    cdList += data.PROD_CD + ecount.delimiter;
                });
                
                var formData = Object.toJSON({
                    Request: {
                        Data: {
                            CD_PARENT: cd_parent,
                            CD_GROUP: cdList,
                            ACTION: "D"
                        }
                    }
                });
    
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/SaveProdToGroup",
                    data: formData,
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
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL07243, PermissionMode: "U" }]);
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
            cdList += data.PROD_CD + ecount.delimiter;
        });

        var params = {
            width: ecount.infra.getPageWidthFromConfig(),
            height: 300,
            CD_Group: this.PCODE,
            NM_Group: this.PText,
            PCodes: cdList,
            LevelGroupType: 'PROD'
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
    //검색 - Contents Search
    //onContentsSearch: function (event, value) {
    //    var invalid = this.contents.getControl("Search").validate();
    //    if (invalid.length > 0) {
    //        this.contents.getControl("Search").setFocus(0);
    //        return;
    //    }
    //    this.searchFormParameter.SEARCH_TEXT = value;
    //    this.contents.getGrid().draw(this.searchFormParameter);
    //},
    // Change Contents Tab
    onChangeContentsTab: function (event) {
        var btnGroupList = this.footer.getControl('GroupList');
        var btnItemAdd = this.footer.getControl('ItemAdd');
        var btnRemove = this.footer.getControl('Remove');
        var btnMove = this.footer.getControl('Move');        
        switch (event.tabId) {
            case "OUT":
                btnGroupList.show();
                btnItemAdd.show();
                btnRemove.hide();
                btnMove.hide();
                break;
            case "NO":
                btnGroupList.hide();
                btnItemAdd.show();
                btnRemove.hide();
                btnMove.hide();
                break;
            default:
                btnGroupList.show();
                btnItemAdd.hide();
                btnRemove.show();
                btnMove.show();
                break;
        }

        if (this.PCODE != 'ROOT') {
        this.searchFormParameter.GB_TYPE = event.tabId;
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

