window.__define_resource && __define_resource("LBL08948","MSG01390","BTN00236","LBL03004","LBL04090","MSG00710");
/****************************************************************************************************
1. Create Date : 2018.06.29
2. Creator     : 신선미
3. Description : 재고>기초등록>거래처등록 > 변경클릭> 거래처선택변경 팝업
4. Precaution  :
5. History     : 2018.05.22(임명식) - 
               : 2018.08.23 Do Xuan Khanh: Add Property isNotUsePopover: true,
               : 2019.05.23 (이현택) : 채권관리코드 체크로직 제거
****************************************************************************************************/
ecount.page.factory("ecount.page.changeSelected", "ESA001P_14", {

    pageID: null,
    isShowSaveButtonByRow: true,
    sendData: [],
    _isFormSetting: false,
    firstVatRate: true,
    _isChangeData: true,
    // 단가 총 자릿수
    lenUnitPrice: 18,

    // 단가 소수점 자릿수
    lenDotUnitPrice: 6,

    // 기타 총 자릿수
    lenEtc: 18,

    // 기타 소수점 자릿수
    lenDotEtc: 6,

    lan_type: "",

    //상단적용클릭여부
    isSetApplyCall: false,

    //initcontrol실행시 순번
    initControlIdx: null,
    
    //검색시 line
    popupLine: 0,

    popupIsForm: false,

    // Not use Popover
    isNotUsePopover: true,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.formTypeCode = this.viewBag.InitDatas.formType;
        this.initProperties();
        this.registerDependencies("ecmodule.common.initControls");
    },

    initProperties: function () {
        this._super.initProperties.apply(this, arguments);
        this.EditFlag = "M";
        this._loadShowColumns = ['G_BUSINESS'];
        this.custDataSet = new Object();
        $.extend(this.custDataSet, { CustLevelGroupData: this.viewBag.InitDatas.ListLevelGroup });          //CustLevelGroupInfomation(거래처 계층그룹 정보)
        $.extend(this.custDataSet, {
            StringCommonData: this.viewBag.InitDatas.CommonCode.where(function (entity, i) {                    //StringCommonData(문자형 추가항목 타이틀 정보 Array)
                return entity.Key.CODE_CLASS == 'A10';
            }),

            NumberCommonData: this.viewBag.InitDatas.CommonCode.where(function (entity, i) {                    //NumberCommonData(숫자형 추가항목 타이틀 정보 Array)
                return entity.Key.CODE_CLASS == 'A13';
            }),

            ForeignCustData: this.viewBag.InitDatas.CommonCode.where(function (entity, i) {                     //ForeignCustData(외화거래처 정보 Array)
                return entity.Key.CODE_CLASS == 'S10';
            })
        });
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/
    onInitHeader: function (header) {
        header
            .setTitle(ecount.resource.LBL08948)
            .notUsedBookmark()
    },

    onInitContents: function (contents) {
        var controls = this._super.onInitContents.apply(this, arguments);
    },

    onInitFooter: function (footer) {
        this._super.onInitFooter.apply(this, arguments);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    //데이터 맵핑
    getRowDatas: function (rowData) {  
        if ($.isEmpty(rowData) && $.isEmpty(this.custView)) {
            this.FormDefaultValueConvertData.InputDefaultValue["G_BUSINESS_NO"] = "";
            this.custView = this.FormDefaultValueConvertData.InputDefaultValue;
            this.viewBag.InitDatas.CustLevelGroupData = this.FormDefaultValueConvertData.InputLevelGroup;
        } else if (!$.isEmpty(rowData) && this.initControlIdx != rowData.rowIdx) {
            this.initControlIdx = rowData.rowIdx;
            this.custView = this.viewBag.InitDatas.ListData[rowData.rowIdx];
            this.custView.BUSINESS_NO = this.custView.BUSINESS_NO;
            this.viewBag.InitDatas.CustLevelGroupData = this.viewBag.InitDatas.ListLevelGroup.where(function (item) { return item.CD_GROUP == this.custView.BUSINESS_NO; }.bind(this));
        }
    },
    //본문
    onInitControl: function (cid, control, controlType, rowData) {
        var ctrl = widget.generator.control();
        cid = rowData ? rowData.columnId : (cid || "");
        this.getRowDatas(rowData);
        if (cid.indexOf("checkItem") > -1) {
            control.value("Y");
            control.select("Y");
            control.label("");
            control.isNoLabel();
            control.setOptions({ number: [(rowData.rowIdx + 1)] })


        }
        ecmodule.common.initControls.custInitControl.call(this, cid, control, controlType, rowData, this);
    },

    //로드 완료후
    onLoadComplete: function () {

        this.setLoadSetting(this.itemRowCnt, true)
        for (var i = 0; i < this._itemRowCnt; i++) {
            this.setLoadSetting(i, false);
        }

        this._super.onLoadComplete.apply(this, arguments);
        //this.contents.getForm()[0].show();
        this.firstVatRate = false;
    },

    //팝업창 결과
    onMessageHandler: function (page, data) {
        switch (page.pageID) {
            case 'CM004P':
                var _postNo = data.zipcode.replace('-', '');

                //Adress1(우편번호1)
                if (data.strType == '1') {
                    ctrl = this.contents.getControl(this.getControlName(data.CheckLine, $.isEmpty(data.CheckLine), "POST_NO"));    
                    ctrl.get(1).setValue(0, _postNo, true);
                    ctrl.get(2).setValue(0, data.address + ' ' + data.otheraddress, true);
                }
                //Adress2(우편번호2)
                else if (data.strType == '2') {
                    ctrl = this.contents.getControl(this.getControlName(data.CheckLine, $.isEmpty(data.CheckLine), "DM_POST"));
                    ctrl.get(1).setValue(0, _postNo, true);
                    ctrl.get(2).setValue(0, data.address + ' ' + data.otheraddress, true);
                }
                break;
            default:
                this._super.onMessageHandler.apply(this, arguments);
                break;
        }

    },

    //팝업오픈
    onPopupHandler: function (control, config, handler) {
        var line = $.isEmpty(control.rowIdxTable) ? 0 : control.rowIdxTable,
           isForm = !control._useTableRowIndex,
           cid = isForm ? control.id : control.originControlID; //control.id.replace("_" + line.toString(), "");
        this.popupLine = line;
        this.popupIsForm = isForm;
        config.popupType = false;
        // 그룹코드 공통 셋팅
        if (["txtCustGroup1", "txtCustGroup2", "CUST_GROUP1", "CUST_GROUP2"].contains(cid)) {
            config.isNewDisplayFlag = true;
            config.isApplyDisplayFlag = false;       //Apply ViewFlag(적용 ViewFlag)
            config.isCheckBoxDisplayFlag = false;    //CheckBox ViewFlag(checkbox ViewFlag)
            config.isIncludeInactive = false;        //Stop ViewFlag(사용중단포함 ViewFlag)
            config.additional = false;
            config.titlename = control.subTitle || control.title;
            config.name = control.subTitle || control.title;
            config.SID = 'E010101';
        }

        switch (cid) {
            case "CUST_GROUP1":
            case "txtCustGroup1":       // 그룹코드
                config.CODE_CLASS = "A11";
                config.custGroupCodeClass = "A11";
                break;
            case "CUST_GROUP2":
            case "txtCustGroup2":
                config.CODE_CLASS = "A12";
                config.custGroupCodeClass = "A12";
                break;
            case "EMP_CD":
            case "txtEmpCd":
                config.isNewDisplayFlag = true;
                config.isCheckBoxDisplayFlag = false;
                break;
            case 'G_BUSINESS_SEARCH':
            //case 'MAIN_CD':
            //    control.width = this.custView.TableWidthCust;
            //    config.isNewDisplayFlag = true;
            //    config.isCheckBoxDisplayFlag = false;
            //    config.MAIN_YN = 'Y';
            //    break;
            case 'PRICE_GROUP':
            case 'PRICE_GROUP2':
                config.isCheckBoxDisplayFlag = false;
                config.titlename = control.subTitle;
                break;
            default:
                this._super.onPopupHandler.apply(this, arguments);
                break;
                //거래처 관련 팝업 항목 설정
        }
        // API 조회 데이터가 1건이더라도 팝업을 오픈 한다.

        handler(config);
    },

    //검색자동완성
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        var line = $.isEmpty(control.rowIdxTable) ? 0 : control.rowIdxTable,
          isForm = !control._useTableRowIndex,
          cid = isForm ? control.id : control.originControlID; //control.id.replace("_" + line.toString(), "");
        this.popupLine = line;
        this.popupIsForm = isForm;
        switch (cid) {
            case "CUST_GROUP1":
                parameter.CODE_CLASS = "A11";
                break;
                //CustGroup2(거래처그룹2)
            case "CUST_GROUP2":
                parameter.CODE_CLASS = "A12";
                break;
            //case "MAIN_CD":
            //    parameter.MAIN_YN = 'Y';
            //    break;
            default:
                this._super.onAutoCompleteHandler.apply(this, arguments);
                break;
        }
        handler(parameter);
    },

    //값 변경시 
    onChangeControl: function (control) {
        var line = $.isEmpty(control.rowIndex) ? 0 : control.rowIndex,
            isForm = $.isEmpty(control.useTableRowIndex) || control.useTableRowIndex == false ? true : false,
            cid = isForm ? control.cid : control.originID;   //     control.cid.replace("_" + line.toString(), "")
        var getData = this.getDataOrControlName(line, isForm, cid),
            controlName = getData.controlName;
        switch (cid) {
            
            case "IO_CODE_SL":
            case "IO_CODE_BY":                
                if (this.contents.getControl(controlName).get(0).getValue(2) == "N") {
                    if (this.contents.getControl(controlName) != undefined)
                        this.contents.getControl(controlName).get(1).show();
                } else {
                    if (this.contents.getControl(controlName) != undefined)
                        this.contents.getControl(controlName).get(1).hide();
                }
                break;
            case "G_BUSINESS":
                if (this.contents.getControl(controlName).get(0).getValue() == "1") {
                    var g_businessno = this.getControlName(line, isForm, "G_BUSINESSNO");
                    this.contents.getControl(controlName).get(1).setValue(0, getData.data.BUSINESS_NO);
                }
                break;
            default:
                this._super.onChangeControl.apply(this, arguments);
                break;


        };
    },
    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/


    //닫기
    onFooterClose: function () {
        var thisObj = this;
        thisObj.sendMessage(this, {});
        thisObj.setTimeout(function () {
            thisObj.close();
        }, 0);
    },


    //
    //하단저장
    onFooterSave: function (e) {
        var btn = this.footer.get(0).getControl("save"),
            isRaisedError = false,
            self = this,
            o = this.contents.getForm()[1].serialize(),
            rowItem = [];
        this.sendData = [];

        var isRaisedError = this.getTableFormSaveDatas();

        if (isRaisedError == false) {
            var listOfCustCode = [];
            listOfCustCode = (this.sendData || []).select(function (item) {
                return item.BUSINESS_NO;
            });
            if (listOfCustCode.length > 0) {
                this._super.onFooterSave.apply(this);
                btn.setAllowClick();
            } else {
                ecount.alert(ecount.resource.MSG01390);
                btn.setAllowClick();
                return;
            };
        };
        btn.setAllowClick();
    },

    //라인별저장
    onContentsLineSave: function (e) {

        var isForm = !e.useTableRowIndex;
        this.onSaveDataByRow(e, e.rowIndex);
    },

    /*라인별 저장시 사용한다. */
    onSaveDataByRow: function (e, line) {

        var self = this;
        this.sendData = [];
        var isRaisedError = this.getTableFormSaveDatas(true, line);
        if (!isRaisedError) {
            this.SaveData(true);
        }
    },

    onFunctionCustDesDupCheck: function (e) {
        var isValid = true;
        var target = this.contents.getControl($.isEmpty(e.rowIndex) ? 'CUST_NAME' : 'CUST_NAME_' + e.rowIndex);

        if (ecount.common.ValidCheckSpecialForCodeName(target.getValue()).result == false) {
            isValid = false;
        }
        this.openDupCheck(isValid, "cust_name", target.getValue(), target, String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03004), e.rowIndex || "");
    },


    //LinkAddress1(우편번호1)    
    onContentsPOST_NOaddrLink: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(1),
            height: 500,
            strType: '1'
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM004P',
            name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
            param: param,
            additional: false
        });
    },

    onContentsPOST_NO: function (e) {
        this.onContentsPOST_NOaddrLink();
    },

    //LinkAddress2(우편번호2)
    onContentsDM_POSTaddrLink: function (e) {
        var param = {
            width: ecount.infra.getPageWidthFromConfig(1),
            height: 500,
            strType: '2'
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM004P',
            name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
            param: param,
            additional: false
        });
    },

    onContentsDM_POST: function (e) {
        this.onContentsDM_POSTaddrLink();
    },

    /**********************************************************************
    * define user function
    **********************************************************************/
    //중복체크
    openDupCheck: function (isValid, searchType, keyword, target, name, line) {
        if (isValid) {
            var param = {
                keyword: keyword,
                searchType: searchType,
                isColumSort: true,
                width: 430,
                height: 480,
                CheckLine: line
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: name,
                param: param,
                isColumSort: true,
                additional: false
            });
        } else {
            target.setFocus(0);
        }
    },

    //상단변경시 값 체인지
    setSelApplyFocus: function (value) {
        this._super.setSelApplyFocus.apply(this, arguments);

    },

    //상단 기본값 적용  따로 처리할게있는경우
    setApply: function (e, callback) {
        var self = this;
        //i:rowidx, row_id : id, chControl: 해당컨트롤obj, saveRowValue: 변경할값, custData: row값들
        callback = function (i, row_id, chControl, saveRowValue, custData) {
            var isCase = false;

            return isCase;
        }
        this._super.setApply.apply(this, arguments);
    },

    /*디비에 저장할 데이터 가공하는 영역*/
    getSendData: function (data) {
        var isSave = this._super.CheckSaveData.apply(this);
        if (isSave == true) {
            var objectData = this._super.getSaveRowData(data.rowItem);
            if (objectData.FOREIGN_FLAG != "N") {
                objectData.EXCHANGE_CODE = objectData.FOREIGN_FLAG;
                objectData.FOREIGN_FLAG = "Y";
            } else {
                objectData.EXCHANGE_CODE = "";
                objectData.FOREIGN_FLAG = "N";
            }

            if (objectData.G_BUSINESS_TYPE == "3") {
                var g_business = this.contents.getControl(String.format("{0}_{1}", "G_BUSINESS", data.rowIdx.toString())).serialize();
                if (g_business && g_business.length > 0)
                    objectData.G_BUSINESSNO_CD = g_business[1].value;
            }
            var _keys = this._super._KeysOfJson(objectData);
            for (var i = 0; i < _keys.length; i++) {
                if (objectData[(_keys[i])] == null) continue;
            };
        }
        else {
            return {}; /*실패처리해야된다.*/
        };
        var send_data = objectData; /*업데이트할 데이터만 가공해서 넘긴다.*/

        return send_data;
    },

    //거래처 기본값 변경
    custSaveValueSet: function (data) {
        data.forEach(function (item, i) {
            Object.keys(item).forEach(function (key, j) { 
                    switch (key) {
                        case "COLL_PAY_TYPE":
                            var collPayType = item["COLL_PAY_TYPE"];
                            item["COLL_PAY_TYPE"] = collPayType[0];
                            if (collPayType[0] == 'D') {                                                                                      //Daily(일 단위)
                                item["COLL_PAY_D"] = collPayType[1];
                            } else if (collPayType[0] == 'M') {                                                                                 //Monthly(월 단위)
                                item["COLL_PAY_M"] = collPayType[1];
                                item["COLL_PAY_D"] = collPayType[2];
                            }
                            else if (collPayType[0] == "W") {                                                                                 //Weekly(주 단위)
                                item["COLL_PAY_W"] = collPayType[1];
                                item["COLL_PAY_DW"] = collPayType[2];
                            }
                            break;
                    }
                
            }.bind(this));
        }.bind(this));

        return data;
    },
    //저장
    SaveData: function (isLine) {
        this.showProgressbar(true);
        var self = this,
            btn = this.footer.get(0).getControl("save"),
            paramData = {};

        var listOfCustCode = this.sendData.select(function (o) {
            return o["BUSINESS_NO"];
        });

        if (this.sendData.length > 0 && listOfCustCode.length > 0) {
            this.sendData = this.custSaveValueSet(this.sendData);
            paramData = {
                DefaultBulkDatas: [],
                FORM_SEQ: 2,
                FORM_TYPE: "SI912",
                GetSelectedColumns: this._selectedItem,
                IsGetBasicTab: true,
                IsSlipBundling: true,
                IsListSelectChangeData: true
            }
            this.sendData.forEach(function (item, i) {
                paramData.DefaultBulkDatas.push({
                    BulkDatas: item,
                    Line: item.Line
                })
            }.bind(this));
            save.call(this);
        }
        else {
            btn.setAllowClick();
        };

        function save() {
            ecount.common.api({
                url: "/Account/Basic/UploadRegistedCustDataForTemplate",
                data: paramData,
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.alert(ecount.resource.MSG00710, function () {
                            self.close(false);
                            btn.setAllowClick();
                        });
                        return;
                    };
                    self.hideProgressbar(true);
                    self.resultData = result.Data;  //resultData: ECount.ERP.Data.Common.Form.BulkDataTemplateErrDataDto > 형태
                    self.openErrorResult({ isLine: isLine });
                    self.checkErrorResult(self.resultData['ResultDetails']);
                }
            });

            btn.setAllowClick();
        }
    },

     

    //컨트롤 이름 변경
    getControlReName: function (value) {
        //if (["CUST_GROUP1", "CUST_GROUP2"].contains(value)) {
        //    value = value.replace("CUST_GROUP1", "") == "" ? "txtCustGroup1" : String.format("txtCustGroup{0}", value.replace("CUST_GROUP", ""));
        //}
        return value;
    },

    //로드완료시 값 변경
    setLoadSetting: function (line, isForm) {
       
        var getData = this.getDataOrControlName(line, isForm, "G_BUSINESS"),
            gBizData = getData.data,
            controlName = getData.controlName,
            getControl = this.contents.getControl(controlName);
        
        if (getControl && ['1', '3'].contains(getControl.get(0).getValue())) {
            if (getControl.get(1))
                getControl.get(1).show();
        }
        else {
            if (getControl.get(2))
                getControl.get(2).show();
        }
    },

    

    //(i, key, checkControls, rowDatas)
    //공통이외의 체크
    etcValidateCheck: function (i, key, checkControls, rowDatas) {
        if (key == "FOREIGN_FLAG") {
            if (checkControls && checkControls.getValue().length == 0) {
                checkControls.showError();
                return false;
            }
        } 
        return true;
    },



});