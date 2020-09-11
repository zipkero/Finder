window.__define_resource && __define_resource("LBL00329","LBL30017","LBL00386","LBL01217","LBL00138");
/****************************************************************************************************
1. Create Date : 2015.10.05
2. Creator     : 양미진
3. Description : 재고/회계 > 기초등록 > 거래처등록 > 리스트
4. Precaution  : widget.link 외 다른 widget 사용시 동일한 아이디 사용하지 말 것.
5. History     : 
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ESA000P_01", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/
    arrErrorList: new Array(),     //선택삭제 안된 리스트

    /**********************************************************************
    *  page init
    **********************************************************************/

    /**********************************************************************
   * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
   **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header) {
        var g = widget.generator,
           contents = g.contents();

        var resrouceVal = "";

        if (this.PageGubun == "CUST")
            resrouceVal = ecount.resource.LBL00329;

        header.setTitle(resrouceVal)
            .addContents(contents);
        header.notUsedBookmark();
    },

    //본문 옵션 설정
    onInitContents: function (contents) {
        var g = widget.generator,
           toolbar = g.toolbar(),
           ctrl = g.control(),
           ctrl2 = g.control();

        var arrDeleteList = this.NoDeleteBusinessNoList.split(ecount.delimiter);
        var Code = "";
        var Name = "";
        var acc101Label = "";
        var acc301Label_1 = "";
        var acc301Label_2 = "";
        var custList = {};

        function setError1(errorList, type) {
            if (errorList) {
                var arrErrorList = errorList.split(ecount.delimiter);
                for (var i = 0, Limit = arrErrorList.length; i < Limit; i++) {
                    var val = arrErrorList[i];
                    if (!custList[val]) {
                        custList[val] = {};
                    }
                    custList[val][type] = true;
                }
            }
        }

        function setError2(errorList, type, column) {
            if (errorList) {
                for (var i = 0, Limit = errorList.length; i < Limit; i++) {
                    var cust = errorList[i];
                    if (!custList[cust.Cust]) {
                        custList[cust.Cust] = {};
                    }
                    custList[cust.Cust][type] = cust[column];
                }
            }
        }

        setError1(this.ErrorType1, "type1");
        setError2(this.viewBag.InitDatas.ErrorType2, "type2", "Count");
        setError2(this.viewBag.InitDatas.ErrorType3_1, "type3_1", "Count");
        setError2(this.viewBag.InitDatas.ErrorType3_2, "type3_2", "Count");

        this.arrErrorList = new Array();

        for (var i = 0, Limit = arrDeleteList.length; i < Limit; i++) {
            var Code = arrDeleteList[i].split("ㆍ")[0];
            var Name = arrDeleteList[i].split("ㆍ")[1];

            if (custList[Code]) {
                acc101Label = ecount.resource.LBL30017 + " " + custList[Code]["type2"] + ecount.resource.LBL00386;
                acc301Label_1 = ecount.resource.LBL01217 + " " + custList[Code]["type3_1"] + ecount.resource.LBL00386;
                acc301Label_2 = ecount.resource.LBL00138 + " " + custList[Code]["type3_2"] + ecount.resource.LBL00386;
            }

            toolbar = g.toolbar();

            toolbar.addLeft(ctrl.define("widget.label", "BusinessNo_" + i).label((i + 1).toString() + ". " + Code + " : " + Name));

            if (custList[Code]["type1"] != undefined)
                toolbar.addLeft(ctrl.define("widget.label", "Cust_" + i).addSpace(5).label("이미 삭제된 거래처입니다."));
            if (custList[Code]["type2"] != undefined)
                toolbar.addLeft(ctrl.define("widget.custom", "Acc101_" + i, "Acc101_" + i).addSpace(5).addControl(ctrl2.define("widget.link", "Acc101_link", i).label(acc101Label)));
            if (custList[Code]["type3_1"] != undefined)
                toolbar.addLeft(ctrl.define("widget.custom", "Acc301_1_" + i, "Acc301_1_" + i).addSpace(5).addControl(ctrl2.define("widget.link", "Acc301_1_link", i).label(acc301Label_1)));
            if (custList[Code]["type3_2"] != undefined)
                toolbar.addLeft(ctrl.define("widget.custom", "Acc301_2_" + i, "Acc301_2_" + i).addSpace(5).addControl(ctrl2.define("widget.link", "Acc301_2_link", i).label(acc301Label_2)));

            this.arrErrorList.push({ id: i, Code: Code, Name: Name })
            contents.add(toolbar);
        }
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/


    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
    onContentsAcc101_link: function (e) {
        var BusinessNo = "";
        var CustName = "";

        for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
            if (this.arrErrorList[i].id == e.name) {
                BusinessNo = this.arrErrorList[i].Code;
                CustName = this.arrErrorList[i].Name;
                break;
            }
        }

        ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) {
            var hidSearchXml = "<root><ddlSYear><![CDATA[" + this.DateFromYear + "]]></ddlSYear><ddlSMonth><![CDATA[01]]></ddlSMonth><txtSDay><![CDATA[01]]></txtSDay><ddlEYear><![CDATA[" + this.DateToYear + "]]></ddlEYear><ddlEMonth><![CDATA[12]]></ddlEMonth><txtEDay><![CDATA[31]]></txtEDay><txtSCustCd><![CDATA[" + BusinessNo + "]]></txtSCustCd><txtSCustDes><![CDATA[" + CustName + "]]></txtSCustDes><EtcVal><![CDATA[0]]></EtcVal><txtSiteCd></txtSiteCd><txtSiteDes></txtSiteDes><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><ddlSFirstInsertYear></ddlSFirstInsertYear><ddlSFirstInsertMonth></ddlSFirstInsertMonth><txtSFirstInsertDay></txtSFirstInsertDay><ddlEFirstInsertYear></ddlEFirstInsertYear><ddlEFirstInsertMonth></ddlEFirstInsertMonth><txtEFirstInsertDay></txtEFirstInsertDay><ddlSLastUpdatedYear></ddlSLastUpdatedYear><ddlSLastUpdatedMonth></ddlSLastUpdatedMonth><txtSLastUpdatedDay></txtSLastUpdatedDay><ddlELastUpdatedYear></ddlELastUpdatedYear><ddlELastUpdatedMonth></ddlELastUpdatedMonth><txtELastUpdatedDay></txtELastUpdatedDay><ddlLastHistory></ddlLastHistory><txtTreeSiteCd><![CDATA[]]></txtTreeSiteCd><txtTreeSiteNm><![CDATA[]]></txtTreeSiteNm><cbSubTreeSite><![CDATA[]]></cbSubTreeSite><txtTreeCustCd><![CDATA[]]></txtTreeCustCd><txtTreeCustNm><![CDATA[]]></txtTreeCustNm><cbSubTreeCust><![CDATA[]]></cbSubTreeCust><txtSCustCd></txtSCustCd><txtSCustDes></txtSCustDes><txtSGyeCode></txtSGyeCode><txtSGyeDes></txtSGyeDes><txtEGyeCode></txtEGyeCode><txtEGyeDes></txtEGyeDes><txtAccCase></txtAccCase><hidAccCaseCd><![CDATA[9999]]></hidAccCaseCd><txtBillNo></txtBillNo><txtBillName></txtBillName><SMoney></SMoney><EMoney></EMoney><sub_code></sub_code><Remark></Remark><WID></WID><WName></WName><chkJournal><![CDATA[0]]></chkJournal><FWID></FWID><FWName></FWName><M_Page><![CDATA[1]]></M_Page><M_SlipType><![CDATA[]]></M_SlipType><M_TradeGubun><![CDATA[]]></M_TradeGubun><FirstFlag><![CDATA[N]]></FirstFlag><M_Pgm></M_Pgm><M_Date></M_Date><M_No></M_No><chkJGubun><![CDATA[0]]></chkJGubun><M_Type></M_Type><M_TrxSer></M_TrxSer><M_EditFlag><![CDATA[M]]></M_EditFlag><M_Uid></M_Uid><M_SerNo></M_SerNo><M_RptGubun2></M_RptGubun2><M_TabFlag><![CDATA[tabAll]]></M_TabFlag><M_IngFlag></M_IngFlag><txtDocNo></txtDocNo></root>";

            var param = {
                width: 800,
                height: 600,
                hidSearchXml: hidSearchXml
            }

            this.openWindow({
                url: "/ECMAIN/EBG/EBG001M.aspx",
                name: 'EBG001M',
                param: param,
                popupType: true
            });
        }.bind(this));
    },


    onContentsAcc301_1_link: function (e) {
        var BusinessNo = "";
        var CustName = "";

        for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
            if (this.arrErrorList[i].id == e.name) {
                BusinessNo = this.arrErrorList[i].Code;
                CustName = this.arrErrorList[i].Name;
                break;
            }
        }

        ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) {
            var hidSearchXml = "<root><ddlSYear><![CDATA[" + this.DateFromYear + "]]></ddlSYear><ddlSMonth><![CDATA[01]]></ddlSMonth><txtSDay><![CDATA[01]]></txtSDay><ddlEYear><![CDATA[" + this.DateToYear + "]]></ddlEYear><ddlEMonth><![CDATA[12]]></ddlEMonth><txtEDay><![CDATA[31]]></txtEDay><txtSCustCd><![CDATA[" + BusinessNo + "]]></txtSCustCd><txtSCustDes><![CDATA[" + CustName + "]]></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtSiteCd></txtSiteCd><txtSiteDes></txtSiteDes><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><rbRptSort><![CDATA[B]]></rbRptSort><ddlMailState></ddlMailState><cbGCustFlag></cbGCustFlag><txtIoTypeCd></txtIoTypeCd><txtIoTypeDes></txtIoTypeDes><M_Page><![CDATA[1]]></M_Page><M_SlipType></M_SlipType><M_FirstFlag><![CDATA[N]]></M_FirstFlag><M_Pgm></M_Pgm><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxSer></M_TrxSer><M_EditFlag><![CDATA[M]]></M_EditFlag><M_PFlag><![CDATA[ALL]]></M_PFlag><M_RptGubun><![CDATA[45]]></M_RptGubun><cbBeforeFlag><![CDATA[0]]></cbBeforeFlag><M_Sort><![CDATA[IO_DATE DESC, IO_NO DESC ]]></M_Sort><ddlFormSer><![CDATA[" + this.viewBag.InitDatas.SalesInvoiceSeq + "]]></ddlFormSer></root>";

            var param = {
                width: 800,
                height: 600,
                hidSearchXml: hidSearchXml
            }

            this.openWindow({
                url: "/ECMAIN/EBG/EBG006M.aspx",
                name: 'EBG006M',
                param: param,
                popupType: true
            });
        }.bind(this));
    },

    onContentsAcc301_2_link: function (e) {
        var BusinessNo = "";
        var CustName = "";

        for (var i = 0, limit = this.arrErrorList.length; i < limit; i++) {
            if (this.arrErrorList[i].id == e.name) {
                BusinessNo = this.arrErrorList[i].Code;
                CustName = this.arrErrorList[i].Name;
                break;
            }
        }

        ecount.confirm("허용거래처, 허용품목, 허용창고, 허용부서로 이용 전표조회가 제한된 경우 일부 전표가 조회되지 않을 수 있습니다.", function (status) {
            var hidSearchXml = "<root><ddlSYear><![CDATA[" + this.DateFromYear + "]]></ddlSYear><ddlSMonth><![CDATA[01]]></ddlSMonth><txtSDay><![CDATA[01]]></txtSDay><ddlEYear><![CDATA[" + this.DateToYear + "]]></ddlEYear><ddlEMonth><![CDATA[12]]></ddlEMonth><txtEDay><![CDATA[31]]></txtEDay><txtSCustCd><![CDATA[" + BusinessNo + "]]></txtSCustCd><txtSCustDes><![CDATA[" + CustName + "]]></txtSCustDes><txtECustCd></txtECustCd><txtECustDes></txtECustDes><txtSiteCd></txtSiteCd><txtSiteDes></txtSiteDes><txtPjtCd></txtPjtCd><txtPjtDes></txtPjtDes><txtCustGroup1></txtCustGroup1><txtCustGroupDes1></txtCustGroupDes1><txtCustGroup2></txtCustGroup2><txtCustGroupDes2></txtCustGroupDes2><txtCustEmpCd></txtCustEmpCd><txtCustEmpDes></txtCustEmpDes><rbRptSort><![CDATA[Z]]></rbRptSort><ddlMailState></ddlMailState><cbGCustFlag></cbGCustFlag><txtIoTypeCd></txtIoTypeCd><txtIoTypeDes></txtIoTypeDes><M_Page><![CDATA[1]]></M_Page><M_SlipType></M_SlipType><M_FirstFlag><![CDATA[N]]></M_FirstFlag><M_Pgm></M_Pgm><M_Date></M_Date><M_No></M_No><M_Type></M_Type><M_TrxSer></M_TrxSer><M_EditFlag><![CDATA[M]]></M_EditFlag><M_PFlag><![CDATA[ALL]]></M_PFlag><M_RptGubun><![CDATA[51]]></M_RptGubun><cbBeforeFlag><![CDATA[0]]></cbBeforeFlag><M_Sort><![CDATA[IO_DATE DESC, IO_NO DESC ]]></M_Sort><ddlFormSer><![CDATA[" + this.viewBag.InitDatas.PurchaseInvoiceSeq + "]]></ddlFormSer></root>";

            var param = {
                width: 800,
                height: 600,
                hidSearchXml: hidSearchXml
            }

            this.openWindow({
                url: "/ECMAIN/EBG/EBG007M.aspx",
                name: 'EBG007M',
                param: param,
                popupType: true
            });
        }.bind(this));
    }
    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/


    /**********************************************************************
	* user function
	=>사용자가 생성한 기능 function 등
	**********************************************************************/
});
