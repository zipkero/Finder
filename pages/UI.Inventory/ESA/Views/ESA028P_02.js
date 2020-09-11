window.__define_resource && __define_resource("LBL02920","LBL06441","LBL03017","MSG00631","LBL09895","MSG00263","LBL09896","BTN00028","BTN00008","LBL06446","MSG00262");
/****************************************************************************************************
1. Create Date : 2015.25.05
2. Creator     : HUY VO
3. Description : Inv.I > Setup > Price Level By Group >> Copy
4. Precaution  :
5. History     : [2016.03.23] 최용환 : 소스리팩토링 나머지 적용(판매 관련 외) 작업
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "ESA028P_02", {

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
        // var objthis = this;

        this.permit = this.viewBag.Permission.permitESA028P_02;

    },

    render: function () {
        this._super.render.apply(this);
    },


    /********************************************************************************************************
        * UI Layout setting
    ****************************************************************************************************/
    onInitHeader: function (header, resource) {
        //header.setTitle(this.resource.LBL02920)
        header.setTitle(this.viewBag.Resource.LBL06441)

              .notUsedBookmark()
    },


    onInitContents: function (contents, resource) {

        var g = widget.generator,
        form = widget.generator.form();
        var ctrl = widget.generator.control();

        form.template("register")
            //.add(ctrl.define("widget.code.prod", "code_class_fr", "code_class_fr", viewBag.Resource.LBL03017).popover(resource.MSG00631).dataRules(["required"], resource.MSG00631).end())
        .add(ctrl.define("widget.multiCode.priceGroup", "COPY_FR", "COPY_FR", resource.LBL09895)
            .dataRules(["required"], resource.MSG00263)
            .maxSelectCount(1).end())
        //.add(ctrl.define("widget.custom", "COPY_TO", "COPY_TO", resource.LBL09896).end());
        .add(ctrl.define("widget.label", "class_des_to", "class_des_to", resource.LBL09896)
            .label(this.classDes)
            .end());
        contents.add(form)
    },


    //setting Footer option
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
        ctrl = widget.generator.control();
        toolbar.addLeft(ctrl.define("widget.button", "Copy").label(this.resource.BTN00028));
        toolbar.addLeft(ctrl.define("widget.button", "Close").label(this.resource.BTN00008));

        footer.add(toolbar);
    },

    // Controls Initialization
    //onInitControl: function (cid, option) {
    //    var thisObj = this;
    //    var ctrl = widget.generator.control();
    //    console.log(cid);
    //    console.log(this.codeClass)
    //    if (cid == "COPY_TO") {
    //        option.columns(5, 7)
    //            .addControl(ctrl.define("widget.label", "code_class_to", "code_class_to").label(this.codeClass))
    //            .addControl(ctrl.define("widget.label", "class_des_to", "class_des_to").label(this.classDes));
    //    }
    //},

    onLoadComplete: function () {
        this.contents.getControl("COPY_FR").setFocus(0);
    },



    /**************************************************************************************************** 
       * define common event listener
   ****************************************************************************************************/
    onPopupHandler: function (control, config, handler) {
        if (control.id == "COPY_FR") {
            config.keyword = this.contents.getControl("COPY_FR").getValue();
            config.parentPageID = this.pageID;
            config.popupType = true;
            config.responseID = this.callbackID;
            config.titlename = control.subTitle;
        }
        handler(config);
    },

    // Message Handler
    onMessageHandler: function (page, message) {
        if (page.pageID == 'CM020P') {
            this.contents.getControl("COPY_FR").addCode({
                label: message.data.CLASS_DES, value: message.data.CODE_CLASS
            });

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
            var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: this.viewBag.Resource.LBL06446, PermissionMode: "U" }]);
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

        //var code_class_fr = this.contents.getControl("COPY_FR").getValue();
        var code_class_fr = this.contents.getControl("COPY_FR").getSelectedCode()[0];
        //if (code_class_fr == '' || $.isNull(code_class_fr))
        //{
        //    this.contents.getControl("COPY_FR").showError(viewBag.Resource.MSG00263)
        //    this.contents.getControl("COPY_FR").setFocus(0);
        //    return
        //}


        if (code_class_fr == this.codeClass) {
            this.contents.getControl("COPY_FR").showError(this.viewBag.Resource.MSG00262)
            this.contents.getControl("COPY_FR").setFocus(0);
            return
        }

        var data = {
            CODE_CLASS_FROM: code_class_fr,
            CODE_CLASS_TO: this.codeClass,
            objCopy: {
            }
        }
        ecount.common.api({
            url: "/Inventory/Basic/CopyPriceLevelByGroup",
            //async: false,
            data: JSON.stringify(data),
            success: function (result) {
                if (result.Status != "200") {
                    alert(result.fullErrorMsg);
                } else {
                    thisObj.sendMessage(thisObj, "Copy");
                    //thisObj.close();
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