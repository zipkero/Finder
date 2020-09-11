window.__define_resource && __define_resource("LBL09999","LBL10030","LBL06434","LBL02999","MSG05659","LBL10029","MSG03031","LBL06451","LBL02813","LBL02238","MSG05661","LBL10277","MSG05660","MSG01136","LBL10278","MSG05673","LBL10270","LBL06426","LBL06425","LBL00097","LBL00096","LBL00095","LBL00094","LBL00093","LBL00084","LBL00085","LBL00086","LBL00087","LBL00088","LBL01249","LBL02513","LBL02512","BTN00065","BTN00765","BTN00067","BTN00007","BTN00959","BTN00204","BTN00203","BTN00033","BTN00008","MSG01182","MSG00299","LBL07157","LBL06423","MSG08770","LBL06436");
/****************************************************************************************************
1. Create Date : 2015.09.23
2. Creator     : 조영상
3. Description : 제고1 > 기초등록 > 품목그룹별 등록, 수정 팝업창
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
                 [2018.07.26] BSY: [A17_02299단가조정Null값반올림]
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                 2019.06.05 (NguyenDucThinh) A18_04171 Update resource
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA071P_02", {

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    init: function () {
        this._super.init.apply(this, arguments);
        this.permit = this.viewBag.Permission.permitESA101;
    },

    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header, resource) {

        header.notUsedBookmark();
        header.setTitle(this.editFlag == "I" ? String.format(ecount.resource.LBL09999, ecount.resource.LBL10030) : String.format(ecount.resource.LBL06434, ecount.resource.LBL10030))   // 타입구분 editFlag : I(등록) / M(수정)
    },

    // Contents Initialization
    onInitContents: function (contents, resource) {
        var self = this;
        var g = widget.generator,
        toolbar = g.toolbar(),
        ctrl = g.control(),
        form1 = g.form();
        form1.template("register")
        if (this.isPriceByItemCall == true) {
            if(self.viewBag.InitDatas.GridFirstLoad[0]==undefined)
                this.editFlag = 'I';
        }

        // 신규 등록 일 경우
        if (['I'].contains(this.editFlag)) {            
            if (this.isPriceByItemCall == true) {
                form1.add(ctrl.define("widget.multiCode.prodGroup", this.CLASS_GUBUN == "1" ? "txtClassCd1" : this.CLASS_GUBUN == "2" ? "txtClassCd2" : "txtClassCd3", "CLASS_CD", ecount.resource.LBL02999)
                   .popover(ecount.resource.MSG05659)
                   .dataRules(["required"], ecount.resource.MSG05659)
                   .addCode({ label: this.CLASS_DES, value: this.CLASS_CD })
                   .maxSelectCount(1)
                   .end());
                // 특별단가
                form1.add(ctrl.define("widget.multiCode.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL10029)
                     .popover(ecount.resource.MSG03031)
                     .addCode({ label: this.DES_CLASS, value: this.CODE_CLASS })
                     .dataRules(["required"], ecount.resource.MSG03031).readOnly()
                     .maxSelectCount(1).end())
            }
            else {
            // 품목그룹코드
                form1.add(ctrl.define("widget.code.prodGroup", this.CLASS_GUBUN == "1" ? "txtClassCd1" : this.CLASS_GUBUN == "2" ? "txtClassCd2" : "txtClassCd3", "CLASS_CD", ecount.resource.LBL02999)
                 .popover(ecount.resource.MSG05659)
                 .dataRules(["required"], ecount.resource.MSG05659)
                 .codeType(7)
                 .maxSelectCount(1)
                 .end());
            // 특별단가
            form1.add(ctrl.define("widget.code.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL10029)
                 .popover(ecount.resource.MSG03031)
                 .dataRules(["required"], ecount.resource.MSG03031)
                 .codeType(7)
                 .maxSelectCount(1).end())
            }
            

          

            // 단가기준
            form1.add(ctrl.define("widget.select", "PRICE_GUBUN", "PRICE_GUBUN", ecount.resource.LBL06451)
                 .option([
                        ["O", ecount.resource.LBL02813],
                        ["I", ecount.resource.LBL02238],
                        ["A", ecount.config.inventory.PRICE_1],
                        ["B", ecount.config.inventory.PRICE_2],
                        ["C", ecount.config.inventory.PRICE_3],
                        ["D", ecount.config.inventory.PRICE_4],
                        ["E", ecount.config.inventory.PRICE_5],
                        ["F", ecount.config.inventory.PRICE_6],
                        ["G", ecount.config.inventory.PRICE_7],
                        ["H", ecount.config.inventory.PRICE_8],
                        ["9", ecount.config.inventory.PRICE_9],
                        ["J", ecount.config.inventory.PRICE_10]]
                        )
                 .popover(ecount.resource.MSG05661)
                 .select(0)
                 .end());

            // 조정 비율
            form1.add(ctrl.define("widget.input", "PRICE_RATE", "PRICE_RATE", ecount.resource.LBL10277)
                 .value('')
                 .popover(ecount.resource.MSG05660)                 
                 .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                 .numericOnly(18, 5)
                 .end())

            // 조정 단위처리 레이어영역
            form1.add(ctrl.define("widget.custom", "CUSTOM_LAYER", "CUSTOM_LAYER", ecount.resource.LBL10278)
                 .popover(ecount.resource.MSG05673)
                 .end());
        }
        else if (['M'].contains(this.editFlag) || (['V'].contains(this.editFlag) && this.P_CheckRead == 'Y'))
        {            
            // 품목그룹코드
            form1.add(ctrl.define("widget.label", "CLASS_CD", "CLASS_CD", ecount.resource.LBL02999)
                .label($.isNull(self.viewBag.InitDatas.GridFirstLoad[0]) ? this.P_CLASS_CD : self.viewBag.InitDatas.GridFirstLoad[0].CLASS_CD)
                .readOnly()
                .end());

            // 품목그룹명
            form1.add(ctrl.define("widget.label", "CLASS_DES", "CLASS_DES", ecount.resource.LBL10270)
                .label($.isNull(self.viewBag.InitDatas.GridFirstLoad[0]) ? this.P_CODE_CLASS_DES : self.viewBag.InitDatas.GridFirstLoad[0].CLASS_DES)
                .readOnly()
                .end());

            // 특별단가 - 적용단가에서 진입할 경우 Label 처리
            if (['M'].contains(this.editFlag))
            {             
                // 특별단가 그룹
                if (this.isPriceByItemCall == true) {
                    form1.add(ctrl.define("widget.code.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL10029)
                     .popover(ecount.resource.MSG03031)
                     .dataRules(["required"], ecount.resource.MSG03031)
                     .codeType(7)
                     .readOnly()
                     .addCode({ label: self.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS_DES, value: self.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS })
                     .maxSelectCount(1).end())
                }
                else {
                    form1.add(ctrl.define("widget.code.priceGroup", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL10029)
                     .popover(ecount.resource.MSG03031)
                     .dataRules(["required"], ecount.resource.MSG03031)
                     .codeType(7)
                     .addCode({ label: self.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS_DES, value: self.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS })
                     .maxSelectCount(1).end())
                }
                
            }
            else {
                form1.add(ctrl.define("widget.label", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL06426) // 특별단가그룹코드
                .label($.isNull(self.viewBag.InitDatas.GridFirstLoad[0]) ? this.P_CODE_CLASS : self.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS)
                .readOnly()
                .end());

                form1.add(ctrl.define("widget.label", "CODE_CLASS_DES", "CODE_CLASS_DES", ecount.resource.LBL06425) // 특별단가그룹명
                .label($.isNull(self.viewBag.InitDatas.GridFirstLoad[0]) ? this.P_CLASS_DES : self.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS_DES)
               .readOnly()
               .end());
            }

            // 단가기준
            form1.add(ctrl.define("widget.select", "PRICE_GUBUN", "PRICE_GUBUN", ecount.resource.LBL06451)
                 .option([
                        ["O", ecount.resource.LBL02813],
                        ["I", ecount.resource.LBL02238],
                        ["A", ecount.config.inventory.PRICE_1],
                        ["B", ecount.config.inventory.PRICE_2],
                        ["C", ecount.config.inventory.PRICE_3],
                        ["D", ecount.config.inventory.PRICE_4],
                        ["E", ecount.config.inventory.PRICE_5],
                        ["F", ecount.config.inventory.PRICE_6],
                        ["G", ecount.config.inventory.PRICE_7],
                        ["H", ecount.config.inventory.PRICE_8],
                        ["9", ecount.config.inventory.PRICE_9],
                        ["J", ecount.config.inventory.PRICE_10]]
                        )
                 .popover(ecount.resource.MSG05661)
                 .select($.isNull(self.viewBag.InitDatas.GridFirstLoad[0]) ? this.P_PRICE_GUBUN : self.viewBag.InitDatas.GridFirstLoad[0].PRICE_GUBUN)
                 .end());

            // 조정 비율
            form1.add(ctrl.define("widget.input", "PRICE_RATE", "PRICE_RATE", ecount.resource.LBL10277)
                 .value($.isNull(self.viewBag.InitDatas.GridFirstLoad[0]) ? this.P_PRICE_RATE : self.viewBag.InitDatas.GridFirstLoad[0].PRICE_RATE)
                 .popover(ecount.resource.MSG05660)                
                 .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                 .numericOnly(18, ecount.config.inventory.DEC_RATE)
                 .end())

            // 조정 단위처리 레이어영역
            form1.add(ctrl.define("widget.custom", "CUSTOM_LAYER", "CUSTOM_LAYER", ecount.resource.LBL10278)
                 .popover(ecount.resource.MSG05673)
                 .end());
        }
        else 
        { 
            // 품목그룹코드
            form1.add(ctrl.define("widget.label", "CLASS_CD", "CLASS_CD", ecount.resource.LBL02999)
                 .label(this.P_CLASS_CD)
                 .readOnly()
                 .end());

            // 품목그룹명
            form1.add(ctrl.define("widget.label", "CLASS_DES", "CLASS_DES", ecount.resource.LBL10270)
                 .label(this.P_CODE_CLASS_DES)
                 .readOnly()
                 .end());

            form1.add(ctrl.define("widget.label", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL06426) // 특별단가그룹코드
                .label(this.P_CODE_CLASS)
                .readOnly()
                .end());

            form1.add(ctrl.define("widget.label", "CODE_CLASS_DES", "CODE_CLASS_DES", ecount.resource.LBL06425) // 특별단가그룹명
                 .label(this.P_CLASS_DES)
                 .readOnly()
                 .end());

            // 단가기준
            form1.add(ctrl.define("widget.select", "PRICE_GUBUN", "PRICE_GUBUN", ecount.resource.LBL06451)
                 .option([
                        ["O", ecount.resource.LBL02813],
                        ["I", ecount.resource.LBL02238],
                        ["A", ecount.config.inventory.PRICE_1],
                        ["B", ecount.config.inventory.PRICE_2],
                        ["C", ecount.config.inventory.PRICE_3],
                        ["D", ecount.config.inventory.PRICE_4],
                        ["E", ecount.config.inventory.PRICE_5],
                        ["F", ecount.config.inventory.PRICE_6],
                        ["G", ecount.config.inventory.PRICE_7],
                        ["H", ecount.config.inventory.PRICE_8],
                        ["9", ecount.config.inventory.PRICE_9],
                        ["J", ecount.config.inventory.PRICE_10]]
                        )
                 .popover(ecount.resource.MSG05661)
                 .select(this.P_PRICE_GUBUN)
                 .end());

            // 조정 비율
            form1.add(ctrl.define("widget.input", "PRICE_RATE", "PRICE_RATE", ecount.resource.LBL10277)
                 .value(this.P_PRICE_RATE)
                 .popover(ecount.resource.MSG05660)
                 
                 .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "15", "30"), max: 30 })
                 .numericOnly(18, 5)
                 .end())

            //조정 단위처리 레이어영역
            form1.add(ctrl.define("widget.custom", "CUSTOM_LAYER", "CUSTOM_LAYER", ecount.resource.LBL10278)
                 .popover(ecount.resource.MSG05673)
                 .end());
        }
        contents.add(form1);
    },

    onInitControl: function (cid, control) {
        var self = this;
        var g = widget.generator,
        toolbar = g.toolbar(),
        ctrl = g.control()

        if (cid == "CUSTOM_LAYER") {

            if (['I'].contains(this.editFlag)) {
            control.columns(6, 6)
            .addControl(ctrl.define("widget.select", "PRICE_LESS", "PRICE_LESS")
                .option([
                        ['1000000.0000000000', ecount.resource.LBL00097],
                        ['100000.0000000000', ecount.resource.LBL00096],
                        ['10000.0000000000', ecount.resource.LBL00095],
                        ['1000.0000000000', ecount.resource.LBL00094],
                        ['100.0000000000', ecount.resource.LBL00093],
                        ['10.0000000000', ecount.resource.LBL00084],
                        ['1.0000000000', ecount.resource.LBL00085],
                        ['0.1000000000', ecount.resource.LBL00086],
                        ['0.0100000000', ecount.resource.LBL00087],
                        ['0.0010000000', ecount.resource.LBL00088]]
                       )
                .select("1000000.0000000000"))
            .addControl(ctrl.define("widget.select", "PRICE_RISE", "PRICE_RISE")
                .option([
                        ['R', ecount.resource.LBL01249],
                        ['C', ecount.resource.LBL02513],
                        ['F', ecount.resource.LBL02512]]
                       )
                .select("R")
                );

            }
            else if (['M'].contains(this.editFlag) || (['V'].contains(this.editFlag) && this.P_CheckRead == 'Y')) {

                control.columns(6, 6)
                    .addControl(ctrl.define("widget.select", "PRICE_LESS", "PRICE_LESS")
                        .option([
                                ['1000000.0000000000', ecount.resource.LBL00097],
                                ['100000.0000000000', ecount.resource.LBL00096],
                                ['10000.0000000000', ecount.resource.LBL00095],
                                ['1000.0000000000', ecount.resource.LBL00094],
                                ['100.0000000000', ecount.resource.LBL00093],
                                ['10.0000000000', ecount.resource.LBL00084],
                                ['1.0000000000', ecount.resource.LBL00085],
                                ['0.1000000000', ecount.resource.LBL00086],
                                ['0.0100000000', ecount.resource.LBL00087],
                                ['0.0010000000', ecount.resource.LBL00088]]
                               )
                        .select(self.viewBag.InitDatas.GridFirstLoad[0].PRICE_LESS))
                    .addControl(ctrl.define("widget.select", "PRICE_RISE", "PRICE_RISE")
                        .option([
                                ['R', ecount.resource.LBL01249],
                                ['C', ecount.resource.LBL02513],
                                ['F', ecount.resource.LBL02512]]
                               )
                        .select(self.viewBag.InitDatas.GridFirstLoad[0].PRICE_RISE)
                        );
            }
            else {

                control.columns(6, 6)
                    .addControl(ctrl.define("widget.select", "PRICE_LESS", "PRICE_LESS")
                        .option([
                                ['1000000.0000000000', ecount.resource.LBL00097],
                                ['100000.0000000000', ecount.resource.LBL00096],
                                ['10000.0000000000', ecount.resource.LBL00095],
                                ['1000.0000000000', ecount.resource.LBL00094],
                                ['100.0000000000', ecount.resource.LBL00093],
                                ['10.0000000000', ecount.resource.LBL00084],
                                ['1.0000000000', ecount.resource.LBL00085],
                                ['0.1000000000', ecount.resource.LBL00086],
                                ['0.0100000000', ecount.resource.LBL00087],
                                ['0.0010000000', ecount.resource.LBL00088]]
                               )
                        .select(this.P_PRICE_LESS))
                    .addControl(ctrl.define("widget.select", "PRICE_RISE", "PRICE_RISE")
                        .option([
                                ['R', ecount.resource.LBL01249],
                                ['C', ecount.resource.LBL02513],
                                ['F', ecount.resource.LBL02512]]
                               )
                        .select(this.P_PRICE_RISE)
                        );
            }
        }
    },

    onMessageHandler: function (page, message) {
        this.contents.getControl(page.controlID).setFocus(0);
    },

    // Footer Initialization
    onInitFooter: function (footer, resource) {
        var self = this;
        var infoData = self.viewBag.InitDatas;
        var permit = self.viewBag.Permission.permit;
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();

        // 수정일 경우
        if (["M"].contains(this.editFlag)) {

            // 저장
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([
               { id: "SaveNew", label: ecount.resource.BTN00765 },
               { id: "SaveContents", label: ecount.resource.BTN00067 },
            ]).clickOnce());
            toolbar.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));

            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959).css("btn btn-default")
                .addGroup([
                    { id: 'DeActivate', label: self.viewBag.InitDatas.GridFirstLoad[0].USE_YN == "Y" ? ecount.resource.BTN00204 : ecount.resource.BTN00203 },
                    { id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008)); // 닫기
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));    // 히스토리
        }

        // 추가일 경우
        else if (["I"].contains(this.editFlag)) {
            
            // 저장
            toolbar.addLeft(ctrl.define("widget.button.group", "Save").label(ecount.resource.BTN00065).addGroup([
                { id: "SaveNew", label: ecount.resource.BTN00765 },
                { id: "SaveContents", label: ecount.resource.BTN00067 },
            ]).clickOnce());

            toolbar.addLeft(ctrl.define("widget.button", "Reset").label(ecount.resource.BTN00007)); // 다시 작성
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008)); // 닫기
        }
        else {

            toolbar.addLeft(ctrl.define("widget.button", "Apply").label(ecount.resource.BTN00065)); // 저장
            toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008)); // 닫기
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));    // 기록보기
        }

        footer.add(toolbar);
    },

    onLoadComplete: function () {
        if (this.isPriceByItemCall == true) {
            this.contents.getControl("CODE_CLASS").setFocus(0);
        }
        else {
        if (this.editFlag == "I") {
            this.contents.getControl(this.CLASS_GUBUN == "1" ? "txtClassCd1" : this.CLASS_GUBUN == "2" ? "txtClassCd2" : "txtClassCd3").setFocus(0);
        }
        else {
            this.contents.getControl("CODE_CLASS").setFocus(0);
        }
        }
    },

    // When the popup is opening
    onPopupHandler: function (control, config, handler) {
        

        config.popupType = false;
        config.additional = false;

        // 품목 그룹 코드
        if (control.id === "txtClassCd1" || control.id === "txtClassCd2" || control.id === "txtClassCd3") {  // product group
            config.isApplyDisplayFlag = true;       // apply 
            config.isCheckBoxDisplayFlag = true;    // checkbox
            config.isIncludeInactive = true;        // 
        }
            // 특별 단가
        else if (control.id == "CODE_CLASS") {
            config.height = 550;
            config.titlename = control.subTitle;
            config.name = control.subTitle;
        }

        handler(config);
    },

    //검색창 자동완성시    
    onAutoCompleteHandler: function (control, keyword, parameter, handler) {
        var _self = this;

        switch (control.id) {
            case "txtClassCd1":
            case "txtClassCd2":
            case "txtClassCd3":
                parameter.CLASS_GUBUN = _self.CLASS_GUBUN;
                break;
        }
        parameter.PARAM = keyword;
        handler(parameter);
    },

    // F8 click
    ON_KEY_F8: function (e) {
        var self = this;
        if (!$.isNull(this.rowIndex)) {
            this.onFooterApply(e);
        }
        else {
            this.fnSave(e, true, true, (self.viewBag.InitDatas.GridFirstLoad == null || (self.viewBag.InitDatas.GridFirstLoad[0] == null && this.isPriceByItemCall == true)) ? "Y" : self.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
        }
    },


    // 적용
    onFooterApply: function (e) {
        // [A17_02299단가조정Null값반올림]
        if ($.isEmpty(this.contents.getControl("PRICE_RATE").getValue())) {
            this.contents.getControl("PRICE_RATE").setValue("0");
        }

        var thisObj = this;
        var formdata = this.contents.serialize().merge();//new feature
        var invalid = this.contents.validate();
        var class_cd, code_class, price_gubun, price_less, price_rate, price_rise, prod_cd, rowIndex;

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            return;
        }

        class_cd = formdata.CLASS_CD.trim();
        code_class = formdata.CODE_CLASS.trim();
        price_gubun = formdata.PRICE_GUBUN.trim();
        price_less = formdata.PRICE_LESS.trim();
        price_rate = formdata.PRICE_RATE.trim();
        price_rise = formdata.PRICE_RISE.trim();
        prod_cd = this.PROD_CD;
        rowIndex = this.rowIndex;

        //if (parseFloat(price_rate) == 0) {
        //    ecount.alert(ecount.resource.MSG01182);
        //}
        //else {
           
        //}

        var param = {
            CLASS_CD: class_cd,
            CODE_CLASS: code_class,
            PRICE_GUBUN: price_gubun,
            PRICE_RATE: price_rate,
            PRICE_LESS: price_less,
            PRICE_RISE: price_rise,
            PROD_CD: prod_cd,
            ROWINDEX: rowIndex
            ,callback: thisObj.close.bind(thisObj)
        };
        
        ecount.common.api({
            url: "/SVC/Inventory/Basic/UpdateSalePriceLevel",
            data: Object.toJSON({ Request: { Data: param }}),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    param.RESULT = result.Data;
                    thisObj.sendMessage(thisObj, param);
                }
            }.bind(this)
        });
    },

    // 저장
    onFooterSave: function (e) {
        var self = this;
        this.fnSave(e, false, true, (self.viewBag.InitDatas.GridFirstLoad == null || (self.viewBag.InitDatas.GridFirstLoad[0] == null && this.isPriceByItemCall == true)) ? "Y" : self.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    // 저장/신규
    onButtonSaveNew: function (e) {
        var self = this;
        this.fnSave(e, true, false, (self.viewBag.InitDatas.GridFirstLoad == null || (self.viewBag.InitDatas.GridFirstLoad[0] == null && this.isPriceByItemCall == true)) ? "Y" : self.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    // 저장/내용유지
    onButtonSaveContents: function (e) {
        var self = this;
        this.fnSave(e, false, false, (self.viewBag.InitDatas.GridFirstLoad == null || (self.viewBag.InitDatas.GridFirstLoad[0] == null && this.isPriceByItemCall == true)) ? "Y" : self.viewBag.InitDatas.GridFirstLoad[0].USE_YN);
    },

    // 다시작성
    onFooterReset: function () {
        debugger;
        if (this.CLASS_CD == null || this.CLASS_CD == undefined) {
        this.contents.reset();
        this.contents.getControl("CUSTOM_LAYER").get(0).setValue("1000000.0000000000");
        this.contents.getControl("CUSTOM_LAYER").get(1).setValue("R");
        }
        else {
            if (this.isPriceByItemCall == true) {
                var param = {

                    CODE_CLASS: this.CODE_CLASS,
                    CLASS_CD: this.CLASS_CD,
                    CLASS_GUBUN: this.CLASS_GUBUN,
                    editFlag: 'M',
                    CLASS_DES: this.CLASS_DES,
                    isPriceByItemCall: this.isPriceByItemCall == true ? this.isPriceByItemCall : false,
                    DES_CLASS : this.DES_CLASS

                };

            } else {

                var param = {
                    CODE_CLASS: this.CODE_CLASS,
                    CLASS_CD: this.CLASS_CD,
                    CLASS_GUBUN: this.CLASS_GUBUN,
                    editFlag: 'M',
                   

                };
            }
            this.onAllSubmitSelf("/ECERP/ESA/ESA071P_02", param);
        }
    },

    // 닫기
    onFooterClose: function () {
        this.close();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },
    // 삭제
    onButtonDelete: function (e) {

        var thisObj = this;
        var btn = thisObj.footer.get(0).getControl("deleteRestore");
        var formdata = this.contents.serialize().merge();//new feature

        var data = {
            CLASS_CD: formdata.CLASS_CD.trim(),
            CODE_CLASS: formdata.CODE_CLASS.trim()
        };
          
        ecount.confirm(ecount.resource.MSG00299, function (status) {
            if (status === true) {
                ecount.common.api({
                    url: "/SVC/Inventory/Basic/DeletePriceLevelGroup",
                    data: Object.toJSON({ Request: { Data: data } }),
                    success: function (result) {
                        if (result.Status != "200") {
                        }
                        else {
                            thisObj.sendMessage(thisObj, "Delete");
                            thisObj.setTimeout(function () {
                                thisObj.close();
                            }, 0);

                        }
                    },
                    complete: function () { btn.setAllowClick(); }
                });
            } else { btn.setAllowClick(); }
        });
    },

    // 사용중단
    onButtonDeActivate: function (e) {
        this.fnSave(e, false, true, this.viewBag.InitDatas.GridFirstLoad[0].USE_YN == "Y"?"N":"Y");
    },

    // 히스토리
    onFooterHistory: function () {
        var param = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.GridFirstLoad[0].WDATE,
            lastEditId: this.viewBag.InitDatas.GridFirstLoad[0].WID,
            parentPageID: this.pageID,  //(Pop-up when this must be declared part)
            popupType: true,             //(Pop-up when this must be declared part)
            responseID: this.callbackID  //(Pop-up when this must be declared part)
        }

        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: param,
            popupType: false
        })
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

   
    /**********************************************************************
    * define user function
    **********************************************************************/

    fnSave: function (e, isSaveNew, isDefault, isUse) {

        // [A17_02299단가조정Null값반올림]
        if ($.isEmpty(this.contents.getControl("PRICE_RATE").getValue())) {
            this.contents.getControl("PRICE_RATE").setValue("0");
        }

        var thisObj = this;
        var checkDuc = true;
        var ctrl_Code = "";
        var btn = this.footer.get(0).getControl("Save");
        var formdata = this.contents.serialize().merge();//new feature
        var class_cd, code_class, price_gubun, price_less, price_rate, price_rise;
        var invalid = this.contents.validate();

        if (this.permit.Value == "R" || (this.permit.Value == "U" && this.editFlag == "M")) {

            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06423, PermissionMode: this.editFlag == "I" ? "W" : "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        if (this.editFlag == "I") {
            ctrl_Code = this.contents.getControl(this.CLASS_GUBUN == "1" ? "txtClassCd1" : this.CLASS_GUBUN == "2" ? "txtClassCd2" : "txtClassCd3");
        }
        else {
            ctrl_Code = this.contents.getControl("CODE_CLASS");
        }

        class_cd = formdata.CLASS_CD.trim();
        code_class = formdata.CODE_CLASS.trim();
        price_gubun = formdata.PRICE_GUBUN.trim();
        price_less = formdata.PRICE_LESS.trim();
        price_rate = formdata.PRICE_RATE.trim();
        price_rise = formdata.PRICE_RISE.trim();

        //if (parseFloat(price_rate) == 0) {
        //    ecount.alert(ecount.resource.MSG01182);
        //    //thisObj.contents.getControl("PRICE_RATE").setFocus(0);
        //    btn.setAllowClick();
        //    return;
        //}
        
        var data = {
            CLASS_CD: class_cd,
            CODE_CLASS: code_class,
            PRICE_GUBUN: price_gubun,
            PRICE_RATE: price_rate,
            PRICE_LESS: price_less,
            PRICE_RISE: price_rise,
            USE_YN: isUse,
            EditFlag: "I",
            OLD_CODE_CLASS: (thisObj.viewBag.InitDatas.GridFirstLoad == null || (thisObj.viewBag.InitDatas.GridFirstLoad[0] == null && this.isPriceByItemCall == true)) ? 0 : thisObj.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS
        }

        var dataExs = {
            EDIT_FLAG: "I",
            CODE_CLASS: code_class,
            CLASS_CD: class_cd
        };

        if (invalid.result.length > 0) {
            invalid.result[0][0].control.setFocus(0);
            btn.setAllowClick();
            return;
        }

        if (this.editFlag == "I") {
            ecount.common.api({
                url: "/SVC/Inventory/Basic/InsertPriceLevelGroup",
                data: Object.toJSON({ Request: { Data: data } }),
                success: function (result) {
                    if (result.Status != "200") {
                        alert(result.fullErrorMsg);
                    } else {
                        console.log(result.Data);
                        if (result.Data == "99") {
                            ctrl_Code.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL06436));
                            ctrl_Code.setFocus(0);
                        }
                        else {
                            thisObj.sendMessage(thisObj, "Save");

                            // 기본 저장
                            if (isDefault) {
                                // 닫기
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                            // 기본 저장이 아닐경우
                            else {
                                var param = {
                                    CODE_CLASS: code_class,
                                    CLASS_CD: class_cd,
                                    CLASS_GUBUN: thisObj.CLASS_GUBUN,
                                    editFlag: isSaveNew ? 'I' : 'M'
                                };

                                thisObj.onAllSubmitSelf("/ECERP/ESA/ESA071P_02", param);
                            }
                        }
                    }
                },
                complete: function () {
                    btn.setAllowClick();
                }
            });
        }
        else if (this.editFlag == "M") {

            // 체크로직 필요
            if (thisObj.viewBag.InitDatas.GridFirstLoad[0].CODE_CLASS != code_class) {
                // Call API
                ecount.common.api({
                    url: "/Inventory/Basic/CheckExistedPriceLevelGroup",
                    async: false,
                    data: Object.toJSON(dataExs),
                    success: function (result) {
                        if (result.Status != "200") {
                            ecount.alert(result.fullErrorMsg);
                        } else {
                            if (result.Data == "1") {
                                btn.setAllowClick();

                                ctrl_Code.showError(String.format(ecount.resource.MSG08770, ecount.resource.LBL06436));
                                ctrl_Code.setFocus(0);
                                checkDuc = false;
                            }
                        }
                    }
                });
            }

            if (checkDuc) {

                ecount.common.api({
                    url: "/SVC/Inventory/Basic/UpdateStatusPriceLevel",
                    data: Object.toJSON({ Request: { Data : data } }),
                    success: function (result) {
                        if (result.Status != "200") {
                            alert(result.fullErrorMsg);
                        } else {

                            thisObj.sendMessage(thisObj, "SAVE");
                            // 기본 저장
                            if (isDefault) {
                               
                                thisObj.setTimeout(function () {
                                    thisObj.close();
                                }, 0);
                            }
                            else {
                                var param = {
                                    CODE_CLASS: code_class,
                                    CLASS_CD: class_cd,
                                    CLASS_GUBUN: thisObj.CLASS_GUBUN,
                                    editFlag: isSaveNew ? 'I' : 'M'
                                };

                                thisObj.onAllSubmitSelf("/ECERP/ESA/ESA071P_02", param);
                            }
                        }
                    },
                    complete: function () {
                        btn.setAllowClick();
                    }
                });
            }
        }
    }
});