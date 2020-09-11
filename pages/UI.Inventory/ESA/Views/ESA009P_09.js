window.__define_resource && __define_resource("LBL06100","LBL00797","LBL08833","LBL01457","BTN00065","BTN00007","BTN00959","BTN00203","BTN00204","BTN00033","BTN00008","BTN00339","LBL02359","BTN00315","LBL03492","MSG00456","MSG00141","MSG00299","LBL07157","LBL09446","MSG00414","MSG00561","MSG04140","MSG05380","MSG06773","LBL04652","MSG05281","LBL35157","MSG05282","LBL10610","LBL02371","LBL03651","LBL01427","LBL03004","LBL11925","LBL11926","LBL06039","MSG04135","MSG04136","MSG04137","MSG04138","LBL08027","MSG02000","LBL12495","MSG02204");
/****************************************************************************************************
1. Create Date : 2016.07.18
2. Creator     : Van Phu Hoi
3. Description : Generate Serial/Lot No or Modify
4. Precaution  :   
5. History     : 2017.05.15 (tuan) Add FORM_TYPE = SU721  
                 [2017.11.22] (Nguyen Duy Thanh) - Job A17_01456 - Press F2 after saving data successfully
				 2018.03.08(양미진) - A18_00524_01 시리얼 기준일 제거 보완
                 [2019.01.14][On Minh Thien] A18_03954 (양식설정 개선 - 입력화면설정 버튼 Option으로 빼기)
                 [2019.01.15][On Minh Thien] A18_03539 (사용자추가수정 화면 UI 수정 요청)
                 2019.02.21 (PhiVo) A19_00558-FE 리팩토링_페이지 일괄작업 8차 apply getSelectedItem() method
                 2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2019.05.31(양미진) - A19_01920 시리얼 등록시 공백으로 등록되는 현상
				2019.08.28(양미진) -  A19_02963 dev 27867 The system does not automatically create the date as previously set when I create Reg. Serial number
                2019.08.27(Hao) Link Serial / Lot No. Slip List to NF3.0
6. Menu Path   : Inv.II > Serial/Lot No. > Reg. Serial/Lot No. > New or Modify
7. Old file name : ESA009P_09.aspx
****************************************************************************************************/
ecount.page.factory("ecount.page.popup.type2", "ESA009P_09"/** page ID */, {
    /********************************************************************** 
    * page user opion Variables(User variables and Object) 
    **********************************************************************/
	userpermit: null,
	strInputDetailPermit: null,
	// 사용방법설정 팝업창 높이					
	selfCustomizingHeight: 0,
	sizeDest: '',
	prodDesList: null,        // prod_des list     
	prodCDList: null,
	initProdCDList: null,
	initProdDesList: null,
	separateSign: ecount.delimiter,
	strMappingFlag: null, //Serial connection to Item code (0 OR NULL -> the items to one of the serial / Port 1 -> Multiple items in a single serial / lot)
	strAnyInputYn: null,    //qty 
	controlList: null,
	lastProdCd: null,
	_widget_combine_serialLotNum: null,
	_willDeleteProdCd: "",
	_isEnableSize100: true, /*시리얼 100자리 허용 여부*/
	autoCode: [],
	autoCodeNew: [],
    /**************************************************************************************************** 
    * page initialize
    ****************************************************************************************************/
	init: function (options) {
		this._super.init.apply(this, arguments);
		this.saveLoading = {     //구프레임웍 ECLoading.locked
			locked: false
		};
	},

	render: function () {
		this._super.render.apply(this);
		this.initProperties();
	},

	initProperties: function () {
		this.inputFormDetail = this.viewBag.FormInfos.SU721;
		this.prodCDList = [];
		this.prodDesList = [];
		this.initProdCDList = [];
		this.initProdDesList = [];

		this.strMappingFlag = ecount.config.inventory.USE_MAPPING_FLAG == 'Y' ? 1 : 0;
		this.strAnyInputYn = ecount.config.inventory.USE_ANYINPUT;
		this.userpermit = this.viewBag.Permission.SettingPermits.Value;
		this.strInputDetailPermit = this.viewBag.Permission.InputDetailPermits.Value;
		this.infoConfig = {
			strSlAnyinputYn: ecount.config.inventory.USE_ANYINPUT,
			strSlNotiYn: ecount.config.inventory.USE_NOTI
		};
		if (this.USER_FLAG == "M" || this.USER_FLAG == "E") {
			this.userpermit = "W";
		}
		if (this.editFlag == null || this.editFlag == undefined || this.editFlag == '') {
			this.editFlag = 'I';
		}
		if (this.editFlag == 'M') {
			if (this.viewBag.InitDatas.Serial != null && this.viewBag.InitDatas.Serial != undefined) {
				this.initDataList = this.viewBag.InitDatas.Serial;
			}
			if (this.initDataList != null && this.initDataList[0] != undefined) {
				this.infoSerial = this.initDataList[0];
			}
		};
		this._widget_combine_serialLotNum = this.viewBag.WidgetDatas["widget.combine.serialLotNum"].config;
	},
    /****************************************************************************************************
    * UI Layout setting
    ****************************************************************************************************/
	onInitHeader: function (header) {
		header.setTitle(this.editFlag == "M" ? String.format(ecount.resource.LBL06100) : String.format(ecount.resource.LBL00797))   //Generate Serial/Lot No.
			.notUsedBookmark()
			.add("option", [
				{ id: "InputScreenSetting", label: ecount.resource.LBL08833 },
				{ id: "SelfCustomizing", label: ecount.resource.LBL01457 } /*Function Setup*/
			]);
	},
	onInitContents: function (contents) {
		var g = widget.generator,
			toolbar = g.toolbar(),
			grid = g.grid(),
			ctrl = g.control(),
			form = g.form(),
			controls = new Array();
		if (this.editFlag == 'M') {
			var newColumn = {
				id: "txtSerial",
				name: "txtSerial",
				title: ecount.resource.LBL06100,
				width: 100,
				controlType: "widget.label",
				numSort: 0,
				cursorIndex: 0,
				isLineMrge: true,
				isEditable: false
			};
			this.viewBag.FormInfos.SU721.columns.unshift(newColumn);
		}

		form.useInputForm()
			.executeValidateIfVisible()
			.setColSize(1)            //.setOptions({ _isModifyMode: true })
			.setType("SU721")
			.showLeftAndRightBorder(true);

		contents.add(form);
	},

	onInitFooter: function (footer) {
		var permit = this.viewBag.Permission.permitESA012M,
			g = widget.generator,
			ctrl = g.control(),
			toolbar = g.toolbar(),
			addgroup = [],
			addgroup2 = [],
			res = ecount.resource;
		if (['M'].contains(this.editFlag)) {
			toolbar.addLeft(ctrl.define("widget.button", "Save").label(ecount.resource.BTN00065));
			toolbar.addLeft(ctrl.define("widget.button", "reset").label(ecount.resource.BTN00007));

			toolbar.addLeft(ctrl.define("widget.button.group", "deleteRestore").label(ecount.resource.BTN00959).css("btn btn-default")
				.addGroup([
					{ id: 'Deactive', label: this.USE_YN == 'Y' ? ecount.resource.BTN00203 : ecount.resource.BTN00204 },
					{ id: 'delete', label: ecount.resource.BTN00033 }
                ])
                .noActionBtn().setButtonArrowDirection("up"));


			toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));
			toolbar.addLeft(ctrl.define("widget.button", "history").label("H"));
		}
		else {
			//toolbar.addLeft(ctrl.define("widget.button", "Generate").label(String.format("{0}{1}", res.BTN00339, "(F8)")));
			toolbar.addLeft(ctrl.define("widget.button", "Generate").label(ecount.resource.BTN00065));
			toolbar.addLeft(ctrl.define("widget.button", "Close").label(res.BTN00008));
		};
		footer.add(toolbar);
	},

	onInitControl: function (cid, control) {
		var ctrl = widget.generator.control();
		switch (cid) {
			case "expirationDate":
				if (this.editFlag == 'I') {
					control
						.hideDateControl(true)
						.useSlipDate(false);
					control.select((this.viewBag.InitDatas.RegistExpireDate || "").trim());
				} else {
					if ((this.initDataList[0].TO_EXPIRATION_DATE || "") == "") {
						control.hideDateControl(true).isHideDateOptionChecked(false).useSlipDate(false);
					}
					else {
						var to_date = ((this.initDataList[0].TO_EXPIRATION_DATE == null) ? (this.regDateTo.toDate()) : this.initDataList[0].TO_EXPIRATION_DATE.toDate());
						var _to_expired_date = to_date.format("yyyyMMdd");
						if (_to_expired_date == "19000101") { /*유효기한을 안쓴다고 선언한 경우 기본값임*/
							control.hideDateControl(true).isHideDateOptionChecked(false).useSlipDate(false);
							control.select((this.viewBag.InitDatas.RegistExpireDate || "").trim());
						}
						else {
							control.hideDateControl(true).isHideDateOptionChecked(true).useSlipDate(false);
							control.select((_to_expired_date || "").trim());
						};
					}
				};
				break;
			case "txtSerial":
				control.hasFn([{ id: "modifySerialLotNo", label: ecount.resource.LBL02359 }, { id: "details", label: ecount.resource.BTN00315 }])
					.label(this.SERIAL_IDX);
				break;
			case "txtSizeDes":
				control.label(this.sizeDest);
				break;
			case "serialLotNum":
				control.value([1, 2]);
				break;

			/* TEXT TYPE ******************************************************** */
			case "txtUdcTxt1":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_TXT_01 : '');
				break;
			case "txtUdcTxt2":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_TXT_02 : '');
				break;
			case "txtUdcTxt3":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_TXT_03 : '');
				break;
			case "txtUdcTxt4":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_TXT_04 : '');
				break;
			case "txtUdcTxt5":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_TXT_05 : '');
				break;

			/* CODE TYPE ******************************************************** */
			case "codeType1":
				control.setOptions({ checkMaxCount: 1 })
					.codeType(7)
					.addCode(this.editFlag == 'M' && this.infoSerial != null ? { label: this.infoSerial.UDC_CD_01_DES == null ? '' : this.infoSerial.UDC_CD_01_DES, value: this.infoSerial.UDC_CD_01 == null ? '' : this.infoSerial.UDC_CD_01 } : { label: '', value: '' });
				break;
			case "codeType2":
				control.setOptions({ checkMaxCount: 1 })
					.codeType(7)
					.addCode(this.editFlag == 'M' && this.infoSerial != null ? { label: this.infoSerial.UDC_CD_02_DES == null ? '' : this.infoSerial.UDC_CD_02_DES, value: this.infoSerial.UDC_CD_02 == null ? '' : this.infoSerial.UDC_CD_02 } : { label: '', value: '' });
				break;
			case "codeType3":
				control.setOptions({ checkMaxCount: 1 })
					.codeType(7)
					.addCode(this.editFlag == 'M' && this.infoSerial != null ? { label: this.infoSerial.UDC_CD_03_DES == null ? '' : this.infoSerial.UDC_CD_03_DES, value: this.infoSerial.UDC_CD_03 == null ? '' : this.infoSerial.UDC_CD_03 } : { label: '', value: '' });
				break;

			/* Num ******************************************************** */
			case "txtUdcNum1":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_NUM_01 : '').numericOnly(18, 6);
				break;
			case "txtUdcNum2":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_NUM_02 : '').numericOnly(18, 6);
				break;
			case "txtUdcNum3":
				control.value(this.editFlag == 'M' && this.infoSerial != null ? this.infoSerial.UDC_NUM_03 : '').numericOnly(18, 6);
				break;

			/* Date ******************************************************** */
			case "ddlYearUdcDt1":
				control.useDateSpace().setYear("====").setMonth("==").setDay("").useSlipDate(false);
				if (this.editFlag == 'M' && this.infoSerial != null && this.infoSerial.UDC_DT_01 != null && this.infoSerial.UDC_DT_01 != '') {
					control.select((this.infoSerial.UDC_DT_01 || "").trim());
				} else if (this.editFlag == "I" && this.YearUdtDt1Date != null) {
					control.select((this.YearUdtDt1Date || "").trim());
				}
				break;
			case "ddlYearUdcDt2":
				control.useDateSpace().setYear("====").setMonth("==").setDay("").useSlipDate(false);
				if (this.editFlag == 'M' && this.infoSerial != null && this.infoSerial.UDC_DT_02 != null && this.infoSerial.UDC_DT_02 != '') {
					control.select((this.infoSerial.UDC_DT_02 || "").trim());
				} else if (this.editFlag == "I" && this.YearUdtDt2Date != null) {
					control.select((this.YearUdtDt2Date || "").trim());
				}
				break;
		}
	},

    /**************************************************************************************************** 
    * define common event listener
    ****************************************************************************************************/
	onLoadComplete: function (e) {
		if (this.editFlag == 'M') {
			this.contents.hideRow("serialLotNum", true);

			if (this.initDataList != null) {
				if (this.initDataList.length > 0) {
					this.prodCDList.clear();
					this.prodDesList.clear();
					this._willDeleteProdCd.length = 0;
					for (var i = 0; i < this.initDataList.length ; i++) {
						//set value for Item Code
						if (this.initDataList[i].PROD_CD != null && this.initDataList[i].PROD_CD != "") {
							this._willDeleteProdCd += (this.initDataList[i].PROD_CD + this.separateSign);
							this.contents.getControl("txtSProdCd").get(0).addCode({ value: this.initDataList[i].PROD_CD, label: this.initDataList[i].PROD_DES });
							this.prodCDList.push(this.initDataList[i].PROD_CD);
							this.initProdCDList.push(this.initDataList[i].PROD_CD);
							this.initProdDesList.push(this.initDataList[i].PROD_DES);
							this.prodDesList.push(this.initDataList[i].SIZE_DES);
						}
					}
				}
			}
			this.contents.getControl("txtSizeDes").setValue(this.prodDesList.join("ㆍ"));

			saved_to_date = this.initDataList[0].TO_EXPIRATION_DATE || "";
			if (saved_to_date == "")
				saved_to_date = this.viewBag.InitDatas.RegistExpireDate.toDate();
			else
				saved_to_date = this.initDataList[0].TO_EXPIRATION_DATE.toDate();
			this.initDataList[0].FROM_EXPIRATION_DATE = ((this.initDataList[0].FROM_EXPIRATION_DATE == null) ? (this.regDateFrom.toDate()) : (((this.initDataList[0].FROM_EXPIRATION_DATE || "") == "") ? "" : this.initDataList[0].FROM_EXPIRATION_DATE.toDate()));
			this.initDataList[0].TO_EXPIRATION_DATE = ((this.initDataList[0].TO_EXPIRATION_DATE == null) ? (this.regDateTo.toDate()) : (((this.initDataList[0].TO_EXPIRATION_DATE || "") == "") ? "" : this.initDataList[0].TO_EXPIRATION_DATE.toDate()));

			if (this.contents.getControl("expirationDate") != null) {

				if ((saved_to_date != "") && (saved_to_date != "19000101"))
					this.contents.getControl("expirationDate").setDate([saved_to_date]);
				else {
					this.contents.getControl("expirationDate").setDate([this.viewBag.InitDatas.RegistExpireDate.toDate()]);
				}
			};

			if (this.strMappingFlag == 0 && this.infoSerial.SL_CNT != null && this.infoSerial.SL_CNT != undefined) {
				if (this.infoSerial.SL_CNT > 0)
					this.contents.getControl("txtSProdCd").get(0).readOnly(true);
			}
		}
		else {
			this.contents.getControl("expirationDate").setDate([this.viewBag.InitDatas.RegistExpireDate.toDate()]);

			if (this.PROD_CD != null && this.PROD_CD != undefined && this.PROD_CD != '') {
				this.prodCDList.push(this.PROD_CD);
				this.contents.getControl("txtSProdCd").get(0).addCode({ value: this.PROD_CD, label: this.PROD_DES });

				if ((ecount.config.inventory.USE_SERIAL_WH || false) == true)
					this.contents.getControl("txtSProdCd").showBasicQty();
			}
		}

		if (this.contents.getControl("serialLotNum") != null)
			this.controlList = this.contents.getControl("serialLotNum").controlList || [];
		else
			this.controlList = [];

		this.contents.getControl("txtSProdCd").get(0).setFocus(0);
	},

	onAutoCompleteHandler: function (control, keyword, parameter, handler) {
		switch (control.id) {
			case "codeType1": //Code Type Add. Field 1
				parameter.CODE_CLASS = "L13";
				break;
			case "codeType2": //Code Type Add. Field 2
				parameter.CODE_CLASS = "L14";
			case "codeType3": //Code Type Add. Field 3
				parameter.CODE_CLASS = "L115";
				break;
		}
		handler(parameter);
	},

	onMessageHandler: function (event, data) {

		var firstData = data.data || data,
			_self = this;
		switch (event.pageID) {
			case "ES020P":
				if (firstData.length != undefined || firstData.PROD_CD != undefined) {
					if (_self.editFlag == 'I') {
						if ((ecount.config.inventory.USE_ANYINPUT || "") != "Y" && _self.strMappingFlag == 0) {
							_self.prodCDList.clear();
							_self.prodDesList.clear();
						}
					};
					if (_self.strMappingFlag == 1) {// choose multi itemcodes
						if (firstData.length != undefined) {
							for (var i = 0; i < firstData.length; i++) {
								if (_self.prodCDList.indexOf(firstData[i].PROD_CD) < 0) {
									_self.prodCDList.push(firstData[i].PROD_CD);
									_self.prodDesList.push(firstData[i].SIZE_DES);
								}
							}
						}
						else {
							_self.prodCDList.push(firstData.PROD_CD);
							_self.prodDesList.push(firstData.SIZE_DES);
						}

						if (this.editFlag != 'M') {
							if ((ecount.config.inventory.USE_SERIAL_WH || false) == true)
								this.contents.getControl("txtSProdCd").showBasicQty();
						}

						_self.contents.getControl("txtSizeDes").setValue(_self.prodDesList.join("ㆍ"));
					}
					else if (_self.strMappingFlag != 1) {//only choose 1 itemcode
						if (firstData.PROD_CD != undefined) {
							if (_self.prodCDList.indexOf(firstData.PROD_CD) < 0) {
								_self.prodCDList.push(firstData.PROD_CD);
								_self.prodDesList.push(firstData.SIZE_DES);
							}
						}

						if (this.editFlag != 'M') {
							if ((ecount.config.inventory.USE_SERIAL_WH || false) == true)
								this.contents.getControl("txtSProdCd").showBasicQty();
						}

						_self.contents.getControl("txtSizeDes").setValue(_self.prodDesList.join("ㆍ"));
					}
				}
				break;
			case "ESQ202P_08":
				var param = {
					editFlag: "M",
					SERIAL_IDX: firstData,
					infoSerial: _self.infoSerial,
					USE_YN: _self.USE_YN,
					height: 600
				};

				var initDataList = _self.initDataList;
				_self.onAllSubmitSelf("/ECERP/ESA/ESA009P_09", param, initDataList, "details");
				_self.getParentInstance(_self.parentPageID)._ON_REDRAW({ serialIdx: firstData, unfocus: true });
				data.callback && data.callback();
				break;
			default:
				break;
		};
	},

	//on change widget
	onChangeControl: function (event, data) {
		switch (event.cid) {
			case "txtSProdCd_txtSProdCd":
				var selectedCode = event.__self ? event.__self.getSelectedCode() : [],
					isRemove, pos;

				if (selectedCode.length == 0) {
					this.prodCDList.clear();
					this.prodDesList.clear();
					this.contents.getControl("txtSizeDes").setValue('');
				}
				else if (event.args == undefined) {
					if (this.strMappingFlag == 0)
						this.lastProdCd = this.contents.getControl("txtSProdCd").get(0).getSelectedItem();
				}
				else if (selectedCode.length !== this.prodCDList.length) {
					isRemove = selectedCode.length < this.prodCDList.length;
					if (isRemove) {
						this.prodCDList.forEach(function (code, index) {
							if (selectedCode.indexOf(code) < 0) {
								pos = index;
							}
						});

						this.prodCDList.splice(pos, 1);
						this.prodDesList.splice(pos, 1);
						this.contents.getControl("txtSizeDes").setValue(this.prodDesList.join("ㆍ"));
					} else {
						if (this.strMappingFlag == 0 && this.lastProdCd && this.lastProdCd.length > 0) {
							if (this.lastProdCd[0].value != event.messageObj.data.PROD_CD)
								this.contents.getControl("txtSProdCd").get(0).removeCode(this.lastProdCd[0]);
						}
						this.contents.getControl("txtSizeDes").setValue(this.prodDesList.join("ㆍ"));
					}
				}
				break;
			case "serialLotNum_textarea":
				this.fnNewCheckValue2(event);
				break;
			default:
				break;
		};
	},

	//set param for popup    
	onPopupHandler: function (control, param, handler) {
		switch (control.id) {
			case "WH_CD":
				param.isNewDisplayFlag = true;
				break;
			case "txtSProdCd_txtSProdCd":
				param.isApplyDisplayFlag = this.strMappingFlag == 1 ? true : false;
				param.isCheckBoxDisplayFlag = this.strMappingFlag == 1 ? true : false;
				param.isIncludeInactive = true;
				param.checkMaxCount = 100;
				param.name = ecount.resource.LBL03492;
				break;
			case "codeType1": //Code Type Add. Field 1
				param.SID = "E040617";
				param.isNewDisplayFlag = true;
				param.isApplyDisplayFlag = false;       // apply
				param.isCheckBoxDisplayFlag = false;    // checkbox
				param.isIncludeInactive = false;        //                 
				param.additional = false;
				param.titlename = control.subTitle.name = control.subTitle;
				param.CODE_CLASS = "L13";
				param.custGroupCodeClass = "L13";
				break;
			case "codeType2": //Code Type Add. Field 2
				param.SID = "E040617";
				param.isNewDisplayFlag = true;
				param.isApplyDisplayFlag = false;       // apply
				param.isCheckBoxDisplayFlag = false;    // checkbox
				param.isIncludeInactive = false;        //                 
				param.additional = false;
				param.titlename = control.subTitle.name = control.subTitle;
				param.CODE_CLASS = "L14";
				param.custGroupCodeClass = "L14";
				break;
			case "codeType3": //Code Type Add. Field 3
				param.SID = "E040617";
				param.isNewDisplayFlag = true;
				param.isApplyDisplayFlag = false;       // apply
				param.isCheckBoxDisplayFlag = false;    // checkbox
				param.isIncludeInactive = false;        //                 
				param.additional = false;
				param.titlename = control.subTitle.name = control.subTitle;
				param.CODE_CLASS = "L15";
				param.custGroupCodeClass = "L15";
				break;
		};
		handler(param);
	},
    /**************************************************************************************************** 
     * define action event listener (컨트롤 클릭, 변경시 발생하는 이벤트 처리)
     * ex) onFooterSave, onHeaderSearch..   [ "on" + target + control id ]
     ****************************************************************************************************/

	onFooterSave: function (e) {
		if (this.userpermit != 'W') {
			ecount.alert(ecount.resource.MSG00456);
			return false;
		}

		if (this.saveLoading.locked)
			return;
		else
			this.saveLoading.locked = true;

		if (['M'].contains(this.editFlag))
			this.fnSave(e, 1); // 수정
		else
			this.fnSave(e, 2); // 신규
	},

	// Reset button clicked event
	onFooterReset: function (e) {
		var param = {
			editFlag: "M",
			SERIAL_IDX: this.SERIAL_IDX,
			infoSerial: this.infoSerial,
			USE_YN: this.USE_YN,
			height: 600,
			isOpenPopup: this.isOpenPopup
		};
		var initDataList = this.initDataList;
		this.onAllSubmitSelf("/ECERP/ESA/ESA009P_09", param, initDataList, "details");
	},

	onFooterDeactive: function (e) {
		this.fnChangeStatus('Y');
	},

	onFooterDeleteRestore: function (e) {
		this.footer.get(0).getControl("deleteRestore").setAllowClick();
	},

	onButtonDelete: function (e) {
		var self = this;
		var btnDelete = this.footer.get(0).getControl("deleteRestore");
		// Check permit (Kiểm tra phân quyền)
		if (this.userpermit != 'W') {
			btnDelete.setAllowClick();
			ecount.alert(ecount.resource.MSG00141);
			return false;
		}
		ecount.confirm(ecount.resource.MSG00299, function (status) {
			if (status === false) {
				btnDelete.setAllowClick();
				return false;
			}
			self.fnDeleteSerial();
		});
	},

	onButtonDeactive: function (e) {
		this.fnChangeStatus(this.USE_YN == 'Y' ? 'N' : 'Y');
	},

	onFooterClose: function () {
		this.close();
	},

	onFooterHistory: function () {
		var param = {
			width: 450,
			height: 150,
			lastEditTime: this.infoSerial == null ? '' : this.infoSerial.WDATE,
			lastEditId: this.infoSerial == null ? '' : this.infoSerial.WID,
			popupType: true,
		};

		this.openWindow({
			url: '/ECERP/Popup.Search/CM100P_31',
			name: ecount.resource.LBL07157,
			param: param,
			popupType: false
		})
	},

	onFooterGenerate: function (e) {
		if (this.userpermit != 'W' && this.userpermit != 'U') {
			ecount.alert(ecount.resource.MSG00456);
			return false;
		}
		this.fnSave(e, 2)
	},

	// 사용방법설정 Dropdown Self-Customizing click event
	onDropdownSelfCustomizing: function (e) {
		var params = {
			width: ecount.infra.getPageWidthFromConfig(true)
			, height: 400
			, PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
		};
		this.openWindow({
			url: '/ECERP/ESC/ESC002M',
			name: ecount.resource.LBL01457,
			param: params,
			fpopupID: this.ecPageID,
			popupType: false,
		});
	},

	onDropdownInputScreenSetting: function () {
		var params = {
			width: 600,
			height: 450,
			FORM_TYPE: 'SU721'
		};

		this.openWindow({
			url: '/ECERP/Popup.Form/CM100P_06',
			name: 'Input Screen Setting',
			param: params,
			fpopupID: this.ecPageID,
			popupType: false,
		});
	},

    /**************************************************************************************************** 
    *  define hotkey event listener
    ****************************************************************************************************/

	ON_KEY_F8: function (e, target) {
		this.onFooterSave();
	},

	ON_KEY_ENTER: function (e, target) {
		if (target != null) {
			if (target.control.id === "NAME" && this.footer.getControl('Save') != undefined) {
				this.footer.getControl('Save').setFocus(0);
			}
		}
	},

    /**************************************************************************************************** 
    * define user function 
    ****************************************************************************************************/

	onFunctionModifySerialLotNo: function () {
		if (this.userpermit != 'W') {
			ecount.alert(ecount.resource.MSG00456);
			return;
		}
		var SerialProdList = [];
		SerialProdList.push({
			NEW_SERIAL_IDX: '',
			SERIAL_IDX: this.SERIAL_IDX,
			PROD_CD: (this.infoSerial.PROD_CD != null ? this.infoSerial.PROD_CD : this.PROD_CD)
		});

		var params = {
			width: 700,
			height: 320,
			editFlag: "M",
			SerialProdList: SerialProdList
		};

		this.openWindow({
			url: '/ECERP/ESQ/ESQ202P_08',
			name: String.format(ecount.resource.LBL02359),
			param: params,
			popupType: false,
			fpopupID: this.ecPageID
		});
	},

	onFunctionDetails: function () {
		if (this.strInputDetailPermit != "X") {
			var params = {
				width: ecount.infra.getPageWidthFromConfig(1),
				height: 420,				
				Request: {
				    AFlag: '4',				    
				    PROD_CD: this.initProdCDList.join(ecount.delimiter),
				    PROD_DES: this.initProdDesList.join(ecount.delimiter),
				    Data: {
				        SERIAL_IDX: this.SERIAL_IDX,
				        isDetail: '1'
				    },
				    editFlag: 'M',
				    pageSize: 100
				}
			};

			this.openWindow({
				url: '/ECERP/SVC/ESQ/ESQ200M',
				name: String.format(ecount.resource.LBL09446),
				param: params,
				popupType: false,
				additional: false
			});
		}
		else {
			ecount.alert(ecount.resource.MSG00141);
		}
	},

	//Save info of slip
    fnSave: function (e, type) {
		var self = this;
		var btn = null;

		if (type == "1") /*modify*/
			btn = this.footer.get(0).getControl("Save");
		else /*add*/
			btn = this.footer.get(0).getControl("Generate");

		var invalid = this.contents.validate();

		if (invalid.result.length > 0) {
			this.saveLoading.locked = false;
			var ctrl = invalid.result[0][0].control;

			if (ctrl.isReadOnly() && ctrl.controlType == "widget.code.wh")
				btn.setAllowClick();
			else {
				ctrl.setFocus(0);
				btn.setAllowClick();
				return;
			}
		}

		var dateCtrl = this.contents.getControl("expirationDate");
		var result = {
			from_date: "",
			to_date: ""
		};

		if (dateCtrl == null) { /*유효기한이 없으면 기본 설정값을 넘겨준다.*/ //요기 넣어줘야됨.
			var start_date = this.regDateFrom;
			var end_date = this.regDateTo;

			result = {
				from_date: (String.format("{0}-{1}-{2}", start_date.toDate().format("yyyy"), start_date.toDate().format("MM"), start_date.toDate().format("dd")).toDate()).format("yyyyMMdd"),
				to_date: (String.format("{0}-{1}-{2}", end_date.toDate().format("yyyy"), end_date.toDate().format("MM"), end_date.toDate().format("dd")).toDate()).format("yyyyMMdd")
			};
		} else {
			if (!$.isEmpty(dateCtrl.errorMessage)) {
				dateCtrl.showError(ecount.resource.MSG00414);
				btn.setAllowClick();
				this.saveLoading.locked = false;
				return;
			}

			var t = dateCtrl.serialize('expirationDate');

			if ((t["expirationDate_DATECHK"] || "0") == "1") {
				var sdate = String.format("{0}-{1}-{2}", dateCtrl.getDate().first().format("yyyy"), dateCtrl.getDate().first().format("MM"), dateCtrl.getDate().first().format("dd"));

				if (!$.isDate(sdate)) {
					dateCtrl.showError(ecount.resource.MSG00414);
					dateCtrl.setFocus(0);
					btn.setAllowClick();
					this.saveLoading.locked = false;
					return;
				}

				result = {
					from_date: ((this.initDataList == null) ? this.regDateFrom : this.initDataList[0].FROM_EXPIRATION_DATE),
					to_date: sdate.replaceAll("-", "")
				};
			}
		}

		var prodCD = this.contents.getControl("txtSProdCd").get(0).getSelectedCode();
		var _checkValue = "0";
		var _wh_cd = "";

		if (this.editFlag != 'M') {
			if ((ecount.config.inventory.USE_SERIAL_WH || false) == true) {
				_checkValue = this.contents.getControl("txtSProdCd").get(1).getValue();

				if (_checkValue == "1") {
					_wh_cd = this.contents.getControl("txtSProdCd").get(2).getSelectedCode();

					if (_wh_cd.length <= 0) {
						this.contents.getControl("txtSProdCd").get(2).showError(ecount.resource.MSG00561);
						this.contents.getControl("txtSProdCd").get(2).setFocus(0);
						btn.setAllowClick();
						this.saveLoading.locked = false;
						return;
					}

					if (_wh_cd[0] == "") {
						this.contents.getControl("txtSProdCd").get(2).showError(ecount.resource.MSG00561);
						this.contents.getControl("txtSProdCd").get(2).setFocus(0);
						btn.setAllowClick();
						this.saveLoading.locked = false;
						return;
					}
				}
			}
		}

		var txtUdcTxt1 = null, txtUdcTxt2 = null, txtUdcTxt3 = null, txtUdcTxt4 = null, txtUdcTxt5 = null;
		if (this.getColumnUsed('txtUdcTxt1').isUse == true)
			txtUdcTxt1 = this.contents.getControl("txtUdcTxt1").getValue();
		if (this.getColumnUsed('txtUdcTxt2').isUse == true)
			txtUdcTxt2 = this.contents.getControl("txtUdcTxt2").getValue();
		if (this.getColumnUsed('txtUdcTxt3').isUse == true)
			txtUdcTxt3 = this.contents.getControl("txtUdcTxt3").getValue();
		if (this.getColumnUsed('txtUdcTxt4').isUse == true)
			txtUdcTxt4 = this.contents.getControl("txtUdcTxt4").getValue();
		if (this.getColumnUsed('txtUdcTxt5').isUse == true)
			txtUdcTxt5 = this.contents.getControl("txtUdcTxt5").getValue();

		var codeType1 = null, codeType2 = null, codeType3 = null;
		if (this.getColumnUsed('codeType1').isUse == true) {
			var currentCodeType1 = this.contents.getControl("codeType1").getSelectedItem()[0];
			if (currentCodeType1 != undefined)
				codeType1 = currentCodeType1.value;
		}
		if (this.getColumnUsed('codeType2').isUse == true) {
			var currentCodeType2 = this.contents.getControl("codeType2").getSelectedItem()[0];
			if (currentCodeType2 != undefined)
				codeType2 = currentCodeType2.value;
		}
		if (this.getColumnUsed('codeType3').isUse == true) {
			var currentCodeType3 = this.contents.getControl("codeType3").getSelectedItem()[0];
			if (currentCodeType3 != undefined)
				codeType3 = currentCodeType3.value;
		}

		var txtUdcNum1 = null, txtUdcNum2 = null, txtUdcNum3 = null;
		if (this.getColumnUsed('txtUdcNum1').isUse == true) {
			txtUdcNum1 = this.contents.getControl("txtUdcNum1").getValue();
		}
		if (this.getColumnUsed('txtUdcNum2').isUse == true) {
			txtUdcNum2 = this.contents.getControl("txtUdcNum2").getValue();
		}
		if (this.getColumnUsed('txtUdcNum3').isUse == true) {
			txtUdcNum3 = this.contents.getControl("txtUdcNum3").getValue();
		}

		var ddlYearUdcDt1 = null, ddlYearUdcDt2 = null;

		if (this.getColumnUsed('ddlYearUdcDt1').isUse == true) {
			dateCtrl = this.contents.getControl("ddlYearUdcDt1");

			if (dateCtrl) {
				if (!$.isEmpty(dateCtrl.errorMessage)) {
					dateCtrl.showError(ecount.resource.MSG00414);
					btn.setAllowClick();
					this.saveLoading.locked = false;
					return;
				}

				var y = 0, m = 1, d = 2;

				if (dateCtrl.dateIndex != undefined && dateCtrl.dateIndex != null) {
					y = dateCtrl.dateIndex[0] == 'y' ? 0 : dateCtrl.dateIndex[1] == 'y' ? 1 : 2;
					m = dateCtrl.dateIndex[0] == 'm' ? 0 : dateCtrl.dateIndex[1] == 'm' ? 1 : 2;
					d = dateCtrl.dateIndex[0] == 'd' ? 0 : dateCtrl.dateIndex[1] == 'd' ? 1 : 2;
				}

				ddlYearUdcDt1 = dateCtrl.getValue(y) + dateCtrl.getValue(m) + dateCtrl.getValue(d);
				ddlYearUdcDt1 = ddlYearUdcDt1.indexOf('=') >= 0 ? null : ddlYearUdcDt1;
			}
		}

		if (this.getColumnUsed('ddlYearUdcDt2').isUse == true) {
			dateCtrl = this.contents.getControl("ddlYearUdcDt2");

			if (dateCtrl) {
				if (!$.isEmpty(dateCtrl.errorMessage)) {
					dateCtrl.showError(ecount.resource.MSG00414);
					btn.setAllowClick();
					this.saveLoading.locked = false;
					return;
				}

				var y = 0, m = 1, d = 2;

				if (dateCtrl.dateIndex != undefined && dateCtrl.dateIndex != null) {
					y = dateCtrl.dateIndex[0] == 'y' ? 0 : dateCtrl.dateIndex[1] == 'y' ? 1 : 2;
					m = dateCtrl.dateIndex[0] == 'm' ? 0 : dateCtrl.dateIndex[1] == 'm' ? 1 : 2;
					d = dateCtrl.dateIndex[0] == 'd' ? 0 : dateCtrl.dateIndex[1] == 'd' ? 1 : 2;
				}

				ddlYearUdcDt2 = dateCtrl.getValue(y) + dateCtrl.getValue(m) + dateCtrl.getValue(d);
				ddlYearUdcDt2 = ddlYearUdcDt2.indexOf('=') >= 0 ? null : ddlYearUdcDt2;
			}
		}

		if (type == "2") /*add*/ {
			//check Qty
			var controlList = this.contents.getControl("serialLotNum").controlList;
			var serialLength = Number(this.contents.getControl("serialLotNum").initData.config.NUM_DIGIT_LEN),
				qty = controlList[controlList.length - 1].getValue();

			var autoCode = [];
			if (controlList[0].getValue() == '1') {/*자동생성*/
				var rs = this.fnValidation();
				if (rs != null) {
					ecount.alert(rs.message, function () {
						controlList[rs.index].setFocus(0);
					});
					this.saveLoading.locked = false;
					return false;
				};
				//check Qty
				if ($.isNull(qty) || isNaN(qty) || qty.length == 0) {
					var test = this._setting;
					ecount.alert(ecount.resource.MSG04140, function () {
						controlList[controlList.length - 1].setFocus(0);
					});
					this.saveLoading.locked = false;
					return false;
				};

				var retvalue = this.checkForRegisterSerialCode(controlList, serialLength);
				if ((retvalue || false) == false) {
					this.saveLoading.locked = false;
					return retvalue;
				}
				autoCode = this.autoCode;
			}
			else { /*직접입력*/

				var serialRegEx = new RegExp("\\t|", "gi");
				var serialLotNum_textarea = this.contents.getControl("serialLotNum_textarea");

				if (serialRegEx.test(serialLotNum_textarea.getValue()) && serialLotNum_textarea.getValue().indexOf(' ') > -1) {
					serialLotNum_textarea.showError(ecount.resource.MSG05380);
					this.saveLoading.locked = false;
					return false;
				}			

				var retvalue = this.checkForRegisterSerialCode(controlList, serialLength);
				if ((retvalue || false) == false) {
					this.saveLoading.locked = false;
					return retvalue;
				}
				autoCode = this.autoCode;
			}

		};

		var option = {};
		option["IO_DATE"] = this.IO_DATE || "";
		option["IO_NO"] = this.IO_NO || "";
		option["IO_TYPE"] = this.IO_TYPE || "";
		option["SERIAL_KEY"] = this.SERIAL_KEY || "0";
		option["SERIAL_DATE"] = this.SERIAL_DATE || "";

		option["txtUdcTxt1"] = txtUdcTxt1 || "";
		option["txtUdcTxt2"] = txtUdcTxt2 || "";
		option["txtUdcTxt3"] = txtUdcTxt3 || "";
		option["txtUdcTxt4"] = txtUdcTxt4 || "";
		option["txtUdcTxt5"] = txtUdcTxt5 || "";
		option["codeType1"] = codeType1 || "";
		option["codeType2"] = codeType2 || "";
		option["codeType3"] = codeType3 || "";
		option["txtUdcNum1"] = txtUdcNum1 || "";
		option["txtUdcNum2"] = txtUdcNum2 || "";
		option["txtUdcNum3"] = txtUdcNum3 || "";
		option["ddlYearUdcDt1"] = ddlYearUdcDt1 || "";
		option["ddlYearUdcDt2"] = ddlYearUdcDt2 || "";
		option["serialLotNum"] = this.controlList;
		option["willDeleteProdCd"] = this._willDeleteProdCd || [];
		option["expirationdate"] = result || {};

		if (prodCD.length <= 0) {
			ecount.confirm(ecount.resource.MSG06773,
				function (isOk) {
					if (isOk == true) {
						self.saveToDB(self, type, _wh_cd, _checkValue, option);
					}
				});
		}
		else {
			self.saveToDB(self, type, _wh_cd, _checkValue, option);
		};
	},

	getColumnUsed: function (column) {
		var col = this.inputFormDetail.columns.first(function (x) {
			return x.id == column;
		});
		return {
			isUse: (col.width || 0) != 0,
			title: col.title,
			dataType: col.dataType,
			subTitle: col.subTitle,
			id: col.id,
			isCheckZero: col.isCheckZero
		};
	},

	//convert status of slip to active or inactive 
	fnChangeStatus: function (useYN) {
		var self = this;
		var btnDelete = this.footer.get(0).getControl("deleteRestore");
		if (this.userpermit != "W") {
			btnDelete.setAllowClick();
			ecount.alert(ecount.resource.MSG00456);
			return false;
		}
		//create object JSON    
		var serialLists = [];
		serialLists.push({
			SerialIdx: self.SERIAL_IDX,
			ProdCD: self.PROD_CD != null ? self.PROD_CD : '',
			UseYN: useYN,
			EditFlag: ''
		});
		var formData = Object.toJSON({ SerialListInfo: serialLists });

		//Call api to update status of serial from Active to Inactive
		self.showProgressbar(true);
		ecount.common.api({
			url: "/Inventory/Serial/ChangeListStatus",
			data: formData,
			success: function (result) {
				if (result.Status != "200") {
					ecount.alert(result.fullErrorMsg + result.Data);
				}
				else {
					self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: self.SERIAL_IDX, unfocus: true });
					self.close(false);
				}
			},
			complete: function () {
				btnDelete.setAllowClick();
				self.hideProgressbar(true);
			}
		});
	},

	fnDeleteSerial: function (e) {
		var self = this;
		var btnDelete = this.footer.get(0).getControl("deleteRestore");
		//create object JSON    
		var serialLists = [];
		serialLists.push({
			SerialIdx: self.SERIAL_IDX,
			ProdCD: self.PROD_CD != null ? self.PROD_CD : '',
			UseYN: '',
			EditFlag: 'D'
		});
		var formData = Object.toJSON({ SerialListInfo: serialLists });

		self.showProgressbar(true);
		ecount.common.api({
			url: "/Inventory/Serial/DeleteListRegSerial",
			data: formData,
			success: function (result) {
				if (result.Status != "200") {
					ecount.alert(result.fullErrorMsg + result.Data);
				}
				else {
					if (!$.isEmpty(result.Data)) {
						self.fnErrMessage(result.Data, 'Delete');
					} else {
						self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: self.SERIAL_IDX, unfocus: true });
						self.close(false);
					}
				}
			},
			complete: function () {
				btnDelete.setAllowClick();
				self.hideProgressbar(true);
			}
		});
	},

	//show messasge error
	fnErrMessage: function (ErrMsg, type) {

		var formErrMsg = Object.toJSON(ErrMsg);

		var titleDate = null;
		msgWarning = null;
		titleMsg = null;
		menuName = null;

		if (type == 'Delete') {
			titleDate = String.format(ecount.resource.LBL04652);
			msgWarning = String.format(ecount.resource.MSG05281, ecount.resource.LBL35157);
			titleMsg = String.format(ecount.resource.MSG05282.replace('[', '').replace(']', ''), ecount.resource.LBL35157);
			menuName = String.format(ecount.resource.LBL10610);
		}
		else if (type == 'Insert') {
			titleDate = String.format(ecount.resource.LBL02371); //New Serial/Lot No.
			msgWarning = String.format(ecount.resource.LBL03651);//cannot insert
			titleMsg = String.format(ecount.resource.LBL01427);//Cause
			menuName = String.format(ecount.resource.BTN00339); //Insert
		}
		else if (type == "Update") {
			titleDate = String.format(ecount.resource.LBL03004);
			msgWarning = String.format(ecount.resource.LBL11925);
			titleMsg = String.format(ecount.resource.LBL01427);
			menuName = String.format(ecount.resource.LBL11926);
		};

		var param = {
			width: 600,
			height: 500,
			checkType: type,
			titleDate: titleDate,
			msgWarning: msgWarning,
			titleMsg: titleMsg,
			menuName: menuName,
			datas: formErrMsg
		};

		this.openWindow({
			url: "/ECERP/Popup.Common/NoticeCommonDeletable",
			name: ecount.resource.LBL06039,
			param: param,
			popupType: false,
			fpopupID: this.ecPageID
		});
	},

	fnValidation: function () {
		var iSerialCount = '';
		var strCritType = '';
		var iItemLen = 0;
		var strItemValue = '';
		var iItemValueLen = 0;
		var iItemCount = this._widget_combine_serialLotNum._settings.length;
		var strMsg = '';
		var rs = { index: 0, message: '' };
		var initSeting = this._widget_combine_serialLotNum._settings;
		var pattern = /\s/g;

		for (var i = 0; i < iItemCount; i++) {
			strCritType = initSeting[i].Key.CRIT_TYPE;
			iItemLen = initSeting[i].CD_LEN;
			strItemValue = this.controlList[2].getValue(i);
			iItemValueLen = strItemValue.length;

			if (strItemValue.match(pattern)) {
				rs = { index: 2, message: ecount.resource.MSG05380 };
				return rs;
			}

			if (iItemLen != iItemValueLen) {
				switch (strCritType) {
					case "R":
						strMsg = ecount.resource.MSG04135;
						break;
					case "Y":
						strMsg = ecount.resource.MSG04136;
						break;
					case "M":
						strMsg = ecount.resource.MSG04137;
						break;
					case "D":
						strMsg = ecount.resource.MSG04138;
						break;
				}
				strMsg = String.format(strMsg, iItemLen);
				//ecount.alert(strMsg);
				rs = { index: 2, message: strMsg };

				return rs;
			}
		}
		return null;
	},

	fnNewCheckValue2: function (th) {
		//th.value = th.value.trim();        
		var _retvalidate = this.contents.getControl("serialLotNum").validate();
		return;
		th.value = th.event.target == undefined ? th.value : th.event.target.value;
		var ProdCdLenth = (th.value.length || 0);
		var ErrFlag = "N";
		var ProdCd = "";
		for (var i = 0; i < ProdCdLenth; i++) {
			var code = th.value.substring(i, i + 1).charCodeAt(0);
			if ((code > 96 && code < 123) || (code > 64 && code < 91) || (code > 47 && code < 58) || (code == 16) || (code == 21) || (code == 33) || (code == 36) || (code == 40) || (code == 41)
				|| (code == 45) || (code == 46) || (code == 64) || (code == 91) || (code == 93) || (code == 94) || (code == 95) || (code > 123) || (code == 13) || (code == 10) || (code == 43))      //||(code == 32)
			{
				ProdCd += th.value.substring(i, i + 1);
			}
			else {
				ErrFlag = "Y";
			}
		};

		th.value = ProdCd;
		this.controlList[1].setValue(ProdCd);
	},

	onFunctionAutoCodePreview: function (type) {

		var _self = this;
		var iSerialCount = '',
			strCritType = '',
			iItemLen = 0,
			strItemValue = '',
			iItemValueLen = 0,
			iItemCount = this._widget_combine_serialLotNum._settings.length,//;  this.initData.config._settings.length,
			initSetting = this._widget_combine_serialLotNum._settings,// this.initData.config._settings,
			strMsg = '',
			result = [],
			autoCode = [],
			serialLength = Number(this._widget_combine_serialLotNum.NUM_DIGIT_LEN),
			repeatCount = this.controlList[this.controlList.length - 1].getValue()
		//repeatCode = this._repeatCode ? this.controlList[this._repeatCode.index + 1].getValue() : null;

		//데이터 타입별 자릿수 비교하여 안맞으면 메세지 띄워주기
		for (var i = 0; i < iItemCount; i++) {
			strCritType = initSetting[i].Key.CRIT_TYPE;
			iItemLen = initSetting[i].CD_LEN;
			strItemValue = this.controlList[2].getValue(i);
			iItemValueLen = strItemValue.length;

			if (iItemLen != iItemValueLen) {
				switch (strCritType) {
					case "R":
						strMsg = ecount.resource.MSG04135;
						break;
					case "Y":
						strMsg = ecount.resource.MSG04136;
						break;
					case "M":
						strMsg = ecount.resource.MSG04137;
						break;
					case "D":
						strMsg = ecount.resource.MSG04138;
						break;
				}
				strMsg = String.format(strMsg, iItemLen);
				ecount.alert(strMsg, function () {
					//_self.setFocus(i + 2);
					_self.controlList[2].setFocus(0);
				});

				return false;
			}
		}

		//반복횟수 오류 메세지
		if ($.isNull(repeatCount) || isNaN(repeatCount) || repeatCount.length == 0) {
			ecount.alert(ecount.resource.MSG04140, function () {
				//_self.setFocus(_self.controlList.length - 1);
				_self.controlList[_self.controlList.length - 1].setFocus(0);
			});
			return false;
		}

		//전체 자동코드 생성
		autoCode = (this.controlList.length == 4) ? _self.controlList[2].getValue() : [];
		///////////////////////////////////////////////////////////////


		var data = {
			SERIAL_UP: autoCode.join(""),
			NUM_LENGTH: serialLength
		}

		//Call api to insert 
		_self.showProgressbar(true);
		ecount.common.api({
			url: "/Inventory/Serial/GetMaxRegSerial",
			async: false,
			data: data,
			success: function (rs) {
				if (rs.Status != "200") {
					ecount.alert(rs.fullErrorMsg + rs.Data);
				}
				else {
					var rsData = rs.Data;
					var MAX = rsData[0] == null || rsData[0] == undefined ? 0 : Number(rsData[0].MAX);

					for (var i = 0; i < Number(repeatCount) ; i++) {
						var serialNumber = (i + 1 + MAX).toString();
						result.push(autoCode.join("") + serialNumber.padLeft(serialLength, "0"));
					}
					if (type != "I") {
						_self.toggle('2', result.join("\n"));
					} else {
						_self.autoCodeNew = result;
					}
				}
			},
			complete: function () {
				_self.hideProgressbar(true);
			}
		});
	},

    /** 
    * select 옵션 설정시 render할 때 호출, 이후 페이지나 내부함수 통해 호출
    * @param {string} state 기준value 값
    */
	toggle: function (state, value) {
		var serial = this.contents.getControl("serialLotNum");
		serial.toggle(state);
		if (value != null) {
			this.controlList[1].setValue(value);
		}
	},

    saveToDB: function (self, type, wh_cd, basicQty, option) {
		var serialList = [];
		if (((wh_cd[0] || "") !== "") && ((basicQty || "0") != "0")) {
			if (!this.viewBag.Permission.ESQ204M.Value.equals("W")) {
				var msgdto = ecount.common.getAuthMessage("", [{ MenuResource: ecount.resource.LBL08027, PermissionMode: "W" }]);  //             
				ecount.alert(msgdto.fullErrorMsg);
				this.saveLoading.locked = false;
				return;
			}
		};

		self.prodCDList = jQuery.unique(self.prodCDList); /*중복제거*/
		if (type == 1) {//Update               
			serialList.push({
				IO_DATE: option["IO_DATE"],
				IO_NO: option["IO_NO"],
				IO_TYPE: option["IO_TYPE"],
				SERIAL_KEY: option["SERIAL_KEY"],
				SERIAL_DATE: option["SERIAL_DATE"],
				SERIAL_IDX: self.SERIAL_IDX,
				PROD_CD: self.prodCDList.join(self.separateSign),
				UDC_TXT_01: option["txtUdcTxt1"],
				UDC_TXT_02: option["txtUdcTxt2"],
				UDC_TXT_03: option["txtUdcTxt3"],
				UDC_TXT_04: option["txtUdcTxt4"],
				UDC_TXT_05: option["txtUdcTxt5"],
				UDC_CD_01: option["codeType1"],
				UDC_CD_02: option["codeType2"],
				UDC_CD_03: option["codeType3"],
				UDC_NUM_01: option["txtUdcNum1"],
				UDC_NUM_02: option["txtUdcNum2"],
				UDC_NUM_03: option["txtUdcNum3"],
				UDC_DT_01: option["ddlYearUdcDt1"],
				UDC_DT_02: option["ddlYearUdcDt2"],
				WH_CD: wh_cd[0],
				BASIC_QTY: basicQty,
				WILL_DELETED_PROD_CD: option["willDeleteProdCd"],
				FROM_EXPIRATION_DATE: option["expirationdate"].from_date,
				TO_EXPIRATION_DATE: option["expirationdate"].to_date
			});

			var formData = Object.toJSON({ SerialList: serialList });
			//Call api to update info of serial  
			self.showProgressbar(true);
			ecount.common.api({
				url: "/Inventory/Serial/UpdateListRegSerial",
				data: formData,
				success: function (result) {
					if (result.Status != "200") {
						ecount.alert(result.fullErrorMsg + result.Data);
					}
					else {
						if (!$.isEmpty(result.Data)) {
							self.fnErrMessage(result.Data, 'Update');
						}
						else {
							if ((self.__ecPageID.toUpperCase().indexOf("ES025P")) >= 0) {
								self.sendMessage(self, { EditFlag: "M", callback: self.close.bind(self) })
							}
							else if ((self.__ecPageID.toUpperCase().indexOf("ES028P")) > -1) {

								self.sendMessage(self, { IO_DATE: option["IO_DATE"], IO_NO: option["IO_NO"], IO_TYPE: option["IO_TYPE"], EditFlag: "M", SERIAL_KEY: option["SERIAL_KEY"], SERIAL_DATE: option["SERIAL_DATE"], callback: self.close.bind(self) });

							}
							else {
								self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: self.SERIAL_IDX, unfocus: true });
								if (self.parentPageID == "ESQ202M") {
									self.sendMessage(self, {});
								}
								self.close(false);
							}
						}
					}
				},
				complete: function () {
					self.saveLoading.locked = false;
					self.hideProgressbar(true);
				}
			});
		}
		else {//create new            
			var controlList = option["serialLotNum"];
			var serialLength = Number(this._widget_combine_serialLotNum.NUM_DIGIT_LEN),
				qty = controlList[controlList.length - 1].getValue();
			var autoCode = [];

			if (controlList[0].getValue() == '1') {//save auto-serial                                           
				var rs = self.fnValidation();
				if (rs != null) {
					ecount.alert(rs.message, function () {
						controlList[rs.index].setFocus(0);
					});
					this.saveLoading.locked = false;
					return false;
				};

				var retvalue = this.checkForRegisterSerialCode(controlList, serialLength);
				if ((retvalue || false) == false) {
					this.saveLoading.locked = false;
					return false;
				};
				//new logic for create new
				if (self.editFlag == "I") {
					self.onFunctionAutoCodePreview("I");
					var qtyList = "",
						checkValueSerialLotList = self.SERIAL_IDXS,
						serial = self.SERIAL_IDX1;
					//get count value check exist 
					var valueExist = new Array();
					var countValue = 1;
					if (self.SERIAL_IDX1 != null) {
						valueExist = self.SERIAL_IDX1.replace(/\r/gi, "ㆍ").split("ㆍ");
						countValue = valueExist.length;
					}

					var arrSerials = new Array();
					arrSerials = self.autoCodeNew;
					for (var i = 0; i < arrSerials.length; i++) {
						//for case create new
						if (self.editFlag == "I") {
							var qtyNew = self.Check;
							if (countValue <= 100) {
								if ((['']).contains(checkValueSerialLotList) || checkValueSerialLotList == null)
									checkValueSerialLotList = arrSerials[i] + 'ㆍ' + qtyNew;
								else
									checkValueSerialLotList += ecount.delimiter + arrSerials[i] + 'ㆍ' + qtyNew;

								if ((['']).contains(serial) || serial == null)
									serial = arrSerials[i] + 'ㆍ';
								else
									serial += arrSerials[i] + 'ㆍ';

								qtyList += qtyNew + 'ㆍ';
							}
							countValue = countValue + 1;
						}
						//end
					}
					if (self.editFlag == "I") {
						self.SERIAL_IDX1 = serial;
						self.SERIAL_CNT = qtyList;
						self.SERIAL_IDXS = checkValueSerialLotList;
					}
				}
				//end

				autoCode = this.autoCode;
				serialList.push({
					IO_DATE: option["IO_DATE"],
					IO_NO: option["IO_NO"],
					IO_TYPE: option["IO_TYPE"],
					SERIAL_KEY: option["SERIAL_KEY"],
					SERIAL_DATE: option["SERIAL_DATE"],
					SERIAL_IDX: '',
					SERIAL_UP: autoCode.join(""),
					SERIAL_CNT: 0,
					NUM_LENGTH: serialLength,
					QTY: qty,
					PROD_CD: self.prodCDList.join(self.separateSign),
					UDC_TXT_01: option["txtUdcTxt1"],
					UDC_TXT_02: option["txtUdcTxt2"],
					UDC_TXT_03: option["txtUdcTxt3"],
					UDC_TXT_04: option["txtUdcTxt4"],
					UDC_TXT_05: option["txtUdcTxt5"],
					UDC_CD_01: option["codeType1"],
					UDC_CD_02: option["codeType2"],
					UDC_CD_03: option["codeType3"],
					UDC_NUM_01: option["txtUdcNum1"],
					UDC_NUM_02: option["txtUdcNum2"],
					UDC_NUM_03: option["txtUdcNum3"],
					UDC_DT_01: option["ddlYearUdcDt1"],
					UDC_DT_02: option["ddlYearUdcDt2"],
					WH_CD: wh_cd[0],
					BASIC_QTY: basicQty,
					FROM_EXPIRATION_DATE: option["expirationdate"].from_date,
					TO_EXPIRATION_DATE: option["expirationdate"].to_date
				});
			}
			else { //save manual-serial                  
				var txtSerial = controlList[1].getValue();
				txtSerial = txtSerial.replaceAll(" ", "").replaceAll("　", "").replaceAll("&nbsp;", "");

				if (txtSerial == '') {
					ecount.alert(ecount.resource.MSG02000);
					this.saveLoading.locked = false;
					return false;
				};
				var retvalue = this.checkForRegisterSerialCode(controlList, serialLength);
				if ((retvalue || false) == false) {
					this.saveLoading.locked = false;
					return false;
				};
				autoCode = this.autoCode;

				var arrSerials = new Array();
				arrSerials = txtSerial.replace(/\r/gi, "").split("\n");

				if (self.editFlag == "I") {
					var qtyList = "",
						checkValueSerialLotList = self.SERIAL_IDXS,
						serial = self.SERIAL_IDX1;
					//get count value check exist 
					var valueExist = new Array();
					var countValue = 1;
					if (self.SERIAL_IDX1 != null) {
						valueExist = self.SERIAL_IDX1.replace(/\r/gi, "ㆍ").split("ㆍ");
						countValue = valueExist.length;
					}

				}

				var pattern = /\s/g;
				for (var i = 0; i < arrSerials.length; i++) {
					//for case create new
					if (self.editFlag == "I") {
						if (arrSerials[i].match(pattern)) {
							this.contents.getControl("serialLotNum_textarea").showError(ecount.resource.MSG05380);
							this.saveLoading.locked = false;
							//break;
							return false;
						}

						var qtyNew = self.Check;
						if (countValue <= 100) {
							if ((['']).contains(checkValueSerialLotList) || checkValueSerialLotList == null)
								checkValueSerialLotList = arrSerials[i] + 'ㆍ' + qtyNew;
							else
								checkValueSerialLotList += ecount.delimiter + arrSerials[i] + 'ㆍ' + qtyNew;

							if ((['']).contains(serial) || serial == null)
								serial = arrSerials[i] + 'ㆍ';
							else
								serial += arrSerials[i] + 'ㆍ';

							qtyList += qtyNew + 'ㆍ';
						}
						countValue = countValue + 1;
					}
					//end

					serialList.push({
						IO_DATE: option["IO_DATE"],
						IO_NO: option["IO_NO"],
						IO_TYPE: option["IO_TYPE"],
						SERIAL_KEY: option["SERIAL_KEY"],
						SERIAL_DATE: option["SERIAL_DATE"],
						SERIAL_IDX: arrSerials[i],
						SERIAL_UP: '',
						SERIAL_CNT: 0,
						NUM_LENGTH: 0,
						QTY: qty,
						PROD_CD: self.prodCDList.join(self.separateSign),
						UDC_TXT_01: option["txtUdcTxt1"],
						UDC_TXT_02: option["txtUdcTxt2"],
						UDC_TXT_03: option["txtUdcTxt3"],
						UDC_TXT_04: option["txtUdcTxt4"],
						UDC_TXT_05: option["txtUdcTxt5"],
						UDC_CD_01: option["codeType1"],
						UDC_CD_02: option["codeType2"],
						UDC_CD_03: option["codeType3"],
						UDC_NUM_01: option["txtUdcNum1"],
						UDC_NUM_02: option["txtUdcNum2"],
						UDC_NUM_03: option["txtUdcNum3"],
						UDC_DT_01: option["ddlYearUdcDt1"],
						UDC_DT_02: option["ddlYearUdcDt2"],
						WH_CD: wh_cd[0],
						BASIC_QTY: basicQty,
						FROM_EXPIRATION_DATE: option["expirationdate"].from_date,
						TO_EXPIRATION_DATE: option["expirationdate"].to_date
					});
				}
				if (self.editFlag == "I") {
					self.SERIAL_IDX1 = serial;
					self.SERIAL_CNT = qtyList;
					self.SERIAL_IDXS = checkValueSerialLotList;
				}
			};
			var formData = Object.toJSON({ SerialList: serialList });
			//Call api to insert  
			self.showProgressbar(true);
			ecount.common.api({
				url: "/Inventory/Serial/InsertListRegSerial",
				data: formData,
                success: function (result) {
					if (result.Status != "200") {
						ecount.alert(result.fullErrorMsg + result.Data);
					}
					else {
						if (!$.isEmpty(result.Data)) {
							self.fnErrMessage(result.Data, 'Insert');
						}
						else {
							if ((self.__ecPageID.toUpperCase().indexOf("ES025P")) >= 0) {
								self.sendMessage(self, {
									EditFlag: "M",
									callback: self.close.bind(self)
								})
							}
                            else if ((self.__ecPageID.toUpperCase().indexOf("ES028P")) > -1) {
								if (self.editFlag == "I") {
									self.sendMessage(self, {
										SERIAL_DATE: option["SERIAL_DATE"],
										SERIAL_IDX1: self.SERIAL_IDX1,
										SERIAL_IDXS: self.SERIAL_IDXS,
										SERIAL_CNT: self.SERIAL_CNT,
										SERIAL_KEY: option["SERIAL_KEY"],
										PROD_CD: self.PROD_CD,
										EditFlag: "I",
										IO_NO: option["IO_NO"],
										IO_TYPE: option["IO_TYPE"],
										IO_DATE: option["IO_DATE"],
										callback: self.close.bind(self)
									});
								} else {
									self.sendMessage(self, { IO_DATE: option["IO_DATE"], IO_NO: option["IO_NO"], EditFlag: "M", IO_TYPE: option["IO_TYPE"], SERIAL_KEY: option["SERIAL_KEY"], SERIAL_DATE: option["SERIAL_DATE"], callback: self.close.bind(self) });
								}

                            } else if ((self.__ecPageID.toUpperCase().indexOf("ES027P")) > -1) {
                                self.sendMessage(self, { callback: self.close.bind(self) });
                            }
							else {
								self.getParentInstance(self.parentPageID)._ON_REDRAW({ serialIdx: self.SERIAL_IDX, unfocus: true });
								self.close(false);
							};
						}
					}
				},
				complete: function () {
					self.saveLoading.locked = false;
					self.hideProgressbar(true);
				}
			});
		};
	},

	checkForRegisterSerialCode: function (controlList, serialLength) { /*등록할 시리얼 체크*/
		var returnVallue = true;
		var autoCode = [];
		if (controlList[0].getValue() == '1') {/*자동생성*/
			autoCode = (this.controlList.length == 4) ? this.controlList[2].getValue() : [];

			var serialUp = autoCode.join("");
			if (this._isEnableSize100 == true) {
				if ((serialUp.length + serialLength) > 100) {    //check length of string                 
					ecount.alert(ecount.resource.LBL12495);
					returnVallue = false;
				};
			}
			else {
				if ((serialUp.length + serialLength) > 30) {    //check length of string                 
					ecount.alert(ecount.resource.MSG02204);
					returnVallue = false;
				};
			};
		}
		else { /*직접입력*/
			var serialData = [];
			var message = [];
			message.push(ecount.resource.LBL12495);

			var isRaisError = false;
			autoCode.push(controlList[1].getValue());
			var serialUp = autoCode.join("");
			if (serialUp.indexOf('\n') > -1) {
				for (var i = 0; i < (serialUp.split('\n') || []).length; i++) {
					if ((serialUp.split('\n')[i] || "") == "") continue;
					var e = (serialUp.split('\n')[i] || "");
					if (this._isEnableSize100 == true) {
						if (e.length > 100) {    //check length of string                 
							serialData.push({
								IO_DATE: e,
								MESSAGE: message
							});
							isRaisError = true;
							returnVallue = false;
						};
					}
					else {
						if (e.length > 30) {    //check length of string                 
							serialData.push({
								IO_DATE: e,
								MESSAGE: message
							});
							isRaisError = true;
							returnVallue = false;
						};
					}
				};
			}
			else {
				if (this._isEnableSize100 == true) {
					if ((serialUp.length) > 100) {    //check length of string                 
						serialData.push({
							IO_DATE: serialUp,
							MESSAGE: message
						});
						isRaisError = true;
						returnVallue = false;
					};
				}
				else {
					if ((serialUp.length) > 30) {    //check length of string                 
						serialData.push({
							IO_DATE: serialUp,
							MESSAGE: message
						});
						isRaisError = true;
						returnVallue = false;
					};
				};
			};
		};
		this.autoCode = autoCode;
		if (isRaisError == true)
			this.fnErrMessage(serialData, 'Insert');
		return returnVallue;
	}
});