window.__define_resource && __define_resource("LBL06441","LBL10126","LBL02920","MSG00263","LBL05595","BTN00028","BTN00008","LBL06446","MSG00262");
/****************************************************************************************************
1. Create Date : 2015.09.25
2. Creator     : 조영상
3. Description : 제고1 > 기초등록 > 품목그룹별 복사
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/


ecount.page.factory("ecount.page.popup.type2", "ESA071P_03", {
    header: null,

    contents: null,

    footer: null,

    off_key_esc: true,

    permit: null,

    //ecConfig: ["config.inventory", "config.company", "config.user", "company", "user"],
    /**************************************************************************************************** 
     * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/



    /********************************************************************** 
   * page init   Class inheritance , init, render etc
   **********************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);  // Perform basic logic defined in the parent class init
        this.searchFormParameter = { PARAM: "", CODE_CLASS: this.codeClass };
        //console.log(this.searchFormParameter)

        this.permit = this.viewBag.Permission.Permit;
    },

    render: function () {
        this._super.render.apply(this);
    },


    /********************************************************************************************************
        * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        header.setTitle(ecount.resource.LBL06441)

              .notUsedBookmark()
    },


    onInitContents: function (contents, resource) {

        var g = widget.generator,
        form = widget.generator.form();
        var ctrl = widget.generator.control();

        form.template("register")
        .add(ctrl.define("widget.multiCode.priceGroup", "COPY_FR", "COPY_FR", ecount.resource.LBL10126 + ecount.resource.LBL02920)
            .dataRules(["required"], ecount.resource.MSG00263)
            .maxSelectCount(1).end())
        .add(ctrl.define("widget.multiCode.priceGroup", "class_des_to", "class_des_to", ecount.resource.LBL05595 + ecount.resource.LBL02920)
            .dataRules(["required"], ecount.resource.MSG00263)
            .maxSelectCount(1).end())
        contents.add(form)
    },


    //setting Footer option
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Copy").label(ecount.resource.BTN00028));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008));

        footer.add(toolbar);
    },

    onLoadComplete: function () {
        this.contents.getControl("COPY_FR").setFocus(0);
    },

    /**************************************************************************************************** 
       * define common event listener
   ****************************************************************************************************/
    onPopupHandler: function (control, config, handler) {
        //if (control.id == "COPY_FR") {
        //config.keyword = this.contents.getControl("COPY_FR").getValue();
        //}
        //else {
        //    config.keyword = this.contents.getControl("class_des_to").getValue();
        //}

        config.parentPageID = this.pageID;
        config.popupType = false;
        config.titlename = control.subTitle;



        config.additional = false;
        config.name = control.subTitle;

        handler(config);
    },

    // ENTER
    ON_KEY_ENTER: function (e, target) {
        // Set focus for Copy button
        if (target != null && (target.cid == "COPY_FR" || target.cid == "class_des_to")) {
            this.footer.get(0).getControl("Copy").setFocus(0);
            e.preventDefault();
        }
    },

    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'CM020P' && page.titlename != undefined) {

            if (page.titlename == ecount.resource.LBL05595 + ecount.resource.LBL02920) {
                this.contents.getControl('class_des_to').addCode({
                    label: message.data.CLASS_DES, value: message.data.CODE_CLASS
                });
            }
            else {
                this.contents.getControl('COPY_FR').addCode({
                    label: message.data.CLASS_DES, value: message.data.CODE_CLASS
                });
            }


            message.callback && message.callback();  // The popup page is closed    
        };
    },


    /**************************************************************************************************** 
       * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
       * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    ****************************************************************************************************/
    onFooterClose: function () {
        this.close();
    },


    onFooterCopy: function () {

        var btn = this.footer.get(0).getControl("Copy")

        if (this.permit.Value == "R") {
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL06446, PermissionMode: "U" }]);
            ecount.alert(msgdto.fullErrorMsg);
            btn.setAllowClick();
            return false;
        }

        var invalid = this.contents.validate();
        if (invalid.result.length > 0) {

            this.contents.getControl("COPY_FR").setFocus(0);
            btn.setAllowClick();
            return;
        }
        var thisObj = this;

        var code_class_fr = this.contents.getControl("COPY_FR").getSelectedCode()[0];
        var code_class_to = this.contents.getControl("class_des_to").getSelectedCode()[0];

        if (code_class_fr == code_class_to) {
            this.contents.getControl("COPY_FR").showError(ecount.resource.MSG00262)
            this.contents.getControl("COPY_FR").setFocus(0);
            return
        }

        var data = {
            CODE_CLASS_FROM: code_class_fr,
            CODE_CLASS_TO: code_class_to,
            objCopy: {
            }
        }
        ecount.common.api({
            url: "/SVC/Inventory/Basic/CopyPriceLevelByGroup",
            data: JSON.stringify({ Request: { Data : data } }),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    thisObj.sendMessage(thisObj, "Copy");
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            },
            complete: function () {
                btn.setAllowClick();
            }
        });
    },

})