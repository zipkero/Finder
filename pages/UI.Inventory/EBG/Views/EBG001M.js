window.__define_resource && __define_resource("LBL02506","LBL02958","BTN00070","BTN00008","LBL02660","LBL02253","BTN00054","MSG09307","MSG00432","MSG00433","MSG00213","MSG04617","BTN00672","LBL01042","MSG00965");
/****************************************************************************************************
1. Create Date : 2016.12.01
2. Creator     : Do Duc Trinh
3. Description : Acct. I > Voucher > Voucher List
4. Precaution  :
5. History     : 2017.01.20(Thien.Nguyen) - Add parameter(onInitControl) for All in one 1 menu(thêm parameter cho menu tất cả trong một 1)
                 2017.11.29(Thien.Nguyen) - Add logic check list uncofirm slip.
                 2018.09.06 (박기정) - [A18_02889] 전표조회 리스트설정 줄수 100 제한 -공통화 작업
                 2019.08.01 (AiTuan) - A19_02423 전표조회/수정 내 전표인쇄 항목과 결의서인쇄 항목 분리 
                 2019.11.29 (taind) - A19_03557 - 참조공통- 구분 추가
                 2020.01.22 (박철민) - A18_02228 - 양식설정공통화 - 지출결의서인쇄 
6: Old file    : EBG/EBG001M.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.list.search.account", "EBG001M", {

    initPageDefaultData: function () {
        //현재 페이지의 정보
        this.pageInfo = {
            type: "account",                                // 전표타입
            path: "/ECERP/EBG/EBG001M",                     // 페이지 URL        
            formTypeCode: "AR070",                          // 리스트 양식타입(grid form type)         AR080             
            formTypeSearch: "AN860",                        // 검색조건 양식타입(search form type)            
            title: ecount.resource.LBL02506,                // 페이지 타이틀            
            isNewSearchFormType: true,                      // 검색 양식 신규로                     
            useSettingSC: true,                             // 사용방법설정 
            useAccountYN: true,                             // 지출결의서, 입금보고서, 가지급금정산서 ACCOUNT_YN 설정값 가져오기 
            isAccountSlip: true,
            Permission: this.viewBag.Permission.strUserPermit,
            // data 컬럼 관련   - 종결:P_FLAG
            columnMap: {
                IO_TYPE: "IO_TYPE", GB_TYPE: "GB_TYPE3", VERSION: "VERSION_NO", TRX_DATE: "TRX_DATE", TRX_NO: "TRX_NO", CONFIRM_FLAG: "CONFIRM_FLAG", TRX_TYPE: "TRX_TYPE", SER_NO: "SER_NO"
            },
            //  엑셀관련
            excelApi: [{ path: "/Account/Voucher/GetVoucherListExcel" }],
            //  확인 기능 관련
            confirm: {
                check: ["isLimitDate"]
                , permitMenuName: ecount.resource.LBL02958
                // 확인 권한 confirm 가능 여부 [context.Config.User.SLIP_PER_TYPE] (회계 확인 권한) 4=일반, 5 = 확인권한) 
                , isPermission: ecount.config.user.SLIP_PER_TYPE == "4" ? false : true
            },
            footerButton:
                [
                    { id: "new", isUse: false },
                    { id: "otherSlip", isUse: this.STETIsFromOrderMng ? false : true },
                    { id: "eApproval", isUse: true },
                    { id: "more", isUse: true }

                ],
            // 위젯관련
            menuAuth: "",
            // 전표정보 
            slip: function (rowItem, param) {
                return {
                    type: "account",  // 한 그리드에 여러개의 전표 타입이 올수 있으므로                    
                    ProgramId: "E010701",
                    // columnMap: { IO_DATE: "IO_DATE", IO_NO: "IO_NO", IO_TYPE: "IO_TYPE" },
                    useEcParam: true,
                    param: {
                        SER_NO: rowItem["SER_NO"] || "1",
                        A_FLAG: "",
                        PAGE: "1",
                        DOC_NO: "1",
                        ROOM_SEQ: this.ROOM_SEQ,
                        isOldFramePreFlag: false,   // 구프레임웍 이전 url flag 
                        focusFlag: "Y"
                    }
                }
            }.bind(this),

            // DAC과 연동되면 dac프로퍼티 규칙 적용, 기타는 자바스크립트 규칙적용
            defaultSearchParam: {
                LIST_FLAG: '1',
                GB_TYPE: '1',
                JFLAG: "0",
                ETCVAL: "0",
                SLIP_TYPE: "1",
                ACCCASE: this.ACCCASE,
                ACCCASE_DES: this.ACCCASE_DES,
                TOT_SIZE: this.baseCount
            }
       
        };

        //그리드 정보 설정        
        this.gridInfo = function (param) {
            var isJournal = param.JOURNAL && param.JOURNAL[0] == "1" ? true : false;

            return {
                hasFormType: true,                                      // 양식 사용할지 여부(true : 사용, false : 직접페이지에서 설정하는 설정)
                api: [{ path: "/Account/Voucher/GetVoucherList" }],
                keyColumn: isJournal ? ['TRX_DATE', 'TRX_NO', 'SLIP_SER', 'SLIP_NO'] : ['TRX_DATE', 'TRX_NO'],                        // key column                
                shaded: ["acc101.trx_date_no", "acc100.trx_date_no"],            // shaded cell target(formset/noFormset)
                //grid init field
                field: [
                    { id: ecount.grid.constValue.checkBoxPropertyName, type: "checkStatus" },
                    { id: "acc101.trx_date_no", type: "slipByJournal" },               //  전표연결하기    
                    { id: "acc100.trx_date_no", type: "slip" },               // 전표 연결하기    
                    { id: "ACSL_DOC_NO.CODE_NO", type: "acslCodeNo" },    // 회계반영여부 
                    { id: "acc100.s_print_s", type: "custom", fn: this.configCellPrint1.bind(this) },                // 전표인쇄(Print)  - 
                    { id: "acc100.s_print", type: "custom", fn: this.configCellPrint2.bind(this) },                // 전표인쇄(Print)  - 
                    { id: "acc101.cr_amt", type: "crAmt" },
                    { id: "acc101.dr_amt", type: "drAmt" },     // 확인여부(Confirm/Cancel)                                                                              
                ]
            }
        };

        //참조공통에서 호출한 경우
        if (this.IsFromRef) {
            this.buttonForApply = [
                { id: "applyRef", isUse: false, tabs: "tabAllㆍtabAllCSㆍtabCompleteㆍtabCompleteCSㆍtabConfirmㆍtabCSㆍtabFinishedㆍtabIngㆍtabIngCSㆍtabSentEmailㆍtabSentFaxㆍtabUnconfirmedㆍtabUnsent", seq: 200, label: ecount.resource.BTN00070 },  //적용
                { id: "close", isUse: false, tabs: "tabAllㆍtabAllCSㆍtabCompleteㆍtabCompleteCSㆍtabConfirmㆍtabCSㆍtabFinishedㆍtabIngㆍtabIngCSㆍtabReportingㆍtabSentEmailㆍtabSentFaxㆍtabUnconfirmedㆍtabUnsent", seq: 800, label: ecount.resource.BTN00008 }

            ];

            this.isShowOptionBtn = false;
        }
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
        if (this.REMARKS && this.REMARKS != null) {
            switch (cid) {
                case "txtSWord":   // 금액 ~                
                    control.value(this.REMARKS).end();
                    break;
            };
        }
    },

    // 페이지마다 처리 해야할 param이 다른경우 
    setInitGridSettings: function (settings, param) {
        settings.setStyleRowBackgroundColor(this.setGridBackgroundColor.bind(this), 'danger');
        settings.setCustomRowCell('acc100.edms_app_type', this.fnShowResourceValue.bind(this));
        settings.setEventUseAfterRowDataLoadForInitialData(true);
    },

    //When it was only opened from order management
    onFooterNewOrderMng: function (e) {
        var url = "";
        var title = "";
        var param = {
            width: ecount.infra.getPageWidthFromConfig(true),
            height: 800,
            STETOrderMode: "1", // 0 : 기본(basic), 1 : 신규(new), 2 : 불러오기(load)
            STETOrderProcNo: this.STETOrderProcNo,
            STETOrderProcStep: this.STETOrderProcStep,
            STETOrderProgress: this.STETOrderProgress,
            FROM_TYPE: this.FROM_TYPE,
            TO_TYPE: this.TO_TYPE,
            isOpenPopup: true,
            isViewPopupCloseButton: true,
            isSaveOnly: true,
            isUnRebuildContent: true,
            EditFlag: "ORDER",
            IsPopup: true,
            URL: "/ECErp/EBG/EBG001M"
        };

        if (this.TO_TYPE == "68") {
            url = "/ECERP/EBD/EBD002M";
            title = ecount.resource.LBL02660;
        } else {
            url = "/ECERP/EBD/EBD015M";
            title = ecount.resource.LBL02253;
        }

        this.openWindow({
            url: url,
            name: title,
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    configCellPrint1: function (value, rowItem) {

        var option = {};
        var isLink = false;

        // 전자결재 아니고
        if (!(rowItem[this.columnMap.GB_TYPE] == "Z")) {
            if ((['2B', '2A'].contains(rowItem.IO_TYPE) && rowItem.S_SYSTEM == "P") == false) {
                if (rowItem["SLIP_NO"] != "" && parseInt(rowItem["SLIP_NO"]) > 0) {
                    isLink = true;
                } else {
                    if (rowItem["SER_NO"] == "99" || rowItem["SER_NO"] == "97"
                        || (rowItem["TRX_TYPE"] == "98" && (rowItem["SER_NO"] == "04" || rowItem["SER_NO"] == "05" || rowItem["SER_NO"] == "06"))) {
                        isLink = true;
                    }
                }
            }

            // 링크 버튼을 생성해야 하면 
            if (isLink) {
                option.controlType = "widget.link";
                option.data = ecount.resource.BTN00054;
                option.attrs = {
                    'data-trigger': 'hover',
                    'data-toggle': 'tooltip',
                    'data-placement': 'auto',
                    'data-html': true,
                    'title': this.printTooltip({
                        latrlyDate: rowItem['LATELY_DATE'],
                        latrlyId: rowItem['LATELY_ID'],
                        hits: rowItem['HITS'],
                        latrlyDateCs: rowItem['CS_LATELY_DATE'],
                        latrlyIdCs: rowItem['CS_LATELY_ID'],
                        hitsCs: rowItem['CS_HITS']
                    })
                };

                if (rowItem["TRX_TYPE"] == "98" && ["04", "05", "06"].contains(rowItem["SER_NO"])) {
                    option.attrs = {
                        'data-trigger': 'hover',
                        'data-toggle': 'tooltip',
                        'data-placement': 'auto',
                        'data-html': true,
                        'title': this.printTooltip({
                            latrlyDate: rowItem['LATELY_DATE2'],
                            latrlyId: rowItem['LATELY_ID2'],
                            hits: rowItem['HITS2']
                        })
                    }

                    if (rowItem["HITS2"] != null && rowItem["HITS2"] != "0") {
                        option.attrs["class"] = ["text-warning-inverse"];
                    }
                }
                
                option.event = {
                    'click': function (e, data) {
                        var rptForm = data.rowItem[this.columnMap.GB_TYPE] == "N" ? "BEFORE" : "AFTER";
                        if (data.rowItem["TRX_TYPE"] == "98" && (data.rowItem["SER_NO"] == "04" || data.rowItem["SER_NO"] == "05" || data.rowItem["SER_NO"] == "06")) {
                            var printKeys = "";

                            switch (data.rowItem["SER_NO"]) {
                                case "04": // 지출결의서
                                    this.openSlipPrintEtcNew(data.rowItem["TRX_DATE"] + "-" + data.rowItem["TRX_NO"] + ";", data.rowItem["TRX_DATE"], "", data.rowItem[this.columnMap.GB_TYPE], "AF040");
                                    //printKeys = "rpt_type=1&rpt_form=" + rptForm + "&trx_date=" + data.rowItem["TRX_DATE"] + "&trx_no=" + data.rowItem["TRX_NO"];
                                    //this.openSlipPrintEtc(this.accountYn.AF040, printKeys);
                                    break;
                                case "05":
                                    this.openSlipPrintEtcNew(data.rowItem["TRX_DATE"] + "-" + data.rowItem["TRX_NO"] + ";", data.rowItem["TRX_DATE"], "", data.rowItem[this.columnMap.GB_TYPE], "AF050");
                                    //printKeys = "rpt_type=2&rpt_form=" + rptForm + "&trx_date=" + data.rowItem["TRX_DATE"] + "&trx_no=" + data.rowItem["TRX_NO"];
                                    //this.openSlipPrintEtc(this.accountYn.AF050, printKeys);
                                    break;
                                case "06":
                                    printKeys = "rpt_type=3&rpt_form=" + rptForm + "&trx_date=" + data.rowItem["TRX_DATE"] + "&trx_no=" + data.rowItem["TRX_NO"];
                                    this.openSlipPrintEtc(this.accountYn.AF060, printKeys);
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            ecount.alert(ecount.resource.MSG09307);
                        }
                        e.preventDefault();
                    }.bind(this)
                };
            }
        }
        return option;
    },

    configCellPrint2: function (value, rowItem) {

        var option = {};
        var isLink = false;

        // 전자결재 아니고
        if (!(rowItem[this.columnMap.GB_TYPE] == "Z")) {
            if ((['2B', '2A'].contains(rowItem.IO_TYPE) && rowItem.S_SYSTEM == "P") == false) {
                if (rowItem["SLIP_NO"] != "" && parseInt(rowItem["SLIP_NO"]) > 0) {
                    isLink = true;
                } else {
                    if (rowItem["SER_NO"] == "99" || rowItem["SER_NO"] == "97"
                        || (rowItem["TRX_TYPE"] == "98" && (rowItem["SER_NO"] == "04" || rowItem["SER_NO"] == "05" || rowItem["SER_NO"] == "06"))) {
                        isLink = true;
                    }
                }
            }

            // 링크 버튼을 생성해야 하면 
            if (isLink) {
                option.controlType = "widget.link";
                option.data = ecount.resource.BTN00054;
                option.attrs = {
                    'data-trigger': 'hover',
                    'data-toggle': 'tooltip',
                    'data-placement': 'auto',
                    'data-html': true,
                    'title': this.printTooltip({
                        latrlyDate: rowItem['LATELY_DATE'],
                        latrlyId: rowItem['LATELY_ID'],
                        hits: rowItem['HITS'],
                        latrlyDateCs: rowItem['CS_LATELY_DATE'],
                        latrlyIdCs: rowItem['CS_LATELY_ID'],
                        hitsCs: rowItem['CS_HITS']
                    })
                };

                if (!$.isNull(rowItem["HITS"]) && rowItem["HITS"] != "0") {
                    option.attrs["class"] = ["text-warning-inverse"];
                }

                option.event = {
                    'click': function (e, data) {
                        var rptForm = data.rowItem[this.columnMap.GB_TYPE] == "N" ? "BEFORE" : "AFTER";
                        debugger
                        this.openSlipPrint(data.rowItem["TRX_DATE"] + "-" + data.rowItem["TRX_NO"] + ";", data.rowItem["TRX_DATE"], "", data.rowItem[this.columnMap.GB_TYPE]);
                        e.preventDefault();
                    }.bind(this)
                };
            }
        }
        return option;
    },
    //Show Resource Value
    fnShowResourceValue: function (value, rowItem) {
        var opt = {};

        opt.data = ecount.resource[value];

        return opt;
    },

    // [OVERRIDE] 확인/취소시 파라미터 생성 (Get confirm param)
    getConfirmParam: function (selectItem, gbType) {
        var param = this._super.getConfirmParam.apply(this, arguments);

        if (selectItem.TRX_TYPE == "45" && selectItem.SER_NO == "10") {
            $.extend(param, {
                UseFixedAssets: true,
                ASSETS_STATUS: '1'          // 증가(Increase) 
            });
        }
        return param;
    },
    // Accounting - Confirm / Unsubscribe
    procConfirmStateChange: function (selectItem) {
        var self = this;
        var confirmInfo = this.pageInfo.confirm;
        var gbType = this.contents.currentTabId == "tabConfirm" ? "Y" : "N";        // 현재 GB_TYPE 
        var msg = gbType == "N" ? ecount.resource.MSG00432 : ecount.resource.MSG00433;
        var res = ecount.resource;

        // Privilege Checking: Checking and Entering the Use of Check Function Full Control        
        if (ecount.config.user.SLIP_PER_TYPE != "1") {
            if (ecount.config.user.SLIP_PER_TYPE == "4") {
                var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL02506, PermissionMode: "C" }]);
                ecount.alert(msgdto.fullErrorMsg);
                return false;
            }
        }

        if (selectItem.length == 0) {
            ecount.alert(ecount.resource.MSG00213);
            return;
        }
        // Check the selected data information Get, edit date, etc., and generate a failure list
        var result1 = this.getSelectedItemsForConfirm(selectItem, function calback(result) {
            if (result) {
                ecount.confirm(msg, function (status) {
                    if (status === true) {

                        if (result.failListByClosing.length > 1 || result.failListDebitCheck.length > 1 || result.failListByAccountDate.length > 1) {
                            var errList = "";
                            var msg = "";
                            if (result.failListByClosing.length > 1)
                                errList += result.failListByClosing;
                            if (result.failListDebitCheck.length > 1)
                                errList += result.failListDebitCheck;
                            if (result.failListByAccountDate.length > 1)
                                errList += result.failListByAccountDate;

                            if (gbType == "Y") {
                                ecount.alert(String.format(ecount.resource.MSG04617, ecount.resource.BTN00672));
                            }
                            else {
                                ecount.alert(String.format(ecount.resource.MSG04617, ecount.resource.LBL01042));
                            };
                        }

                        if (result.trxDataeAndNoList.length > 0) {
                            self.callConfirmApi(self.setListConfirmApiJsonData(result.trxDataeAndNoList, result.typeList, result.serNoList, result.versionList), gbType == "Y" ? "N" : "Y");
                        }
                    }
                }.bind(this));
            }
        });
    },
    // set list confirm api json
    setListConfirmApiJsonData: function (trxDataeAndNoList, typeList, serNoList, versionList) {
        var confirmLists = [], _self = this;

        $.each(trxDataeAndNoList.split("ㆍ"), function (i, val) {
            var item = {
                TRX_TYPE: typeList.split("ㆍ")[i],
                TRX_DATE: trxDataeAndNoList.length > 0 ? trxDataeAndNoList.split("ㆍ")[i].split("-")[0] : "",
                TRX_NO: trxDataeAndNoList.length > 0 ? trxDataeAndNoList.split("ㆍ")[i].split("-")[1] : "",
                SER_NO: serNoList.split("ㆍ")[i],
                VERSION_NO: versionList.split("ㆍ")[i]
            };
            confirmLists.push(item);
        });
        return confirmLists;
    },
    //// 채권채무 유효성 체크 fnBondChk(check bonddebit validate)
    //getBondDebitAvailabilityCheck: function (param, isReturnParam) {
    //    if (isReturnParam == true) {
    //        return param;
    //    }
    //    /*
    //            var errData = { Data: null, Error: null, Status: 200 };

    //            if ((param.Type == "1" || param.Type == "2") && $.isEmpty(param.BONDDEBIT_NO)) {
    //                param.callback && param.callback(errData, false);
    //                return;
    //            } else if ($.isEmpty(param.UID) == true || param.UID == "0") {
    //                param.callback && param.callback(errData, false);
    //                return;
    //            }
    //    */

    //    var errData = { Data: null, Error: null, Status: 200 };

    //    if (this.contents.currentTabId == "tabUnconfirmed") {
    //        param.callback && param.callback(errData, false);
    //        return;
    //    }

    //    ecount.common.api({
    //        url: "/Account/Common/GetBondDebitAvailabilityCheckList",
    //        async: param.async === false ? false : true,
    //        data: Object.toJSON(param),
    //        success: function (result) {
    //            var isError = false;
    //            var resultData = param.Type == "1" || param.Type == "2" ? result.Data.BondDebitNo : result.Data.BondDebitSlip;
    //            if ($.isEmpty(resultData) == false && resultData.length > 0) {
    //                isError = true;
    //            }
    //            param.callback && param.callback(result.Data, isError);
    //        }
    //    });
    //},
    getSelectedItemsForConfirm: function (selectItem, calback) {
        var returnData = {};
        //var resultBonddebit = {};
        //var lstDataCheck = [];

        //$.each(selectItem, function (i, item) {

        //    if ($.isEmpty(item.BONDDEBIT_NO) || item.ACEM_UID == 0) {
        //        return;
        //    }

        //    lstDataCheck.push(this.getBondDebitParam(item));
        //}.bind(this));

        returnData = this.makeReturnDatacheck(selectItem);
        calback && calback(returnData);

        // Can not be undoconfirm if bond reduction is processed
        //this.getBondDebitAvailabilityCheck({
        //    LIST_DATA_CHK: lstDataCheck,
        //    callback: function (result, isError) {
        //        if (isError == true) {
        //            if (result)
        //                resultBonddebit = result.BondDebitSlip;


        //            returnData = this.makeReturnDatacheck(selectItem, resultBonddebit);
        //            calback && calback(returnData);
        //        }
        //        else {
        //            returnData = this.makeReturnDatacheck(selectItem);
        //            calback && calback(returnData);
        //        }
        //    }.bind(this)
        //});
    },
    //getBondDebitParam: function (item) {
    //    return {
    //        TRX_DATE: item.TRX_DATE,
    //        TRX_NO: item.TRX_NO,
    //        TRX_TYPE: item.TRX_TYPE,
    //        SER_NO: item.SER_NO,
    //        BONDDEBIT_NO: item.BONDDEBIT_NO,
    //        UID: item.ACEM_UID,
    //        Type: item.IO_GUBUN == "1" ? "3" : "4"
    //        //Type: item.IO_GUBUN == "1" ? "3" : "4"
    //    }
    //},
    makeReturnDatacheck: function (selectItem) {

        var limitDate = ecount.config.account.LIMIT_DATE.left(10).toDate().format("yyyyMMdd");
        var trxNoType = "";
        var failListByAccountDate = "", failListByClosing = "", trxDateNoTypeList = "", trxDataeAndNoList = "", failListDebitCheck = "", versionList = "", typeList = "", serNoList = "";

        $.each(selectItem, function (i, data) {
            trxNoType = data[this.columnMap.TRX_DATE] + "-" + data[this.columnMap.TRX_NO];

            //if (!$.isEmpty(resultBonddebit))
            //    if (this.checkItemSelect(resultBonddebit, data) === true) {
            //        failListDebitCheck += trxNoType + this.splitFlag;
            //        return;
            //    }

            if (data[this.columnMap.TRX_DATE] < limitDate) {  //  편집제한일자
                failListByAccountDate += trxNoType + this.splitFlag;
            } else if ((data.TRX_TYPE == "98" && data.SER_NO == "99") || (data.TRX_TYPE == "98" && data.SER_NO == "97")) {
                // You can not check the settlement slip. 
                failListByClosing += trxNoType + this.splitFlag;
            }
            else {
                versionList += data[this.columnMap.VERSION] + this.splitFlag;

                typeList += data.TRX_TYPE + this.splitFlag;

                serNoList += data.SER_NO + this.splitFlag;

                trxDataeAndNoList += data[this.columnMap.TRX_DATE] + "-" + data[this.columnMap.TRX_NO] + this.splitFlag;

                trxDateNoTypeList += trxNoType + this.splitFlag;
            }
        }.bind(this));

        trxDataeAndNoList = trxDataeAndNoList.substring(0, trxDataeAndNoList.length - 1);
        versionList = versionList.substring(0, versionList.length - 1);
        serNoList = serNoList.substring(0, serNoList.length - 1);
        typeList = typeList.substring(0, typeList.length - 1);

        return {
            trxDataeAndNoList: trxDataeAndNoList,
            failListByClosing: failListByClosing,
            failListDebitCheck: failListDebitCheck,
            failListByAccountDate: failListByAccountDate,
            versionList: versionList,
            typeList: typeList,
            serNoList: serNoList,
            cnt: selectItem.length
        };

    },
    checkItemSelect: function (data, item1) {
        var result = null;

        var data_trx_date = !$.isEmpty(data["TRX_DATE"]) && data["TRX_DATE"].first();

        if ($.isEmpty(data) || data_trx_date || !(item1.IO_GUBUN == 1 || item1.IO_GUBUN == 2)) {
            return false;
        }

        var trx_date = item1[this.columnMap.TRX_DATE];
        var trx_no = item1[this.columnMap.TRX_NO];
        var trx_type = item1["TRX_TYPE"];
        var ser_no = parseInt(item1["SER_NO"]) || 0;

        result = data.where(function (item) {
            return ((item["TRX_DATE"]).equals(trx_date) && item["TRX_NO"] == trx_no && item["TRX_TYPE"] == trx_type && item1["SER_NO"] == ser_no);
        });
        return !$.isEmpty(result);
    },
    vhideProgressbar: function () {
        this.hideProgressbar(true);
    },

    //참조공통 - 전표참조 적용버튼 클릭
    onFooterApplyRef: function () {
        var selectedItem = this.contents.getGrid().getCheckedItem();

        if (selectedItem.length == 0) {
            ecount.alert(ecount.resource.MSG00965);
            return;
        }
        var selList = [];
        for (var i = 0; i < selectedItem.length; i++) {
            var o = selectedItem[i];

            var slipDate = o["K-E-Y"].split("∮")[0];
            var slipNo = o["K-E-Y"].split("∮")[1];
            
            selList.push({
                IO_DATE: slipDate,
                IO_NO: slipNo,
                IO_TYPE: o.TRX_TYPE,
                HID: o.HID,
                SER_NO: o.SER_NO,
                ACCCASE: o.TRX_TYPE + o.SER_NO,
                VERSION_NO: o.VERSION_NO
            })
        }

        var message = {
            data: {
                ioNoKey: selList,
                slipCd: this.SlipCd
            },
            type: '03',//slip
            callback: function () {
                this.close();
            }.bind(this)
        };

        this.sendMessage(this, message);

    }
});