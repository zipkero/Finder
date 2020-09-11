window.__define_resource && __define_resource("LBL15093","LBL02001","LBL02581","LBL06764","BTN00037","BTN00065","BTN00008","MSG00923","LBL04090","BTN00190","MSG00113","LBL07157","MSG00456","MSG00342","MSG00303","MSG08659","MSG00296","MSG06173");

/*--- ESA001P_15.js ---*/
/****************************************************************************************************
1. Create Date : 2018.09.19
2. Creator     : 류상민
3. Description : MultiRegist Address Popup
4. Precaution  : 
5. History     : 
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA001P_15", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    dataLoad: [],
    headerMergeData: {},
    lastOpenPopupGridRowIndex:null,
    columns: [],

    /********************************************************************** 
    * page init 
    **********************************************************************/
    init: function (options) {
        debugger
        this._super.init.apply(this, arguments);
        this.initProperties();
        this.searchFormParameter = {
            BUSINESS_NO: this.BUSINESS_NO,
            ADDR_TYPE: this.ADDR_TYPE
        };
    },

    initProperties: function () {
        if (this.state_code == null) {
            this.state_code = "KR"
        }
        this.dataLoad = this.viewBag.InitDatas.ListLoad;
        if (this.dataLoad.length == 0) {
            this.dataLoad = [{
                POST_NO: '',
                ADDR: '',
                DFLT_VAL_TF: '1',
            }];
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
        header.setTitle(ecount.resource.LBL15093);
    },
    //onInitContents(본문 옵션 설정)
    onInitContents: function (contents, resource) {
        var generator = widget.generator,
            toolbar = generator.toolbar(),
            ctrl = generator.control(),
            settings = generator.grid();
        var self = this;
        
        // header 머지용
        this.headerMergeData['_MERGE_USEOWN'] = true;
        this.headerMergeData['_IS_CENTER_ALIGN'] = true;
        this.headerMergeData['_COLSPAN_COUNT'] = 2;
        this.headerMergeData['_MERGE_START_INDEX'] = 1;


        //우편번호 사용여부
        var hide_Post_Yn = !ecount.config.limited.feature.USE_POST;

        this.columns.push({ propertyName: 'POST_LINK', id: 'POST_LINK', title: ecount.resource.LBL02001, width: 80, isHideColumn: hide_Post_Yn });
        this.columns.push({
            propertyName: 'POST_NO', id: 'POST_NO', title: ecount.resource.LBL02001, controlType: 'widget.input', width: 150, isHideColumn: hide_Post_Yn
        });
        this.columns.push({
            propertyName: 'ADDR', id: 'ADDR', title: ecount.resource.LBL02581, controlType: 'widget.textarea', width: 300, controlOption: {maxByte: { max: 1000 }}});
        this.columns.push({ propertyName: 'DFLT_VAL_TF', id: 'DFLT_VAL_TF', title: ecount.resource.LBL06764, controlType: 'widget.checkbox', width: 70, align: 'center' });
        this.columns.push({ propertyName: 'DLVFC_SEQ', id: 'DLVFC_SEQ', title: "", width: 80, isHideColumn: true });      

        settings
            .setEditRowDataSample({ ISCHANGE: 'N' })
            .setEditLimitAddRow(50)
            .setCheckBoxUse(true)
            .setRowData(this.dataLoad)
            .setRowDataParameter(this.searchFormParameter)
            .setRowDataUrl('/Account/Basic/GetListCustDlvfc') //Common.Infra
            .setColumns(this.columns)
            .setCheckBoxCallback({
                'change': this.setCheckBoxCallback.bind(this)
            })
            .setCheckBoxHeaderCallback({
               'change': this.setCheckBoxCallback.bind(this)
            })
            .setColumnRowCustom([1, 0], [{ '_MERGE_SET': new Array(this.headerMergeData) }])    // 헤더 머지 
            .setCustomColumnCell('DFLT_VAL_TF', function (idx) {
                var option = {};
                    option['controlType'] = 'widget.label';
                return option;
            })
            .setCustomRowCell('POST_LINK', this.setGridDataLink.bind(this))
            .setCustomRowCell('POST_NO', this.setGridPostValue.bind(this))
            .setCustomRowCell('DFLT_VAL_TF', this.setGridDefaultValue.bind(this))
            .setCustomRowCell('ADDR', function (value, rowItem) {
                var grid = self.contents.getGrid("dataGrid").grid;
                var option = {};
                
                option.event = {
                    'change': function (e, data) {
                        grid.setCell('ISCHANGE', data.rowKey, 'Y');
                    }.bind(this)
                }
                
                return option;
            }.bind(this));

        if (this.dataLoad.length < 50) {
            var addRowCnt = 50 - this.dataLoad.length > 2 ? 2 : 50 - this.dataLoad.length;
            settings.setEventAutoAddRowOnLastRow(true, addRowCnt)
            settings.setEditable(true, 3, addRowCnt)
        } else {
            settings.setEditable(true, 3, 0)
        }

        //Toolbar(툴바)
        toolbar.setOptions({ css: "btn btn-default btn-sm"})
            .addLeft(ctrl.define("widget.button", "DeleteMulti").label(ecount.resource.BTN00037).clickOnce());

        contents.add(toolbar).addGrid("dataGrid", settings);
    },

    //onInitFooter(풋터 옵션 설정)
    onInitFooter: function (footer, resource) {

        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065)/*.clickOnce()*/)
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
            .addLeft(ctrl.define("widget.button", "History").label("H"));

        footer.add(toolbar);
    },
    onInitControl: function (cid, control) {
        if (cid == "DeleteMulti") {
            control.hide();
        }
    },

    /**********************************************************************
    * event form userDefine
    **********************************************************************/
    //우편번호 제약조건
    setGridPostValue: function (value, rowItem) {
        var grid = this.contents.getGrid("dataGrid").grid;
        var option = {};
        option.controlOption = {
            maxLength: 8,
            widgetOptions: { useAsteriskMode: false },
        };
        option.controlOption.filter = ['numberOnlyAndSign', { message: ecount.resource.MSG00923 }];
        option.event = {
            'change': function (e, data) {
                grid.setCell('ISCHANGE', data.rowKey, 'Y');
            }.bind(this)
        };
        return option;
    },
    //기본값 제약조건
    setGridDefaultValue: function (value, rowItem) {
        var grid = this.contents.getGrid("dataGrid").grid;
        var option = {};
        var selectOption = new Array();

        option.data = value;
        option.event = {
            'change': function (e, data) {
                if (!(data.newValue == true && data.oldValue == true)) {
                    //기본값을 설정하는경우에 값이 들어있는경우
                    if (data.newValue == true &&
                        (!$.isEmpty(data.rowItem.ADDR) || !$.isEmpty(data.rowItem.POST_NO))) {
                        var arrGridData = grid.getRowList();
                        $.each(arrGridData, function (i, item) {
                            if (item[data.columnProperty] == true && item[ecount.grid.constValue.keyColumnPropertyName] !== data.rowKey) {
                                grid.setCell(data.columnId, item[ecount.grid.constValue.keyColumnPropertyName], false, { isRunChange: false });
                                grid.setCell('ISCHANGE', item[ecount.grid.constValue.keyColumnPropertyName], 'Y'); 
                            }
                        }.bind(this));
                    }
                    //기본값에서 값체크를 해제하는경우
                    else if (data.newValue == false && data.oldValue == true) {
                        grid.setCell('DFLT_VAL_TF', data.rowKey, true, { isRunChange: false });
                    }
                    //기본값을 설정하는경우에 값이 없는경우(위의경우에 change이벤트를 다시 타기때문에 밑의 조건을 예외처리)
                    else {
                        grid.setCell('DFLT_VAL_TF', data.rowKey, false, {isRunChange: false});
                    }
                    this.isChanged = true;
                    grid.setCell('ISCHANGE', data.rowKey, 'Y');
                }
            }.bind(this)
        }
        return option;
    },
    //우편번호검색 팝업설정
    setGridDataLink: function (value, rowItem) {
        var option = {};

        var param = {
            width: ecount.infra.getPageWidthFromConfig(1),
            height: 500,
            strType: '1'
        };
        option.controlType = "widget.link";
        option.event = {
            'click': function (e, data) {
                //로우키 저장 후 그값으로 반환 값 셋팅
                this.lastOpenPopupGridRowIndex = data.rowKey;

                this.openWindow({
                    url: '/ECERP/Popup.Search/CM004P',
                    name: ecount.resource.LBL04090,     //Resource : 우편번호검색
                    param: param,
                    additional: false
                });
            }.bind(this)
        };
        option.data = ecount.resource.BTN00190;

        return option;
    },
    //grid 그리드 로우 체크박스
    setCheckBoxCallback: function (value, gridData) {
        delItem = this.contents.getGrid().grid.getChecked();
        if (delItem.length > 0) {
            this.contents.get(0).getControl("DeleteMulti").show();
        } else {
            this.contents.get(0).getControl("DeleteMulti").hide();
        }
    },
    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    
    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
    //Popup에서 SendMessage After
    onMessageHandler: function (page, message) {
        var self = this;
        var grid = this.contents.getGrid().grid;
        switch (page.pageID) {
            case 'CM004P':
                var _postNo = message.zipcode.replace('-', '');
                grid.setCell("POST_NO", this.lastOpenPopupGridRowIndex, _postNo);
                grid.setCell("ADDR", this.lastOpenPopupGridRowIndex,  message.address + ' ' + message.otheraddress);
                break;
        }

        this.setTimeout(function () {
            message.callback && message.callback();
        }.bind(this), 0);
    },
    //onFooterSave(저장)
    onFooterSave: function () {
        var self = this,
            grid = this.contents.getGrid().grid;

        var gridFilteringData = grid.getRowList().where(function (entity, i) {
            return entity.ISCHANGE == 'Y' ||
                (!$.isEmpty(entity.ADDR) || !$.isEmpty(entity.POST_NO)) && $.isEmpty(entity.DLVFC_SEQ);
        }),
        gridDefaultData = grid.getRowList().where(function (entity, i) {
            return entity.DFLT_VAL_TF == true;
        });

        if (gridDefaultData[0].ADDR == '') {
            var option = {};
            option.message = ecount.resource.MSG00113;
            grid.setCellShowError("ADDR", gridDefaultData[0][ecount.grid.constValue.keyColumnPropertyName], option);
            grid.setCellFocus("ADDR", gridDefaultData[0][ecount.grid.constValue.keyColumnPropertyName]);
            return false;
        }

        if (gridFilteringData.length > 0) {

            var arraySaveData = [];

            $.each(gridFilteringData, function (i, item) {
                arraySaveData.push({
                    ADDR_TYPE: this.ADDR_TYPE,
                    BUSINESS_NO: this.BUSINESS_NO,
                    POST_NO: item.POST_NO,
                    ADDR: item.ADDR,
                    DFLT_VAL_TF: item.DFLT_VAL_TF,
                    DLVFC_SEQ: item.DLVFC_SEQ
                });
            }.bind(this))

        
            self.showProgressbar(true, null, 0);
            ecount.common.api({
                url: '/Account/Basic/SaveCustDlvfc', //Common.Infra
                data: Object.toJSON({ CUST_DLVFC_LIST: arraySaveData}),
                success: function (result) {
                    message = {
                        ADDR_TYPE: this.ADDR_TYPE,
                        ADDR: gridDefaultData[0].ADDR,
                        POST_NO: gridDefaultData[0].POST_NO,
                        callback: this.close.bind(this)
                    };

                    this.sendMessage(this, message);
                    this.close();
                }.bind(this),
                complete: function () {
                    self.hideProgressbar(true);
                }
            });
        } else {
            this.close();
        }
        

        return false;
    },
    //onFooterClose(닫기버튼)
    onFooterClose: function () {
        this.close();
        return false;
    },
    //onFooterHistory(히스토리)
    onFooterHistory: function (e) {
        var param = {
            lastEditTime: this.dataLoad.length != 0 ? this.dataLoad[0].EDIT_DT : null, // datetime, // datetime
            lastEditId: this.dataLoad.length != 0 ? this.dataLoad[0].EDITOR_ID : null,      //id
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            width: 450,
            height: 150
        };
        // false : Modal , true : pop-up
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },
    // New button click event
    onContentsDeleteMulti: function (cid) {
           
        //Permission check
        //this.viewBag.Permission.Permit.Value
        var _self = this;
        var btnDeleteMulti = this.contents.get(0).getControl("DeleteMulti"),
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


        ////선택한 데이터 중 기본값항목이 있으면 안된다.
        var defaultYn = false;

        $.each(delItem, function (i, item) {
            $.each(['DFLT_VAL_TF'], function (j, item2) {
                if (item[item2] == true) {
                    defaultYn = item[item2];
                    return false;
                }
            }.bind(_self));
        }.bind(this));

        if (defaultYn) {
            ecount.alert(ecount.resource.MSG08659);
            btnDeleteMulti.setAllowClick();
            return false;
        }

        $.each($.makeArray(delItem), function (i, el) {
            console.log(el.DLVFC_SEQ);
            if (el.DLVFC_SEQ != '') {
                uniqueItems.push(el.DLVFC_SEQ);
            } else {
                rawItems.push(el);
            }
        }.bind(this));


        var grid = this.contents.getGrid("dataGrid").grid;
        for (var i = 0; i < delItem.length; i++) {
            grid.setCell('ISCHANGE', delItem[i][ecount.grid.constValue.keyColumnPropertyName], 'Y');
            grid.setCell('POST_NO', delItem[i][ecount.grid.constValue.keyColumnPropertyName], '');
            grid.setCell('ADDR', delItem[i][ecount.grid.constValue.keyColumnPropertyName], '');
        }

        this.contents.getGrid().grid.clearChecked();
        btnDeleteMulti.setAllowClick();


        //if (uniqueItems.length == 0 && rawItems.length != 0) {
        //    this.contents.getGrid().draw(this.searchFormParameter);
        //    btnDeleteMulti.setAllowClick();
        //    return false;
        //} else {
        //    var formData = Object.toJSON({
        //        DLVFC_SEQ_LIST: uniqueItems.join(ecount.delimiter),
        //        ADDR_TYPE: this.ADDR_TYPE,
        //        BUSINESS_NO: this.BUSINESS_NO
        //    });
        //}

        //ecount.confirm(ecount.resource.MSG00296 , function (status) {

        //    if (status) {
        //        ecount.common.api({
        //            url: "/Account/Basic/DeleteCustDlvfc",
        //            async: false,
        //            data: formData,
        //            success: function (result) {
        //                //상태값이 200 이거나 삭제행이 없을경우(기본값을 삭제하거나 없는SEQ를 삭제하는경우)
        //                if (result.Status != "200" || result.Data == 1) {
        //                    ecount.alert(ecount.resource.MSG06173);
        //                } else {
        //                    this.contents.getGrid().draw(this.searchFormParameter);
        //                }
        //            }.bind(this)
        //        });
               
        //    }
        //    btnDeleteMulti.setAllowClick();
            
        //}.bind(this));

        return false;
    },
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    // ON_KEY_F8
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    // ON_KEY_ENTER
    ON_KEY_ENTER: function (e, target) {
    },
    // ON_KEY_DOWN
    ON_KEY_DOWN: function () {
    },
    // ON_KEY_UP
    ON_KEY_UP: function () {
    },
    
});
