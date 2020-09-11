window.__define_resource && __define_resource("LBL01495","LBL00361","LBL05499","LBL05500","BTN00220","BTN00315","LBL05501","LBL05503","LBL05504","MSG01794","LBL05505","LBL05506","MSG01795","LBL04959","LBL01432","LBL01595","LBL01506","LBL01710","LBL03067","LBL02765","LBL03657","MSG01796","BTN00173","BTN00008","MSG00213","MSG10009","MSG10007","MSG00340","MSG00260","MSG06645","LBL11306","MSG06616","LBL90071");
/*************************************************************************************************
1. Create Date  : 2016.10.25
2. Creator      : 양미진
3. Description  : 회계1 > 기초등록 >  거래처등록 > SMS
						회계1 > 기초등록 >  사원등록 > SMS
						재고1 > 출력물 > 채권/채무 현황 > 채권 > SMS
4. Precaution   : 
5. History      : 2018.03.20(김우정) : A18_00600 메일발송화면에서 SMS발송 시 메뉴타입 정리
                                       setMenuType- 채권현황, 사원문자발송 returnValue 변경
6. Old File     : ESA/ESA025M.aspx
****************************************************************************************************/

ecount.page.factory("ecount.page.list", "ECC002M", {
    /********************************************************************** 
	* page user opion Variables(사용자변수 및 객체)  
	**********************************************************************/

    /**************************************************************************************************** 
	* page initialize
	****************************************************************************************************/
    init: function (options) {
        this._super.init.apply(this, arguments);
        this.initProperties();
    }, 

    initProperties: function () {
        this.ButtonCnt = 0;
    },

    render: function () {
        this._super.render.apply(this);
    },

    /**********************************************************************
	* form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
	**********************************************************************/
    //헤더 옵션 설정(Header Option Setup)
    onInitHeader: function (header) {
        var title = "";

        switch (this.smsType) {
            case "I":
                //사원문자발송
                title = ecount.resource.LBL01495;
                break;
            case "C":
                //거래처문자발송
                title = ecount.resource.LBL00361;
                break;
            case "M":
                //회원문자발송
                title = ecount.resource.LBL05499;
                break;
            case "S":
                //미수금문자발송
                title = ecount.resource.LBL05500;
                break;
            case "T":
                //서비스구분출력 - 미수금문자발송 -> 카카오로 수정 
                title = "Notify Receivables by KaKao" 
                break;

                
        }

        header.notUsedBookmark();
        header.setTitle(title);
    },


    //본문 옵션 설정
    onInitContents: function (contents) {
        var g = widget.generator,
			toolbar = g.toolbar(),
			grid = g.grid(),
			form = g.form(),
			form1 = g.form(),
			ctrl = g.control(),
			columns = [],
			checked = [],
			controls = new Array();
        var decAMT = String.format('9{0}', ecount.config.company.DEC_AMT);

        toolbar
            .setOptions({ css: "btn btn-default btn-sm", ignorePrimaryButton: true })
            .addRight(ctrl.define("widget.label", "balance").label(this.dEmoneyMsg))
            .addRight(ctrl.define("widget.button", "charge").label(ecount.resource.BTN00220))
            .addRight(ctrl.define("widget.button", "detail").label(ecount.resource.BTN00315));

        if (this.smsType == "S") {
            controls.push(ctrl.define("widget.radio", "sendStandard", "sendStandard", ecount.resource.LBL05501)
				.label([ecount.resource.LBL05503, ecount.resource.LBL05504])
				.popover(ecount.resource.MSG01794.replace(/\n/g, "<br />"))
				.value(["1", "2"])
				.select("1")
				.multiCell(2).end());
            controls.push(ctrl.define("widget.input.number", "sendNumber", "sendNumber", ecount.resource.LBL05505).maxLength(20).value($.isEmpty(this.telNo) ? this.senderHP : this.telNo).end());
            controls.push(ctrl.define("widget.combine.textareaLink", "sendMessage", "sendMessage", ecount.resource.LBL05506)
				.filter("maxbyte", { max: 2000 })
				.value(this.sendComment)
				.popover(ecount.resource.MSG01795.replace(/\n\n/g, "<br />").replace(/\n/g, "<br />"))
				.end());
        } else {
            //서비스구분출력에서는 고객센터 모바일번호를 보여줌

            if (this.smsType == "T") {
                var templateList = new Array();
                for (i = 0; i < this.templateList.length; i++) {
                    templateList.push([i, this.templateList[i].TEMPLATE_NAME]);
                }

                controls.push(ctrl.define("widget.combine.kakaoComments", "kakaoComments", "kakaoComments", "kakaoComments")
                    .option(templateList)
                    .end());
                controls.push(ctrl.define("widget.label", "", "", "").end());
                controls.push(ctrl.define("widget.textarea", "sendMessage", "sendMessage", this.smsType == "T" ? "SMS Outgoing Comments" : ecount.resource.LBL05506)
				    .filter("maxbyte", { max: 2000 })
                    .popover("카카오톡 알림톡 전송이 실패한 경우 설정해둔 문구로 SMS가 대체 전송됩니다.<br />* SMS 발송문구가 90바이트를 초과할경우 LMS로 발송 됩니다")
				    .value(this.sendComment).end());
                controls.push(ctrl.define("widget.input.number", "sendNumber", "sendNumber", this.smsType == "T" ? "SMS Outgoing No." : ecount.resource.LBL05505).maxLength(20).value(this.smsType == "T" ? '01075312552' : $.isEmpty(this.telNo) ? this.senderHP : this.telNo).end());
            }
            else {
                controls.push(ctrl.define("widget.input.number", "sendNumber", "sendNumber", this.smsType == "T" ? "SMS Outgoing No." : ecount.resource.LBL05505).maxLength(20).value(this.smsType == "T" ? '01075312552' : $.isEmpty(this.telNo) ? this.senderHP : this.telNo).end());
                controls.push(ctrl.define("widget.combine.textareaLink", "sendMessage", "sendMessage", this.smsType == "T" ? "SMS Outgoing Comments" : ecount.resource.LBL05506)
        	        .filter("maxbyte", { max: 2000 })
        	        .value(this.sendComment).end());

            }

        }

        if (this.smsType == "T") {
            columns.push({ id: 'businessNo', propertyName: 'businessNo', title: "real customer code", width: '180', align: 'left' });
            columns.push({ id: 'custName', propertyName: 'custName', title: "company name", width: '180', align: 'left' });
            columns.push({
                id: 'hpNo', propertyName: 'hpNo', title: "Recipient No.", width: '180', align: 'left', controlType: 'widget.input', controlOption: {
                    numberType: 'onlyNumber',
                    maxLength: 20
                }
            });
        } else {
            columns.push({ id: 'businessNo', propertyName: 'businessNo', title: this.smsType == "I" ? ecount.resource.LBL04959 : ecount.resource.LBL01432, width: '150', align: 'left' });
            columns.push({ id: 'custName', propertyName: 'custName', title: this.smsType == "I" ? ecount.resource.LBL01595 : ecount.resource.LBL01506, width: '150', align: 'left' });
            columns.push({
                id: 'hpNo', propertyName: 'hpNo', title: ecount.resource.LBL01710, width: '180', align: 'left', controlType: 'widget.input', controlOption: {
                    numberType: 'onlyNumber',
                    maxLength: 20
                }
            });
        }

        if (this.smsType == "S") {
            columns.push({ id: 'amt', propertyName: 'amt', title: ecount.resource.LBL03067, width: '150', align: 'right', dataType: decAMT });
            columns.push({ id: 'balAmt', propertyName: 'balAmt', title: ecount.resource.LBL02765, width: '150', align: 'right', dataType: decAMT });
            columns.push({
                id: 'message', propertyName: 'message', title: ecount.resource.LBL03657, width: '', align: 'left', controlType: 'widget.textarea', controlOption: {
                    maxByte: { max: 2000 }
                },
                columnOption: {
                    controlType: 'widget.userHelpMark',
                    attrs: {
                        'data-toggle': 'popover',
                        'data-placement': 'left',
                        'data-html': 'true',
                        'data-content': ecount.resource.MSG01796
                    }
                }
            });
        } else if (this.smsType == "T") {
            columns.push({ id: 'amt', propertyName: 'amt', title: "receivable", width: '180', align: 'right', dataType: decAMT });

            //columns.push({
            //        id: 'bizTemplateList', propertyName: 'bizTemplateList', title: "Kakao comments", width: '', align: 'left', controlType: 'widget.label', controlOption: { 

            //}

            //    //columnOption: {
            //    //    controlType: 'widget.userHelpMark',
            //    //    attrs: {
            //    //        'data-toggle': 'popover',
            //    //        'data-placement': 'left',
            //    //        'data-html': 'true',
            //    //        'data-content': ecount.resource.MSG01796
            //    //    }
            //    //}
            //});
            columns.push({
                id: 'message', propertyName: 'message', title: ecount.resource.LBL03657, width: 0, align: 'left', controlType: 'widget.textarea', controlOption: {
                    maxByte: { max: 2000 }
                }
            });
            columns.push({
                id: 'talkMessage', propertyName: 'talkMessage', title: ecount.resource.LBL03657, width: 0, align: 'left', controlType: 'widget.textarea', controlOption: {
                    maxByte: { max: 2000 }
                }
            });
            columns.push({
                id: 'buttonInfo', propertyName: 'buttonInfo', title: ecount.resource.LBL03657, width: 0, align: 'left', controlType: 'widget.textarea', controlOption: {
                    maxByte: { max: 2000 }
                }
            });
            columns.push({
                id: 'templateCode', propertyName: 'templateCode', title: ecount.resource.LBL03657, width: 0, align: 'left', controlType: 'widget.textarea', controlOption: {
                    maxByte: { max: 30 }
                }
            });
        } else {
            columns.push({
                id: 'message', propertyName: 'message', title: ecount.resource.LBL03657, width: '', align: 'left', controlType: 'widget.textarea', controlOption: {
                    maxByte: { max: 2000 }
                }
            });
        }


        if (this.sendList != undefined) {
            this.sendList.forEach(function (item) { if (item.hpNo != '') checked.push(item.businessNo); })
        }

        if (this.smsType == "T") {
            grid
            .setRowData(this.sendList)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setEditRowShowInputOutLine('activeRow')
            .setEditable(true, 0, 0)
            .setColumns(columns);
        }
        else {
            grid
            .setRowData(this.sendList)
            .setStyleRowBackgroundColor(this.setRowBackgroundColor.bind(this), 'danger')
            .setEditRowShowInputOutLine('activeRow')
            .setCheckBoxInitialCheckedItems(checked)
            .setEditable(true, 0, 0)
            .setCheckBoxUse(true)
            .setCheckBoxRememberChecked(true)
            .setColumns(columns);
        }

        if (this.smsType != "T") {
            grid.setKeyColumn(['businessNo']);
        }

        form
			.useInputForm()
			.setColSize(2)
			.addControls(controls);

        contents.add(toolbar).add(form).addGrid("dataGrid", grid);
    },

    //풋터 옵션 설정
    onInitFooter: function (footer) {
        var g = widget.generator,
			toolbar = g.toolbar(),
			ctrl = g.control();

        if (this.smsType == "T") {
            toolbar.addLeft(ctrl.define("widget.button", "sms").label("Send Kakao").end());
            toolbar.addLeft(ctrl.define("widget.button", "close").label("Close").end());
        }
        else {
            toolbar.addLeft(ctrl.define("widget.button", "sms").label(ecount.resource.BTN00173).end());
            toolbar.addLeft(ctrl.define("widget.button", "close").label(ecount.resource.BTN00008).end());
        }

        footer.add(toolbar);
    },

    /**************************************************************************************************** 
	* define Button    
	****************************************************************************************************/
    //SMS발송하기
    onFooterSms: function (e) {
        var grid = this.contents.getGrid().grid,
			rowKeyList = grid.getCheckedKeyList();
        var self = this;
        var number = this.contents.getControl("sendNumber").getValue() == "" ? this.senderHP : this.contents.getControl("sendNumber").getValue();
        debugger;
        if (this.smsType == 'T') {
            this.makeApply();
        }
        else {
            var selectItem = this.contents.getGrid().grid.getChecked();
            self.selectedCnt = selectItem.length;

            if (self.selectedCnt == 0) {
                ecount.alert(ecount.resource.MSG00213);
                return;
            }
        }
        ecount.infra.checkEnableSendSms.apply(this, [number, function (resultObj) {
            if (resultObj == true) {
                this.SendSms();
            } else {
                return false;
            }
        }.bind(this)]);
    },


    getTwoMonthAgo: function () {
            var now = ecount.control.date.serverDate();
            var date = new Date(now.getFullYear(), now.getMonth(), 1).addMonths(-1);

            var getMonth = date.getMonth();
            var getYear = date.getFullYear();
            if (getMonth == 0) {
                getMonth = 12;
                getYear = date.getFullYear() - 1;
            }
            return getYear + '년' + getMonth + '월';

    },

    getOneMonthAgo: function () {
        var now = ecount.control.date.serverDate();

        var date = new Date(now.getFullYear(), now.getMonth(), 1);

        var getMonth = date.getMonth();
        var getYear = date.getFullYear();
        if (getMonth == 0) {
            getMonth = 12;
            getYear = date.getFullYear() - 1;
        }
        return getYear + '년' + getMonth + '월';


    },

     getoneMonthAgoDay: function () {

            var now = ecount.control.date.serverDate();

            var lastDay = new Date(now.getYear(), now.getMonth(), "");
            var lastMonthDay = lastDay.getDate();
            var getYear = now.getFullYear();
            var getMonth = now.getMonth();
            if (getMonth == 0) {
                getMonth = 12;
                getYear = now.getFullYear() - 1;
            }
            return getYear + '년' + getMonth + '월' + lastMonthDay + '일';


        },

    //SMS 발송
    SendSms: function () {

        var grid = this.contents.getGrid().grid;
        if (this.smsType == "T") {
            //rowKeyList = grid.getCheckedKeyList();
            rowKeyList = grid.getRowKeyList();
        } else {
            rowKeyList = grid.getCheckedKeyList();
        }
        var smsmoney = new Decimal(0);
        var smsOverCount = 0;
        var smsprice = new Decimal(this.dSmsPrice);
        var lmsprice = new Decimal(this.dMmsPrice);
        var msgType = "1";
        var menuType = this.setMenuType();
        var self = this;
        var sendData = {
        	SendInfo: {                
        		COM_CODE: self.comCode,
        		SenderNumber: this.contents.getControl("sendNumber").getValue(),// 발송 번호
        		MenuType: menuType,
        		SendList: new Array()        		
        	},
        	EnableYn: "Y"// 인증 검사 유무 
        }
        var dEmoney = new Decimal(this.dEmoney);
        
        this.ButtonCnt = this.ButtonCnt + 1;

        if (this.ButtonCnt == 1) {
            // 발송금액이 잔액보다 적은지 확인 start
            for (var i = 0, limit = rowKeyList.length; i < limit; i++) {
                if (this.CheckByte(grid.getCell("message", rowKeyList[i])) == true) {
                    smsmoney = smsmoney.plus(lmsprice);
                    smsOverCount = smsOverCount + 1;
                } else {
                    smsmoney = smsmoney.plus(smsprice);
                }
            }

			//0이상이면 발송가능
            if (Number(dEmoney) < 0) {
                //발송 금액이 잔액보다 크면
                ecount.confirm(ecount.resource.MSG10009, function (status) {
                    if (status == true) {
                        //KCP 결제 연결
                        self.onContentsCharge();
                        self.ButtonCnt = 0;
                        return false;
                    } else {
                        ecount.alert(ecount.resource.MSG10007);
                        this.ButtonCnt = 0;
                        return false;
                    }
                });

                return false;
            }
            //발송금액이 잔액보다 적은지 확인 end

            for (var i = 0, limit = rowKeyList.length; i < limit; i++) {
                msgType = "1";

                if (grid.getCell("hpNo", rowKeyList[i]) == "") {
                    this.ButtonCnt = 0;
                    ecount.alert(ecount.resource.MSG00340, function () {
                        grid.setCellFocus("hpNo", rowKeyList[i]);
                    });
                    return false;
                }

                if (grid.getCell("message", rowKeyList[i]) == "") {
                    this.ButtonCnt = 0;
                    ecount.alert(ecount.resource.MSG00260, function () {
                        grid.setCellFocus("message", rowKeyList[i]);
                    });
                    return false;
                }

                if (this.smsType == "T") {
                    sendData.SendInfo.SendList.push({
                        MSG_TYPE: this.CheckByte(grid.getCell("message", rowKeyList[i])) == true ? "3" : "1",
                        RECEIVE_NUMBER: grid.getCell("hpNo", rowKeyList[i]),
                        CONTENT: grid.getCell("talkMessage", rowKeyList[i]),
                        RECEIVE_USERID: grid.getCell("custName", rowKeyList[i]),
                        RECEIVE_EMPID: grid.getCell("businessNo", rowKeyList[i]),
                        SMS_CONTENT: grid.getCell("message", rowKeyList[i]),
                        SENDER_KEY: 'a7d4a3a8e58b7d9d2f2b5b90fae2f908b39394f4',
                        TEMPLATE_CODE: grid.getCell("templateCode", rowKeyList[i]),
                        SUBJECT: '',
                        BUTTON_TYPE: '',
                        BUTTON_INFO: '',

                    });
                }
                else {
                    sendData.SendInfo.SendList.push({
                        MSG_TYPE: this.CheckByte(grid.getCell("message", rowKeyList[i])) == true ? "3" : "1",
                        RECEIVE_NUMBER: grid.getCell("hpNo", rowKeyList[i]),
                        CONTENT: grid.getCell("message", rowKeyList[i]),
                        RECEIVE_NAME: grid.getCell("custName", rowKeyList[i]),
                        RECEIVE_EMPID: grid.getCell("businessNo", rowKeyList[i])
                    });
                }
            }//end for

            if (smsOverCount > 0) {
                ecount.confirm(String.format(ecount.resource.MSG06645, rowKeyList.length, smsOverCount), function (status) {
                    if (status == false) {
                        self.ButtonCnt = 0;
                        return false;
                    } else {
                        if (this.smsType == "T") {
                            this.callSendBizTalkApi(sendData);
                        }
                        else {
                            this.callSendApi(sendData);
                        }
                    }
                }.bind(this));
            } else {
                if (this.smsType == "T") {
                    this.callSendBizTalkApi(sendData);
                }
                else {
                    this.callSendApi(sendData);
                }
            }
        }//if (this.ButtonCnt == 1)
    },


     callSendBizTalkApi : function(sendData) {
         var self = this;

         if (sendData != "") {
             if (this.contents.getControl("sendNumber").getValue() == "") {
                 this.contents.getControl("sendNumber").setValue(this.senderHP);
                 sendData.SenderNumber = this.senderHP;
             }
             ecount.common.gmcSessionApi({
                 sessionURL: "/Common/Infra/SendBizTalk",
                 callbackApi: function (sessionURL) {
                     ecount.common.api({
                         url: sessionURL,
                         data: Object.toJSON(sendData),
                success: function (result) {
                    if (result.Status == "200") {
                        self.showAlertCircle(ecount.resource.LBL11306, {
                            callback: function () {
                                self.close();
                            }
                        });
                    }
                }.bind(this)
                     });
                 }
            })
        }
    },

    callSendApi: function (sendData) {
        var self = this;

        //발송 API start
        if (sendData != "") {
            if (this.contents.getControl("sendNumber").getValue() == "") {
                this.contents.getControl("sendNumber").setValue(this.senderHP);
                sendData.SenderNumber = this.senderHP;
            }

            ecount.common.api({
                url: '/Common/Infra/SendSms', //Common.Infra
                data: Object.toJSON(sendData),
                success: function (result) {
                    if (result.Status == "200") {
                        self.showAlertCircle(ecount.resource.LBL11306, {
                            callback: function () {
                                self.close();
                            }
                        });
                    }
                }.bind(this)
            })
        }
        //발송 API end
    },

    onContentsKakaoComments_apply: function () {

        var money = 0;
        debugger;
        this.makeApply();

    },

    onContentsKakaoComments_show: function () {
        debugger;
        var value = this.contents.getControl("kakaoComments").controlList[0].getSelectedItem().value;
        //var index = this.templateList.indexOf(value);
        var date = this.contents.getControl("kakaoComments").get(2).getDate().first().format('yyyyMMdd');
        var dueDate = date.substring(0, 4) + '년' + date.substring(4, 6) + '월' + date.substring(6, 8) + '일';

        if (value == '0') {
            var viewtemplate = this.templateList[parseInt(value)].TEMPLATE_CONTENT.replace("{2}", dueDate);
        }
        else {
            var viewtemplate = this.templateList[parseInt(value)].TEMPLATE_CONTENT.replace("{2}", dueDate);
        }
        ecount.error(viewtemplate);

       // ecount.error("안녕하세요, ㅇㅇㅇ님.이카운트입니다.0000년 00월 사용료 00,000원에 대한 미수안내입니다.사용료 미납으로 0000년00월00일자로수정세금계산서가 발행되며, 0000년00월00일에 탈퇴 처리될 예정입니다.");
    },

    //적용(Apply)
    onContentsSendMessage_link: function () {
        debugger;
        var grid = this.contents.getGrid().grid,
			rowKeyList = grid.getRowKeyList();
        var money = 0;

        if (this.CheckByte(this.contents.getControl("sendMessage").getValue()) == true) {
            //LMS
            ecount.confirm(ecount.resource.MSG06616, function (status) {
                if (status == true) {
                    this.makeApply();
                } else {
                    return false;
                }
            }.bind(this));
        } else {
            //일반
            this.makeApply();
        }
    },

    //내역(Detail)
    onContentsDetail: function () {
        var param = {
            width: 980,
            height: 750,
            popFlag: "Y",
            MenuTypes: this.setMenuType()
        }

        this.openWindow({
            url: "/ECERP/SVC/ECC/ECC002M",
            name: ecount.resource.LBL90071,
            param: param,
            popupType: false,
            fpopupID: this.ecPageID
        });
    },

    //충전하기(Charge)
    onContentsCharge: function (e) {
        //var sessionId = window.requestUrl.param['ec_req_sid'];
        //var url = "/ECMAIN/KCP/KCP001M.aspx?ec_req_sid=" + sessionId + "&com_code=" + this.comCode + "&db_con_flag=" + this.dbConFlag + "&emn_flag=N&access_site=" + this.accessSite + "&CcProdDesc=" + encodeURIComponent(this.comCode + " SMS");     //신용카드 결제

        //window.open(url, "kcp", 'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=630,height=700');
        //this.openWindow({
        //    url: "/ECERP/GeneralPage/OpenPageForGMC",
        //    name: "kcp",
        //    param: {
        //        RetUrl: "/ECERP/GMC.GCP/KCP001M",
        //        PostData: Object.toJSON({
        //            emn_flag: "N",
        //            CallComCode: this.comCode,
        //            access_site: this.accessSite,
        //            CcProdDesc: encodeURIComponent(this.comCode + " SMS")
        //        }),
        //        DataType: "jsonp",
        //        width: 630,
        //        height: 700
        //    },
        //    popupType: true,
        //});

        ecount.common.openKCPType1(
        {
            emn_flag: "N",
            callComCode: this.comCode,
            access_site: this.accessSite,
            ccProdDesc: encodeURIComponent(this.comCode + " SMS")
        });
    },

    //닫기(Close)
    onFooterClose: function (e) {
        this.close();
    },
    /*************************************************************************************************** 
	*  hotkey [f1~12, 방향키등.. ] 
	****************************************************************************************************/

    /**************************************************************************************************** 
   * define grid event listener
   ****************************************************************************************************/

    /**************************************************************************************************** 
	* define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
	* ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
	****************************************************************************************************/
    // Event Load Complete
    onLoadComplete: function (e, cid, control) {
        var grid = this.contents.getGrid().grid,
			rowKeyList = grid.getRowKeyList();

        if (!e.unfocus) {
            this.contents.getControl("sendNumber").onFocus(0);
        }

        this.contents.getControl("sendNumber").setImeModeKeydownHandler(0, false, "N", true);

        if (this.smsType == "S") {
            if (this.contents.getControl("sendStandard").getValue() == "1") {
                grid.setColumnVisibility("amt", true);
                grid.setColumnVisibility("balAmt", false);
            } else {
                grid.setColumnVisibility("amt", false);
                grid.setColumnVisibility("balAmt", true);
            }
        }
    },

    //컨트롤 변경시
    onChangeControl: function (control, data) {
        var grid = this.contents.getGrid().grid

        if (control.cid == "sendStandard") {
            //미수금 발송기준
            if (this.contents.getControl("sendStandard").getValue() == "1") {
                grid.setColumnVisibility("amt", true);
                grid.setColumnVisibility("balAmt", false);

                grid.setColumnTitle('amt', ecount.resource.LBL03067);
            } else {
                grid.setColumnVisibility("amt", false);
                grid.setColumnVisibility("balAmt", true);

                grid.setColumnTitle('balAmt', ecount.resource.LBL02765);
            }
        }
    },
    /**************************************************************************************************** 
	* define user function    
	****************************************************************************************************/
    //적용(Apply)
    makeApply: function () {
        var grid = this.contents.getGrid().grid;
        var rowKeyList;

        debugger;
        if (this.smsType == "T") {
            //rowKeyList = grid.getCheckedKeyList();
            rowKeyList = grid.getRowKeyList();
        } else {
           rowKeyList = grid.getRowKeyList();
        }
        var money = 0;

        grid.setCellTransaction().start();

        for (var i = 0, limit = rowKeyList.length; i < limit; i++) {
            money = 0;

            if (this.smsType == "S") {
                if (this.contents.getControl("sendMessage").getValue().indexOf("{0}") >= 0) {
                    if (this.contents.getControl("sendStandard").getValue() == "1") {
                        money = grid.getCell("amt", rowKeyList[i]);

                        if (money != 0) {
                            grid.setCell("message", rowKeyList[i], this.contents.getControl("sendMessage").getValue().replace("{0}", String.fastFormat(money, { fractionLimit: ecount.config.company.DEC_AMT })));
                        }
                    } else {
                        money = grid.getCell("balAmt", rowKeyList[i]);

                        if (money != 0) {
                            grid.setCell("message", rowKeyList[i], this.contents.getControl("sendMessage").getValue().replace("{0}", String.fastFormat(money, { fractionLimit: ecount.config.company.DEC_AMT })));
                        }
                    }
                } else {
                    grid.setCell("message", rowKeyList[i], this.contents.getControl("sendMessage").getValue());
                }
            } else if (this.smsType == "T") {
                money = grid.getCell("amt", rowKeyList[i]);
                custName = grid.getCell("custName", rowKeyList[i]);
                 if (money != 0) {
                    var index = rowKeyList[i];
                    grid.setCell("bizTemplateList", rowKeyList[i], this.contents.getControl("kakaoComments").controlList[0].getSelectedItem().label);
                    this.MakeBizTalkMessage(grid, money, custName, index);
                }
                if (this.contents.getControl("sendMessage").getValue().indexOf("{0}") >= 0) {
                   

                    if (money != 0) {
                        grid.setCell("message", rowKeyList[i], this.contents.getControl("sendMessage").getValue().replace("{0}", String.fastFormat(money, { fractionLimit: ecount.config.company.DEC_AMT })));
                    }
                }
                else {
                    grid.setCell("message", rowKeyList[i], this.contents.getControl("sendMessage").getValue());
                }
            }
            else {
                grid.setCell("message", rowKeyList[i], this.contents.getControl("sendMessage").getValue());
            }
        }

        grid.setCellTransaction().end();
    },

    //비즈톡 메세지.
    MakeBizTalkMessage: function (grid, money, custName, index) {

        var date = this.contents.getControl("kakaoComments").get(2).getDate().first().format('yyyyMMdd');
        var value = this.contents.getControl("kakaoComments").controlList[0].getSelectedItem().value;
        var user = this.templateList[parseInt(value)].TEMPLATE_CONTENT.replace("{0}", custName);
        var cureDate = date.substring(0, 4) + '년 ' + date.substring(4, 6) + '월'
        var cureDateString = this.templateList[parseInt(value)].TEMPLATE_CONTENT.replace("{0}", cureDate);
        var setAMt = cureDateString.replace("{1}", String.fastFormat(money, { fractionLimit: ecount.config.company.DEC_AMT }) + '원');
       
        //grid.setCell("buttonInfo", index, this.templateList

        var dueDate = date.substring(0, 4) + '년' + date.substring(4, 6) + '월' + date.substring(6, 8) + '일';
        var viewtemplate = setAMt.replace("{2}", dueDate);
        if (value == '0') {
            //var twoMonthAgo = user.replace("{1}", this.getTwoMonthAgo());
            //var setAMt = twoMonthAgo.replace("{2}", String.fastFormat(money, { fractionLimit: ecount.config.company.DEC_AMT }) + '원');
            //var lastDay = viewtemplate.replace("{3}", this.getoneMonthAgoDay);
            viewtemplate = viewtemplate.replace("{3}", this.getoneMonthAgoDay);
            //var viewtemplate = lastDay.replace("{4}", dueDate);
            //grid.setCell("buttonInfo", index, this.templateList[parseInt(value)].BUTTON_INFO);
        }
        else {
            //var oneMonthAgo = user.replace("{1}", this.getOneMonthAgo());
            //var setAMt = oneMonthAgo.replace("{2}", String.fastFormat(money, { fractionLimit: ecount.config.company.DEC_AMT }) + '원');
           // var viewtemplate = setAMt.replace("{3}", dueDate);
            //grid.setCell("buttonInfo", index, viewtemplate);
        }
        debugger;
        grid.setCell("buttonInfo", index, this.templateList[parseInt(value)].BUTTON_INFO);
        grid.setCell("templateCode", index, this.templateList[parseInt(value)].TEMPLATE_CODE);
        grid.setCell("talkMessage", index, viewtemplate);

    },

    //바이트 체크
    CheckByte: function (data) {
        var len = data.length;
        var one_ch = "";
        var count = 0;
        var total2 = 0;
        var x = 0;
        var y = 0;

        for (i = 0; i < len; i++) {
            one_ch = data.charAt(i);	//한문자만 추출
            if (encodeURIComponent(one_ch).length > 4) {
                count = count + 2;   //한글
                total2 = i
            } else {
                count = count + 1;   //영문
                total2 = i
            }
            if (count == 90) {	//90을 타지 않을 때도 있어서 91까지 설정해 줌
                x = i;
                y = 1;
            } else if (count == 91 && y != 1)
                x = i;
        }//for end

        if (count > 90) {
            return true;
        } else {
            return false;
        }
    },

	//문자타입 구하기
    setMenuType: function () {
    	var returnValue = "50";
    	debugger;
    	switch (this.smsType) {
    		case "C":
    			//거래처등록
    			returnValue = "50";
    			break;
    	    case "S":
            case "T":
    			//채권현황
    			returnValue = "52";     // MISU > 52
    			break;
    		case "I":
    			//사원문자발송
    			returnValue = "51";     // 40 > 51
    			break;
    	}

    	return returnValue;
    },

    // Suspension Change colors row
    setRowBackgroundColor: function (data) {
        if (data['cancel'] == "Y")
            return true;
    }
});