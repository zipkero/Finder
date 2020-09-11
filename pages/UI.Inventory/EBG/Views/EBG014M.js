window.__define_resource && __define_resource("LBL03908","LBL10548","MSG04553");
/****************************************************************************************************
1. Create Date : 2016.10.28
2. Creator     : Do Duc Trinh
3. Description : SSSS
4. Precaution  :
5. History     : 2017.08.31 (Phu) Refactoring and apply common
                 2018.06.05 (이현택) - 계정코드 체크 갯수 100개로 제한
                 2018.10.05 (PhiTa) Apply disable sort when data search > 1000
6.Menupath     : Acct. II > Import > Trade Voucher List 
7. Old menu    : EBG/EBG001M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.list.search.account", "EBG014M", {
    initPageDefaultData: function () {
        //현재 페이지의 정보
        this.pageInfo = {
            type: "account",                                // 전표타입
            path: "/ECERP/EBG/EBG014M",                     // 페이지 URL        
            formTypeCode: "AR990",                          // 리스트 양식타입(grid form type)         AR080             
            formTypeSearch: "AN990",                        // 검색조건 양식타입(search form type)            
            title: ecount.resource.LBL03908,                // 페이지 타이틀            
            isNewSearchFormType: true,                      // 검색 양식 신규로                     
            useSettingSC: true,                             // 사용방법설정 
            useAccountYN: true,                             // 지출결의서, 입금보고서, 가지급금정산서 ACCOUNT_YN 설정값 가져오기 
            isNotUseConfirm: true,                          // 확인버튼 미출력여부
            isAccountSlip: true,
            Permission: this.viewBag.Permission.strUserPermit,
            columnMap: {
                IO_TYPE: "IO_TYPE", GB_TYPE: "GB_TYPE3", VERSION: "VERSION_NO", TRX_DATE: "TRX_DATE", TRX_NO: "TRX_NO", CONFIRM_FLAG: "CONFIRM_FLAG", TRX_TYPE: "TRX_TYPE", SER_NO: "SER_NO"
            },
            excelApi: [{ path: "/Account/Voucher/GetTradeVoucherListExcel" }],
            confirm: {
                check: ["isLimitDate"]
                , permitMenuName: ecount.resource.LBL03908
                , isPermission: ecount.config.user.SLIP_PER_TYPE == "4" ? false : true
            },
            footerButton:
                [
                    { id: "new", isUse: false },
                    { id: "eApproval", isUse: true },
                    { id: "messenger", isUse: false },
                    { id: "deleteSelected", isUse: this.slip_type != "4" ? true : false },
                    { id: "more", isUse: true }

                ],
            slip: function (rowItem, param) {
                return {
                    type: "account",
                    useEcParam: true,
                    param: {
                        SER_NO: rowItem["SER_NO"] || "1",
                        A_FLAG: "",
                        PAGE: "1",
                        DOC_NO: "1",
                        isOldFramePreFlag: false,
                        focusFlag: "Y"
                    }
                }
            }.bind(this),

            // DAC과 연동되면 dac프로퍼티 규칙 적용, 기타는 자바스크립트 규칙적용
            defaultSearchParam: {
                GB_TYPE: '1',
                JFLAG: "0",
                ETCVAL: "0",
                SLIP_TYPE: "1",
                TRADE_GUBUN: "Y",
                ACCCASE: this.ACCCASE,
                ACCCASE_DES: this.ACCCASE_DES
            }
        };

        //그리드 정보 설정        
        this.gridInfo = function (param) {
            //var isJournal = param.JOURNAL && param.JOURNAL[0] == "1" ? true : false;

            return {
                hasFormType: true,                                      // 양식 사용할지 여부(true : 사용, false : 직접페이지에서 설정하는 설정)
                api: [{ path: "/Account/Voucher/TradeVoucherList" }],
                keyColumn: ['TRX_DATE', 'TRX_NO', 'SLIP_SER'],                        // key column                
                shaded: ["acc101.trx_date_no", "acc100.trx_date_no"],            // shaded cell target(formset/noFormset)
                //grid init field
                field: [
                    { id: ecount.grid.constValue.checkBoxPropertyName, type: "checkStatus" },
                    { id: "acc100.s_print", type: "slipPrint" },
                    { id: "ACSL_DOC_NO.CODE_NO", type: "acslCodeNo" },
                    { id: "acc101.cr_amt", type: "crAmt" },
                    { id: "acc101.dr_amt", type: "drAmt" },     // (Confirm/Cancel)
                    { id: "acc100.trx_date_no", type: "slip" }
                ]
            }
        };
    },

    onInitControl: function (cid, control) {
        var ctrl = widget.generator.control();
        switch (cid) {
            case "EtcChk":
                control.addControl(ctrl.define("widget.checkbox", "ChkETCVAL", "ChkETCVAL").label([ecount.resource.LBL10548]).value([1]).select(['0']));
                break;
            default:
                this._super.onInitControl.apply(this, arguments);
                break;
        }
    },

    onInitControl_Submit: function (cid, control) {
        switch (cid) {
            case "txtAccCase":
                control.setOptions({
                    Gubun: "TRADE"
                });
                break;
            case "txtEMoney":
                control.inline().setOptions({ _betweenSuffix: ['F', 'T'] }).numericOnly(18, 2, ecount.resource.MSG04553).end();
                break;
            case "txtBillNo":
                control.setOptions({
                    checkMaxCount: 100,
                    isIncludeInactive: true,
                    isApplyDisplayFlag: true,
                    isApplyDisplayFlag: true
                })
                    .codeType(7);
        }
    },

    onPopupHandler: function (control, param, handler) {
        var addParam;
        switch (control.id) {
            case "txtFirstWriteID":
            case "txtLastUpdatedID":
                addParam = { GwUse: true, Type: true, UserFlag: "id", isIncludeInactive: true, MENU_TYPE: "S", hidGwUse: "1" };
                break;
            case "txtGyeCode":
                addParam = {
                    isIncludeInactive: true
                }
                break;
        }
        this._super.onPopupHandler.apply(this, [control, param, handler, addParam]);
    },

    // 페이지마다 처리 해야할 param이 다른경우 
    setInitGridSettings: function (settings, param) {
        settings.setStyleRowBackgroundColor(function (rowItem) {
            var color = '';
            if (!$.isEmpty(rowItem.IO_GUBUN)) {
                if (rowItem.IO_GUBUN == 1)
                    color = 'danger';
                else if (rowItem.IO_GUBUN == 2)
                    color = 'muted';
            }
            return color;
        }.bind(self));
        settings.setEventUseAfterRowDataLoadForInitialData(true);
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
    }
});