window.__define_resource && __define_resource("LBL35181","LBL70203","LBL11726","MSG01136","MSG05728","LBL13760","MSG05726","BTN00765","BTN00067","BTN00065","BTN00007","BTN00008","BTN00959","BTN00204","BTN00203","BTN00033","MSG00299","LBL07157","MSG00676");
/****************************************************************************************************
1. Create Date : 2015.11.02
2. Creator     : 전영준
3. Description : 재고>기초등록>품목등록 > 규격코드 등록, 수정(단건조회)
4. Precaution  :규격코드 등록, 수정
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_09", {
                                                
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/

    bindData: {},

    title: null,

    CodeValues:{},

    init: function (options) {
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CODE_CLASS: this.CODE_CLASS,
            EDIT_FLAG: this.EDIT_FLAG ? this.EDIT_FLAG : false, //팝업 기준(형태 표시)
            CODE_NO: this.CODE_NO,
            CANCEL: "Y", // DEFAULT : Y(사용중)
            SP_EDIT_FLAG: "S", // SP저장기준 PARAM   S: 재사용, 사용중단, D : 삭제, I: 저장, 수정, M: 코드명 변경

        }
        if (this.searchFormParameter.EDIT_FLAG) {
            this.title = ecount.resource.LBL35181 + ecount.resource.LBL70203 //"규격코드수정";
            this.bindData.CODE_CLASS = this.viewBag.InitDatas.ListLoad[0].CODE_CLASS
            this.bindData.SIZE_DES = this.viewBag.InitDatas.ListLoad[0].SIZE_DES
        } else {
            this.title = ecount.resource.LBL35181 + ecount.resource.LBL11726  //""규격코드등록";
        }
    },

    render: function () {

        this._super.render.apply(this);
    },

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
    //헤더 옵션 설정
    onInitHeader: function (header, resource) {
        header.notUsedBookmark();        
            header.setTitle(this.title)
    },
    //본문 옵션 설정
    onInitContents: function (contents, resource) {
     
        var form = widget.generator.form(),
            ctrl = widget.generator.control(),
            codeClassControl = null;

        if (this.EDIT_FLAG) {
            codeClassControl = ctrl.define("widget.label", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL35181) //"규격코드"
                      .label(this.CODE_NO).popover(ecount.resource.LBL35181).end() //"규격코드"
        } else {
           codeClassControl =
            ctrl.define("widget.input", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL35181).dataFilter(ecount.common.ValidCheckSpecialForCodeType)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "5", "5"), max: 5 })
                .dataRules(['required'], ecount.resource.MSG05728).popover(ecount.resource.MSG05728).value(this.bindData.CLASS_DES).end()
        }
        form.setOptions({ css: "table-layout-auto" })
            .add(codeClassControl)
            .add(ctrl.define("widget.input", "CLASS_DES", "CLASS_DES", ecount.resource.LBL13760).dataRules(["required"], ecount.resource.MSG05726).popover(ecount.resource.MSG05726).value(this.bindData.SIZE_DES).end())
        contents.add(form);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup = []

        if (!this.EDIT_FLAG) {
            addgroup.push({ id: "SaveAndNew", label: ecount.resource.BTN00765 });
            addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        }
        toolbar.addLeft(ctrl.define("widget.button.group", "save").label(resource.BTN00065).addGroup(addgroup));
        toolbar.addLeft(ctrl.define("widget.button", "Rewrite").label(ecount.resource.BTN00007));//다시작성 
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));

        if (this.EDIT_FLAG) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").css("btn btn-default").label(ecount.resource.BTN00959)
                .addGroup([
                    { id: "Deactivate", label: this.viewBag.InitDatas.ListLoad[0].CANCEL == "N" ? ecount.resource.BTN00204 : ecount.resource.BTN00203 },//재사용 / 사용중단
                    { id: "delete", label: ecount.resource.BTN00033 }
            ]).clickOnce());               
            toolbar.addLeft(ctrl.define("widget.button", "History").label("H"));
        }
        footer.add(toolbar);
    },

    /**********************************************************************
    * event form listener [tab, content, search, popup ..]
    **********************************************************************/
    onLoadComplete: function () {
       
    },
    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/

    onButtonDeactivate: function (e) {

        this.searchFormParameter.CANCEL = this.viewBag.InitDatas.ListLoad[0].CANCEL == "N"? "Y":"N";
        this.searchFormParameter.SP_EDIT_FLAG = "S";
        this.fnSubmit();
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    //선택삭제
    onButtonDelete: function (cid) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var formData = Object.toJSON({
            CODE_NO_LIST: this.viewBag.InitDatas.ListLoad[0].CODE_NO,
            CODE_CLASS: this.viewBag.InitDatas.ListLoad[0].CODE_CLASS
        });
        var strUrl = "/Inventory/Basic/DeleteCodeListForSpec";

        if (confirm(ecount.resource.MSG00299)) {
            ecount.common.api({
                url: strUrl,
                async: false,
                data: formData,
                success: function (result) {
                    if (result.Status != "200") {
                        ecount.ecount.alert(result.fullErrorMsg);
                    } else {
                        this.sendMessage(this, { callback: this.close.bind(this) });
                    }
                }.bind(this),
                complete: function () {
                    btnDelete.setAllowClick();
                }
            });
        } else {
            btnDelete.setAllowClick();
        }
    },

    fnSubmit: function () {
        var thisObj = this;
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        strUrl = "/Inventory/Basic/SaveSpecCodeForSALE008";
        formData = Object.toJSON({
            CODE_CLASS: this.searchFormParameter.CODE_CLASS,
            CODE_NO: this.searchFormParameter.CODE_NO,
            CANCEL: this.searchFormParameter.CANCEL,
            SIZE_DES: this.contents.getControl("CLASS_DES").getValue(),
            EDIT_FLAG: this.searchFormParameter.SP_EDIT_FLAG
        });
        ecount.common.api({
            url: strUrl,
            async: true,
            data: formData,
            success: function (result) {
                if (result.Status != "200") {
                    ecount.alert(result.fullErrorMsg);
                } else {
                    thisObj.sendMessage(thisObj, "Save");
                    this.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                }
            }.bind(this),
            complete: function () {
                btnDelete.setAllowClick();
            }
        });
    },

    // 히스토리
    onFooterHistory: function (e) {
 
        var param = {
            lastEditTime: this.viewBag.InitDatas.ListLoad.length != 0 ? this.viewBag.InitDatas.ListLoad[0].WDATE : null, // datetime, // datetime
            lastEditId: this.viewBag.InitDatas.ListLoad.length != 0 ? this.viewBag.InitDatas.ListLoad[0].WID : null,      //id
            parentPageID: this.pageID,
            popupType: true,
            responseID: this.callbackID,
            width: 450,
            height: 150
        };
        this.openWindow({ url: '/ECERP/Popup.Search/CM100P_31', name: ecount.resource.LBL07157, param: param, popupType: false, additional: false });
    },

    //저장/신규 Flag = 1
    onFooterSave: function (e) {

        this.fnClientValidation(this.fnSave.bind(this), 1);
    },
    //저장/신규 Flag = 2
    onButtonSaveAndNew: function (e) {
        this.fnClientValidation(this.fnSave.bind(this), 2);
    },
    //저장/내용유지 Flag = 3
    onButtonSaveReview: function (e) {
        this.CodeValues.CODE_CLASS = this.contents.getControl("CODE_CLASS").getValue();
        this.CodeValues.CODE_DES = this.contents.getControl("CLASS_DES").getValue();
        this.fnClientValidation(this.fnSave.bind(this), 3);
    },
    // [Save] and [Save & New] button function
    fnSave: function (isSaveNew) {

            var thisObj = this,
                formData = Object.toJSON({
                CODE_CLASS: this.CODE_CLASS,
                CODE_NO: this.contents.getControl('CODE_CLASS').getValue(),
                SIZE_DES: this.contents.getControl('CLASS_DES').getValue(),
                EDIT_FLAG: this.EDIT_FLAG==true? "M":"I",
                CANCEL: "N"
            });

        ecount.common.api({
            url: "/Inventory/Basic/SaveSpecCodeForSALE008",
            async: true,
            data: formData,
            success: function (result) {

                if (result.Status === "200" && result.Data == 1) {
                    alert(ecount.resource.MSG00676);  //"이미등록된코드 입니다."
                    this.contents.getControl("CODE_CLASS").setFocus(0);
                    return false;
                }
              
                thisObj.sendMessage(thisObj, "SaveSuccess");

                if (isSaveNew === 1) {
                    //저장
                    thisObj.setTimeout(function () {
                        thisObj.close();
                    }, 0);
                } else {
                    if (isSaveNew == 2) {
                        this.contents.getControl("CODE_CLASS").setValue("");
                        this.contents.getControl("CLASS_DES").setValue("");
                        this.contents.getControl("CODE_CLASS").setFocus(0);
                    } else {

                        this.contents.getControl("CODE_CLASS").setValue(this.CodeValues.CODE_CLASS);
                        this.contents.getControl("CODE_CLASS").setFocus(0);
                        this.contents.getControl("CODE_DES").setValue(this.CodeValues.CODE_DES);
                    }
                }
            }.bind(this)
        });
    },
    //Handle to callback the fnSave
    fnClientValidation: function (callback, isSave) {
        
        var invalid = this.contents.validate();
        
        if (invalid.result.length == 0) {
            callback(isSave);
        } else {
            for (var i = 0, len = invalid.result.length; i < len; i++) {
                ;
                this.contents.getControl(invalid.result[i][0].control.id).showError(invalid.result[i][0].message);
            }
            return;
        }
    },
    //닫기버튼
    onFooterClose: function () {

        this.close();
        return false;
    },
    //다시작성 버튼
    onFooterRewrite: function () {
        var param = {
            width: 600,
            height: 200,
            isOpenPopup: true,
            callPageName: "ESA010P_09",
            __ecPage__: "",
            _ecParam__: "",
            isPopFlag: "Y",
            EDIT_FLAG: this.EDIT_FLAG,
            CODE_CLASS: this.CODE_CLASS,
            CODE_NO: this.CODE_NO
        };
        this.onAllSubmitSelf("/ECERP/ESA/ESA010P_09", param, "details");
    },
    /**********************************************************************
    *  event listener  ==>  [grid]
    **********************************************************************/

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
      //  this.onContentsSearch(target.control.getValue());
    },

});
