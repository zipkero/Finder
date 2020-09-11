window.__define_resource && __define_resource("LBL15848","LBL70203","LBL11726","LBL00225","MSG01136","MSG01356","MSG05725","LBL35182","MSG05726","MSG05727","BTN00765","BTN00067","BTN00065","BTN00007","BTN00008","BTN00959","BTN00204","BTN00203","BTN00033","MSG00299","LBL07157","MSG00676");
/****************************************************************************************************
1. Create Date : 2015.10.30
2. Creator     : 전영준
3. Description : 재고>기초등록>품목등록 > 규격그룹 등록 
4. Precaution  :규격그룹검색
5. History     : 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA010P_07", {
                                                
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

    /**********************************************************************
    *  page init
    **********************************************************************/
    
    bindData: {},

    title: null,

    init: function (options) {
 
        this._super.init.apply(this, arguments);
        this.searchFormParameter = {
            CODE_CLASS: this.CODE_CLASS,
            EDIT_FLAG: this.EDIT_FLAG ? this.EDIT_FLAG: false,
            CANCEL: "N",
            UseYn:false
        }

        var data = this.viewBag.InitDatas.ListLoad.length !=0 ?this.viewBag.InitDatas.ListLoad : null

        if (this.searchFormParameter.EDIT_FLAG) {
            this.title = ecount.resource.LBL15848 + ecount.resource.LBL70203 //"규격그룹수정";
            this.bindData.CODE_CLASS = data[0].CODE_CLASS
            this.bindData.CLASS_DES = data[0].CLASS_DES
        } else {
            this.title = ecount.resource.LBL15848 + ecount.resource.LBL11726 //"규격그룹등록";
            this.bindData.CODE_CLASS = data[0].NEXT_CODE
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
            codeClassControl = ctrl.define("widget.label", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL00225)
                      .label(this.bindData.CODE_CLASS).popover(ecount.resource.LBL00225).end()
        } else {
           codeClassControl =
            ctrl.define("widget.input", "CODE_CLASS", "CODE_CLASS", ecount.resource.LBL00225).dataFilter(ecount.common.ValidCheckSpecialForCodeType)
                .filter("maxbyte", { message: String.format(ecount.resource.MSG01136, "5", "5"), max: 5 })
                .dataRules(['required'], ecount.resource.MSG01356).popover(ecount.resource.MSG05725).value(this.bindData.CODE_CLASS).end()
        }
        form.setOptions({ css: "table-layout-auto" })
            .add(codeClassControl)
            .add(ctrl.define("widget.input", "CLASS_DES", "CLASS_DES", ecount.resource.LBL35182)
                .dataRules(["required"], ecount.resource.MSG05726)
                .popover(ecount.resource.MSG05727)
                .value(this.bindData.CLASS_DES).end())
        contents.add(form);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer, resource) {
        var toolbar = widget.generator.toolbar(),
            ctrl = widget.generator.control(),
            addgroup =[]

        if (!this.EDIT_FLAG) {
            addgroup.push({ id: "SaveAndNew", label: ecount.resource.BTN00765 });
            addgroup.push({ id: "SaveReview", label: ecount.resource.BTN00067 });
        }
        toolbar.addLeft(ctrl.define("widget.button.group", "save").label(resource.BTN00065).addGroup(addgroup).clickOnce());
        toolbar.addLeft(ctrl.define("widget.button", "Rewrite").label(ecount.resource.BTN00007)); //다시작성 
        toolbar.addLeft(ctrl.define("widget.button", "close").label(resource.BTN00008));
        if (this.EDIT_FLAG) {
            toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").css("btn btn-default").label(ecount.resource.BTN00959)
                .addGroup([{ id: "Deactivate", label: this.viewBag.InitDatas.ListLoad[0].CANCEL == 'N' ? ecount.resource.BTN00204 : ecount.resource.BTN00203 },
                    { id: "delete", label: ecount.resource.BTN00033 }]).clickOnce());
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
        this.searchFormParameter.UseYn = true;
        this.searchFormParameter.CANCEL = this.viewBag.InitDatas.ListLoad[0].CANCEL == "N" ? "Y" : "N";
        this.fnSave(1); //저장(사용/사용안함,업데이트)
    },

    onFooterDeleteRestore: function (e) {
        this.footer.get(0).getControl("deleteRestore").setAllowClick();
    },

    onButtonDelete: function (e) {
        var btnDelete = this.footer.get(0).getControl("deleteRestore");
        var formData ={
            Request: {
                CODE_CLASS: this.viewBag.InitDatas.ListLoad[0].CODE_CLASS
            }
        };
       
        var strUrl = "/SVC/Inventory/Basic/DeleteGroupListForSpec";
        ecount.confirm(ecount.resource.MSG00299, function (isOk) {
            if (isOk) {
                ecount.common.api({
                    url: strUrl,
                    data: formData,
                    success: function (result) {
                        debugger
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
            
        }.bind(this));
    },

    //저장- Flag = 1
    onFooterSave: function (e) {
        this.fnClientValidation(this.fnSave.bind(this),1);
    },
    //저장/신규 Flag = 2
    onButtonSaveAndNew: function (e) {
        this.fnClientValidation(this.fnSave.bind(this),2);
    },
    //저장/내용유지 Flag = 3
    onButtonSaveReview: function (e) {
        this.fnClientValidation(this.fnSave.bind(this), 3);
    },
    //History button click event
    onFooterHistory: function (e) {
        var params = {
            width: 450,
            height: 150,
            lastEditTime: this.viewBag.InitDatas.ListLoad[0].WDATE,
            lastEditId:  this.viewBag.InitDatas.ListLoad[0].WID,
            parentPageID: this.pageID,
            responseID: this.callbackID
        };

        // Open popup
        this.openWindow({
            url: '/ECERP/Popup.Search/CM100P_31',
            name: ecount.resource.LBL07157,
            param: params,
            popupType: false,
            additional: false
        });
    },
    // [Save] and [Save & New] [Save & Review],[onButtonActivate],[onButtonDeactivate] button function
    fnSave: function (isSaveNew) {

        var thisObj = this;
   
        var formData = Object.toJSON({
            Request: {
                Data: {
                    CODE_CLASS: this.contents.getControl('CODE_CLASS').getValue(),
                    CLASS_DES: this.contents.getControl('CLASS_DES').getValue(),
                    CANCEL: this.searchFormParameter.CANCEL
                },
                EDIT_FLAG: (function () {
                    if (this.searchFormParameter.UseYn) {
                        return "S";
                    } else {
                        return this.EDIT_FLAG == true ? "M" : "I"
                    }
                }.bind(this)())
               }
            });
            ecount.common.api({
                url: "/SVC/Inventory/Basic/InsertSpecgroupCode",
                async: true,
                data: formData,
                success: function (result) {

                    if (result.Status === "200" && result.Data == "1") {
                        alert(ecount.resource.MSG00676);  //"이미등록된코드 입니다."
                        this.buttonRefresh();
                        return false;
                    }
                    //thisObj.sendMessage(thisObj, "SaveSuccess");
                    thisObj.sendMessage(thisObj, "SaveSuccess");
                    param = {
                        Edit_flag: this.searchFormParameter.Edit_flag,
                        CODE_CLASS: "L06"
                    }
                    if (isSaveNew === 1) {
                        //저장
                        this.setTimeout(function () {
                            thisObj.close();
                        }, 0);
                    } else {
                        var url = "/Inventory/Basic/GetSpecGroupAutoCode"
                        var formData = JSON.stringify(param);
                        ecount.common.api({
                            url: url,
                            data: formData,
                            success: function (result) {
                                this.contents.getControl("CODE_CLASS").setValue(result.Data[0].NEXT_CODE);
                                if (isSaveNew == 2) {
                                    this.contents.getControl("CLASS_DES").setValue("");
                                }
                                this.buttonRefresh();
                            }.bind(this)
                        });
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
                this.contents.getControl(invalid.result[i][0].control.id).showError(invalid.result[i][0].message);
            }
            this.footer.getControl('save').setAllowClick();
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
            callPageName: "ESA010P_07",
            __ecPage__: "",
            _ecParam__: "",
            isPopFlag: "Y",
            EDIT_FLAG: this.EDIT_FLAG,
            CODE_CLASS: this.contents.getControl("CODE_CLASS").getValue()
        };
        this.onAllSubmitSelf("/ECERP/ESA/ESA010P_07", param, "details");
    },
    /**********************************************************************
    *  페이지 기능
    **********************************************************************/

    buttonRefresh: function () {
      
        this.contents.getControl("CODE_CLASS").setFocus(0);
        this.footer.getControl('save').setAllowClick();
    },

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
    //F8 적용
    ON_KEY_F8: function () {
        this.onFooterSave();
    },
    //엔터
    ON_KEY_ENTER: function (e, target) {
       // this.onContentsSearch(target.control.getValue());
    },


});
