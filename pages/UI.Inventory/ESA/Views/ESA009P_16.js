window.__define_resource && __define_resource("BTN00008","LBL09677","LBL05100","LBL01289","LBL00386","LBL16385","LBL35000","LBL35005","LBL08272","LBL02728","LBL08274","LBL93359","LBL30120","LBL01398","LBL00178","LBL06039","MSG05280","MSG05282","LBL02874","LBL02878","LBL06768","LBL00387","LBL02936","LBL00642","LBL01412","LBL02984","LBL10774","LBL03004","LBL06434","LBL06436");
/****************************************************************************************************
1. Create Date : 2015.11.07
2. Creator     : 이일용
3. Description : 재고1 > 기초등록 > 품목등록 리스트 > 선택삭제 결과화면
4. Precaution  :
5. History     : 2019.01.04 (Ngo Thanh Lam) - Modified Link Url for Internal Use List menu
    
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA009P_16", {

    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    //currentTabId: null,
    //formSearchControlType: 'SN030', // 검색컨트롤폼타입
    //formTypeCode: 'SR030',
    //canCheckCount: 100,     // 체크 가능 수 기본 100    
    //isShowSearchForm:'1',


    /**************************************************************************************************** 
    * user opion Variables
    ****************************************************************************************************/
    //userPermit: this.viewBag.Permission.Permit.Value,

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.base_date_from = {
            year: "",
            month: "",
            day: ""
        };
        this.base_date_to = {
            year: "",
            month: "",
            day: ""
        };
        this.onInitDate();
        this.searchFormParameter = {
            QUICK_SEARCH: ''                   //퀵서치
        };
    },

    initProperties: function () {
        this.MeargeSetCount = [],
        this.SplitSetCount = [],
        this.MeargeArrayData = [];
       

    },

    render: function () {
        this._super.render.apply(this);
    },
    onInitDate: function () {
        // 날짜 위젯에서 처리되면 다 지워야함 
        this.base_date_from.year = this.baseDateFrom.substring(0, 4);
        this.base_date_from.month = this.baseDateFrom.substring(4, 6);
        this.base_date_from.day = this.baseDateFrom.substring(6, 8);
        this.base_date_to.year = this.baseDateTo.substring(0, 4);
        this.base_date_to.month = this.baseDateTo.substring(4, 6);
        this.base_date_to.day = this.baseDateTo.substring(6, 8);        
    },
    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        var self = this;

        var g = widget.generator,
            contents = g.contents(),
            tabContents = g.tabContents(),
            toolbar = g.toolbar(),
            ctrl = g.control(),
            grid = g.grid();

        toolbar
            .addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008))
        ;

        contents
            .add(toolbar)
            ;

        header
            .notUsedBookmark()
            .setTitle(String.format(ecount.resource.LBL09677, ecount.resource.LBL05100))
            .addContents(contents)
        ;
    },
    // Contents Initialization
    onInitContents: function (contents, resource) {
        var g = widget.generator,
            tabContents = g.tabContents(),
            grid = g.grid(),
            ctrl = g.control(),
            ctrl2 = g.control();

        //contents.addGrid("dataGrid", grid);
        var _self = this;
        var CodeData = [];
        var CodeList = this.CodeList.split(ecount.delimiter);
        var NameList = this.NameList.split(ecount.delimiter);
        var ExcuteFlag = this.ExcuteFlag.split(ecount.delimiter);

        //1. 품목 마스터로 지정된 품목 존재여부 결과값
        var ApplyResult_01 = this.ApplyResult_01.split(ecount.delimiter);
        var ApplyResult_01_Count = this.ApplyResult_01_Count.split(ecount.delimiter);
        //2. 판매전표 존재여부 결과값
        var ApplyResult_02 = this.ApplyResult_02.split(ecount.delimiter);
        var ApplyResult_02_Count = this.ApplyResult_02_Count.split(ecount.delimiter);
        /// 3. 구매 존재여부 결과값
        var ApplyResult_03 = this.ApplyResult_03.split(ecount.delimiter);
        var ApplyResult_03_Count = this.ApplyResult_03_Count.split(ecount.delimiter);
        /// 4. 생산불출 존재여부 결과값
        var ApplyResult_04 = this.ApplyResult_04.split(ecount.delimiter);
        var ApplyResult_04_Count = this.ApplyResult_04_Count.split(ecount.delimiter);
        /// 5. 창고이동 존재여부 결과값
        var ApplyResult_05 = this.ApplyResult_05.split(ecount.delimiter);
        var ApplyResult_05_Count = this.ApplyResult_05_Count.split(ecount.delimiter);
        /// 6. 생산입고 존재여부 결과값
        var ApplyResult_06 = this.ApplyResult_06.split(ecount.delimiter);
        var ApplyResult_06_Count = this.ApplyResult_06_Count.split(ecount.delimiter);
        /// 7. 자가사용 존재여부 결과값
        var ApplyResult_07 = this.ApplyResult_07.split(ecount.delimiter);
        var ApplyResult_07_Count = this.ApplyResult_07_Count.split(ecount.delimiter);
        /// 8. 재고조정 존재여부 결과값
        var ApplyResult_08 = this.ApplyResult_08.split(ecount.delimiter);
        var ApplyResult_08_Count = this.ApplyResult_08_Count.split(ecount.delimiter);
        /// 9. 불량 존재여부 결과값
        var ApplyResult_09 = this.ApplyResult_09.split(ecount.delimiter);
        var ApplyResult_09_Count = this.ApplyResult_09_Count.split(ecount.delimiter);
        /// 10. BOM 존재여부 결과값
        var ApplyResult_10 = this.ApplyResult_10.split(ecount.delimiter);
        var ApplyResult_10_Count = this.ApplyResult_10_Count.split(ecount.delimiter);
        var ApplyResult_10_Bom = null;
        if (this.ApplyResult_10_Bom != null) {
            ApplyResult_10_Bom = this.ApplyResult_10_Bom.split(ecount.delimiter);
        }
        /// 11. 오픈마켓 존재여부 결과값
        var ApplyResult_11 = this.ApplyResult_11.split(ecount.delimiter);
        var ApplyResult_11_Count = this.ApplyResult_11_Count.split(ecount.delimiter);

        this.arrErrorList = new Array();
        for (var i = 0, Limit = CodeList.length; i < Limit; i++) {
            toolbar = g.toolbar();
            var Code = CodeList[i];
            var Name = NameList[i];
            var displayFlsg = false;
            
            //|| '1' == '1'
            if (ExcuteFlag[i] == 'False') {
                ////toolbar.addLeft(ctrl.define("widget.label", "prodInfo" + i, "prodInfo" + i).label((i + 1).toString() + ". " + Code + " : " + Name));
                ///// 1. 품목 마스터로 지정된 품목 존재여부 결과값
                //if (ApplyResult_01_Count[i] != "0" || displayFlsg == true) {
                //    //toolbar.addLeft(ctrl.define("widget.custom", "check1" + i, "check1" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink1", i).label(ecount.resource.LBL01289 + ' (' + ApplyResult_01_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 주품목 
                //    _self.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL16385, cnt: ApplyResult_01_Count[i], checkLine: "checkLink1" });
                //}
                    
                /// 2. 판매전표 존재여부 결과값
                if (ApplyResult_02_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check2" + i, "check2" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink2", i).label(ecount.resource.LBL35000 + ' (' + ApplyResult_02_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 판매 
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL35000, cnt: ApplyResult_02_Count[i], checkLine: "checkLink2" });
                }
                    
                /// 3. 구매 존재여부 결과값
                if (ApplyResult_03_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check3" + i, "check3" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink3", i).label(ecount.resource.LBL35005 + ' (' + ApplyResult_03_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 구매 
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL35005, cnt: ApplyResult_03_Count[i], checkLine: "checkLink3" });
                }
                    
                /// 4. 생산불출 존재여부 결과값
                if (ApplyResult_04_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check4" + i, "check4" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink4", i).label(ecount.resource.LBL08272 + ' (' + ApplyResult_04_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 생산불출 
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL08272, cnt: ApplyResult_04_Count[i], checkLine: "checkLink4" });
                }
                    
                /// 5. 창고이동 존재여부 결과값
                if (ApplyResult_05_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check5" + i, "check5" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink5", i).label(ecount.resource.LBL02728 + ' (' + ApplyResult_05_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 창고이동 
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL02728, cnt: ApplyResult_05_Count[i], checkLine: "checkLink5" });
                }
                    
                /// 6. 생산입고 존재여부 결과값
                if (ApplyResult_06_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check6" + i, "check6" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink6", i).label(ecount.resource.LBL08274 + ' (' + ApplyResult_06_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 생산입고
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL08274, cnt: ApplyResult_06_Count[i], checkLine: "checkLink6" });
                }
                    
                /// 7. 자가사용 존재여부 결과값
                if (ApplyResult_07_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check7" + i, "check7" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink7", i).label(ecount.resource.LBL93359 + ' (' + ApplyResult_07_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 자가사용
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL93359, cnt: ApplyResult_07_Count[i], checkLine: "checkLink7" });
                }
                    
                /// 8. 재고조정 존재여부 결과값
                if (ApplyResult_08_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check8" + i, "check8" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink8", i).label(ecount.resource.LBL30120 + ' (' + ApplyResult_08_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 재고조정
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL30120, cnt: ApplyResult_08_Count[i], checkLine: "checkLink8" });
                }
                    
                /// 9. 불량 존재여부 결과값
                if (ApplyResult_09_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check9" + i, "check9" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink9", i).label(ecount.resource.LBL01398 + ' (' + ApplyResult_09_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 불량
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL01398, cnt: ApplyResult_09_Count[i], checkLine: "checkLink9" });
                }
                    
                /// 10. BOM 존재여부 결과값
                if (ApplyResult_10_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check10" + i, "check10" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink10", i).label(ecount.resource.LBL00178 + ' (' + ApplyResult_10_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // BOM
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL00178, cnt: ApplyResult_10_Count[i], checkLine: "checkLink10" });
                }
                    
                /// 11. 시리얼 존재여부 결과값
                if (ApplyResult_11_Count[i] != "0" || displayFlsg == true) {
                    //toolbar.addLeft(ctrl.define("widget.custom", "check11" + i, "check11" + i).addSpace(5).addControl(ctrl2.define("widget.link", "checkLink11", i).label(ecount.resource.LBL06039 + ' (' + ApplyResult_11_Count[i] + '' + ecount.resource.LBL00386 + ')'))); // 시리얼
                    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun: ecount.resource.LBL06039, cnt: ApplyResult_11_Count[i], checkLine: "checkLink11" });
                }
                    

                //if (ApplyResult_10_Bom == null)
                //    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun:'', cnt: '' });
                //else
                //    this.arrErrorList.push({ id: i, code: Code, name: Name, gubun:'', cnt: ApplyResult_10_Bom[i] });
                contents.add(toolbar);
            }
        }

        var PreName = "", MergeCount = 0, SplitCount = 1;
        var tmpMergeCount = [], tmpSplitCount = [];
        
        $.each(this.arrErrorList, function (idx, item) {
            if (idx != 0) {
                if (PreName != item.code) {
                    PreName = item.code;
                    MergeCount = MergeCount + SplitCount;
                    tmpMergeCount.push(MergeCount);
                    tmpSplitCount.push(SplitCount);
                    SplitCount = 1;
                } else {
                    SplitCount++;
                }
                if (idx == _self.arrErrorList.length - 1) {
                    tmpSplitCount.push(SplitCount);
                }
            }
            else {
                PreName = item.code;
                tmpMergeCount.push(MergeCount);
            }
        });

        this.SplitSetCount = tmpSplitCount;
        this.MeargeSetCount = tmpMergeCount;

        //데이터 Merge
        var mergeData = {}, r;
        for (i = 0, j = this.SplitSetCount.length; i < j; i++) {
            mergeData = {};
            r = this.MeargeSetCount[i];
            this.arrErrorList[r]['_MERGE_SET'] = [];
            mergeData['_MERGE_USEOWN'] = true;
            mergeData['_STYLE_USEOWN'] = true;
            mergeData['_ROW_TYPE'] = 'TOTAL';
            mergeData['_MERGE_START_INDEX'] = 0;
            mergeData['_ROWSPAN_COUNT'] = this.SplitSetCount[i];
            this.arrErrorList[r]['_MERGE_SET'].push(mergeData);

            mergeData = {};
            r = this.MeargeSetCount[i];
            mergeData['_MERGE_USEOWN'] = true;
            mergeData['_STYLE_USEOWN'] = true;
            mergeData['_ROW_TYPE'] = 'TOTAL';
            mergeData['_MERGE_START_INDEX'] = 1;
            mergeData['_ROWSPAN_COUNT'] = this.SplitSetCount[i];
            this.arrErrorList[r]['_MERGE_SET'].push(mergeData);
        }

        toolbar.addLeft(ctrl.define("widget.label", "warning").label(String.format(ecount.resource.MSG05280, ecount.resource.LBL05100)).useHTML()).end();

        var leftHtml = "<span style=' font-weight: bold'>" + String.format(ecount.resource.MSG05282, ecount.resource.LBL05100) + "</span>"

        grid
            .setRowData(this.arrErrorList)
            //.setKeyColumn(['CHECK_CODE', 'CHECK_GUBUN'])
            .setColumns([
                { propertyName: 'code', id: 'code', title: ecount.resource.LBL02874, width: '130' },
                { propertyName: 'name', id: 'name', title: ecount.resource.LBL02878, width: '170' },
                { propertyName: 'gubun', id: 'gubun', title: ecount.resource.LBL06768, width: '140' },
                { propertyName: 'cnt', id: 'cnt', title: ecount.resource.LBL00387, width: '100', align: 'right' },
                { propertyName: 'checkLine', id: 'checkLine', title: ecount.resource.LBL00387, width: '60', align: 'right', isHideColumn: true }
            ])
            .setColumnFixHeader(true)
            .setHeaderTopLeftHTML(leftHtml)
            .setCustomRowCell('gubun', this.setLinkData.bind(this));

        contents.addGrid("dataGrid", grid);

    },
    // 

    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control();

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));
        footer.add(toolbar);
    },
    /**********************************************************************
    * define common event listener
    **********************************************************************/
    // After the document loaded
    onLoadComplete: function () {
        //this.dataSearch(true);
    },
    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        handler(config);
    },
    // Message Handler for popup
    onMessageHandler: function (page, message) {
        message.callback && message.callback();  // The popup page is closed   
    },
    /**********************************************************************
    * define Link event listener
    **********************************************************************/

    //팝업연결
    setLinkData: function (value, rowData) {
        var option = {};
        var _self = this;
        //option.data = this.GetLinkDataInfo(rowData, "TEXT");
        option.controlType = "widget.link";

        option.event = {
            'click': function (e, data) {
                //if(data.rowItem.checkLine =="")
                switch (data.rowItem.checkLine) {
                    case "checkLink1": _self.onContentsCheckLink1(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink2": _self.onContentsCheckLink2(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink3": _self.onContentsCheckLink3(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink4": _self.onContentsCheckLink4(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink5": _self.onContentsCheckLink5(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink6": _self.onContentsCheckLink6(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink7": _self.onContentsCheckLink7(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink8": _self.onContentsCheckLink8(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink9": _self.onContentsCheckLink9(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink10": _self.onContentsCheckLink10(data.rowItem.code, data.rowItem.name)
                        break;
                    case "checkLink11": _self.onContentsCheckLink11(data.rowItem.code, data.rowItem.name)
                        break;
                }

            }.bind(this)
        };

        return option;
    },

    /// 1. 품목 마스터로 지정된 품목 존재여부 결과값
    onContentsCheckLink1: function (code,name) {
        //var code = "";
        //var name = "";        
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            PROD_CD: code,
            PROD_DES: name
        }

        this.openWindow({
            url: "/ECERP/ESA/ESA009M",
            name: 'ESA009M',
            param: param,
            popupType: false
        });

        //ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) { 
        //}.bind(this));
    },
    /// 2. 판매전표 존재여부 결과값
    onContentsCheckLink2: function (code, name) {
        //var code = "";
        //var name = "";

        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            BASE_DATE_FROM: this.baseDateFrom, //DateFromYear
            BASE_DATE_TO: this.baseDateTo,
            PROD_CD: code,
            PROD_DES: name,
            isSimpleDate: true

        }

        this.openWindow({
            url: "/ECERP/SVC/ESD/ESD007M",
            name: ecount.resource.LBL02936,
            param: param,
            popupType: false
        });
    },
    /// 3. 구매 존재여부 결과값
    onContentsCheckLink3: function (code, name) {
        //var code = "";
        //var name = "";

        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        //ecount.alert('구매 : ' + code + ' / ' + name);
        var param = {
            width: 800,
            height: 600,
            isOpenPopup: true,
            BASE_DATE_FROM: this.baseDateFrom, //DateFromYear
            BASE_DATE_TO: this.baseDateTo,
            PROD_CD: code,
            PROD_DES: name,
            TabAllYn: "Y",
            hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><ddlSioType><![CDATA[' + '99' + ']]></ddlSioType><hidSioDes><![CDATA[]]></hidSioDes><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd><![CDATA[]]></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><txtPDes6></txtPDes6><ddlSTaxFlag><![CDATA[00]]></ddlSTaxFlag><M_RptGubun><![CDATA[205]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No><![CDATA[0]]></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[ESD007M.aspx]]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_AFlag><![CDATA[1]]></M_AFlag><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><hidAFlag><![CDATA[1]]></hidAFlag><M_PFlag><![CDATA[' + '0' + ']]></M_PFlag><txtBondDebitNo></txtBondDebitNo><hidPageGubun><![CDATA[]]></hidPageGubun><txtDocNo><![CDATA[]]></txtDocNo></root>'
        }

        this.openWindow({
            url: "/ECERP/SVC/ESG/ESG010M",
            name: ecount.resource.LBL00642,
            param: param,
            popupType: false
        });

        //ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) { 
        //}.bind(this));
    },
    /// 4. 생산불출 존재여부 결과값
    onContentsCheckLink4: function (code, name) {
        //var code = "";
        //var name = "";

        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        //ecount.alert('구매 : ' + code + ' / ' + name);
        var param = {
            width: 800,
            height: 600,
            IsOpenPopup: true,
            baseDateFrom: this.baseDateFrom, //DateFromYear
            baseDateTo: this.baseDateTo,
            PROD_CD: code,
            PROD_DES: name,
            hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[420]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[1]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[]]></M_PFlag><txtDocNo><![CDATA[]]></txtDocNo></root>'
        }

        this.openWindow({
            url: "/ECERP/SVC/ESJ/ESJ007M",
            name: ecount.resource.LBL08272,
            param: param,
            popupType: false
        });

        //ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) { 
        //}.bind(this));
    },
    /// 5. 창고이동 존재여부 결과값
    onContentsCheckLink5: function (code, name) {
        //var code = "";
        //var name = "";

        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        //ecount.alert('구매 : ' + code + ' / ' + name);
        var param = {
            width: 800,
            height: 600,
            IsOpenPopup: true,
            Request: {
                BASE_DATE_FROM: this.baseDateFrom, //DateFromYear
                BASE_DATE_TO: this.baseDateTo,
                PROD_CD: code,
                PROD_DES: name,
                TabAllYn: "Y",
                isSimpleDate: true,
                hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[]]></M_PFlag><hidPageGubun><![CDATA[]]></hidPageGubun><txtDocNo><![CDATA[]]></txtDocNo></root>'
            }
        }

        this.openWindow({
            url: "/ECERP/SVC/ESM/ESM002M",
            name: ecount.resource.LBL02728,
            param: param,
            popupType: false
        });

        //ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) { 
        //}.bind(this));
    },
    /// 6. 생산입고 존재여부 결과값
    onContentsCheckLink6: function (code, name) {
        //var code = "";
        //var name = "";
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            IsOpenPopup: true,
            baseDateFrom: this.baseDateFrom, //DateFromYear
            baseDateTo: this.baseDateTo,
            PROD_CD: code,
            PROD_DES: name,
            TabAllYn: "Y",
            hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><rbSChk></rbSChk><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><cbOutCustFlag></cbOutCustFlag><M_RptGubun><![CDATA[200]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><hidPageGubun><![CDATA[]]></hidPageGubun><M_PFlag><![CDATA[' + 'tabConfirm' + ']]></M_PFlag><txtBondDebitNo></txtBondDebitNo><txtDocNo><![CDATA[]]></txtDocNo></root>'
        }

        this.openWindow({
            url: "/ECERP/SVC/ESJ/ESJ010M",
            name: ecount.resource.LBL02728,
            param: param,
            popupType: false
        });
    },
    /// 7. 자가사용 존재여부 결과값
    onContentsCheckLink7: function (code, name) {
        //var code = "";
        //var name = "";
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            IsOpenPopup: true,
            baseDateFrom: this.baseDateFrom, //DateFromYear
            baseDateTo: this.baseDateTo,
            PROD_CD: code,
            PROD_DES: name,
            TabAllYn: "Y",
            hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtJagaTypeCd></txtJagaTypeCd><txtJagaTypeDes></txtJagaTypeDes><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[' + 'tabConfirm' + ']]></M_PFlag><ddlAdjFlag><![CDATA[0]]></ddlAdjFlag><txtDocNo><![CDATA[]]></txtDocNo></root>'
        }
        this.openWindow({
            url: "/ECERP/SVC/ESM/ESM016M",
            name: ecount.resource.LBL93359,
            param: param,
            popupType: false
        });
    },
    /// 8. 재고조정 존재여부 결과값
    onContentsCheckLink8: function (code, name) {
        //var code = "";
        //var name = "";
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            IsOpenPopup: true,
            baseDateFrom: this.baseDateFrom, //DateFromYear
            baseDateTo: this.baseDateTo,
            PROD_CD: code,
            PROD_DES: name,
            //hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtJagaTypeCd></txtJagaTypeCd><txtJagaTypeDes></txtJagaTypeDes><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[' + 'tabConfirm' + ']]></M_PFlag><ddlAdjFlag><![CDATA[0]]></ddlAdjFlag><txtDocNo><![CDATA[]]></txtDocNo></root>'
            hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd><![CDATA[]]></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><ddlAdjSlipType></ddlAdjSlipType><ddlInvAdjSlip></ddlInvAdjSlip><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag><![CDATA[00]]></ddlSTaxFlag><M_RptGubun><![CDATA[205]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_AFlag><![CDATA[1]]></M_AFlag><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag></root>'
            //hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtJagaTypeCd></txtJagaTypeCd><txtJagaTypeDes></txtJagaTypeDes><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA['+ '' +']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA['+ '1' +']]></M_FirstFlag><M_PFlag><![CDATA[tabConfirm]]></M_PFlag><ddlAdjFlag><![CDATA[2]]></ddlAdjFlag></root>'
        }
        this.openWindow({
            //url: "/ECMain/ESM/ESM004M.aspx?io_type=57",
            //url: "/ECMain/ESP/ESP018M.ASPX",
            url: "/ECERP/ESP/ESP018M",
            name: ecount.resource.LBL93359,
            param: param,
            popupType: false
        });
    },
    /// 9. 불량 존재여부 결과값
    onContentsCheckLink9: function (code, name) {
        //var code = "";
        //var name = "";
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            IsOpenPopup: true,
            Request: {
                BASE_DATE_FROM: this.baseDateFrom, //DateFromYear
                BASE_DATE_TO: this.baseDateTo,
                PROD_CD: code,
                PROD_DES: name,
                TabAllYn: "Y",
                isSimpleDate: true,
                //hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtJagaTypeCd></txtJagaTypeCd><txtJagaTypeDes></txtJagaTypeDes><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[' + 'tabConfirm' + ']]></M_PFlag><ddlAdjFlag><![CDATA[0]]></ddlAdjFlag><txtDocNo><![CDATA[]]></txtDocNo></root>'
                //hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtJagaTypeCd></txtJagaTypeCd><txtJagaTypeDes></txtJagaTypeDes><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[tabConfirm]]></M_PFlag><ddlAdjFlag><![CDATA[2]]></ddlAdjFlag></root>',
                hidSearchXml: '<root><ddlSYear><![CDATA[' + this.base_date_from.year + ']]></ddlSYear><ddlSMonth><![CDATA[' + this.base_date_from.month + ']]></ddlSMonth><txtSDay><![CDATA[' + this.base_date_from.day + ']]></txtSDay><ddlEYear><![CDATA[' + this.base_date_to.year + ']]></ddlEYear><ddlEMonth><![CDATA[' + this.base_date_to.month + ']]></ddlEMonth><txtEDay><![CDATA[' + this.base_date_to.day + ']]></txtEDay><txtLastUpdatedID><![CDATA[]]></txtLastUpdatedID><txtLastUpdatedName><![CDATA[]]></txtLastUpdatedName><EtcVal></EtcVal><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><txtEProdCd></txtEProdCd><txtEProdDes></txtEProdDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSWhCd></txtSWhCd><txtSWhDes></txtSWhDes><txtEWhCd></txtEWhCd><txtEWhDes></txtEWhDes><txtEmpCd></txtEmpCd><txtEmpDes></txtEmpDes><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><txtBadTypeCd></txtBadTypeCd><txtBadTypeDes></txtBadTypeDes><ddlBadFlag></ddlBadFlag><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtSWord></txtSWord><rbProdChk></rbProdChk><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><ddlSTaxFlag></ddlSTaxFlag><M_RptGubun><![CDATA[600]]></M_RptGubun><M_FormGubun></M_FormGubun><M_SortAD></M_SortAD><M_Sort></M_Sort><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxDate></M_TrxDate><M_TrxNo></M_TrxNo><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[' + '' + ']]></M_Pgm><M_Page><![CDATA[0]]></M_Page><M_EdmsFlag></M_EdmsFlag><M_EditFlag><![CDATA[M]]></M_EditFlag><M_FirstFlag><![CDATA[' + '1' + ']]></M_FirstFlag><M_PFlag><![CDATA[tabConfirm]]></M_PFlag><txtDocNo><![CDATA[]]></txtDocNo></root>'
            }
        }
        this.openWindow({
            url: "/ECERP/SVC/ESM/ESM006M",
            name: ecount.resource.LBL01412,
            param: param,
            popupType: false
        });
    },
    /// 10. BOM 존재여부 결과값
    onContentsCheckLink10: function (code, name) {
        //var code = "";
        //var name = "";
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        etc = this.arrErrorList[i].etc;
        //        break;
        //    }
        //}

        //MSG05280, LBL02984,
        //var msg = String.format(ecount.resource.MSG05280, ecount.resource.LBL05100);
        //msg += '\n\nBOM : ' + etc;
        //ecount.alert(msg);

        var param = {
            width: 400,
            height: 600,
            BOM_CD: code
        }
        this.openWindow({
            url: "/ECERP/ESA/ESA009P_16_01",
            name: ecount.resource.LBL10774,
            param: param,
            popupType: false
        });
    },
    /// 11. 시리얼/로트 존재여부 결과값
    onContentsCheckLink11: function (code, name) {
        //var code = "";
        //var name = "";
        //for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
        //    if (this.arrErrorList[i].id == e.name) {
        //        code = this.arrErrorList[i].code;
        //        name = this.arrErrorList[i].name;
        //        break;
        //    }
        //}
        var param = {
            width: 800,
            height: 600,
            PROD_CD: code,
            PROD_DES: name,
            hidSearchXml: '<root><txtSerialS></txtSerialS><txtSerialE></txtSerialE><txtSProdCd><![CDATA[' + code + ']]></txtSProdCd><txtSProdDes><![CDATA[' + name + ']]></txtSProdDes><rbJagoQtyFlag><![CDATA[3]]></rbJagoQtyFlag><cbEmptyFlag><![CDATA[1]]></cbEmptyFlag><txtItemCd></txtItemCd><txtItemDes></txtItemDes><txtClassCd></txtClassCd><txtClassDes></txtClassDes><txtClassCd2></txtClassCd2><txtClassDes2></txtClassDes2><txtClassCd3></txtClassCd3><txtClassDes3></txtClassDes3><txtSCustCd><![CDATA[]]></txtSCustCd><txtSCustDes></txtSCustDes><txtSWord></txtSWord><txtRemarksWin></txtRemarksWin><txtPDes1></txtPDes1><txtPDes2></txtPDes2><txtPDes3></txtPDes3><txtPDes4></txtPDes4><txtPDes5></txtPDes5><M_Date></M_Date><M_No></M_No><M_SerNo><![CDATA[1]]></M_SerNo><M_Pgm><![CDATA[ESQ202M.aspx?ec_req_sid=00IrsSll_6U2]]></M_Pgm><M_EditFlag><![CDATA[M]]></M_EditFlag><M_Page>0</M_Page><M_AFlag><![CDATA[0]]></M_AFlag><M_FirstFlag><![CDATA[0]]></M_FirstFlag><M_ForeignFlag><![CDATA[0]]></M_ForeignFlag><M_WhCd></M_WhCd><E_Date></E_Date><E_No></E_No></root>'
        }
        this.openWindow({
            url: "/ECERP/ESQ/ESQ202M",
            name: ecount.resource.LBL06039,
            param: param,
            popupType: false
        });
    },
    /********************************************************************** 
    * define grid event listener
    **********************************************************************/
    
    //dataSearch: function (initFlag) {
    //    var thisObj = this;
    //    var settings = widget.generator.grid(),
    //        gridObj = this.contents.getGrid("dataGrid");

    //    var CodeData = [];
    //    var CodeList = this.CodeList.split('∬');
    //    var NameList = this.NameList.split('∬');
    //    var ExcuteFlag = this.ExcuteFlag.split('∬');

    //    var ApplyResult_01 = this.ApplyResult_01.split('∬');
    //    var ApplyResult_01_Count = this.ApplyResult_01_Count.split('∬');
    //    var ApplyResult_02 = this.ApplyResult_02.split('∬');
    //    var ApplyResult_02_Count = this.ApplyResult_02_Count.split('∬');
    //    var ApplyResult_03 = this.ApplyResult_03.split('∬');
    //    var ApplyResult_03_Count = this.ApplyResult_03_Count.split('∬');
    //    var ApplyResult_04 = this.ApplyResult_04.split('∬');
    //    var ApplyResult_04_Count = this.ApplyResult_04_Count.split('∬');
    //    var ApplyResult_05 = this.ApplyResult_05.split('∬');
    //    var ApplyResult_05_Count = this.ApplyResult_05_Count.split('∬');
    //    var ApplyResult_06 = this.ApplyResult_06.split('∬');
    //    var ApplyResult_06_Count = this.ApplyResult_06_Count.split('∬');
    //    var ApplyResult_07 = this.ApplyResult_07.split('∬');
    //    var ApplyResult_07_Count = this.ApplyResult_07_Count.split('∬');
    //    var ApplyResult_08 = this.ApplyResult_08.split('∬');
    //    var ApplyResult_08_Count = this.ApplyResult_08_Count.split('∬');
    //    var ApplyResult_09 = this.ApplyResult_09.split('∬');
    //    var ApplyResult_09_Count = this.ApplyResult_09_Count.split('∬');
    //    var ApplyResult_10 = this.ApplyResult_10.split('∬');
    //    var ApplyResult_10_Count = this.ApplyResult_10_Count.split('∬');
    //    var ApplyResult_11 = this.ApplyResult_11.split('∬');
    //    var ApplyResult_11_Count = this.ApplyResult_11_Count.split('∬');

    //    for (var i = 0; i < CodeList.length; i++) {
    //        //console.log(CodeList[i]);
    //        CodeData.push({
    //            EXCUTE:ExcuteFlag[i],
    //            CODE: CodeList[i],
    //            NAME: NameList[i],
    //            LINK_01: ApplyResult_01_Count[i],
    //            LINK_02: ApplyResult_02_Count[i],
    //            LINK_03: ApplyResult_03_Count[i],
    //            LINK_04: ApplyResult_04_Count[i],
    //            LINK_05: ApplyResult_05_Count[i],
    //            LINK_06: ApplyResult_06_Count[i],
    //            LINK_07: ApplyResult_07_Count[i],
    //            LINK_08: ApplyResult_08_Count[i],
    //            LINK_09: ApplyResult_09_Count[i],
    //            LINK_10: ApplyResult_10_Count[i],
    //            LINK_11: ApplyResult_11_Count[i]
    //        });
    //    }
        
        
    //    // Initialize Grid
    //    settings
    //        //.setRowDataUrl('/Inventory/Basic/GetListPriceLevelByItemForSearch')
    //        .setRowData(CodeData)
    //        .setRowDataParameter(this.searchFormParameter)
    //        .setKeyColumn(["PROD_CD"])

    //        .setColumnFixHeader(true)
    //        .setHeaderTopMargin(this.header.height())
    //        .setColumns([
    //            { propertyName: 'EXCUTE', id: 'EXCUTE', title: "결과", width: '65', align: 'center' },
    //            { propertyName: 'CODE', id: 'PROD_CD', title: ecount.resource.LBL05100, width: '100' },
    //            { propertyName: 'NAME', id: 'PROD_DES', title: ecount.resource.LBL03004, width: '' },

    //            { propertyName: 'LINK_01', id: 'LINK_01', title: '주품목', width: '65', align:'center' },
    //            { propertyName: 'LINK_02', id: 'LINK_02', title: '판매', width: '65', align: 'center' },
    //            { propertyName: 'LINK_03', id: 'LINK_03', title: '구매', width: '65', align: 'center' },
    //            { propertyName: 'LINK_04', id: 'LINK_04', title: '생산불출', width: '65', align: 'center' },
    //            { propertyName: 'LINK_05', id: 'LINK_05', title: '창고이동', width: '65', align: 'center' },
    //            { propertyName: 'LINK_06', id: 'LINK_06', title: '생산입고', width: '65', align: 'center' },
    //            { propertyName: 'LINK_07', id: 'LINK_07', title: '자가사용', width: '65', align: 'center' },
    //            { propertyName: 'LINK_08', id: 'LINK_08', title: '재고조정', width: '65', align: 'center' },
    //            { propertyName: 'LINK_09', id: 'LINK_09', title: '불량', width: '65', align: 'center' },
    //            { propertyName: 'LINK_10', id: 'LINK_10', title: 'BOM', width: '65', align: 'center' },
    //            { propertyName: 'LINK_11', id: 'LINK_11', title: '오픈마켓', width: '65', align: 'center' }
    //        ])

    //        // Custom Cells
    //        .setCustomRowCell("EXCUTE", this.setItemExcute.bind(this))
    //        .setCustomRowCell("LINK_01", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_02", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_03", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_04", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_05", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_06", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_07", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_08", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_09", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_10", this.setItemLink.bind(this))
    //        .setCustomRowCell("LINK_11", this.setItemLink.bind(this))
    //    ;

    //    this.gridSettings = settings;
    //    gridObj.grid.settings(settings);
    //    gridObj.draw(this.searchFormParameter);

    //    return true;
    //},
    //setItemExcute: function (value, rowItem) {
    //    var res = ecount.resource;
    //    var option = {};
    //    //option.controlType = "widget.link";

    //    if (value == "True")
    //        option.data = "성공";
    //    else
    //        option.data = "실패";

    //    option.event = {
    //        'click': function (e, data) {
    //            // Define data transfer object
    //            ecount.alert(data.rowItem.EXCUTE);

    //            e.preventDefault();
    //        }.bind(this)
    //    };
    //    return option;
    //},
    //setItemLink: function (value, rowItem) {
    //    var res = ecount.resource;
    //    var self = this;
    //    var option = {};
    //    if (value == "" || value == 0) {
    //        value = "-";
    //    } else {
    //        option.controlType = "widget.link";
    //    }
        
    //    option.data = '' + value + '';
    //    option.event = {
    //        'click': function (e, data) {
    //            switch (data.columnId) {
    //                case "LINK_01":
    //                    //주품목
    //                    self.fnProdMasterLink(data.rowItem.PROD_CD);
    //                    break;
    //                case "LINK_02":
    //                    //판매
    //                    break;
    //                case "LINK_03":
    //                    //구매
    //                    break;
    //                case "LINK_04":
    //                    //생산불출
    //                    break;
    //                case "LINK_05":
    //                    //창고이동
    //                    break;
    //                case "LINK_06":
    //                    //생산입고
    //                    break;
    //                case "LINK_07":
    //                    //자가사용
    //                    break;
    //                case "LINK_08":
    //                    //재고조정
    //                    break;
    //                case "LINK_09":
    //                    //불량
    //                    break;
    //                case "LINK_10":
    //                    //BOM
    //                    break;
    //                case "LINK_11":
    //                    //오픈마켓
    //                    break;
    //            }
    //            e.preventDefault();
    //        }.bind(this)
    //    };
        
    //    return option;
    //},
    //setItemCodeLink: function (value, rowItem) {
    //    var option = {};
    //    var res = ecount.resource;

    //    option.controlType = "widget.link";
    //    option.event = {
    //        'click': function (e, data) {
    //            // Define data transfer object
    //            var param = {
    //                width: ecount.infra.getPageWidthFromConfig(),
    //                //width: 800,
    //                height: 210 + 60,
    //                editFlag: 'M',
    //                code_class: data.rowItem.CODE_CLASS,
    //                prod_cd: data.rowItem.PROD_CD,
    //                DEL_GUBUN: data.rowItem.DEL_GUBUN
    //            };

    //            // Open popup
    //            this.openWindow({
    //                url: '/ECERP/ESA/ESA014P_02',
    //                name: String.format(res.LBL06434, res.LBL06436),
    //                param: param,
    //                popupType: false,
    //                additional: false,
    //                parentPageID: this.pageID,
    //                responseID: this.callbackID,
    //            });

    //            e.preventDefault();
    //        }.bind(this)
    //    };
    //    return option;
    //},
    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    **********************************************************************/

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/
    // F8 click
    ON_KEY_F8: function (e) {
    },
    /**********************************************************************
    * define user function
    **********************************************************************/
    // Close button click event
    onFooterClose: function () {
        this.close();
    }
    //,
    //// 1. 주품목 링크
    //fnProdMasterLink: function (prodCd) {
    //    ecount.alert('fnProdMasterLink');
    //},
    //// 2. 판매 링크
    //fnSalesLink: function (prodCd) {
    //    ecount.alert('fnSalesLink');
    //},
    //// 3. 구매 링크
    //fnPurchasesLink: function (prodCd) {
    //    ecount.alert('fnPurchasesLink');
    //},
    //// 4. 생산불출 링크
    //fnGoodsIssuedLink: function (prodCd) {
    //    ecount.alert('fnGoodsIssuedLink');
    //},
    //// 5. 창고이동 링크
    //fnLocationTranLink: function (prodCd) {
    //    ecount.alert('fnLocationTranLink');
    //},
    //// 6. 생산입고 링크
    //fnGoodsReceiptLink: function (prodCd) {
    //    ecount.alert('fnGoodsReceiptLink');
    //},
    //// 7. 자가사용 링크
    //fnInternalUseLink: function (prodCd) {
    //    ecount.alert('fnInternalUseLink');
    //},
    //// 8. 재고조정 링크
    //fnInventoryAdjustmentLink: function (prodCd) {
    //    ecount.alert('fnInventoryAdjustmentLink');
    //},
    //// 9. 불량 링크
    //fnBadLink: function (prodCd) {
    //    ecount.alert('fnBadLink');
    //},
    //// 10. BOM 링크
    //fnBomLink: function (prodCd) {
    //    ecount.alert('fnBomLink');
    //},
    //// 11. 오픈마켓 링크
    //fnOpenMarketLink: function (prodCd) {
    //    ecount.alert('fnOpenMarketLink');
    //},
});