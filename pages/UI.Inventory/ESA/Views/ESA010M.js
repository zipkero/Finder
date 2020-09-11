window.__define_resource && __define_resource("LBL03003","BTN00410","LBL02279","LBL10323","LBL01457","BTN00065","BTN00067","BTN00765","BTN00043","LBL13100","BTN00028","BTN00771","BTN00959","BTN00204","BTN00203","BTN00033","BTN00275","BTN00007","BTN00008","MSG07652","MSG07653","MSG00631","MSG00618","MSG05881","MSG03845","MSG03846","LBL13101","LBL02987","MSG00299","LBL07280","MSG00150","BTN00236","LBL03017","MSG08770","MSG00675","MSG00229","LBL80071","LBL02389","LBL04244","BTN00541","LBL03004","LBL80099","LBL01234","MSG06090","LBL02881","MSG00590","LBL02072","MSG05226","LBL02339","LBL03024","MSG00141","MSG05079","MSG05078","MSG07948","MSG00332","MSG01768","MSG01770","MSG01777","MSG04441","MSG03475","MSG03463","MSG05353","MSG04149","MSG07576","MSG00297","BTN85009","LBL02025","LBL02538","LBL01250","LBL01523","LBL01387","LBL11065");
/****************************************************************************************************
1. Create Date : 2015.03.24
2. Creator     : 강성훈
3. Description : 재고 > 기초등록 > 품목등록 ()
4. Precaution  :
5. History     : 2015.11.19 배소영 수정
                 2016.02.01 이은규 - 헤더에 옵션 > 사용방법설정 추가
                 2016.04.15 최용환 - CS최소주문수량 소수점 적용
                 2017.09.25 이현우 - CS최소주문수량 - 최소주문수량 사용여부가 기본설정(Default)일때도 최소주문수량을 Value를 설정할 수 있도록 변경
                 2018.09.18 (TanThanh) - Change function Copy to footer Copy button
                 2018.12.10 (bsy) - Dev16741 OEM,다공정 -품목구분 무형상품 제거
                 2018.12.27 (HoangLinh): Remove $el
                 2018.12.21 (PhiVo) applied 17520-A18_04271
                 2019.02.18 (Hao) Additional Tab > Show title by resource if empty
                 2019.02.19 (Hao) Additional Tab > change logic get title ( Dev. 19793)
                 2019.02.25 (PhiVo) A19_00625-FE 리팩토링_페이지 일괄작업 10차
                 [2019.01.14][On Minh Thien] A18_03954 (양식설정 개선 - 입력화면설정 버튼 Option으로 빼기)
                 2019.01.28 (BSY) 주품목 제거 및 테이블 변경에 따른 처리
                 2019.04.04 (Hao): Remove delimiter when adjust
                 2019.04.10 (강성훈): 신규, 수정, 삭제, 사용중단 3.0 적용
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.07.04 (PhiVo) A19_02187-사용중단품목 저장시 사용으로 변경되는 현상
                 [2019.07.15][On Minh Thien] A19_02327 - 특수문자 제한 및 치환 로직변경 (다공정품목/OEM품목)
                 2019.10.24 (Ngo Thanh Lam) A19_03695 - Modify Delete function same menu list
                 2019.11.05(PhiVo) - A17_02590 - Change URL /ECERP/EGG/EGG025M to /ECERP/SVC/ENT/ENT007M
                 2019.12.13 (phivo) - fix up30 33884
                 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
				 2020.01.06(양미진) - dev 33917 A19_04756 관계설정된 대표품목 품목구분 설정문제입니다
****************************************************************************************************/

ecount.page.factory("ecount.page.formsetBasic", "ESA010M", {
    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    //추가 항목
    commonCode: null,

    // ESC Key off 처리 
    off_key_esc: true,

    // 설정정보
    mypageCompany_AutoCode: null,

    //API Save Parameter
    prodSave: null,

    //안전재고 파람
    setup: null,

    // 단가
    userPrice: null,

    // 품목이미지
    imageList: null,

    // Tab List
    allTab: null,

    // 조회된 품목 정보
    prodView: null,

    // 조회된 품목 기타 정보
    setupView: null,

    // 자동 생성 신규 품목코드
    newProdCd: '',

    // 다공정 메인 품목일경우
    gProdList: null,

    // 삭제여부
    delFlag: 'N',

    // 신규 여부
    isNewFlag: false,

    // 사용방법설정 팝업창 높이					
    selfCustomizingHeight: 0,

    // 다공정품목 여부 (상위, 하위 품목 모두 포함)
    gProdFlag: false,

    //oem 등록시 bom
    oemBomData: null,

    //모델품 품목코드
    oemModelProdCd: null,

    multiSizeProdList: null,

    //품목코드 타입 분류
    prodTypeGroup: {
        productionPossibleGroup: ['1', '2', '3'],   //생산가능 그룹
        checkSetPossibleGroup: ['1', '3']           //세트체크가능 그룹
    },

    //체크해야할 주품목코드 품목타입
    checkProdTypeByMainProdCD: '',

    /**************************************************************************************************** 
    * page initialize
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5cnwvbJO3&pageId=page-config
    ****************************************************************************************************/
    init: function (options) {
        
        this.initProperties();
        this._super.init.apply(this, arguments);

        if (this.isOemProd) {
            for (var i = 0; i < this.viewBag.FormInfos.SI902.items.length; i++) {
                for (var ii = 0; ii < this.viewBag.FormInfos.SI902.items[i].subItems.length; ii++) {
                    var currentSubItem = this.viewBag.FormInfos.SI902.items[i].subItems[ii];
                    if (["PROD_CD", "PROD_DES"].contains(currentSubItem.id || "0")) {
                        currentSubItem.controlType = 'widget.combine.inputProd';
                        currentSubItem.containsTypes = (currentSubItem.id == "PROD_CD" ? ["code", "code"] : ["name", "name"]); // 특수문자체크 설정
                    }
                }
            }
        }

        this.prodSave.WDATE = this.viewBag.LocalTime;

        if (this.PROD_FLAG.equals("G")) {
            this.gProdList = (this.viewBag.InitDatas.LoadProd[0]) ? this.viewBag.InitDatas.LoadProd : null;
            this.prodView = (this.viewBag.InitDatas.LoadProd[0]) ? this.viewBag.InitDatas.LoadProd[this.viewBag.InitDatas.LoadProd.length - 1] : null;
        }
        else {
            this.prodView = (this.viewBag.InitDatas.LoadProd[0]) ? this.viewBag.InitDatas.LoadProd[0] : null;
        }

        if (this.prodView && this.prodView.G_PROD_CD == undefined) {
            this.prodView.G_PROD_CD = "";
        }

        // 복사이면 PROD_CD를 초기화 해준다. 
        if (this.CopyFlag == "Y") {
            if (this.isOemProd) {
                this.oemModelProdCd = [{ value: this.prodView.PROD_CD, label: this.prodView.PROD_DES }]
            }
            this.prodView.PROD_CD = "";
        }

        // 삭제구분(사용중단)
        if (this.prodView && this.prodView.DEL_GUBUN)
            this.delFlag = this.prodView.DEL_GUBUN.toUpperCase();

        this.setupView = (this.viewBag.InitDatas.LoadSetup[0]) ? this.viewBag.InitDatas.LoadSetup : null;

        // 이미지
        this.imageList = this.viewBag.InitDatas.LoadImage;

        // 권한
        this.permitFile = this.viewBag.Permission.file;
        this.permitProd = this.viewBag.Permission.prod;
        this.permitSale = this.viewBag.Permission.sale;

        // focus
        this.setAutoFocusOnTabPane = true;

        // 다공정품목 여부 (다공정품목일 경우 true)
        if (this.prodView && this.prodView.G_PROD_CD)
            this.gProdFlag = true;

        this.checkProdTypeByMainProdCD = (this.EditFlag == "I" && this.prodView && this.prodView.MAIN_PROD_CD_PROD_TYPE) ? this.prodView.MAIN_PROD_CD_PROD_TYPE : this.prodTypeByMainProdCD || '';
        if (this.EditFlag == "I" && !$.isEmpty(this.prodView) && !$.isEmpty(this.KEYWORD)) {
            this.prodView.PROD_DES = this.KEYWORD;
        }
        this.ecRequire(["ecmodule.common.formHelper"]);
    },

    // init properties
    initProperties: function () {
        this.commonCode = { cont1: "", cont2: "", cont3: "", cont4: "", cont5: "", cont6: "", cont7: "", cont8: "", cont9: "" };

        this.mypageCompany_AutoCode = {
            AUTOMAKE_TYPE: null,
            INPUTMAKE_TYPE: null,
            MenuName: null,
            NUM_DIGIT_LEN: null,
            Trx: null,
            USE_AUTOMAKE: null,
            USE_BUTTON: null,
            USE_DOCNO: null
        };

        //안전재고 파람
        this.setup = {};
        // 단가
        this.userPrice = {};

        this.prodSave = {
            DEL_GUBUN: "N",
            WDATE: "",
            SYNC_BOM_YN: "N"
        };

        this.allTab = ['BASIC', 'PROD', 'QTY', 'PRICE', 'COST', 'CONT', 'ITEM'];

        //initcontrol 정보
        this._pageOption = { onInitControl: this.prodOnInitControl.bind(this) };
    },

    onInitControl: function (cid, control) {
        this._super.onInitControl.apply(this, arguments);
        switch (cid) {
            case "CLASS_CD":
            case "CLASS_CD2":
            case "CLASS_CD3":
            case "INSPECT_TYPE_CD":
            case "CUST":
                control.setOptions({ labelContainsType: "search" });
                break;
            default:
                break;
        }
    },


    // render
    render: function ($parent) {
        this._super.render.apply(this);
        this.multiSizeProdList = this.viewBag.InitDatas.MultiSizeProdList || [];
    },

    /****************************************************************************************************
    * UI Layout setting
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-header
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I5lBc6pRn2&pageId=page-layout-contents
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-layout-footer
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-control
    ****************************************************************************************************/
    onInitHeader: function (header) {
        header.notUsedBookmark();

        this.mypageCompany_AutoCode = $.extend({}, this.mypageCompany_AutoCode, this.viewBag.InitDatas.autoCodeItems[0] || {});
        this.newProdCd = this.viewBag.InitDatas.autoNewCode;

        header.setTitle(ecount.resource.LBL03003)
            .add("option", [
                { id: "webTrans", label: ecount.resource.BTN00410 },
                { id: "inputSetting", label: ecount.resource.LBL02279 },
                { id: "search", label: ecount.resource.LBL10323 },          // 품목구분별회계계정추가
                { id: "SelfCustomizing", label: ecount.resource.LBL01457 }
            ]);

        this.commonCode.cont1 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "CONT1"; }).title;
        this.commonCode.cont2 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "CONT2"; }).title;
        this.commonCode.cont3 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "CONT3"; }).title;
        this.commonCode.cont4 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "CONT4"; }).title;
        this.commonCode.cont5 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "CONT5"; }).title;
        this.commonCode.cont6 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "CONT6"; }).title;
        this.commonCode.cont7 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER1"; }).title;
        this.commonCode.cont8 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER2"; }).title;
        this.commonCode.cont9 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER3"; }).title;
        this.commonCode.cont10 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER4"; }).title;
        this.commonCode.cont11 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER5"; }).title;
        this.commonCode.cont12 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER6"; }).title;
        this.commonCode.cont13 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER7"; }).title;
        this.commonCode.cont14 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER8"; }).title;
        this.commonCode.cont15 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER9"; }).title;
        this.commonCode.cont16 = this.viewBag.FormInfos.SI902.items[5].subItems.find(function (element) { return element.id == "NO_USER10"; }).title;

    },

    onInitContents: function (contents, resource) {
        var tabContents = widget.generator.tabContents();
        var self = this;

        tabContents
            .onSync()
            .setType("SI902")
            .setSeq(1)
            .template("register")
            .filter(function (control) {
                switch (control.id) {
                    case "MAIN_PROD_CD_BASE":   //주품목
                        return false;
                        break;
                    case "PROD_FILE": // 파일관리
                        if (self.EditFlag != "M") {
                            return false;
                        }
                        break;
                    case "PROD_LEVEL_GROUP":  // 다공정품목 일때 품목계층그룹 숨기기
                        if (self.isMultiProcess) {
                            return false;
                        }
                        break;
                    case "OEM_PROD_TYPE":
                    case "OEM_BOM":
                        return self.isOemProd;
                        break;
                }
            });

        contents.add(tabContents);
    },

    onInitFooter: function (footer) {
        var g = widget.generator;
        var toolbar = g.toolbar();
        var ctrl = g.control();

        if (this.HistoryFlag != 'Y') {
            // 버튼 생성
            // 저장/내용유지를 사용할때만 버튼 그룹 생성         
            var ctrlSave = ctrl.define("widget.button.group", "save").label(ecount.resource.BTN00065);
            if (this.isSaveContentsFlag) {            // 저장내용유지
                ctrlSave.addGroup([{ id: 'saveContinue', label: ecount.resource.BTN00067 }, { id: 'saveNew', label: ecount.resource.BTN00765 }]);
            } else if (this.isSaveFlag) {   // 판매전표입력에서 품목 검색창에서 팝업으로 띄울때 저장+ 신규. 즉 this.isSaveContentsFlag= false && isSaveFlag == true 
                ctrlSave.addGroup([{ id: 'saveNew', label: ecount.resource.BTN00043 }]);
            }

            toolbar.addLeft(ctrlSave.clickOnce());

            if (((this.PROD_FLAG.equals("S") && this.EditFlag != "M") || (this.EditFlag == "M" && this.PROD_FLAG.equals("M"))) && ecount.config.inventory.USE_MULTI_PROD && this.isOemProd != true) {
                toolbar.addLeft(ctrl.define("widget.button", "multiSizeProd").label(ecount.resource.LBL13100)); //다규격품목
            }

            if (this.EditFlag == "M") { //this.isDeleteFlag, this.isIncludeInactive
                if (!this.isMultiProcess && this.prodView && ["1", "2"].contains(this.prodView.PROD_TYPE)) {
                    toolbar.addLeft(ctrl.define("widget.button.group", "prodCopy").label(ecount.resource.BTN00028)
                        .addGroup([
                            { id: "prodCopyWithBom", label: ecount.resource.BTN00771 } //복사(Bom포함
                        ]).css("btn btn-default"));
                }
                else {
                    toolbar.addLeft(ctrl.define("widget.button", "prodCopy").label(ecount.resource.BTN00028));
                }

                var ctrlDel = ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959).css("btn btn-default");
                ctrlDel.addGroup([
                    { id: 'use', label: ((this.delFlag == "N") ? ecount.resource.BTN00204 : ecount.resource.BTN00203) },
                    { id: 'delete', label: ecount.resource.BTN00033 }
                ]).noActionBtn().setButtonArrowDirection("up");  // 사용, 사용중단

                toolbar.addLeft(ctrlDel);
            }

            if (this.isListFlag) {  // 리스트로 가는것 구에서 실행 될수 있음 
                toolbar.addLeft(ctrl.define("widget.button", "list").label(ecount.resource.BTN00275));
            }

            toolbar.addLeft(ctrl.define('widget.button', 'reWrite').label(ecount.resource.BTN00007));

            if (this.isCloseFlag) {
                toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
            }
        } else {
            toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008));
        }

        if (this.isHistoryFlag) {
            toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
        }

        if (!this.isMobileFlag)
            footer.add(toolbar);
    },

    onFocusOutHandler: function () {
        var ctrl = this.footer.getControl("save");
        ctrl && ctrl.setFocus(0);
    },

    /**************************************************************************************************** 
    * define common event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-general
    ****************************************************************************************************/
    onLoadTabPane: function (event) { },

    onLoadTabContents: function (event) { },

    onChangeHeaderTab: function (event) { },

    onChangeContentsTab: function (event) {

    },

    onChangeControl: function (event) {
        var cid = event.__self.pcid || event.cid;
        var self = this;

        $(this.allTab).each(function (i, data) {
            var control = self.contents.getControl(cid, data);
            if (control) {
                if (control.isCombinedControl()) {
                    control = control.get(event.__self.id);
                }
            }
        });

        this.setControlChange(event.cid, event.value, event.oldVlaue);
    },

    // 페이지 로딩 완료 후 이벤트
    onLoadComplete: function (e) {
        var prodType = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").getValue();

        if (this.isMultiProcess == true && this.PROD_FLAG && this.PROD_FLAG.equals("G")) {
            var isProdTypeDefCange = this.prodView && ["0", "3", "4", "7"].contains(this.prodView.PROD_TYPE) && this.EditFlag == "I";

            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").hideCompByValue(["0", "3", "4", "7"]);
            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").setValue(0, this.prodView ? (isProdTypeDefCange ? "1" : this.prodView.PROD_TYPE) : "1");

            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").hideCompByValue(["0", "3", "4", "7"]);
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").setValue(0, this.prodView ? (isProdTypeDefCange ? "1" : this.prodView.PROD_TYPE) : "1");
            }
        } else if (this.isOemProd) {
            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").hideCompByValue(["0", "2", "3", "4", "7"]);
            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").setValue(0, this.prodView ? this.prodView.PROD_TYPE : "1");

            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").hideCompByValue(["0", "2", "3", "4", "7"]);
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").setValue(0, this.prodView ? this.prodView.PROD_TYPE : "1");
            }
        }

        if (this.prodView && !(["1", "3"].contains(this.prodView.PROD_TYPE))) {
            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG").hide(true);

            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("SET_FLAG").hide(true);
            }
        }

        //원가-재료비 활성화여부
        if (["1", "2"].contains(prodType)) {  // 제품, 반제품 일때 
            this.setMeterialCostControlByProdType(false);
        }
        else {
            this.setMeterialCostControlByProdType(true);
        }

        //원가-재료비외 활성화여부
        if (["0", "4"].contains(prodType) || (prodType == "3" && this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG").getValue() == "0")) {   // 원재료, 부재료, (상품 & SET가 아닐때)
            this.setCostControlByProdType(false);
        }
        else {
            this.setCostControlByProdType(true);
        }

        if (this.isChangeTab == true) {
            this.contents.changeTab(this.tabId, false);
            ctrl = this.contents.getControl(this.controlId, this.tabId);
            ctrl.setFocus(0);
        }

        //oem등록시 기본값이있는경우
        if (this.EditFlag == "I" && this.isOemProd && this.prodView && this.prodView.OEM_PROD_TYPE) {
            this.setOemProdTypeOnChange('', this.prodView.OEM_PROD_TYPE, '1');
        }

        // 무형상품이면         
        if (this.prodView.PROD_TYPE == '7') {
            this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "PROD").readOnly(true);
            if (this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "BASIC")) {
                this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "BASIC").readOnly(true);
            }
        }

        ecmodule.common.formHelper.checkSetupList(this, this.viewBag.DefaultOption.PROGRAM_ID);  //PROGRAM_SEQ : 1080
    },

    // 위젯 연동 팝업이 뜨기전에 호출되는 콜백
    onPreInitPopupHandler: function (control, keyword, config, response) {
        return true;
    },

    /****************************************************************************************************
    * define grid event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/
    onGridInit: function (e, data, grid) { },

    onGridRenderComplete: function (e, data, grid) { },

    onGridAfterFormLoad: function (e, data, grid) { },


    /**************************************************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-grid
    ****************************************************************************************************/

    /**************************************************************************************************** 
    *  define hotkey event listener
    * http://zeus.ecounterp.com/ECERP/ECDEV/Tutorials?ec_req_sid=00I4m1TbRTi5&pageId=page-event-key
    ****************************************************************************************************/
    ON_KEY_F2: function () {
        this.prodNewProcess();
    },

    ON_KEY_F8: function () {
        this.setSave(false);
        this.setInitSetAllow();
    },

    reloadPage: function () {
        var self = this;
        var param = {
            editFlag: self.EditFlag,
            copyFlag: "N",
            PROD_CD: (self.prodView) ? self.prodView.PROD_CD : "",
            PROD_FLAG: self.PROD_FLAG,
            isMultiProcess: self.isMultiProcess,
            oldProdCd: "",
            isCloseFlag: true,
            hidSearchXml: self.hidSearchXml,
            hidData: self.hidData,
            hidTab2: "",
            isFromApp: self.isFromApp ? true : false,
            isOemProd: self.isOemProd
        }

        if (self.isFromApp) {
            self.onAllSubmitSelf("/ECErp/ESA/ESA010M?ErpApp=ADD", param);
        }
        else {
            self.onAllSubmitSelf("/ECErp/ESA/ESA010M", param);
        }
    },

    //oem 등록시 bom
    onContentsOEM_BOM: function () {
        var val = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").getValue();

        if (val != "1" && val != "2") {
            this.contents.getControl('PROD_TYPE_BASE').showError(ecount.resource.MSG07652);  //제품, 반제품인 경우에만 가능 합니다.
            return false;
        }

        var basic151 = this.contents.getControl('OEM_PROD_TYPE') && this.contents.getControl('OEM_PROD_TYPE').get(1),
            prod151 = this.contents.getControl('OEM_PROD_TYPE', "PROD").get(1),
            basic1 = this.contents.getControl('PROD_CD'),
            prod1 = this.contents.getControl('PROD_CD', "PROD"),
            basic2 = this.contents.getControl('PROD_DES')
        prod2 = this.contents.getControl('PROD_DES', "PROD"),
            setControl = null;

        switch (this.contents.getControl('OEM_PROD_TYPE', "PROD").get(0).getValue()) {
            case "1":
                if ($.isEmpty(prod151.getValue())) {
                    if (basic151) {
                        setControl = basic151;
                    } else {
                        this.contents.changeTab("PROD", false);
                        setControl = prod151;
                    }

                    setControl.showError(ecount.resource.MSG07653); //"모델품을 선택 바랍니다."
                    setControl.setFocus(0)
                    return false
                }

                var setFocusIdx = ecount.config.inventory.OEM_GEN_RULE == 1 ? 0 : 2;
                if (prod1 && prod1.getValue().count(function (val) { return $.isEmpty(val); }) > 0) {
                    if (basic1) {
                        setControl = basic1;
                    } else {
                        this.contents.changeTab("PROD", false);
                        setControl = prod1;
                    }

                    setControl.get(1).showError(ecount.resource.MSG00631);
                    setControl.get(1).setFocus(setFocusIdx);
                    return false;
                }

                if (prod2 && prod2.getValue().count(function (val) { return $.isEmpty(val); }) > 0) {
                    if (basic2) {
                        setControl = basic2;
                    } else {
                        this.contents.changeTab("PROD", false);
                        setControl = prod2;
                    }

                    setControl.get(1).showError(ecount.resource.MSG00618);
                    setControl.get(1).setFocus(setFocusIdx);
                    return false;
                }
                break;
            default:
                if (prod1 && $.isEmpty(prod1.getValue())) {
                    if (basic1) {
                        setControl = basic1;
                    } else {
                        this.contents.changeTab("PROD", false);
                        setControl = prod1;
                    }

                    setControl.get(0).showError(ecount.resource.MSG00631);
                    setControl.get(0).setFocus(0);
                    return false;
                }

                if (prod2 && $.isEmpty(prod2.getValue())) {
                    if (basic2) {
                        setControl = basic2;
                    } else {
                        this.contents.changeTab("PROD", false);
                        setControl = prod2;
                    }

                    setControl.get(0).showError(ecount.resource.MSG00618);
                    setControl.get(0).setFocus(0);
                    return false;
                }
                break;
        }

        var prodValue = this.getProdCdDes();

        if (!$.isEmpty(this.oemBomData)) {
            this.oemBomData.BomTop.BOM_CD = prodValue.value;
            this.oemBomData.BomTop.PROD_DES = prodValue.label || "";
        }

        var checkWhCdData = this.contents.getControl('WH_CD_BASE', "PROD").get(0).getSelectedItem();
        var paramData = {
            width: this.productWidth3 + 20
            , height: 600
            , BOM_CD: prodValue.value
            , BOM_DES: prodValue.label || ""
            , BOM_NO: 0
            , BOM_QTY: 0
            , LIST_TYPE: "A"
            , BOM_SHOW_TYPE: 'ONE'
            , EDIT_FLAG: 'I'
            , IsOemProd: this.isOemProd
            , PROD_TYPE: this.contents.getControl('PROD_TYPE_BASE', "PROD").get("PROD_TYPE").getValue()
            , OEM_PROD_TYPE: this.contents.getControl('OEM_PROD_TYPE', "PROD").get(0).getValue()
            , PLANT_CD: checkWhCdData.length > 0 ? checkWhCdData.first().value : ''
            , PLANT_DES: checkWhCdData.length > 0 ? checkWhCdData.first().label : ''
            , SET_FLAG: val == "1" ? this.contents.getControl('PROD_TYPE_BASE', "PROD").get("SET_FLAG").getValue() : "0"
            , SIZE_DES: ""
            , MAIN_PROD_CD: this.prodView.MAIN_PROD_CD      // bsy 최초 조회된 대표품목으로 
            , SYNC_BOM_YN: "N"
            , OEM_MODEL_PROD: this.contents.getControl("OEM_PROD_TYPE", "PROD").get(0).getValue() == "1" ? this.contents.getControl("OEM_PROD_TYPE", "PROD").get(1).getValue() : ""
            , transferTopData: $.isEmpty(this.oemBomData) ? "" : this.oemBomData.BomTop
            , transferRowData: $.isEmpty(this.oemBomData) ? "" : this.oemBomData.BomBottom
            , OEM_PROD_CD_SPLIT: this.contents.getControl("OEM_PROD_TYPE", "PROD").get(0).getValue() == "1" ? (this.contents.getControl("PROD_CD", "PROD").get(1).getValue()[ecount.config.inventory.OEM_GEN_RULE == 1 ? 0 : 2]) : ""
            , OEM_PROD_DES_SPLIT: this.contents.getControl("OEM_PROD_TYPE", "PROD").get(0).getValue() == "1" ? (this.contents.getControl("PROD_DES", "PROD").get(1).getValue()[ecount.config.inventory.OEM_GEN_RULE == 1 ? 0 : 2]) : ""
        };

        this.openWindow({
            url: "/ECERP/ESJ/ESJ001P_04",
            name: "Enter BOM",
            param: paramData,
            modal: true
        });
    },

    // 창고별 지정(안전재고수량)
    onContentsWhQty: function () {
        if (this.EditFlag != "M") {
            ecount.alert(ecount.resource.MSG05881);
            return;
        }

        if (ecount.config.inventory.WHSAFE_TYPE == "0") {
            ecount.alert(ecount.resource.MSG03845 + "\n\n" + ecount.resource.MSG03846);
            return;
        }

        var param = {
            width: 410,  // 데이타가 많을경우 스크롤이 생기므로 width 유지 해야함
            height: 600,
            prod_cd: (this.prodView) ? this.prodView.PROD_CD : this.contents.getControl('PROD_CD', "PROD").getValue()
        };

        this.openWindow({
            url: '/ECErp/ESA/ESA010P_12',
            name: "ESA010P_12",
            param: param,
            additional: false
        });
    },

    // Footer 버튼 클릭 이벤트 시작-----------------------------------------------------------------------------

    // 저장버튼 클릭
    onFooterSave: function () {
        this.continueFlag = false;
        this.setSave(false);
    },

    // 저장/내용유지 버튼 클릭
    onButtonSaveContinue: function () {
        this.continueFlag = true;
        this.setSave(false);
    },

    // 저장/신규버튼 클릭
    onButtonSaveNew: function () {
        this.continueFlag = true;
        this.setSave(true);
    },

    //다규격품목
    onFooterMultiSizeProd: function () {
        this.openWindow({
            url: '/ECERP/ESA/ESA010P_13',
            name: ecount.resource.LBL13101,   //다규격품목코드 생성
            param: {
                width: 800,
                height: 600,
                PROD_CD: this.EditFlag == "M" ? this.prodView.PROD_CD : this.contents.getControl('PROD_CD', "PROD").getValue(),
                PROD_DES: this.EditFlag == "M" ? this.prodView.PROD_DES : this.contents.getControl('PROD_DES', "PROD").getValue(),
                MultiSizeProdList: this.multiSizeProdList,
                EditFlag: this.EditFlag
            }
        });
    },

    //Rewrite(다시작성)
    onFooterReWrite: function (e) {
        var prodCd = this.SAVE_PROD_CD != null ? this.SAVE_PROD_CD : this.PROD_CD;
        if (prodCd == null || prodCd == undefined) {
            this.prodNewProcess();
        }
        else {
            var param = {
                editFlag: "M",
                copyFlag: "N",
                PROD_CD: prodCd,
                PROD_FLAG: this.PROD_FLAG,
                isMultiProcess: this.isMultiProcess,
                oldProdCd: "",
                isCloseFlag: true,
                hidSearchXml: this.hidSearchXml,        // 구프레임웍에서 연결할수 있으므로 유지
                hidData: this.hidData,                  // 구프레임웍에서 연결할수 있으므로 유지
                hidTab2: "",
                isFromApp: this.isFromApp ? true : false,
                isOemProd: this.isOemProd
            };

            if (this.isFromApp) {
                this.onAllSubmitSelf("/ECErp/ESA/ESA010M?ErpApp=ADD", param);
            }
            else {
                this.onAllSubmitSelf("/ECErp/ESA/ESA010M", param);
            }
        }
    },

    // 사용중단
    onButtonUse: function () {
        var self = this;
        this.setInitSetAllow();
        // 권한체크
        if (this.EditFlag == "M") {  // 수정 저장은 모든 권한이 있을때만 가능
            if (this.viewBag.Permission.prod.Value != "W") {
                var msgdto = ecount.common.getAuthMessage("", [{
                    MenuResource: ecount.resource.LBL02987, PermissionMode: "U"
                }]);
                ecount.alert(msgdto.fullErrorMsg);
                return;
            }
        }

        if (!this.viewBag.Permission.prod.CW) {
            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: ecount.resource.LBL02987, PermissionMode: "W"
            }]);
            ecount.alert(msgdto.fullErrorMsg);
            return;
        }

        var param = {
            PROD_CD: self.PROD_CD,
            DEL_GUBUN: self.prodView.DEL_GUBUN == "Y" ? "N" : "Y",
            PROD_FLAG: self.PROD_FLAG
        };
        var updatedList = {
            Data: []
        };


        updatedList.Data.push(param);

        var formData = Object.toJSON({
            Request: {
                Data: updatedList.Data
            }
        });

        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateSale003ForDelFlag",
            data: formData,
            success: function (result) {
                if (result.Status == "200") {
                    self.reloadItemList(true);
                }
            }
        });
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    // 삭제버튼 클릭
    onButtonDelete: function () {
        var self = this;
        this.setInitSetAllow();
        // 권한체크
        if (!this.viewBag.Permission.prod.CD) {
            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: ecount.resource.LBL02987, PermissionMode: "D"
            }]);
            ecount.alert(msgdto.fullErrorMsg);
            this.setInitSetAllow();
            return;
        }

        //리소스 
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === false) {
                this.setInitSetAllow();
                return;
            }
            
            //var self = this;
            //var btnDelete = this.footer.get(0).getControl("deleteRestore");
            var DeleteLists = [];
            DeleteLists.push(self.prodView.PROD_CD);

            var formData = Object.toJSON({
                MENU_CODE: "Item",              //MENU_CODE (ENUM_BASIC_CODE_TYPE)
                CHECK_TYPE: "S",                //삭제전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A)
                DELETE_TYPE: "SEARCH",          //삭제타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행)
                PARAMS: DeleteLists                    //단일, 선택삭제시 삭제할 거래처코드
            });
            ecount.common.api({
                url: "/SVC/Inventory/Basic/DeleteItemCheckList",
                data: formData,
                success: function (result) {
                    if (result.Status !== "200") {
                        ecount.alert(result.fullErrorMsg + result.Data);
                    }
                    else if (result.Data !== null && result.Data.length === 1 && result.Data[0].CHECK_CODE === null) {
                        ecount.alert(result.Data[0].ERR_MSG);
                    }
                    else if (result.Data !== null && result.Data !== "" && result.Data !== undefined && result.Data.length > 0) {

                        //삭제불가 코드리스트 팝업창 연결
                        self.ShowNoticeNonDeletable(result.Data);
                    }
                    else {
                        self.reloadItemList(true);

                    }
                    if (self.isFromApp) {
                        self.onAllSubmitSelf("/mobile/close", {});
                    }
                }
            });
        });

        this.setInitSetAllow();
    },

    // 리스트 버튼 클릭
    onFooterList: function () {
        // 구프레임웍 연결시 변경하여 사용 할것 
        var url = "/ECErp/ESA/ESA009M";
        var param = {
            hidSearchXml: this.hidSearchXml,
            hidData: this.hidData,
            hidSedit: "N",
            hidErrMsg: ""
        };

        this.onAllSubmitSelf(url, param);
    },

    // 닫기 버튼
    onFooterClose: function () {
        this.close();
        if (this.isFromApp) {
            window.open('mobile/close');
        }
    },

    // History 
    onFooterHistory: function () {
        this.openWindow({
            url: '/ECERP/Popup.Search/ES303P',
            name: ecount.resource.LBL07280,
            param: {
                width: 435,
                height: 300,
                menuType: "14",
                historySlipNo: this.prodView.PROD_CD,
                isLastDateShow: true,
                lastData: String.format("{0}[{1}]", ecount.infra.getECDateFormat('date11', false, this.prodView.WDATE.toDatetime()), this.prodView.WID)
            }
        });
    },

    // CONTENTS 버튼 클릭 이벤트 시작-------------------------------------------------------------------------
    // 품목코드 중복확인 버튼
    onFunctionProdDupCheck: function () {
        var self = this;
        var isValid = true;
        var prodCtrl = this.contents.getControl('PROD_CD');
        var tempProdCd = prodCtrl.getValue();

        if (tempProdCd == '') {
            prodCtrl.showError(ecount.resource.MSG00150);
            prodCtrl.setFocus(0);
            return;
        }

        if (this.isOemProd) {
            tempProdCd = $.isArray(tempProdCd) ? tempProdCd.join("") : tempProdCd;
        }

        if (ecount.common.ValidCheckSpecialForCodeType(tempProdCd).result == false) {
            isValid = false;
        }

        if (isValid) {
            var param = {
                keyword: tempProdCd,
                searchType: 'prod_cd',
                isColumSort: true,
                width: 430,
                height: 480
            };

            ecount.common.api({
                url: "/Inventory/Basic/CheckItemForSave",
                data: Object.toJSON({
                    FLAG: "I",
                    PROD_CD: tempProdCd
                }),
                success: function (result) {
                    if (result.Status == "200") {
                        switch (result.Data) {
                            case "0":   // OK 
                                self.openWindow({
                                    url: '/ECERP/Popup.Search/ES013P',
                                    name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03017),
                                    param: param,
                                    additional: false
                                });
                                break;
                            case "1":   // 1:이미존재하는 코드 INSERT불가  
                                self.setTabMove("PROD_CD", "PROD", String.format(ecount.resource.MSG08770, ecount.resource.LBL02987));  // 이미존재하는코드
                                break;
                            case "2":   // 2:코드가 존재하지 않습니다
                                self.setTabMove("PROD_CD", "PROD", ecount.resource.MSG00675);  // 코드가 존재하지 않습니다  
                                break;
                        }

                        if (result.Data != "0") {
                            self.setInitSetAllow();
                        }
                    } else {
                        self.setInitSetAllow();
                    }
                }
            });
        } else {
            prodCtrl.setFocus(0);
        }
    },

    // 품목코드 코드생성 버튼
    onFunctionProdCodeCreate: function () {
        if (!this.mypageCompany_AutoCode.USE_AUTOMAKE) {
            var msf = String.format(ecount.resource.MSG00229, ecount.resource.LBL80071, ecount.resource.LBL02389, ecount.resource.LBL04244);  // 품목, 재고, 품목코드자동생성
            this.setTimeout(function () {
                ecount.alert(msf);
            });
            return false;
        }

        var params = {
            height: 220,
            width: 820,
            autoNumberSettings: encodeURIComponent(Object.toJSON([{ CODE_TYPE: "7" }])),
            programID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/Popup.Search/CM102P',
            name: ecount.resource.BTN00541,
            param: params,
            additional: false
        });
    },

    //품목명 중복확인 버튼
    onFunctionProdDesDupCheck: function () {
        var isValid = true;
        var target = this.contents.getControl('PROD_DES');
        var tempProdDes = target.getValue();

        if (this.isOemProd) {
            tempProdDes = $.isArray(tempProdDes) ? tempProdDes.join("") : tempProdDes;
        }

        if (ecount.common.ValidCheckSpecialForCodeName(tempProdDes).result == false) {
            isValid = false;
        }

        if (isValid) {
            var param = {
                width: 430,
                height: 480,
                keyword: tempProdDes,
                searchType: 'prod_des',
                isColumSort: true
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL03004),
                param: param,
                additional: false
            });
        } else {
            target.setFocus(0);
        }
    },

    //규격명 중복확인 버튼
    onFunctionSizeDesDupCheck: function () {
        var isValid = true;
        var target = this.contents.getControl('SIZE_DES_BASE', "PROD").get(1);

        if (ecount.common.ValidCheckSpecialForCodeName(target.getValue()).result == false) {
            isValid = false;
        }

        if (isValid) {
            var param = {
                width: 430,
                height: 480,
                keyword: target.getValue(),
                searchType: 'size_des',
                isColumSort: true
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL80099),
                param: param,
                additional: false
            });
        } else {
            target.setFocus(0);
        }
    },

    //바코드 중복확인 버튼
    onFunctionBarCodeDupCheck: function () {
        var isValid = true;
        var target = this.contents.getControl('BAR_CODE', "PROD");

        if (ecount.common.ValidCheckSpecial(target.getValue()).result == false) {
            isValid = false;
        }

        if (isValid) {
            var param = {
                width: 430,
                height: 480,
                keyword: target.getValue(),
                searchType: 'bar_code',
                isColumSort: true
            };

            this.openWindow({
                url: '/ECERP/Popup.Search/ES013P',
                name: String.format('{0} ({1})', ecount.resource.BTN00236, ecount.resource.LBL01234),
                param: param,
                additional: false
            });
        } else {
            target.setFocus(0);
        }

    },

    // 품목코드 복사 버튼
    onFooterProdCopy: function () {
        if (!["W", "U", ].contains(this.permitProd.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }

        this.prodCopyProcess("N");
    },

    // "품목코드 복사(BOM포함)" 버튼
    onButtonProdCopyWithBom: function () {
        if (!["W", "U", ].contains(this.permitProd.Value)) {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }

        this.prodCopyProcess("Y");
    },

    // 픔목코드 변경 버튼
    onFunctionProdCodeChange: function () {
        if (this.permitProd.Value == "W") {
            // 다공정품목일 경우(상위, 하위 품목 모두) 코드 변경 불가
            if (this.gProdFlag) {
                ecount.alert(ecount.resource.MSG06090);
                return false;
            }

            var param = {
                width: ecount.infra.getPageWidthFromConfig(true),
                height: 300,
                Code: this.prodView.PROD_CD,
                CodeDes: this.prodView.PROD_DES,
                RequestType: 'prod',
                RequestSubType: "2",
            };

            this.openWindow({
                url: '/ECERP/Popup.Common/ESA002P_02',
                name: ecount.resource.LBL02881,
                additional: false,
                param: param
            })
        }
    },

    // 이미지 삽입 버튼(config 수정 후 다시 개발 진행 합니다.)
    onContentsPROD_IMAGE: function () {
        var locationAllow = ecount.infra.getGroupwarePermissionByAlert(this.viewBag.InitDatas.GroupwarePermission1).Excute();
        if (locationAllow) {
            //등록된 이미지 개수 체크
            if (this.contents.getControl("PROD_IMAGE", "PROD").getItemCount() >= 5) {
                ecount.alert(String.format(ecount.resource.MSG00590, ecount.resource.LBL02072, '5'));
                return false;
            }

            var param = {
                width: 780,
                height: 800,
                hidFlag: "I",
                AFlag: "4",
                PageType: "PROD",
                MaxCheckCount: 5,
                CheckedCount: 0,
                isViewApplyButton: true
            };

            this.openWindow({
                url: '/ECERP/SVC/ENT/ENT007M',
                name: "ENT007M",
                param: param,
                popupType: false,
                additional: true
            });
        }
    },

    //재고수량입력 버튼
    onContentsINV_ADJUST: function () {
        if (this.EditFlag != "M") {
            ecount.alert(ecount.resource.MSG05226);
            return;
        }

        var param = {
            width: 800,
            height: 600,
            ProdCds: this.prodView.PROD_CD,
            FromProd: 'Y'
        };

        this.openWindow({
            url: '/ECErp/ESP/ESP007P_02',
            name: "ESP007P_02",
            param: param
        });
    },

    //파일 관리 버튼 틀릭
    onContentsPROD_FILE: function () {
        //var locationAllow = ecount.infra.getGroupwarePermissionByAlert(this.viewBag.InitDatas.GroupwarePermission).Excute();
        //if (locationAllow) {
            var param = {
                width: 780,
                height: 600,
                BOARD_CD: 7000,
                isFileManage: true,
                prodCdAllInOne: this.prodView.PROD_CD,
                prodDesAllInOne: this.prodView.PROD_DES
            };

            this.openWindow({
                //url: "/ECMain/ESA/ESA009P_04.aspx?b_type=S01&code=" + encodeURIComponent(this.prodView.PROD_CD) + "&code_des=" + encodeURIComponent(this.prodView.PROD_DES),
                url: "/ECERP/EGM/EGM024M",
                name: 'ESA009P_04',
                param: param,
                popupType: false,
                fpopupID: this.ecPageID
            });
       // }
    },

    // 웹자료 올리기
    onDropdownWebTrans: function () {
        if (this.permitProd.Value == "W" || this.permitProd.Value == "U") {
            this.openWindow({
                url: '/ECERP/Popup.Common/BulkUploadForm', //'/ECERP/Popup.Common/EZS001M',
                name: ecount.resource.LBL02339,
                additional: true,
                popupType: false,
                param: {
                    width: 1000,
                    height: 640,
                    FormType: 'SI902', //SI420
                    IsGetBasicTab: true
                }
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }
    },

    // 추가 항목 등록
    onDropdownEtcCode: function () {
        if (ecount.user.USER_TYPE === "A" || ecount.user.USER_TYPE === "B" || this.permitProd.Value == "W") {
            var param = {
                width: ecount.infra.getPageWidthFromConfig(),
                height: 450,
                hidTab: "",
                cust_save: "Y",
                menu_gubun: "S",
                code_class: "S01",
                class_des: ecount.resource.LBL03024,
                hidData: this.hidData
            };

            this.openWindow({
                url: '/ECERP/Popup.Common/ESA002P_01',
                param: param
            });
        }
        else {
            ecount.alert(ecount.resource.MSG00141);
        }
    },

    // 입력 검색 화면
    onDropdownInputSetting: function () {
        if (this.permitProd.Value == "W" || this.permitProd.Value == "U") {
            var param = {
                width: 800,
                height: 815,
                FORM_TYPE: "SI902",
                FORM_SEQ: 1
            };

            this.openWindow({
                url: "/ECERP/Popup.Form/CM100P_07_CM",
                name: ecount.resource.LBL02279,
                param: param
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }
    },

    // 품목 계정 추가
    onDropdownSearch: function () {
        if (this.permitProd.Value == "W") {
            var param = {
                width: 510,
                height: 300
            };

            this.openWindow({
                url: "/ECERP/Popup.Common/ESA010P_05",
                name: 'ESA010P_05',
                param: param
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "W" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }
    },

    //A-J 단가 등록
    onDropdownAddPriceAtoJ: function () {
        if (this.permitProd.Value == "W" || this.permitProd.Value == "U") {
            var param = {
                width: 350,
                height: 470
            };

            this.openWindow({
                url: "/ECERP/Popup.Common/ESA010P_11",
                name: 'ESA010P_1',
                param: param
            });
        } else {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL03003, PermissionMode: "U" }]);
            this.setTimeout(function () {
                ecount.alert(msgdto.fullErrorMsg);
            });
            return false;
        }
    },

    // 사용방법설정 Dropdown Self-Customizing click event
    onDropdownSelfCustomizing: function (e) {
        var params = {
            width: 750,
            height: this.selfCustomizingHeight,
            PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
        };

        this.openWindow({
            url: '/ECERP/ESC/ESC002M',
            name: ecount.resource.LBL01457,
            param: params,
            fpopupID: this.ecPageID,
            popupType: false
        });
    },

    //OPTION 버튼 생성   끝---------------------------------------------------------------------------------------
    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/
    // 단가 정보 매핑
    getObjects: function (obj, val) {
        var retvalue = '';
        $.each(obj, function (i, adata) {
            if (adata.Key.CODE_NO == val)
                retvalue = adata.CODE_DES;
        });
        return retvalue;
    },

    //권한 메세지
    setUserMsg: function () {
        if (!(ecount.user.USER_TYPE == "A" || ecount.user.USER_TYPE == "B" || this.permitProd.Value == "W")) {
            ecount.alert(ecount.resource.MSG00141);
        }
    },

    getColEssentialYn: function (tab, cid) {
        if (this.viewBag.FormInfos.SI902) {
            var subiTem = this.viewBag.FormInfos.SI902.items.where(function (item) {
                return item.id == tab;
            }).select(function (subitem) {
                return subitem.subItems;
            }).first();

            return subiTem.any(function (itemid) {
                return itemid.id == cid && itemid.colEssentialYn == "Y";
            });
        }

        return false;
    },

    etcValidateCheck: function () {
        var tabId = "", ctarget = "", tControl;
        if (this.getColEssentialYn("PROD", "PROD_IMAGE")) {
            tControl = this.contents.getControl("PROD_IMAGE", "PROD");
            if (tControl && tControl.getValue().length == 0) {
                tControl.showError();
                tabId = "PROD";
                ctarget = tControl;
            }
        }

        if (this.getColEssentialYn("PROD", "PROD_FILE") && this.EditFlag == "M") {
            if (this.prodView && this.prodView.FILECNT == "0") {
                tControl = this.contents.getControl("PROD_FILE", "PROD");
                if (tControl) {
                    tControl.showError();
                    if ($.isEmpty(tabId)) {
                        tabId = "PROD";
                        ctarget = tControl;
                    }
                }
            }
        }

        if (this.getColEssentialYn("QTY", "SAFE_QTY") && this.EditFlag == "M" && ecount.config.inventory.WHSAFE_TYPE == "1") {
            if (this.prodView && new Decimal(this.prodView.SAFE_QTY || "0").isZero()) {
                tControl = this.contents.getControl("SAFE_QTY", "QTY");
                if (tControl) {
                    tControl.showError();
                    if ($.isEmpty(tabId)) {
                        tabId = "QTY";
                        ctarget = tControl;
                    }
                }
            }
        }

        return (tabId != "") ? { tabId: tabId, ctarget: ctarget } : null;
    },


    //저장
    setSave: function (isNew) {
        this.errorMessageControl = [];
        var save_AllTab = ['PROD', 'QTY', 'PRICE', 'COST', 'CONT', 'ITEM'];
        var self = this;
        var EasySchDataV1 = this.EasySchDataV1;  // 현재 값이 세팅 되는곳이 없음. 확인해봐야함   구프레임웍에서 hidEasySchData 값으로 처리 하고 있는데 무엇인지 모르겠음 
        var EasySchDataV2 = this.EasySchDataV2;
        var isError = false;    // validation check 
        this.isNewFlag = isNew;
        this.showProgressbar(false);

        //////////////////////////기본 체크 Start//////////////////////////
        // 권한체크 Start
        if (this.EditFlag == "M") {  // 수정 저장은 모든 권한이 있을때만 가능
            if (this.viewBag.Permission.prod.Value != "W") {
                var msgdto = ecount.common.getAuthMessage("", [{
                    MenuResource: ecount.resource.LBL02987, PermissionMode: "U"
                }]);

                ecount.alert(msgdto.fullErrorMsg);
                this.setInitSetAllow();
                return;
            }
        }

        if (!this.viewBag.Permission.prod.CW) {
            var msgdto = ecount.common.getAuthMessage("", [{
                MenuResource: ecount.resource.LBL02987, PermissionMode: "W"
            }]);

            ecount.alert(msgdto.fullErrorMsg);
            this.setInitSetAllow();
            return;
        }

        // 권한체크 End
        var firstTapid = "",
            firstTarget = "";

        // validation check 
        $(save_AllTab).each(function (i, data) {
            var invalid = self.contents.validate(data),
                invalidControl = {},
                targetControl = {};

            if (invalid.result.length > 0) {
                isError = true;
                invalidControl = self.contents.getControl(invalid.result[0][0].control.id, invalid.tabId);

                if (invalidControl) {   //현재 탭에 없을때 
                    targetControl = invalidControl;
                } else {
                    targetControl = invalid.result[0][0].control;
                }

                if ($.isEmpty(firstTapid)) {
                    firstTapid = invalid.tabId;
                    firstTarget = targetControl;
                }
            }
        });

        var etcValidate = this.etcValidateCheck();
        if (!$.isEmpty(etcValidate)) {
            isError = true;
            if ($.isEmpty(firstTapid)) {
                firstTapid = etcValidate.tabId;
                firstTarget = etcValidate.ctarget;
            }
        }

        if (isError) {
            if (!$.isEmpty(firstTapid)) {
                var cuttentControl = this.contents.getControl(firstTarget.id, this.contents.currentTabId);

                if (cuttentControl)
                    cuttentControl.setFocus(0);
                else {
                    firstTapid == (this.contents.currentTabId || firstTapid) ? "" : self.contents.changeTab(firstTapid, false);
                    firstTarget.setFocus(0);
                }
            }

            this.setInitSetAllow();
            return false;
        }
        ///////////////////////////기본 체크 End///////////////////////////
        var prod_type = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").getValue();//품목 구분

        //기본 파람 설정        
        this.prodSave = $.extend({}, this.prodSave);

        //탭별 항목 설정
        $(save_AllTab).each(function (i, data) {
            self.prodSave = $.extend({}, self.prodSave, self.contents.serialize(data).result || {});
        });

        //명수책임님
        //여기부터 할차례
        // 1. return false에 대해서 어떻게 처리할지
        // 2. 선택형 4가지 항목에 대해서 추가적인 validation
        returnValue = [];
        //////////////////////////상세 유효성 체크 Start//////////////////////////
        //각 함수의 return false가 잘 동작하는지 확인
        returnValue.push(checkSetFlagWhereEasySchDataIsNotEmpty.call(this));               //다공정이며, EasySchDataV1, EasySchDataV2가 비어있지 않을 때 체크
        returnValue.push(checkWhCdWhereProdGFlag.call(this));                              //다공정일때 생산공정 유효성 체크 bsy 제거 

        if (this.prodCdValidate) {
            returnValue = $.merge(returnValue, this.prodCdValidate.call(this));
        }

        if (returnValue.contains(false)) {
            this.setErrorValidate();
            this.setInitSetAllow();
            return false;
        }

        ///////////////////////////상세 유효성 체크 End///////////////////////////
        //////////////////////////////상세 값 세팅 Start//////////////////////////////
        setWhCd.call(this);                                             //생산공정 세팅
        setProdCdWhereProdCdLisNotEmpty.call(this);                     //변경해줘야 할 코드들?
        setProdTypeWhereProdGFlag.call(this);                           //다공정품목 일 경우, 품목구분이 반제품일 경우 L로 예외처리
        setCheckBoxValue.call(this);                                    //체크 되지 않은 체크 박스 설정
        setSizeDesBase.call(this);                                      //선택한 규격종류 별로 세팅
        setOemProdType.call(this);                                      //OEM등록 시, 선택한 OEMProdType에 따른 값 세팅
        setUserPrice.call(this, this.prodSave);                         //사용자정의 단가
        setSetup.call(this, this.prodSave);                             //안전재고,CS 최소주문수량, CS최소주문단위 설정 
        setSafeQty.call(this);                                          //안전재고수량 설정

        //////////////////////////////상세 값 세팅 End//////////////////////////////
        // [2016.01.21] Check whether items can be saved when saving
        // [2016.01.21] 저장 가능 여부 체크 후 저장 호출 
        ecount.common.api({
            url: "/Inventory/Basic/CheckItemForSave",
            data: Object.toJSON({
                FLAG: self.EditFlag,
                PROD_CD: self.prodSave.PROD_CD,
                PROD_FLAG: self.PROD_FLAG,
                MAIN_PROD_CD: '',   // 품목등록에서는 체크하지 말아야 하므로
                SYNC_BOM_YN: 'N'    // 품목등록에서는 체크하지 말아야 하므로
            }),
            success: function (result) {
                if (result.Status == "200") {
                    switch (result.Data) {
                        case "0":   // OK 
                            self.execSave();
                            break;
                        case "1":   // 1:이미존재하는 코드 INSERT불가                                                 
                            self.setTabMove("PROD_CD", "PROD", String.format(ecount.resource.MSG08770, ecount.resource.LBL02987));  // 이미존재하는코드
                            break;
                        case "2":   // 2:코드가 존재하지 않습니다
                            self.setTabMove("PROD_CD", "PROD", ecount.resource.MSG00675);  // 코드가 존재하지 않습니다
                            break;
                        case "3":   // 3: BOM_CD 중복 오류
                            self.setTabMove("PROD_CD", "PROD", ecount.resource.MSG00675);  // 코드가 존재하지 않습니다                            
                            break;
                    }
                    if (result.Data != "0") {
                        self.setInitSetAllow();
                    }
                } else {
                    self.setInitSetAllow();
                }
            }
        });

        //다공정이며, EasySchDataV1, EasySchDataV2가 비어있지 않을 때 체크
        function checkSetFlagWhereEasySchDataIsNotEmpty() {
            // 일반품목이고 아래 조건이 맞으면 소모품목체크 
            if (!this.PROD_FLAG.equals("G") && EasySchDataV1 !== "" && EasySchDataV2 !== "") {
                if (EasySchDataV1 === "70" || EasySchDataV1 === "42" || EasySchDataV1 === "43" || EasySchDataV1 === "32" || EasySchDataV1 === "90") {
                    var ctrlObj = null;  // validation check 시 사용할 컨트롤 object
                    // 소모품목코드
                    if (EasySchDataV1 === "32" || EasySchDataV2 === "501") {
                        ctrlObj = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG");
                        if (ctrlObj.getValue() == "1") {
                            this.setErrorMessageControl("PROD_TYPE_BASE", "PROD", ecount.resource.MSG05079);  // 세트품목은 소모품목으로 사용할 수 없습니다.\n세트여부를 확인 바랍니다
                            this.setInitSetAllow();
                            return false;
                        }
                    }
                        // 생산품목코드
                    else {
                        //1. 세트 체크일 시 상품만 저장
                        ctrlObj = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG");
                        if (ctrlObj.getValue() == "1") {
                            if (prod_type != "3") {
                                this.setErrorMessageControl("PROD_TYPE_BASE", "PROD", ecount.resource.MSG05078);  // 생산품목으로 사용하려면 품목구분이 제품/반제품이거나 세트품목이어야 합니다.\n품목구분 및 세트여부를 확인 바랍니다
                                this.setInitSetAllow();
                                return false;
                            }
                        }
                            //2. 세트아닌 제품, 반제품은 모두 저장
                        else {
                            if (prod_type != "1" && prod_type != "2") {
                                this.setErrorMessageControl("PROD_TYPE_BASE", "PROD", ecount.resource.MSG05078);  // 생산품목으로 사용하려면 품목구분이 제품/반제품이거나 세트품목이어야 합니다.\n품목구분 및 세트여부를 확인 바랍니다
                                this.setInitSetAllow();
                                return false;
                            }
                        }
                    }
                }
            }
        }

        //추가수량당수량 유효성 체크
        function checkExchRate() {
            // 추가수량당수량 시작

            // 추가수량당수량 끝
        }

        //세트여부 유효성 체크
        function checkSetFlag() {
            if (this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG").getValue() == "1") {
                if (this.prodTypeGroup.checkSetPossibleGroup.contains(prod_type) == false) {                //세트체크가 가능한 품목구분인지
                    this.setTabMove("PROD_TYPE_BASE", "PROD", ecount.resource.MSG07948)                     //세트여부는 제품일 경우에만 선택됩니다.MSG00332
                    this.setInitSetAllow();
                    return false;
                }
            }
        }

        //다공정일때 생산공정 유효성 체크
        function checkWhCdWhereProdGFlag() {
            if (this.PROD_FLAG.equals("G")) {
                var plantCnt = 0;
                var preStep = "";
                var nowStep = "";
                var firstNotSet = "";

                for (var i = 1; i <= ecount.config.inventory.PLAN_CNT; i++) {
                    if (i == 1) {
                        nowStep = this.prodSave["WH_CD"];
                    } else {
                        preStep = nowStep;
                        nowStep = this.prodSave["WH_CD" + i];
                    }

                    if (i > 2 && preStep == "" && nowStep != "") {
                        this.setErrorMessageControl("WH_CD_BASE", "PROD", ecount.resource.MSG01768, "WH_CD" + (i - 1));  // 생산공정은 단계별로 입력해야 합니다.공정이 입력되지 않은 단계를 확인 바랍니다.
                        this.setInitSetAllow();
                        return false;
                    }

                    if (nowStep != "") {
                        plantCnt++;
                        for (var j = i + 1; j <= ecount.config.inventory.PLAN_CNT; j++) {
                            if (nowStep == this.prodSave["WH_CD" + j]) {
                                this.setErrorMessageControl("WH_CD_BASE", "PROD", ecount.resource.MSG01770, "WH_CD" + j); // 중복된 공정이 있습니다 (The same Process exists on the different steps)                            
                                this.setInitSetAllow();
                                return false;
                            }
                        }
                    } else {
                        if (firstNotSet == "") firstNotSet = "WH_CD" + i.toString();      // 빈 공정 
                    }
                }

                if (this.EditFlag == "M" && plantCnt < this.viewBag.InitDatas.LoadProd.length) {
                    this.setErrorMessageControl("WH_CD_BASE", "PROD", ecount.resource.MSG01777, firstNotSet);  //한 번 설정된 생산공정 수는 줄일 수 없습니다.                
                    this.setInitSetAllow();
                    return false;
                }
            }
        }

        //바코드 유효성 체크
        function checkBarCode() {
            if (this.contents.getControl("BAR_CODE", "PROD")) {
                var barCodeValue = this.contents.getControl("BAR_CODE", "PROD").getValue();
                var barCodeCharAt = "";

                for (var i = 0; i < barCodeValue.length; i++) {
                    barCodeCharAt = barCodeValue.charAt(i);
                    if (encodeURIComponent(barCodeCharAt).length > 4) {
                        this.setTabMove("BAR_CODE", "PROD", ecount.resource.MSG04441);
                        this.setInitSetAllow();
                        return false;
                    }
                }
            }
        }

        //부가세율(매출) 유효성 체크
        function checkTax() {
            // [2016]
            if (this.contents.getControl("TAX", "PROD").getValue()) {
                var var10 = this.contents.getControl("TAX", "PROD").getValue();

                var txtPercent = var10[1];
                if (String(txtPercent).substring(0, 1).equals("-")) {
                    this.setTabMove("TAX", "PROD", ecount.resource.MSG03475);
                    return false;
                }

                this.prodSave.VAT_YN = var10[0];
                this.prodSave.TAX = var10[1];
            }
        }

        //부가세율(매입) 유효성 체크
        function checkVatRateBy() {
            if (this.contents.getControl("VAT_RATE_BY", "PROD").getValue() != "") {
                var var62 = this.contents.getControl("VAT_RATE_BY", "PROD").getValue();
                var txtPercent = var62[1];
                if (String(txtPercent).substring(0, 1).equals("-")) {
                    this.setTabMove("VAT_RATE_BY", "PROD", ecount.resource.MSG03475);
                    this.setInitSetAllow();
                    return false;
                }
                this.prodSave.VAT_RATE_BY_BASE_YN = var62[0];
                this.prodSave.VAT_RATE_BY = var62[1];
            }
        }

        //품질검사방법 유효성 체크
        function checkInSpectStatus() {
            if (this.contents.getControl("INSPECT_STATUS", "PROD").get(0).getValue() != "L" &&
                (this.contents.getControl("INSPECT_STATUS", "PROD").get(1).getValue().equals("") ||
                    this.contents.getControl("INSPECT_STATUS", "PROD").get(1).getValue() < 0)
            ) {
                this.setTabMove("INSPECT_STATUS", "PROD", ecount.resource.MSG03463);
                this.setInitSetAllow();
                return false;
            }
        }

        //CS최소주문수량 유효성 체크
        function checkCsLimitFlag() {
            if (this.prodSave.CSORD_C0001 == "Y") {    // 사용이면        
                var csOrdText = this.contents.getControl("CSLimitFlag", "QTY").get("CSORD_TEXT");

                if (csOrdText && Number(csOrdText) < 0) {
                    this.setTabMove("CSLimitFlag", "QTY", String.format(ecount.resource.MSG05353, "0"));
                    this.setInitSetAllow();
                    return false;
                }
            }
        }

        //생산공정 세팅
        function setWhCd() {
            if (this.PROD_FLAG.equals("G")) {
                this.prodSave.G_PROD_CD = this.contents.getControl("PROD_CD", "PROD").getValue();

                // 생산공정
                this.prodSave.WH_CD = ""
                this.WhDesList = "";
                var tmpWh = this.contents.getControl("WH_CD_BASE", "PROD").get("WH_CD").getSelectedItem();
                this.prodSave.WH_CD += (tmpWh.length > 0 ? tmpWh[0].value : "") + ";";
                this.WhDesList += (tmpWh.length > 0 ? tmpWh[0].label : "") + ";";

                for (var i = 2; i <= ecount.config.inventory.PLAN_CNT; i++) {
                    tmpWh = this.contents.getControl("WH_CD_BASE", "PROD").get("WH_CD" + i.toString()).getSelectedItem();
                    this.prodSave.WH_CD += (tmpWh.length > 0 ? tmpWh[0].value : "") + ";";
                    this.WhDesList += (tmpWh.length > 0 ? tmpWh[0].label : "") + ";";
                }
            }
        }

        //변경해줘야 할 코드들?
        function setProdCdWhereProdCdLisNotEmpty() {
            if (this.prodSave.PROD_CDL) {
                this.prodSave.PROD_CD = this.prodSave.PROD_CDL;
            }
        }

        //다공정품목 일 경우, 품목구분이 반제품일 경우 L로 예외처리
        function setProdTypeWhereProdGFlag() {
            // 코드를 변경해야 하는 경우 정리
            if (this.PROD_FLAG.equals("G")) {
                if (this.prodSave.PROD_TYPE == "2") {
                    this.prodSave.PROD_TYPE = "L";  // 프로시저 내부에서 처리 되는 로직이 있어서 변경 후 보내기 
                }
            }
        }

        //선택한 규격종류 별로 세팅
        function setSizeDesBase() {
            // 규격사용이면
            if (this.contents.getControl("SIZE_DES_BASE", "PROD").get(0).getValue() == "0") {           //규격그룹
                this.prodSave.SIZE_DES = "";
                this.prodSave.SIZE_CALC_CD = "";
            } else if (this.contents.getControl("SIZE_DES_BASE", "PROD").get(0).getValue() == "1") {    //규격계산
                this.prodSave.SIZE_CD = "";
                this.prodSave.SIZE_CALC_CD = "";
            } else if (this.contents.getControl("SIZE_DES_BASE", "PROD").get(0).getValue() == "2") {    //규격계산그룹
                this.prodSave.SIZE_DES = "";
                this.prodSave.SIZE_CD = "";
            } else {
                this.prodSave.SIZE_CD = "";
                this.prodSave.SIZE_CALC_CD = "";
            }
        }

        //OEM등록 시, 선택한 OEMProdType에 따른 값 세팅
        function setOemProdType() {
            //oem 등록시
            if (this.isOemProd) {
                this.prodSave.OEM_PROD_TYPE = this.contents.getControl("OEM_PROD_TYPE", "PROD").get(0).getValue();
                this.prodSave.OEM_PROD_CD = this.contents.getControl("OEM_PROD_TYPE", "PROD").get(1).getValue();
                var prodValue = this.getProdCdDes();
                if (!$.isEmpty(this.oemBomData)) {
                    this.oemBomData.BomTop.BOM_CD = prodValue.value;
                    this.oemBomData.BomTop.PROD_DES = prodValue.label || "";
                }
                this.prodSave.PROD_CD = prodValue.value;
                this.prodSave.PROD_DES = prodValue.label || "";
            }
        }

        //품목-사용자단가 
        function setUserPrice(obj) {
            this.userPrice = {
                OUT_PRICE1_VAT_YN: obj.OUT_PRICE1_VAT_YN,
                OUT_PRICE2_VAT_YN: obj.OUT_PRICE2_VAT_YN,
                OUT_PRICE3_VAT_YN: obj.OUT_PRICE3_VAT_YN,
                OUT_PRICE4_VAT_YN: obj.OUT_PRICE4_VAT_YN,
                OUT_PRICE5_VAT_YN: obj.OUT_PRICE5_VAT_YN,
                OUT_PRICE6_VAT_YN: obj.OUT_PRICE6_VAT_YN,
                OUT_PRICE7_VAT_YN: obj.OUT_PRICE7_VAT_YN,
                OUT_PRICE8_VAT_YN: obj.OUT_PRICE8_VAT_YN,
                OUT_PRICE9_VAT_YN: obj.OUT_PRICE9_VAT_YN,
                OUT_PRICE10_VAT_YN: obj.OUT_PRICE10_VAT_YN
            }
        }

        //안전재고수량 설정
        function setSafeQty() {
            // 수량탭의 안전재고수량
            if (ecount.config.inventory.WHSAFE_TYPE == "1" && this.EditFlag == "M") {     // 안전재고-수량체크기준-설정(0:전체, 1:창고)                                                 
                this.prodSave.SAFE_QTY = this.prodView.SAFE_QTY;
            }
        }

        // 안전재고관리, CS 최소주문 수량 - 수량 정보 
        function setSetup(obj) {
            this.setup = {
                setup: [
                    { PROD_CD: obj.PROD_CD, TYPE: "A0001", VALUE: obj.SAFE_A0001, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },
                    { PROD_CD: obj.PROD_CD, TYPE: "A0002", VALUE: obj.SAFE_A0002, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },
                    { PROD_CD: obj.PROD_CD, TYPE: "A0003", VALUE: obj.SAFE_A0003, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },
                    { PROD_CD: obj.PROD_CD, TYPE: "A0004", VALUE: obj.SAFE_A0004, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },
                    { PROD_CD: obj.PROD_CD, TYPE: "A0005", VALUE: obj.SAFE_A0005, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },
                    { PROD_CD: obj.PROD_CD, TYPE: "A0006", VALUE: obj.SAFE_A0006, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },
                    { PROD_CD: obj.PROD_CD, TYPE: "C0001", VALUE: obj.CSORD_C0001, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },  //CS 최소주문 수량 구분(기본사용, 사용, 사용안함)
                    { PROD_CD: obj.PROD_CD, TYPE: "C0002", VALUE: obj.CSORD_TEXT, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },   //CS 최소주문 수량 구분이 사용인 경우의 수량 
                    { PROD_CD: obj.PROD_CD, TYPE: "C0003", VALUE: obj.CSLimitUnit, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime },   //CS 최소주문단위 사용여부
                    { PROD_CD: obj.PROD_CD, TYPE: "A0007", VALUE: obj.SAFE_A0007, WRITER_ID: ecount.user.WID, WRITE_DT: this.viewBag.LocalTime, EDITOR_ID: ecount.user.WID, EDIT_DT: this.viewBag.LocalTime }
                ]
            }
        }

        // 체크 되지 않은 체크 박스 설정
        function setCheckBoxValue() {
            if (this.prodSave.BOM_FLAG && this.prodSave.BOM_FLAG.length > 0) {
                this.BOM_FLAG = this.prodSave.BOM_FLAG[0];
            }

            if (this.prodSave.OUT_PRICE1_VAT_YN.length > 0) this.prodSave.OUT_PRICE1_VAT_YN = this.prodSave.OUT_PRICE1_VAT_YN[0];
            else this.prodSave.OUT_PRICE1_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE2_VAT_YN.length > 0) this.prodSave.OUT_PRICE2_VAT_YN = this.prodSave.OUT_PRICE2_VAT_YN[0];
            else this.prodSave.OUT_PRICE2_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE3_VAT_YN.length > 0) this.prodSave.OUT_PRICE3_VAT_YN = this.prodSave.OUT_PRICE3_VAT_YN[0];
            else this.prodSave.OUT_PRICE3_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE4_VAT_YN.length > 0) this.prodSave.OUT_PRICE4_VAT_YN = this.prodSave.OUT_PRICE4_VAT_YN[0];
            else this.prodSave.OUT_PRICE4_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE5_VAT_YN.length > 0) this.prodSave.OUT_PRICE5_VAT_YN = this.prodSave.OUT_PRICE5_VAT_YN[0];
            else this.prodSave.OUT_PRICE5_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE6_VAT_YN.length > 0) this.prodSave.OUT_PRICE6_VAT_YN = this.prodSave.OUT_PRICE6_VAT_YN[0];
            else this.prodSave.OUT_PRICE6_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE7_VAT_YN.length > 0) this.prodSave.OUT_PRICE7_VAT_YN = this.prodSave.OUT_PRICE7_VAT_YN[0];
            else this.prodSave.OUT_PRICE7_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE8_VAT_YN.length > 0) this.prodSave.OUT_PRICE8_VAT_YN = this.prodSave.OUT_PRICE8_VAT_YN[0];
            else this.prodSave.OUT_PRICE8_VAT_YN = "N";
            if (this.prodSave.OUT_PRICE9_VAT_YN.length > 0) this.prodSave.OUT_PRICE9_VAT_YN = this.prodSave.OUT_PRICE9_VAT_YN[0];
            else this.prodSave.OUT_PRICE9_VAT_YN = "N";

            if (this.prodSave.OUT_PRICE10_VAT_YN.length > 0) this.prodSave.OUT_PRICE10_VAT_YN = this.prodSave.OUT_PRICE10_VAT_YN[0];
            else this.prodSave.OUT_PRICE10_VAT_YN = "N";
            if (this.prodSave.IN_PRICE_VAT.length > 0) this.prodSave.IN_PRICE_VAT = this.prodSave.IN_PRICE_VAT[0];
            else this.prodSave.IN_PRICE_VAT = "0";
            if (this.prodSave.OUT_PRICE_VAT.length > 0) this.prodSave.OUT_PRICE_VAT = this.prodSave.OUT_PRICE_VAT[0];
            else this.prodSave.OUT_PRICE_VAT = "0";
            if (this.prodSave.OUTSIDE_PRICE_VAT.length > 0) this.prodSave.OUTSIDE_PRICE_VAT = this.prodSave.OUTSIDE_PRICE_VAT[0];
            else this.prodSave.OUTSIDE_PRICE_VAT = "0";
            if (this.prodSave.CS_FLAG.length > 0) this.prodSave.CS_FLAG = this.prodSave.CS_FLAG[0];   // CS 공유여부        
            else this.prodSave.CS_FLAG = "0";

            if (this.prodSave.INSPECT_TYPE_CD == "") this.prodSave.INSPECT_TYPE_CD = 0;
        }
    },

    // Save Api Call.
    // 저장 API 호출
    execSave: function () {
        var self = this;

        if (self.prodView.DEL_GUBUN && self.prodView.DEL_GUBUN == 'Y' && self.CopyFlag != 'Y') {
            self.prodSave.DEL_GUBUN = 'Y';
        }

        var formData = Object.toJSON({
            Request: {
                Data: {
                    request: self.RequestData,
                    sale003: self.prodSave,
                    UserPrice: self.userPrice,
                    setup: self.setup.setup,
                    price: self.prodSave,
                    imageList: self.prodSave.PROD_IMAGE, //this.imageList,
                    WhDesList: self.WhDesList,
                    EDIT_FLAG: self.EditFlag,
                    OLD_PROD_CD: self.OldProdCd,
                    BOM_FLAG: self.BOM_FLAG,
                    PROD_FLAG: !$.isEmpty(self.multiSizeProdList) ? "M" : self.PROD_FLAG,
                    PROD_LEVEL_GROUP: self.prodSave.PROD_LEVEL_GROUP,
                    OemBomTop: $.isEmpty(self.oemBomData) ? "" : self.oemBomData.BomTop,
                    OemBomBottom: $.isEmpty(self.oemBomData) ? "" : self.oemBomData.BomBottom,
                    OemBomProc: $.isEmpty(self.oemBomData) ? "" : self.oemBomData.Proc || "SAVE",
                    IsOemProd: self.isOemProd,
                    MultiSizeProdList: self.multiSizeProdList
                },
                EditMode: (self.EditFlag == "I") ? "01" : "02"
            }
        });

        ecount.common.api({
            url: "/SVC/Inventory/Basic/SaveProd",
            data: formData,
            success: function (result) {
                if (result.Status == "200") {
                    self.reloadItemList(!self.continueFlag);

                    if (self.continueFlag == true) {
                        if (self.isNewFlag) {
                            var param = {
                                editFlag: "I",
                                copyFlag: "N",
                                PROD_CD: "",
                                SAVE_PROD_CD: self.prodSave.PROD_CD,
                                PROD_FLAG: self.PROD_FLAG,
                                isMultiProcess: self.isMultiProcess,
                                oldProdCd: "",
                                isCloseFlag: true,
                                hidSearchXml: self.hidSearchXml,
                                hidData: self.hidData,
                                hidTab2: "",
                                isFromApp: self.isFromApp ? true : false,
                                isOemProd: self.isOemProd
                            };

                            if (self.isFromApp) {
                                self.onAllSubmitSelf("/ECErp/ESA/ESA010M?ErpApp=ADD", param);
                            }
                            else {
                                self.onAllSubmitSelf("/ECErp/ESA/ESA010M", param);
                            }

                        } else {
                            var param = {
                                editFlag: "M",
                                copyFlag: "N",
                                PROD_CD: self.prodSave.PROD_CD,
                                PROD_FLAG: !$.isEmpty(self.multiSizeProdList) ? "M" : self.PROD_FLAG,
                                isMultiProcess: self.isMultiProcess,
                                oldProdCd: "",
                                isCloseFlag: true,
                                hidSearchXml: self.hidSearchXml,        // 구프레임웍에서 연결할수 있으므로 유지
                                hidData: self.hidData,                  // 구프레임웍에서 연결할수 있으므로 유지
                                hidTab2: "",
                                isFromApp: self.isFromApp ? true : false
                            };

                            if (self.isFromApp) {
                                self.onAllSubmitSelf("/ECErp/ESA/ESA010M?ErpApp=ADD", param);
                            }
                            else {
                                self.onAllSubmitSelf("/ECErp/ESA/ESA010M", param);
                            }
                        }
                    }
                    else {
                        if (self.isFromApp) {
                            self.onAllSubmitSelf("/mobile/close", {});
                        }
                    }
                }
            }
        });
    },

    // 컨트롤 변경에 따른 처리 
    setControlChange: function (cid, changeVal, oldVal) {
        var basicCtrl = null;
        var value = null;

        switch (cid.toString()) {
            // 품목구분 PROD_TYPE
            case "PROD_TYPE":
                if (this.EditFlag == "M" && this.prodView.PROD_TYPE != "3") {
                    //※ 주의\r\n- 등록된 BOM이 있다면, 원가계산 등에 영향을 미칠 수 있습니다.\r\n- 주품목일 경우 종품목의 품목구분도 같이 변경됩니다.

                    var mainProdCd = this.prodView.MAIN_PROD_CD;        // 조회된 내용의 주품목 코드 bsy
					if (cid.toString() == "PROD_TYPE" && !$.isEmpty(mainProdCd) && changeVal != this.checkProdTypeByMainProdCD) {
						if (mainProdCd != this.prodView.PROD_CD) {
							this.contents.getControl("PROD_TYPE_BASE", "BASIC") && this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").setValue(0, this.checkProdTypeByMainProdCD);
							this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").setValue(0, this.checkProdTypeByMainProdCD);
						}

                        if (this.prodView && !(["1", "3"].contains(this.checkProdTypeByMainProdCD))) {
                            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG").hide(true);
                            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("SET_FLAG").hide(true);
                            }
                        } else {
                            this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG").show(true);
                            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("SET_FLAG").show(true);
                            }
                        }
                    }
                    ecount.alert(ecount.resource.MSG04149);// bsy 리소스 변경
                }

                var prodType = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").getValue();

                //원가-재료비 활성화여부
                if (["1", "2"].contains(prodType)) {  // 제품, 반제품 일때 
                    this.setMeterialCostControlByProdType(false);
                }
                else {
                    this.setMeterialCostControlByProdType(true);
                }

                //원가-재료비외 활성화여부
                if (["0", "4"].contains(prodType) || (prodType == "3" && this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").getValue() == false)) {   // 원재료, 부재료, (상품 & SET가 아닐때)
                    this.setCostControlByProdType(false);
                }
                else {
                    this.setCostControlByProdType(true);
                }

                // 수량관리사용여부 사용못하게 
                if (["7"].contains(prodType)) {
                    this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "PROD").setValue(1, "0", true);
                    this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "PROD").setReadOnly(true);
                    if (this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "BASIC")) {
                        this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "BASIC").setReadOnly(true);
                    }
                } else {
                    this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "PROD").setReadOnly(false);

                    if (this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "BASIC")) {
                        this.contents.getControl("PROD_TYPE_BASEBAL_FLAG", "BASIC").setReadOnly(false);
                    }
                }

                //oem등록인경우
                if (this.isOemProd) {
                    if (changeVal != undefined && !["1", "2"].contains(prodType) && !$.isEmpty(this.oemBomData)) {
                        ecount.confirm(ecount.resource.MSG07576, function (isok) {
                            if (isok) {
                                this.oemBomData = null;
                                this.contents.getControl("OEM_BOM").changeCss("visible-border", true);
                            } else {
                                this.contents.getControl("PROD_TYPE_BASE", "BASIC") && this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").setValue(0, oldVal);
                                this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").setValue(0, oldVal);
                            }
                        }.bind(this));
                    }
                }
                break;
                // 세트여부
            case "SET_FLAG":
                var prodType = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE").getValue();
                //원가-재료비외 활성화여부
                if (["0", "4"].contains(prodType) || (prodType == "3" && this.contents.getControl("PROD_TYPE_BASE", "PROD").get("SET_FLAG").getValue() == "0")) {   // 원재료, 부재료, (상품 & SET가 아닐때)
                    this.setCostControlByProdType(false);
                }
                else {
                    this.setCostControlByProdType(true);
                }
                break;
                // 규격명
            case "SIZE_FLAG":
                this.contents.getControl("SIZE_DES_BASE").get(0).show();
                basicCtrl = this.contents.getControl("SIZE_DES_BASE", "BASIC");
                value = this.contents.getControl("SIZE_DES_BASE", "PROD").get(0).getValue();

                if (value === "3" || value === "1") {  // 직접입력(2, DB 저장값:0 ), 규격계산(1, DB 저장값:1 )
                    if (basicCtrl) {
                        this.contents.getControl("SIZE_DES_BASE", "BASIC").get(1).show();
                        this.contents.getControl("SIZE_DES_BASE", "BASIC").get(2).hide();
                        this.contents.getControl("SIZE_DES_BASE", "BASIC").get(3).hide();
                    }

                    this.contents.getControl("SIZE_DES_BASE", "PROD").get(1).show();
                    this.contents.getControl("SIZE_DES_BASE", "PROD").get(2).hide();
                    this.contents.getControl("SIZE_DES_BASE", "PROD").get(3).hide();
                    this.contents.getControl("SIZE_DES_BASE").get("SIZE_DES").setFocus(0);
                }
                else if (value === "0" || value === "2") {
                    if (basicCtrl) {
                        this.contents.getControl("SIZE_DES_BASE", "BASIC").get(1).hide();
                        this.contents.getControl("SIZE_DES_BASE", "BASIC").get(value === "2" ? 3 : 2).show();
                        this.contents.getControl("SIZE_DES_BASE", "BASIC").get(value === "2" ? 2 : 3).hide();
                    }

                    this.contents.getControl("SIZE_DES_BASE", "PROD").get(1).hide();
                    this.contents.getControl("SIZE_DES_BASE", "PROD").get(value === "2" ? 3 : 2).show();
                    this.contents.getControl("SIZE_DES_BASE", "PROD").get(value === "2" ? 2 : 3).hide();
                    this.contents.getControl("SIZE_DES_BASE").get(value === "2" ? "SIZE_CALC_CD" : "SIZE_CD").setFocus(0);
                }
                break;
                // 부가세율 매출 
            case "TAX_radio":
                value = this.contents.getControl("TAX", "PROD").get(0).getValue()[0];
                if (value === "Y") {
                    this.contents.getControl("TAX").get(1).setFocus(0);
                }
                break;
                // 부가세율 매입
                //case "VAT_RATE_BY_BASE_YN":
            case "VAT_RATE_BY_radio":
                value = this.contents.getControl("VAT_RATE_BY", "PROD").get(0).getValue()[0];
                if (value === "Y") {
                    this.contents.getControl("VAT_RATE_BY").get(1).setFocus(0);
                }
                break;
                // 수량>CS최소주문수량
            case "CSORD_C0001":
                // 무조건 CS 최소주문단위는 사용안함으로 변경 
                this.contents.getControl('CSLimitUnit').setValue(0, "N", true);
                break;
            case "OEM_PROD_TYPE_radio":
                //2) 모델품 또는 양산품을 선택하면 품목구분은 제품만 나온다.
                //모델부품 또는 공통부품으로 선택하면 품목구분은 반제품, 원재료,부재료만 나온다. 
                this.setOemProdTypeOnChange(cid, changeVal, oldVal);
                break;
        }// switch end   
    },

    setOemProdTypeOnChange: function (cid, changeVal, oldVal) {
        //2) 모델품 또는 양산품을 선택하면 품목구분은 제품만 나온다.
        //모델부품 또는 공통부품으로 선택하면 품목구분은 반제품, 원재료,부재료만 나온다. 
        var prodTypeControl = this.contents.getControl("PROD_TYPE_BASE", "PROD").get("PROD_TYPE");
        var selectedValue = "1";

        if (changeVal == "1" || changeVal == "2") {
            prodTypeControl.hideCompByValue(["0", "4", "2", "3"]);
            prodTypeControl.showCompByValue(["1"]);

            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").hideCompByValue(["0", "4", "2", "3"]);
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").showCompByValue(["1"]);
            }
        } else {
            prodTypeControl.hideCompByValue(["1", "3"]);
            prodTypeControl.showCompByValue(["0", "4", "2"]);
            selectedValue = "2";

            if (this.contents.getControl("PROD_TYPE_BASE", "BASIC")) {
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").hideCompByValue(["1", "3"]);
                this.contents.getControl("PROD_TYPE_BASE", "BASIC").get("PROD_TYPE").showCompByValue(["0", "4", "2"]);
            }
        }
        prodTypeControl.setValue(0, selectedValue, true);

        var changeNum = changeVal == "1" ? 1 : 2,
            prodMaxLen = ecount.config.inventory.OEM_MODEL_LEN,
            desMaxLen = 100;

        if (changeVal == "4") {
            prodMaxLen = 20;
        }

        var prodControl = this.contents.getControl("PROD_CD", "BASIC") && this.contents.getControl("PROD_CD", "BASIC"),
            prodControl2 = this.contents.getControl("PROD_CD", "PROD"),
            proddesControl = this.contents.getControl("PROD_DES", "BASIC") && this.contents.getControl("PROD_DES", "BASIC"),
            proddesControl2 = this.contents.getControl("PROD_DES", "PROD"),
            prodMessage = String.format(ecount.resource.MSG00297, Math.floor(prodMaxLen / 2), prodMaxLen),
            proddesMessage = String.format(ecount.resource.MSG00297, Math.floor(desMaxLen / 2), desMaxLen);

        prodControl && prodControl.changeType(changeNum);
        prodControl2.changeType(changeNum);
        prodControl && prodControl.get(0).setMaxByte(prodMaxLen, prodMessage);
        prodControl2.get(0).setMaxByte(prodMaxLen, prodMessage);

        proddesControl && proddesControl.changeType(changeNum);
        proddesControl2.changeType(changeNum);
        proddesControl && proddesControl.get(0).setMaxByte(desMaxLen, proddesMessage);
        proddesControl2.get(0).setMaxByte(desMaxLen, proddesMessage);
    },

    // 품목 복사 
    // bomFlag: bom포함여부 
    prodCopyProcess: function (bomFlag) {
        var self = this;
        var copyProdCd = self.isOemProd ? this.contents.getControl("OEM_PROD_TYPE", "PROD").get(1).getValue() : self.PROD_CD
        var param = {
            editFlag: "I",
            copyFlag: "Y",
            PROD_CD: copyProdCd,
            PROD_FLAG: self.PROD_FLAG == "M" ? "S" : self.PROD_FLAG,
            isMultiProcess: self.isMultiProcess,
            oldProdCd: copyProdCd,
            BOM_FLAG: bomFlag,
            isCloseFlag: true,
            isFromApp: self.isFromApp ? true : false,
            isOemProd: self.isOemProd
        };

        if (this.isFromApp) {
            this.onAllSubmitSelf("/ECErp/ESA/ESA010M?ErpApp=ADD", param);
        }
        else {
            this.onAllSubmitSelf("/ECErp/ESA/ESA010M", param);
        }
    },

    // 신규 
    prodNewProcess: function () {
        var param = {
            editFlag: "I",
            copyFlag: "N",
            PROD_CD: "",
            PROD_FLAG: this.PROD_FLAG,
            isMultiProcess: this.isMultiProcess,
            oldProdCd: "",
            isCloseFlag: true,
            hidSearchXml: this.hidSearchXml,
            hidData: this.hidData,
            hidTab2: "",
            isFromApp: this.isFromApp ? true : false,
            isOemProd: this.isOemProd
        };

        if (this.isFromApp) {
            this.onAllSubmitSelf("/ECErp/ESA/ESA010M?ErpApp=ADD", param);
        }
        else {
            this.onAllSubmitSelf("/ECErp/ESA/ESA010M", param);
        }
    },

    //api에서 체크된 거래처정보 팝업으로 연결
    getSelectDeleteResult: function (result) {
        var codeList = null;
        excuteFlag = result.Data.ExcuteFlag.split(ecount.delimiter);
        codeList = result.Data.CodeList.split(ecount.delimiter);
        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        for (var i = 0, Limit = excuteFlag.length; i < Limit; i++) {
            if (excuteFlag[i] == "False") {
                this.errDataAllKey.push(codeList[i]);
            }
        }

        var param = {
            width: 500,
            height: 600,
            PageGubun: "CUST",
            CodeList: result.Data.CodeList,
            NameList: result.Data.NameList,
            ExcuteFlag: result.Data.ExcuteFlag,
            ApplyResult_01: result.Data.ApplyResult_01,
            ApplyResult_01_Count: result.Data.ApplyResult_01_Count,
            ApplyResult_02: result.Data.ApplyResult_02,
            ApplyResult_02_Count: result.Data.ApplyResult_02_Count,
            ApplyResult_03: result.Data.ApplyResult_03,
            ApplyResult_03_Count: result.Data.ApplyResult_03_Count,
            ApplyResult_04: result.Data.ApplyResult_04,
            ApplyResult_04_Count: result.Data.ApplyResult_04_Count,
            ApplyResult_05: result.Data.ApplyResult_05,
            ApplyResult_05_Count: result.Data.ApplyResult_05_Count,
            ApplyResult_06: result.Data.ApplyResult_06,
            ApplyResult_06_Count: result.Data.ApplyResult_06_Count,
            ApplyResult_07: result.Data.ApplyResult_07,
            ApplyResult_07_Count: result.Data.ApplyResult_07_Count,
            ApplyResult_08: result.Data.ApplyResult_08,
            ApplyResult_08_Count: result.Data.ApplyResult_08_Count,
            ApplyResult_09: result.Data.ApplyResult_09,
            ApplyResult_09_Count: result.Data.ApplyResult_09_Count,
            ApplyResult_10: result.Data.ApplyResult_10,
            ApplyResult_10_Count: result.Data.ApplyResult_10_Count,
            ApplyResult_10_Bom: result.Data.ApplyResult_10_Bom,
            ApplyResult_11: result.Data.ApplyResult_11,
            ApplyResult_11_Count: result.Data.ApplyResult_11_Count
        };

        this.openWindow({
            url: "/ECERP/ESA/ESA009P_16",
            name: ecount.resource.BTN85009,
            param: param
        });
    },

    // 버튼 클릭 가능하게 처리
    setInitSetAllow: function () {
        this.hideProgressbar(true);
        this.footer.getControl("save") && this.footer.getControl("save").setAllowClick();

        if (this.EditFlag == "M") {
            this.footer.getControl("deleteRestore") && this.footer.getControl("deleteRestore").setAllowClick();
        }
    },

    // 품목등록 리스트 reload
    reloadItemList: function (isClose) {
        var self = this;

        if ($.isNull(self.prodSave)) {
            this.sendMessage(this, {});
        } else {
            this.sendMessage(this, {
                PROD_CD: self.prodSave.PROD_CD,
                PROD_DES: self.prodSave.PROD_DES,
                CONTINUE: self.continueFlag
            });
        }

        if (isClose == true) {
            this.setTimeout(function () {
                self.close();
            }, 0);
        }
    },

    // 표준원가 컨트롤 
    setCostControlByProdType: function (isVisible) {
        this.contents.getControl("EXPENSE_COST", "COST").setReadOnly(!isVisible);
        this.contents.getControl("LABOR_COST", "COST").setReadOnly(!isVisible);
        this.contents.getControl("OUT_COST", "COST").setReadOnly(!isVisible);

        if (this.contents.getControl("EXPENSE_COST", "BASIC")) {
            this.contents.getControl("EXPENSE_COST", "BASIC").setReadOnly(!isVisible);
        }

        if (this.contents.getControl("LABOR_COST", "BASIC")) {
            this.contents.getControl("LABOR_COST", "BASIC").setReadOnly(!isVisible);
        }

        if (this.contents.getControl("OUT_COST", "BASIC")) {
            this.contents.getControl("OUT_COST", "BASIC").setReadOnly(!isVisible);
        }

        if (!isVisible) {
            this.contents.getControl("EXPENSE_COST", "COST").setValue(0, 0, true);
            this.contents.getControl("LABOR_COST", "COST").setValue(0, 0, true);
            this.contents.getControl("OUT_COST", "COST").setValue(0, 0, true);
        }
    },

    // 표준원가- 재료비 컨트롤 활성화 여부 
    setMeterialCostControlByProdType: function (isVisible) {
        this.contents.getControl("MATERIAL_COST", "COST").setReadOnly(!isVisible);

        if (this.contents.getControl("MATERIAL_COST", "BASIC")) {
            this.contents.getControl("MATERIAL_COST", "BASIC").setReadOnly(!isVisible);
        }

        if (!isVisible) {
            this.contents.getControl("MATERIAL_COST", "COST").setValue(0, 0, true);
        }
    },

    // 파일관리에서 파일 저장 후 색이 변해야 함
    setFileLinkCss: function () {
        this.contents.getControl("PROD_FILE", "PROD").changeCss("text-warning-inverse", true);
    },

    fnRequestFileData: function (param) {
        var imgInfoArry = new Array();
        $(param.param).each(function (i, data) {
            imgInfoArry.push({ selIndex: "1", fileName: data.fileName, fileUrl: data.FILE_FULLPATH, FS_OWNER_KEY: data.FS_OWNER_KEY, NO_FILE: data.NO_FILE, ATTACH_INFO: data.ATTACH_INFO });
        });
        this.onMessageHandler({ pageID: "image" }, imgInfoArry);
        param.callback();
    },

    getOemProdCd: function (code) {
        var newCreatcd = code == "value" ? this.newProdCd : ((this.prodView) ? this.prodView.PROD_DES : this.KEYWORD != "" ? this.KEYWORD : "");
        if (this.isOemProd) {
            if (!$.isEmpty(this.oemModelProdCd)) {
                newCreatcd = [ecount.config.inventory.OEM_GEN_RULE == 2 ? this.oemModelProdCd[0][code] : "", ecount.config.inventory.OEM_IDENT_MASK || "", ecount.config.inventory.OEM_GEN_RULE == 2 ? "" : this.oemModelProdCd[0][code]];
            } else {
                newCreatcd = ["", ecount.config.inventory.OEM_IDENT_MASK || "", ""]
            }
        }
        return newCreatcd;
    },

    getProdGroupString: function (key) {
        var returnString = ecount.resource.LBL02025;

        switch (key) {
            case "0":
                returnString = ecount.resource.LBL02025;
                break;
            case "1":
                returnString = ecount.resource.LBL02538;
                break;
            case "2":
                returnString = ecount.resource.LBL01250;
                break;
            case "3":
                returnString = ecount.resource.LBL01523;
                break;
            case "4":
                returnString = ecount.resource.LBL01387;
                break;
        }

        return returnString;
    },

    getProdCdDes: function () {
        var prodcdControlValue = this.contents.getControl('PROD_CD', "PROD").getValue();
        var proddesContorlValue = this.contents.getControl('PROD_DES', "PROD").getValue();

        if (this.isOemProd && this.contents.getControl("OEM_PROD_TYPE", "PROD").get(0).getValue() == "1") {
            prodcdControlValue = this.contents.getControl('PROD_CD', "PROD").getValue().join("");
            proddesContorlValue = this.contents.getControl('PROD_DES', "PROD").getValue().join("");
        }

        return {
            value: prodcdControlValue,
            label: proddesContorlValue
        };
    },

    //삭제불가 메세지 팝업창
    ShowNoticeNonDeletable: function (data) {

        this.errDataAllKey = null;
        this.errDataAllKey = new Array();

        //그리드 리로드후 삭제되지 않은 코드들 체크하기 위해 담아둠 (=> onGridRenderComplete에서 체크로직 진행)
        for (var i = 0; i < data.length; i++) {
            this.errDataAllKey.push(data[i].CHECK_CODE);
        }

        var param = {
            width: 520,
            height: 500,
            datas: Object.toJSON(data),
            parentPageID: this.pageID,
            responseID: this.callbackID,
            MENU_CODE: "Item"
        }

        this.openWindow({
            url: "/ECERP/Popup.Common/NoticeNonDeletable",
            name: ecount.resource.LBL11065,
            popupType: false,
            additional: false,
            param: param
        });
    },

    /*override */
    setTabMove: function (cid, tabId, msg, subCid, isSetFocus) {
        var ctrl = this.contents.getControl(cid, "BASIC");
        var currentTab = this.contents.currentTabId;
        var currentCtrl = this.contents.getControl(cid, currentTab);
        if (tabId != currentTab) {
            if (currentCtrl) {
                ctrl = currentCtrl;
            } else if (ctrl && currentTab != "BASIC") {
                this.contents.changeTab("BASIC", false);
            } else {
                this.contents.changeTab(tabId, false);
                ctrl = this.contents.getControl(cid, tabId);
            }
        } else {
            ctrl = this.contents.getControl(cid, currentTab);
        }

        ctrl.setFocus(0);
        ctrl.showError(msg);
    }
});

// 구프레임웍 이미지 선택 후 연동 
function fnRequestFileData(FileDatas) {
    var imgInfoArry = new Array();

    $(FileDatas).each(function (i, data) {
        imgInfoArry.push({ selIndex: "1", fileName: data.NM_FILE, fileUrl: data.FILE_FULLPATH, FS_OWNER_KEY: data.FS_OWNER_KEY, NO_FILE: data.NO_FILE, ATTACH_INFO: data.ATTACH_INFO });
    });

    window[window.ecPageID].onMessageHandler({ pageID: "image" }, imgInfoArry);
};