window.__define_resource && __define_resource("LBL07914","LBL00847","BTN00863","BTN00008","LBL01519","MSG00524","MSG00205","MSG30015","MSG00609","MSG00392");
/****************************************************************************************************
1. Create Date : 2017.02.24
2. Creator     : 서득서
3. Description : Self-Customizing > Data Management > Geroupware > Board
4. Precaution  : 
5. History     : 2017.11.29: (Thai) Modify for Schedule
****************************************************************************************************/

ecount.page.factory("ecount.page.popup.type2", "EMV003M", {

    header: null,
    contents: null,
    footer: null,

    /**************************************************************************************************** 
    * user opion Variables(사용자변수 및 객체) 
    ****************************************************************************************************/
    countLimit: 30000,
    errorList: [],

    /********************************************************************** 
    * page initialize
    **********************************************************************/
    // init
    init: function () {
        this._super.init.apply(this, arguments);
        this.initProperties();
    },

    initProperties: function () {
        this.data = this.viewBag.InitDatas.Data;
    },

    // render
    render: function () {
        this._super.render.apply(this, arguments);
    },

    /********************************************************************** 
    * UI Layout setting
    **********************************************************************/

    // Header Initialization
    onInitHeader: function (header) {
        header.notUsedBookmark().setTitle(ecount.resource.LBL07914);
    },

    // Contents Initialization
    onInitContents: function (contents) {
        var g = widget.generator,
            ctrl = g.control(),
            form = g.form(),
            controls = [];

        form.template("register")
            .useInputForm();

        controls.push(ctrl.define("widget.custom", "custom1", "custom1", this.itemName).end());
        controls.push(ctrl.define("widget.multiDate", "dateFromTo", "dateFromTo", ecount.resource.LBL00847).end());

        form.addControls(controls);

        contents.add(form);
    },

    // Footer Initialization
    onInitFooter: function (footer) {
        var toolbar = widget.generator.toolbar(),
           ctrl = widget.generator.control();

        if ((["64", "65"].contains(this.itemId) && this.viewBag.InitDatas.boardList.length > 0) || !["64", "65"].contains(this.itemId)) {
            toolbar.addLeft(ctrl.define("widget.button", "Backup").label(ecount.resource.BTN00863).clickOnce());
        }

        toolbar.addLeft(ctrl.define("widget.button", "Close").label(ecount.resource.BTN00008).clickOnce());
        footer.add(toolbar);
    },

    /**********************************************************************
    * define common event listener
    **********************************************************************/

    onInitControl: function (cid, control) {
        if (cid == "custom1") {
            var ctrl = widget.generator.control();

            if (["64", "65"].contains(this.itemId)) {
                if (this.viewBag.InitDatas.boardList.length > 0) {
                    control.addControl(ctrl.define("widget.select", "boardCd", "boardCd", ecount.resource.LBL01519).option(this.viewBag.InitDatas.boardList).end())
                           .addControl(ctrl.define("widget.label", "label1", "label1", "label1").label(String.format(ecount.resource.MSG00524, this.countLimit)).css("text-warning").end());
                } else {
                    control.addControl(ctrl.define("widget.label", "label1", "label1", "label1").label(ecount.resource.MSG00205).css("text-warning").end());
                }
            } else if(this.itemId == "68") {
                control.addControl(ctrl.define("widget.label", "label1", "label1", "label1").label(this.itemName2).multiLine().end())
                       .addControl(ctrl.define("widget.label", "label2", "label2", "label2").label(String.format(ecount.resource.MSG00524, this.countLimit)).css("text-warning").end());
            } else if (this.itemId == "69") {
                control.addControl(ctrl.define("widget.label", "label1", "label1", "label1").label(this.itemName2).multiLine().end())
                       .addControl(ctrl.define("widget.label", "label2", "label2", "label2").label(String.format(ecount.resource.MSG00524, this.countLimit)).css("text-warning").end());
            }
            else {
                control.addControl(ctrl.define("widget.label", "label1", "label1", "label1").label(ecount.resource.MSG00205).css("text-warning").end());
            }
        }
    },

    // After the document loaded
    onLoadComplete: function () {
    },

    // Completion event Grid load
    onGridRenderComplete: function (e, data, gridObj) {
        ecount.page.popup.prototype.onGridRenderComplete.apply(this, arguments);
    },

    // Popup Handler for popup
    onPopupHandler: function (control, params, handler) {
    },

    /********************************************************************** 
    *  define hotkey event listener
    **********************************************************************/

    // F8 click
    ON_KEY_F8: function (e) {
    },

    /********************************************************************** 
    * define grid event listener
    **********************************************************************/

    /********************************************************************** 
    * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
    * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
    **********************************************************************/

    // Footer Apply
    onFooterBackup: function (e) {
        var _self = this;
        var btnBackup = this.footer.get(0).getControl("Backup");
        var dateFromTo = this.contents.getControl("dateFromTo", "details").getDate();
        var sessionKey = window.requestUrl.param["ec_req_sid"] + Date.now();

        var data = {
            pageSessionKey: sessionKey,
            itemId: this.itemId,
            itemName: this.itemName,
            itemName2: this.itemName2,
            sheetName: this.itemName2,
            WRITE_DT_FROM: dateFromTo[0].format("yyyy-MM-dd"),
            WRITE_DT_TO: dateFromTo[1].format("yyyy-MM-dd"),
            CountLimit: this.countLimit,
            callback: function () {
                ecount.common.hideProgressbar(true);
                btnBackup.setAllowClick();
                _self.alertErrorList();
            }
        };

        if (["64", "65"].contains(this.itemId)) {
            var boardInfo = this.contents.getControl("custom1").get(0).getSelectedItem();
            data.BOARD_CD = boardInfo.value;
            data.itemName2 = boardInfo.label;
            data.sheetName = boardInfo.label;
        }

        btnBackup.setAllowClick();
        this.convertZip(data);
    },

    convertZip: function (data) {
        var self = this;
        ecount.common.showProgressbar(true);

        ecount.common.api({
            url: "/SelfCustomize/DataManagement/GetZipGroupware",
            data: data,
            success: function (result) {
                if (result.Data.ErrorMsg == "") {
                    // 파일 완료 여부 체크: 4초에 한번씩 체크
                    setTimeout(function () {
                        self.errorList = result.Data.ErrorList;
                        self.checkConvertZip(result.Data, data.callback);
                    }, 4000);
                } else {
                    ecount.alert(result.Data.ErrorMsg, function () {
                        data.callback()
                    });
                }
            }
        });
    },

    checkConvertZip: function (result, callback) {
        var self = this;
        var fileNames = {
            FileName: result.FileName,
            DownFileName: result.DownFileName
        };

        var startTime = Date.now();
        var checkFunc = function () {
            var timeSpan = (Date.now() - startTime) / 1000;

            if (timeSpan >= 120) {
                ecount.alert("COMPRESS_ZIP_TIMEOUT", function () {
                    callback();
                });
                return;
            }

            if (!result || !result.FileName) {
                ecount.alert("COMPRESS_ZIP_ERROR_1", function () {
                    callback();
                });
                return;
            }

            self.checkFileStatus(fileNames, function (result) {
                if (result.Data == "START_MAKING_ZIP") {
                    // 파일 완료 여부 체크: 4초에 한번씩 체크
                    setTimeout(function () {
                        checkFunc();
                    }, 4000);
                } else if (result.Data == "END_MAKING_ZIP") {
                    self.downLoadFile(fileNames, callback);
                } else {
                    ecount.alert("COMPRESS_ZIP_ERROR_2", function () {
                        callback();
                    });
                    return;
                }
            }, callback);
        };

        checkFunc();
    },

    checkFileStatus: function (fileNames, callback, errCallback) {
        var _self = this;
        var data = fileNames;

        ecount.common.api({
            url: "/SelfCustomize/DataManagement/CheckZipFile",
            data: data,
            error: function () {
                ecount.alert("Web server error : checkFileStatus", function () {
                    errCallback();
                });
                return;
            },
            success: function (result) {
                if (callback) {
                    callback(result);
                }
            }
        });
    },

    downLoadFile: function (fileNames, callback) {
        var _self = this;
        var url = "/SelfCustomize/DataManagement/DownloadZipFile";

        var ifrmExcel = $("#ifrmExcel");
        if (ifrmExcel.length == 0) {
            $("body").append($("<iframe id=\"ifrmExcel\" name=\"ifrmExcel\" style=\"width:0px; height:0px;border:0\" class=\"hidden\"></iframe>"));
        }
        var form = $("#__ecSubmitForm");
        if (form.length == 0) {
            form = $("<form id=\"__ecSubmitForm\" method=\"POST\"/>");
            $("body").append(form);
        } else {
            form.empty();
        }

        if (!url.startsWith("http") && !url.startsWith(ecount.apiPathRoot)) {
            url = ecount.apiPathRoot + url;
        }
        form.append($("<input type=\"hidden\" name=\"jsonp\"/>").val(Object.toJSON(fileNames)));
        form.attr("action", ecount.common.buildSessionUrl(url) + "&xct=jsonp&jscb=ecount.parentFrame.ecount.document.exceptionCallback");
        form.attr("method", "post");
        form.attr("target", "ifrmExcel");
        form.submit();

        if (callback) {
            callback();
        }
    },

    alertErrorList: function () {
        if (this.errorList.length > 0) {
            var errorMsg = [];
            errorMsg.push(ecount.resource.MSG30015 + "\n");

            $.each(this.errorList, function (i, item) {
                switch(item.errorCode){
                    case "F01":
                        errorMsg.push(item.errorData + " : " + ecount.resource.MSG00609);
                        break;
                    default:
                        errorMsg.push(item.errorData + " : " + ecount.resource.MSG00392);
                        break;
                }
            });

            ecount.alert(errorMsg.join("\n"));
        }
    },

    //Close button click event
    onFooterClose: function () {
        this.close();
    }

});