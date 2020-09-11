window.__define_resource && __define_resource("BTN00534","LBL02279","LBL01457","LBL00336","BTN00008","BTN00065","BTN00067","BTN00765","BTN00007","BTN00410","BTN00959","BTN00204","BTN00203","BTN00033","MSG00297","MSG02641","MSG06830","MSG00306","BTN00236","BTN00541","BTN00453","LBL03142","LBL02876","LBL00359","LBL00385","MSG00229","LBL00329","LBL30023","LBL00726","MSG02582","MSG08770","LBL00338","LBL35400","LBL35399","LBL35398","LBL35397","LBL01484","LBL03529","LBL00381","MSG00078","LBL02881","MSG01392","LBL15093","LBL04090","MSG09786","LBL07553","LBL02339","MSG00299","LBL07280","LBL11065","MSG00291","MSG01119","MSG01121","MSG01674","MSG04400","MSG07833");
/****************************************************************************************************
1. Create Date : 2015.12.28
2. Creator     : ShinHeejun
3. Description : Inv/Acct > Setup > Customer/Vendor > New/Modify(재고/회계 > 기초등록 > 거래처등록 > 신규/수정)
4. Precaution  : 
5. History     : 
                2016-04-04 최용환 : 거래처 수금지급예정일 항목 리소스 분리
                2017.04.12(Hao) : add doc gubun for email 70 - internal use
                2017.05.04(Hao) : add doc gubun for email 34 - purchase
                2017.06.15(Thien.Nguyen) add condition HistoryFlag == y, oninitfooter
                2017.08.04(Hao) : add doc gubun for email 28 - Release Sales Order
                2018.07.25(Ngo Thanh Lam): Add maxlengh for Remarks field (Jobcode:A18_02066)
                2018.08.01(이용희): Dev.11188 거래처등록 - 거래처 이력확인 시 Last Update가 현재 시간으로 나타나는 문제
                2018.10.08(류상민): 주소 불러오기 기능 추가
                2018.12.05(문요한): 중복코드 체크 보여주기 공통화
                2018.12.21 (PhiVo) applied 17520-A18_04271
				2019.02.20 (DucThai): A19_00425 - 입력화면설정 기본값에따라 휴폐업조회 안되는 현상
                2019.05.29 [DucThai] A18_04115 - 임시삭제 용어 정리하기
                2019.06.21 (문요한) : 거래처삭제 Action3.0 호출
                2019.07.01 (이현택) : 거래처관계 등록으로 인한 선배포
				2019.07.03 (이현택) : 채권관리코드 체크로직 제거
                2019.10.10 (PhiTa) - A19_03554_메뉴별로 SC설정 팝업사이즈를 계산하는 API제거
                2019.11.07 (한재국) : 메일수신 거래처 매핑 입금표 추가
                2019.11.29 (Ngo Thanh Lam) : A19_02923 Remove validate Hyphen (-)
****************************************************************************************************/

ecount.page.factory("ecount.page.formsetBasic", "ESA002M", {
    /********************************************************************** 
    * page user opion Variables(사용자변수 및 객체) 
    **********************************************************************/

	custDataSet: null,         //CustInfomation(거래처 정보)
	tabTitleArray: null,       //CustInfomationTabTitleArray(거래처 정보 탭 타이틀)
	// 언어설정
	lan_type: null,
	// 조회된 거래처 정보
	custView: null,
	EditFlag: "I",
    /**********************************************************************
    *  page init
    **********************************************************************/ 
	init: function (options) {
		this._super.init.apply(this, arguments);

		this.initProperties();

	},

	initProperties: function () {
		this.custDataSet = new Object();
		this.tabTitleArray = ['CUST', 'PRICE', 'CONT'];

		$.extend(this.custDataSet, { Cust: new Object() });                                                     //CustInfomation(거래처 정보)    
		$.extend(this.custDataSet, { CustLevelGroupData: this.viewBag.InitDatas.CustLevelGroupData });          //CustLevelGroupInfomation(거래처 계층그룹 정보)
		$.extend(this.custDataSet, { EG_CardCom: new Object() });                                               //EGCardComInfomation(잠재거래처 정보)
		$.extend(this.custDataSet, { EG_CardComment: new Object() });                                           //EGCardCommentInfomation(명함관리 정보)
		$.extend(this.custDataSet, { CustPermission: this.viewBag.InitDatas.Permission });                      //Customer/Vendor Permission(거래처입력 권한)
		$.extend(this.custDataSet, { GroupWarePermission: this.viewBag.InitDatas.GroupwarePermission });        //Groupware Permission(그룹웨어 권한)
		$.extend(this.custDataSet, { TableWidthCust: this.viewBag.InitDatas.TableWidthCust });                  //CustSearchWidth(거래처 검색창 넓이)
		$.extend(this.custDataSet, { SelfCustomizingHeight: 0 });                                               //SelfCustomizingHeight(사용방법설정 설정값)
		$.extend(this.custDataSet, { AutoCodeData: this.viewBag.InitDatas.AutoCodeData });                      //If you entered the code generation Object(입력시 코드생성 Object)
		$.extend(this.custDataSet, {
			StringCommonData: this.viewBag.InitDatas.CommonCode.where(function (entity, i) {                    //StringCommonData(문자형 추가항목 타이틀 정보 Array)
				return entity.Key.CODE_CLASS == 'A10';
			}),

			NumberCommonData: this.viewBag.InitDatas.CommonCode.where(function (entity, i) {                    //NumberCommonData(숫자형 추가항목 타이틀 정보 Array)
				return entity.Key.CODE_CLASS == 'A13';
			}),

			ForeignCustData: this.viewBag.InitDatas.CommonCode.where(function (entity, i) {                     //ForeignCustData(외화거래처 정보 Array)
				return entity.Key.CODE_CLASS == 'S10';
			})
		});

		if ($.isEmpty(this.Cust)) {
			//CustInfomation(거래처 정보)

			//기초 입력화면 설정에서 내려온 값으로 값 설정
			this.custDataSet.Cust = this.viewBag.InitDatas.Cust[0];
			this.custDataSet.Cust.BUSINESS_NO = !$.isEmpty(this.GBusinessno) ? this.GBusinessno : this.viewBag.InitDatas.AutoNewCodeData;
			this.custDataSet.Cust.CUST_NAME = !$.isEmpty(this.GBusinessno) && !$.isEmpty(this.CustName) ? this.CustName : (this.custContentViewDto && this.custContentViewDto.CustNameString ?
				this.custContentViewDto.CustNameString : this.custDataSet.Cust.CUST_NAME);

			if (!$.isEmpty(this.GBusinessno)) {
				this.custDataSet.Cust.G_BUSINESSNO = this.GBusinessno;
			} else if (this.custDataSet.Cust.G_BUSINESS_TYPE == "1") {
				this.custDataSet.Cust.G_BUSINESSNO = this.custDataSet.Cust.BUSINESS_NO;
			} else if (this.custDataSet.Cust.G_BUSINESS_TYPE == "2") {
				this.custDataSet.Cust.G_BUSINESSNO = this.custDataSet.Cust.G_BUSINESSNO_CD;
            } else if (this.custDataSet.Cust.G_BUSINESS_TYPE == "3") {
                this.custDataSet.Cust.G_BUSINESSNO = this.custDataSet.Cust.G_BUSINESSNO_DIRECT_INPUT;
			}

			//EGCardComInfomation(잠재거래처 정보)
			$.extend(this.custDataSet.EG_CardCom, {
				CUST_IDX: '0',                                                                                  //CUST_IDX(업체정보 기본키)
				COMPANY_DES: '',                                                                                //CompanyName(업체명)
				TEL_NO: '',                                                                                     //PhoneNumber(전화번호)
				HP_NO: '',                                                                                      //CellPhoneNumber(핸드폰번호)
				FAX_NO: '',                                                                                     //FaxNumber(팩스번호)
				HOMEPAGE: '',                                                                                   //HomePageURL(홈페이지)
				COM_POST: '',                                                                                   //Post_NO(우편번호)
				COM_ADDR: '',                                                                                   //CompanyAddress(회사주소)
				CARD_GROUP: '',                                                                                 //CardGroup(카드그룹)
				PUBLIC_TYPE: '1',                                                                               //PublicType(공유여부)
				BANK_NAME: '',                                                                                  //BackName(은행명)
				ACCT_NAME: '',                                                                                  //AcctName(예금주명)
				ACCT_NO: '',                                                                                    //AcctNO(계좌번호)
				PJT_CD: '',                                                                                     //ProjectCode(프로젝트 코드)
				CUST: '',                                                                                       //CustCode(거래처코드)
				CUST_DES: '',                                                                                   //CustName(거래처명)
				IDATE: '',                                                                                      //InputDate(입력일자)
				IID: '',                                                                                        //InputID(입력자)
				CANCEL_YN: 'N',                                                                                 //CancelFlag(N:Ing, Y:Stop)(사용중단여부(N:사용중, Y:사용중단))
				EMAIL: '',                                                                                      //Email(이메일)
				COMMENT: ''                                                                                     //Comment(메모)
			});

			//EGCardCommentInfomation(명함관리 정보)
			$.extend(this.custDataSet.EG_CardComment, {
				SER_NO: '0',                                                                                    //SER_NO(순번)
				CUST_IDX: '0',                                                                                  //CUST_IDX(업체정보 기본키)
				COMPANY_DES: '',                                                                                //CompanyName(업체명)
				UNAME: '',                                                                                      //Name(성명)
				SITE: '',                                                                                       //Site(부서명)
				POS: '',                                                                                        //Position(직책)
				BIRTHDAY: '',                                                                                   //Birthday(생일)
				TEL_NO: '',                                                                                     //TelNo(전화번호)
				HP_NO: '',                                                                                      //HpNo(핸드폰번호)
				FAX_NO: '',                                                                                     //FaxNo(팩스번호)
				EMAIL: '',                                                                                      //Email(이메일
				HOMEPAGE: '',                                                                                   //HomePageURL(홈페이지)
				COM_POST: '',                                                                                   //Post_NO(우편번호)
				COM_ADDR: '',                                                                                   //CompanyAddress(회사주소)
				CARD_GROUP: '',                                                                                 //CardGroup1(카드그룹1)
				PUBLIC_TYPE: '1',                                                                               //PublicType(공유여부)
				PJT_CD: '',                                                                                     //ProjectCode(프로젝트)
				CUST: '',                                                                                       //CustCode(거래처코드)
				CUST_DES: '',                                                                                   //CustName(거래처명)
				CARD_GROUP2: '',                                                                                //CardGroup2(카드그룹2)
				CARD_GROUP3: '',                                                                                //CardGroup3(카드그룹3)
				OPTIN_GUBUN: 'N',                                                                               //NoRevice(수신거부여부)
				IN_GUBUN: '1',                                                                                  //Type(0:명함 1:거래처메일)
				MAIN_GUBUN: 'Y',                                                                                //Main(메인)
				KEYMAN_YN: '',                                                                                  //Importent(중요고객여부(N:일반고객, Y:중요고객))
				COMMENT: ''                                                                                     //COMMENT(메모)
			});
		}
		else {
			$.extend(this.custDataSet.Cust, this.viewBag.InitDatas.Cust);                                       //CustInfomation(거래처 정보)

			if (this.viewBag.InitDatas.EG_CardCom)
				$.extend(this.custDataSet.EG_CardCom, this.viewBag.InitDatas.EG_CardCom.Key,                    //EGCardComInfomation(잠재거래처 정보)
					this.viewBag.InitDatas.EG_CardCom);
			if (this.viewBag.InitDatas.EG_CardComment)
				$.extend(this.custDataSet.EG_CardComment, this.viewBag.InitDatas.EG_CardComment.Key,            //EGCardCommentInfomation(명함관리 정보)
					this.viewBag.InitDatas.EG_CardComment);
			this.EditFlag = "M";
		}
		this.custView = this.custDataSet.Cust;
		this.lan_type = this.viewBag.Language;

		//onInitControl 정보
		this._pageOption = { onInitControl: this.custOninitControl.bind(this) };
	},

	render: function () {
		this._super.render.apply(this);
	},

    /**********************************************************************
    * form render layout setting [onInitHeader, onInitContents, onInitFooter ...]
    **********************************************************************/
	//SettingHeaderOption(헤더 옵션 설정)
	onInitHeader: function (header) {
		var option = [];
		if (!this.custContentViewDto ||
			(this.custContentViewDto &&
				(this.custContentViewDto.isView != 'Y' && // View 모드아닌 경우
					!this.custContentViewDto.isSimpleSave    // 심플저장이 아닌 경우
				)
			)
		) {
			if (!this.isForTest) {
				option.push({ id: 'RegisterAddItem', label: ecount.resource.BTN00534 });                                //Resource : 추가항목등록
				option.push({ id: 'InputItemTemplate', label: ecount.resource.LBL02279 });                              //Resource : 입력항목설정
			}

		}
		option.push({ id: "SelfCustomizing", label: ecount.resource.LBL01457 });                                //Resource : 사용방법설정

		header.setTitle(ecount.resource.LBL00336)                                                               //Resource : 거래처등록
			.add('option', option, false);

		header.notUsedBookmark();
	},

	//SettingContentsOption(본문 옵션 설정)
	onInitContents: function (contents) {
		var tabContents = widget.generator.tabContents();

		tabContents
			.onSync()
			.setType('SI912')
			.setSeq(1)
			.template('register');

		contents.add(tabContents);
	},

	//SettingFooterOption(풋터 옵션 설정)
	onInitFooter: function (footer) {
		var toolbar = widget.generator.toolbar(),
			ctrl = widget.generator.control();

		if (this.custContentViewDto && this.custContentViewDto.isView == 'Y' || this.HistoryFlag == 'Y') {          // View 모드인 경우
			toolbar.addLeft(ctrl.define('widget.button', 'close').label(ecount.resource.BTN00008));                 //Resource : 닫기
			toolbar.addLeft(ctrl.define('widget.button', 'history').label('H'));
		} else if (this.custContentViewDto && this.custContentViewDto.isSimpleSave) {                               //간편한 저장방식(ex: 수정세금계산서에서 공급받는자 거래처를 수정하는 경우)
			toolbar.addLeft(ctrl.define("widget.button", "save").label(ecount.resource.BTN00065).clickOnce());      //Resource : 저장(F8)  
			toolbar.addLeft(ctrl.define('widget.button', 'close').label(ecount.resource.BTN00008));                 //Resource : 닫기
			toolbar.addLeft(ctrl.define('widget.button', 'history').label('H'));
		} else {

			toolbar.addLeft(
				ctrl.define("widget.button.group", "save").label(ecount.resource.BTN00065)                              //Resource : 저장(F8)  
					.addGroup(
						this.custContentViewDto && !this.custContentViewDto.isSaveGroupButtonDisplay ?                      //if have custContentViewDto, not display AddGroupButton(거래처수정에 부가정인 정보가 호출되는 경우(기본적인 경로가 아닌 경우), 저장/내용유지, 저장/신규 버튼을 보이지 않음)
							[] :
							[
								{ id: 'saveReview', label: ecount.resource.BTN00067 },                                          //Resource : 저장/내용유지 
								{ id: 'saveNew', label: ecount.resource.BTN00765 }                                              //Resource : 저장/신규
							])
					.clickOnce());

			toolbar.addLeft(ctrl.define('widget.button', 'reWrite').label(ecount.resource.BTN00007));               //Resource : 다시작성

			if ($.isEmpty(this.Cust)) {
				toolbar.addLeft(ctrl.define('widget.button', 'webUpload').label(ecount.resource.BTN00410));         //Resource : 웹자료올리기 
				toolbar.addLeft(ctrl.define('widget.button', 'close').label(ecount.resource.BTN00008));             //Resource : 닫기
			}
			if (!$.isEmpty(this.Cust)) {
				toolbar.addLeft(ctrl.define('widget.button.group', 'deleteRestore').label(ecount.resource.BTN00959)        //Resource : 삭제
					.css("btn btn-default")
					.addGroup([
						{ id: 'use', label: ((this.custDataSet.Cust.CANCEL == 'N') ? ecount.resource.BTN00204 : ecount.resource.BTN00203) },               //Resource : 재사용, 사용중단
						{ id: 'delete', label: ecount.resource.BTN00033 }
                    ])
                    .noActionBtn().setButtonArrowDirection("up")
				);
				toolbar.addLeft(ctrl.define('widget.button', 'close').label(ecount.resource.BTN00008));             //Resource : 닫기
				toolbar.addLeft(ctrl.define('widget.button', 'history').label('H'));
			}
		}

		footer.add(toolbar);
	},

    custOninitControl: function (cid, control) {
		switch (cid) {
			case "REMARKS":
				if (control.end().controlType == "widget.textarea") {
					control.filter("maxlength", { message: String.format(ecount.resource.MSG00297, "2000", "2000"), max: 2000 });
				}
				control.value(this.custView.REMARKS);
				control.popover(ecount.resource.MSG02641);
                break;
            case 'BUSINESS_NO':
                var selfObj = this;
                //BUSINESS_NO(거래처코드)
                if (!selfObj._isFormSetting && !selfObj._isChangeData) {
                    if (!selfObj.isNotUsePopover) {
                        control.popover(ecount.resource.MSG06830);
                    }
                    if (selfObj.EditFlag != "M") {
                        control
                            .filter('maxbyte', { message: String.format(ecount.resource.MSG00297, '15', '30'), max: 30 })                                   //Resource : 입력한 내용은 한글 15, 영문 30 자 까지 사용 가능합니다. \n\n문자수를 확인 바랍니다.
                            .dataRules(['required'], ecount.resource.MSG00306)                                                                              //Resource : 거래처코드를입력하세요. 
                            .value(selfObj.custView.BUSINESS_NO);

                        if (!selfObj._isFormSetting) { //입력화면 설정 아닌 경우
                            control.hasFn([{ id: 'custCodeCheck', label: ecount.resource.BTN00236 }, { id: 'custCodeCreate', label: ecount.resource.BTN00541 }])   //Resource : 중복확인, 코드생성
                        }
                    }
                    else {
                        control
                            .label(selfObj.custView.BUSINESS_NO);

                        if (!selfObj._isFormSetting) {
                            control.hasFn([{ id: 'custCodeChange', label: ecount.resource.BTN00453 }])                                                             //Resource : 코드변경
                        }
                    }
                } else if (selfObj._isChangeData) {
                    control.end().controlType = "widget.label";
                    control.label((selfObj.custView) ? selfObj.custView.BUSINESS_NO : "");
                }
                break;
			default:
				this._super.custOninitControl.apply(this, arguments);
				break;
		}
	},

	onInitControl_Submit: function (cid, control) {
	},

	//ChangeControl(컨트롤 변경시)
	onChangeControl: function (control) {

		switch (String(control.cid)) {
			//Change BUSINESS_NO(거래처코드 변경)
            case 'BUSINESS_NO': //거래처코드 변경 시 > 세무신고거래처(거래처동일)의 값도 같음
				if (this.contents.getControl('G_BUSINESS', 'CUST').get(0).getValue() == '1')
					this.contents.getControl('G_BUSINESS', 'CUST').get(1).setValue(0, control.value, true);
				break;
			//Change FOREIGN_FLAG(외화거래처)
			case 'FOREIGN_FLAG':
				if (control.value == '99999') {
					var param = {
						width: 755,
						height: 400,
						editFlag: "I",
						codeClassType: 'S10',
						codeClassDes: ecount.resource.LBL03142,                                                                                                     //Resource : 환율
						isCloseDisplayFlag: true,
						popupType: false,
						additional: false
					};

					this.openWindow({
						url: '/ECERP/ESA/ESA035M',
						name: ecount.resource.LBL02876,                                                                                                             //Resource : 코드등록
						param: param,
						additional: false
					});
				}
				break;
			//Change G_BUSINESS_TYPE(세무신고거래처구분 변경)
            case 'G_BUSINESS_businessType':
				if (control.value == '1') { // 거래처 동일
					this.contents.getControl('G_BUSINESS', 'CUST').get(1).setValue(this.contents.getControl('BUSINESS_NO', 'CUST').getValue());

					if (this.contents.getControl('G_BUSINESS', "BASIC")) { //기본 탭에 세무신고거래처가 존재한다면
						this.contents.getControl('G_BUSINESS', 'BASIC').get(1).setValue(this.contents.getControl('BUSINESS_NO', 'BASIC').getValue());
					}
                }
				break;
			//Change IO_CODE_SL_BASE_YN(거래유형(영업) 구분 변경)
			case 'IO_CODE_SL_ioCodeBaseYn':
				if (control.value == 'Y') {
					this.contents.getControl('IO_CODE_SL', 'CUST').get(1).hide();

					if (this.contents.getControl('IO_CODE_SL', "BASIC"))
						this.contents.getControl('IO_CODE_SL', 'BASIC').get(1).hide();
				}
				else {
					this.contents.getControl('IO_CODE_SL', 'CUST').get(1).show();

					if (this.contents.getControl('IO_CODE_SL', "BASIC"))
						this.contents.getControl('IO_CODE_SL', 'BASIC').get(1).show();
				}
				break;
			//Change IO_CODE_SL SelectBox(거래유형(영업) 선택값 변경)
			case 'IO_CODE_SL_ioTypeSale':
				if (control.value == '99999') {
					var param = {
						width: 755,
						height: 400,
						EDITFLAG: 'I',
						IOTYPE: '1',
						isCloseDisplayFlag: true,
						popupType: false,
						additional: false
					};

					this.openWindow({
						url: '/ECERP/EMJ/EMJ001P_02',
						name: ecount.resource.LBL02876,                                                                                                             //Resource : 코드등록
						param: param
					});
				}
				break;
			//Change IO_CODE_BY_BASE_YN(거래유형(구매) 구분 변경)
			case 'IO_CODE_BY_ioCodeBaseYn':
				if (control.value == 'Y') {
					this.contents.getControl('IO_CODE_BY', 'CUST').get(1).hide();

					if (this.contents.getControl('IO_CODE_BY', "BASIC"))
						this.contents.getControl('IO_CODE_BY', 'BASIC').get(1).hide();
				}
				else {
					this.contents.getControl('IO_CODE_BY', 'CUST').get(1).show();

					if (this.contents.getControl('IO_CODE_BY', "BASIC"))
						this.contents.getControl('IO_CODE_BY', 'BASIC').get(1).show();
				}
				break;
			//Change IO_CODE_BY SelectBox(거래유형(구매) 선택값 변경)
			case 'IO_CODE_BY_ioTypeBuy':
				if (control.value == '99999') {
					var param = {
						width: 755,
						height: 400,
						EDITFLAG: 'I',
						IOTYPE: '2',
						isCloseDisplayFlag: true,
						popupType: false,
						additional: false
					};

					this.openWindow({
						url: '/ECERP/EMJ/EMJ001P_02',
						name: ecount.resource.LBL02876,                                                                                                             //Resource : 코드등록
						param: param
					});
				}
				break;
		}
	},

    /********************************************************************** 
    * event grid listener [click, change...] 
    **********************************************************************/
	onLoadComplete: function (e) {
		//Setting Focus(초기 포커스 지정)
		

        //무조건 거래처 코드에 포커스 가도록 변경 - dknam(이승용 확인)
		//if ($.isEmpty(this.Cust)) {
		//	if (this.custDataSet.AutoCodeData.USE_AUTOMAKE)
		//		_focusControl = this.contents.getControl('CUST_NAME', 'BASIC');
		//	else
		//		_focusControl = this.contents.getControl('BUSINESS_NO', 'BASIC');
		//}
		//else {
		//	_focusControl = this.contents.getControl('CUST_NAME', 'BASIC');
		//}
        var _focusControl = this.contents.getControl('BUSINESS_NO', 'BASIC');
        if (_focusControl) {
            _focusControl.setFocus(0);
        }
		
		//G_BUSINESS(세무신고거래처관련)
        var g_businesstype = Number(this.custDataSet.Cust.G_BUSINESS_TYPE);
        if ([1, 2, 3].contains(g_businesstype)) {
            this.contents.getControl('G_BUSINESS', 'CUST').get(g_businesstype).show();

            if (this.contents.getControl('G_BUSINESS', 'BASIC'))
                this.contents.getControl('G_BUSINESS', 'BASIC').get(g_businesstype).show();
        }
        

		if (this.isChangeTab == true) {
			this.contents.changeTab(this.tabId, false);
			ctrl = this.contents.getControl(this.controlId, this.tabId);
			ctrl.setFocus(0);
		}

		//SelfCustomizing Setup(사용방법설정 일괄작업 반영)
		this.selfCustomizingHeight = 1710;
	},

	onLoadTabPane: function (e) {
		if (this.custContentViewDto && this.custContentViewDto.isView == 'Y') { // View 모드인 경우
			if (e.tabId != "BASIC") {
				this.contents.getTabContents().hideTab(e.tabId);
			}
		}
	},

	onGridRenderComplete: function (e, data) {
		this._super.onGridRenderComplete.apply(this, arguments);
	},

	onChangeContentsTab: function (event) {
		if (!$.isEmpty(this.Cust)) {
			var form = this.contents.getForm(event.tabId).first();
			if (form) {
				form.changePopover(this.contents.getControl('BUSINESS_NO').id, {
					message: event.tabId == 'BASIC' || event.tabId == 'CUST' ? ecount.resource.MSG06830 : ecount.resource.LBL00359 + ' : ' + this.custDataSet.Cust.CUST_NAME        //Resource : 사업자(주민, 외국인)등록번호 사용을 권고합니다.<br/>임의번호로도 입력 가능합니다.(영,숫자만 입력),  상호(이름) 
				});
			}
		}
	},

    /********************************************************************** 
    * event  [button, link, FN, optiondoropdown..] 
    **********************************************************************/
	//포커스가 위젯컨트롤들에서 벗어났을 때
	onFocusOutHandler: function () {
		var ctrl = this.footer.getControl("save");
		ctrl && ctrl.setFocus(0);
	},

	//RegisterAddItem(추가항목등록)
	onDropdownRegisterAddItem: function () {
		var _success = true;                                                                    //Validity check success of each stage(각 단계별 유효성체크 성공여부)

		//1. Permission(권한체크)
		if (_success)
			_success = this.checkCreateCustPermission();                                        //Check ESA002M Create Permission(거래처입력 입력 권한체크)

		if (_success) {
			var param = {
				width: 820,
				height: 450,
				hidTab: "",
				cust_save: "Y",
				menu_gubun: "A10",
				code_class: "A10",
				class_des: ecount.resource.LBL00385                                             //Resource : 거래처코드의추가항목     
			};

			this.openWindow({
				url: '/ECERP/Popup.Common/ESA002P_01',
				param: param
			});
		}
	},

	//InputItemTemplate(입력항목설정)
	onDropdownInputItemTemplate: function () {
		var _success = true;                                                                    //Validity check success of each stage(각 단계별 유효성체크 성공여부)

		//1. Permission(권한체크)
		if (_success)
			_success = this.checkCreateCustPermission();                                        //Check ESA002M Create Permission(거래처입력 입력 권한체크)

		if (_success) {
			var param = {
				width: 800,
				height: 700,
				FORM_TYPE: "SI912",
				FORM_SEQ: 1
			};

			this.openWindow({
				url: "/ECERP/Popup.Form/CM100P_07_CM",
				name: ecount.resource.LBL02279,
				param: param
			});
		}
	},

	//Dropdown Self-Customizing click event(사용방법설정)
	onDropdownSelfCustomizing: function (e) {
		this.openWindow({
			url: '/ECERP/ESC/ESC002M',
			name: ecount.resource.LBL01457,
			param: {
				width: 750,
				height: 1710,
				PRG_ID: this.viewBag.DefaultOption.PROGRAM_ID
			},
			fpopupID: this.ecPageID,
			popupType: false,
		});
	},

	//CustCodeCreate(거래처코드 생성)
	onFunctionCustCodeCreate: function () {
		if (!this.custDataSet.AutoCodeData.USE_AUTOMAKE) {
			var msf = String.format(ecount.resource.MSG00229, ecount.resource.LBL00329, ecount.resource.LBL30023, ecount.resource.LBL00726);    //Resource : {0}코드자동생성기능을 사용하지 않고 있습니다.\n\n자동생성기능 설정은 Self-Customizing > 환경설정 > 사용방법설정 > {1} > {2} > 설정 에서 확인 바랍니다., 거래처, 회계 I, 거래처코드자동생성기능 
			this.setTimeout(function () {
				ecount.alert(msf);
			});
			return false;
		}

		var params = {
			height: 250,
			width: 820,
			autoNumberSettings: encodeURIComponent(Object.toJSON([{ CODE_TYPE: "1" }])),
			programID: this.viewBag.DefaultOption.PROGRAM_ID
		};

		this.openWindow({
			url: '/ECERP/Popup.Search/CM102P',                                                                  //Resource : 코드생성
			name: ecount.resource.BTN00541,
			param: params,
			additional: false
		});
	},

	//Redundancy check BusinessNo(거래처코드 중복확인)
	onFunctionCustCodeCheck: function () {
		var btn = this.footer.get(0).getControl("save");
		var tabId = this.contents.currentTabId == "BASIC" ? "BASIC" : "CUST";
		var ctrl = this.contents.getControl("BUSINESS_NO", tabId);
		var _custCodeControlValue = ctrl.getValue().trim();
		if (_custCodeControlValue == "") {
			ctrl.showError(ecount.resource.MSG02582);
			ctrl.setFocus(0);
			btn.setAllowClick();
		} else {
			if (ecount.common.ValidCheckSpecialForCodeType(_custCodeControlValue).result)
				//If user entried data, call to API to check the item existed or not
				ecount.common.api({
					url: "/Account/Basic/CheckExistedCustCommon",
					data: Object.toJSON({ CUST: { BUSINESS_NO: _custCodeControlValue } }),
					success: function (result) {
						if (result.Status != "200") {
							alert(result.fullErrorMsg);
						} else {
							if (result.Data != null) {
								var msg = "";
								switch (result.Data.GUBUN) {
									case "11":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL00338);
										break;
									case "14":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35400);
										break;
									case "15":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35399);
										break;
									case "20":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35398);
										break;
									case "30":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35397);
										break;
									case "90":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL01484);
										break;
									case "GY":
										msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL03529);
										break;
									default:
										break;
								}
								ctrl.showError(msg);
								ctrl.setFocus(0);
							} else {
								this.callOverlapCheckCommon(ecount.resource.LBL00381, 'business_no', _custCodeControlValue);
							}
						}
					}.bind(this),
					complete: function () {
						btn.setAllowClick();
					},
				});
			else {
				ctrl.setFocus(0);
				btn.setAllowClick();
			}
		}
	},

	//CustCodeCreate(거래처코드 생성)
	onFunctionCustClosureStatus: function () {        
		var custControl = this.contents.getControl("G_BUSINESS");
		var company_name = this.contents.getControl("CUST_NAME");

        var radioBtnValue = parseInt(custControl.get(0).getValue());        

        if ($.isEmpty(custControl.get(radioBtnValue).getValue()) == true) {
            custControl.showError(ecount.resource.MSG00078);
            custControl.setFocus(0);
            return false;            
        }

        var titleName = "Notice";
        var business_no = custControl.get(radioBtnValue).getValue();

		this.openWindow({
			url: "/ECERP/ECTAX/NoticeClosureStatus",
			name: titleName,
			popupType: false,
			param: {
				width: 800,
				height: 500,
				isOpenPopup: true,
				COMPANY_NAME: company_name.getValue(),
				BUSINESS_NO: business_no
			},
		});
	},

	//Change CustCode(거래처코드 변경)
	onFunctionCustCodeChange: function () {
		var _success = true;

		_success = this.checkModifyCustPermission(function () {                             //Check ESA002M Modify Permission(거래처입력 수정 권한체크)
			this.hideProgressbar();                                                         //Rights city check failure and reactivate(권한체크 실패 시 다시 활성화)
			this.footer.getControl("save").setAllowClick();                                 //Tolerance, storage button again when check power failure(권한체크 실패 시 저장버튼 다시허용)
		}.bind(this));

		if (_success) {
			var param = {
				width: ecount.infra.getPageWidthFromConfig(true),
				height: 300,
				Code: this.custDataSet.Cust.BUSINESS_NO,
				CodeDes: this.custDataSet.Cust.CUST_NAME,
				RequestType: 'cust',
				RequestSubType: "1"
			};

			this.openWindow({
				url: '/ECERP/Popup.Common/ESA002P_02',
				name: ecount.resource.LBL02881,                                                                     //Resource : 코드변경
				additional: false,
				param: param
			});
		}
	},

	//Change CustName(거래처코드명 중복확인)
	onFunctionCustCodeNameCheck: function () {
		var _custCodeNameControl = this.contents.getControl('CUST_NAME');
		var _custCodeNameControlValue = this.contents.getControl('CUST_NAME').getValue();

		if (ecount.common.ValidCheckSpecialForCodeType(_custCodeNameControlValue).result)
			this.callOverlapCheckCommon(ecount.resource.LBL00359, 'business_des', _custCodeNameControlValue);       //Resource : 거래처명
		else
			_custCodeNameControl.setFocus(0);
	},

	//LinkEGCardCom(잠재거래처연결)
	onFunctionEGCardComLink: function () {
		var param = {
			width: 500,
			height: 600,
			SEARCHTEXT: this.contents.getControl('CUST_NAME', "CUST").getValue()
		};

		this.openWindow({
			url: '/ECERP/Popup.Search/ES026P',
			param: param
		});
	},

	//AddEmails(이메일 추가)
	onFunctionEmailAdding: function () {
		if (this.EditFlag == "M")
			this.callMoblieEmailAddingPage();
		else
			ecount.alert(ecount.resource.MSG01392);
	},

	//AddMobile(모바일 추가)
	onFunctionMoBileAdding: function () {
		if (this.EditFlag == "M")
			this.callMoblieEmailAddingPage();
		else
			ecount.alert(ecount.resource.MSG01392);
	},

	//AddrAdding(배송지 추가)
	onFunctionAddrAdding: function (e) {
		var param = {
			width: 650,
			height: 650,
			BUSINESS_NO: this.custDataSet.Cust.BUSINESS_NO,
			ADDR_TYPE: e.pcontrolID == "POST_NO" ? "1" : "2"
		};

		this.openWindow({// Open popup
			url: '/ECERP/ESA/ESA001P_15',
			name: ecount.resource.LBL15093,
			param: param
		});
	},

	//LinkAddress1(우편번호1)    
	onContentsPOST_NOaddrLink: function (e) {
		var param = {
			width: ecount.infra.getPageWidthFromConfig(1),
			height: 500,
			strType: '1'
		};

		this.openWindow({
			url: '/ECERP/Popup.Search/CM004P',
			name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
			param: param,
			additional: false
		});
	},

	//LinkAddress2(우편번호2)
	onContentsDM_POSTaddrLink: function (e) {
		var param = {
			width: ecount.infra.getPageWidthFromConfig(1),
			height: 500,
			strType: '2'
		};

		this.openWindow({
			url: '/ECERP/Popup.Search/CM004P',
			name: ecount.resource.LBL04090,                                                                     //Resource : 우편번호검색
			param: param,
			additional: false
		});
	},

	//FileManage(파일관리)
    onContentsFILECNT: function (e) {
        //var locationAllow = ecount.infra.getGroupwarePermissionByAlert(this.custDataSet.GroupWarePermission).Excute();
        //if (locationAllow) {
        if ($.isEmpty(this.custDataSet.EG_CardCom.CUST_IDX)) {
            ecount.alert(ecount.resource.MSG09786);
            return false;
        }
        if ($.isEmpty(this.Cust)) {
            ecount.alert(ecount.resource.MSG01392);
            return false;
        }
        var param = {
            width: 780,
            height: 800,
            //code: this.custDataSet.Cust.BUSINESS_NO,
            //code_des: this.custDataSet.Cust.CUST_NAME
            BOARD_CD: 7001,
            custCdAllInOne: this.custDataSet.EG_CardCom.CUST_IDX,
            custDesAllInOne: this.custDataSet.EG_CardCom.COMPANY_DES,
            TITLE: "[" + this.custDataSet.Cust.BUSINESS_NO + "] " + this.custDataSet.Cust.CUST_NAME,
            isFileManage: true
        };

        this.openWindow({
            //url: encodeURI('/ECMAIN/ESA/ESA009P_04.aspx?b_type=A01'),
            url: "/ECERP/EGM/EGM024M",
            name: ecount.resource.LBL07553,
            param: param,
            popupType: false,
            popupID: this.ecPageID
        });
        //	}
    },

	//Save(저장)
	onFooterSave: function (e) {
		this.checkExistedCustCode(this.dataSave.bind(this), 'SAVEANDCLOSE');  //SaveAndPopupClose(저장/팝업닫기)
	},

	//Click SaveAndContentMaintenance(저장/내용유지 버튼 클릭)
	onButtonSaveReview: function () {
		this.checkExistedCustCode(this.dataSave.bind(this), 'SAVEANDMODIFY'); //SaveAndPopupModify(저장/내용유지)
	},

	//Click SaveAndNew(저장/신규버튼 클릭)
	onButtonSaveNew: function () {
		this.checkExistedCustCode(this.dataSave.bind(this), 'SAVEANDNEW'); //SaveAndPopupNew(저장/신규)
	},

	//Rewrite(다시작성)
	onFooterReWrite: function (e) {
		var cust = this.Save_Cust != null ? this.Save_Cust : this.Cust
		var param = {};

		if (cust == null || cust == undefined) {
			param.Cust = ''
		}
		else {
			param.Cust = cust
		}

		this.onAllSubmitSelf('/ECErp/ESA/ESA002M', param);
	},

	//WebUpload(웹자료올리기)
	onFooterWebUpload: function (e) {
		var _success = true;                                                                    //Validity check success of each stage(각 단계별 유효성체크 성공여부)

		//1. Permission(권한체크)
		if (_success)
			_success = this.checkCreateCustPermission();                                        //Check ESA002M Create Permission(거래처입력 입력 권한체크)

		if (_success) {
			if (_success) {
				this.openWindow({
					url: '/ECERP/Popup.Common/BulkUploadForm', //'/ECERP/Popup.Common/EZS001M',
					name: ecount.resource.LBL02339,
					additional: true,
					popupType: false,
					param: {
						width: 1000,
						height: 640,
						FormType: 'SI912',
						IsGetBasicTab: true
					}
				});
			}
		}
	},

	//Close(닫기)
	onFooterClose: function (e) {
		this.close();
	},

	//Suspension use/misuse(사용/사용중단)
	onButtonUse: function (e) {
		this.showProgressbar();
		var _success = true;                                                                    //Validity check success of each stage(각 단계별 유효성체크 성공여부)
		var btnDelete = this.footer.get(0).getControl("deleteRestore");
		//1. Permission(권한체크)
		if (_success) {
			_success = this.checkModifyCustPermission(function () {                             //Check ESA002M Modify Permission(거래처입력 수정 권한체크)
				btnDelete.setAllowClick();
				this.hideProgressbar();                                                         //Rights city check failure and reactivate(권한체크 실패 시 다시 활성화)
				this.footer.getControl("save").setAllowClick();                                 //Tolerance, storage button again when check power failure(권한체크 실패 시 저장버튼 다시허용)
			}.bind(this));
		}

		if (_success) {
			//Call UseFlag API(사용중단 API호출)
            ecount.common.api({
                url: '/SVC/Common/Infra/UpdateUseData',
                data: Object.toJSON(
                    {
                        Request: {
                            Data: {
                                BASIC_CODE: this.custDataSet.Cust.BUSINESS_NO,                              //a customer's code to get out of users(사용/사용중단할 거래처코드)
                                MENU_TYPE: "Customer",                                                      //Type (Secured game plan : customer) / stop using(사용/사용중단할 유형 (Customer:거래처))
                                CANCEL_YN: (this.custDataSet.Cust.CANCEL == 'Y') ? 'N' : 'Y'                //Suspension use/misuse division(사용/사용중단 구분)
                            }
                        }
                    }
                ),
				error: function (e) {
					this.hideProgressbar();
				}.bind(this),
				success: function (result) {
					this.hideProgressbar();
					this.sendMessage(this, {});
					this.setTimeout(function () {
						this.close();
					}.bind(this), 0);
				}.bind(this),
				complete: function () {
					btnDelete.setAllowClick();
				}
			});
		} else {
			btnDelete.setAllowClick();
		}
	},
	onFooterDeleteRestore: function (e) {
		this.footer.get(0).getControl("deleteRestore").setAllowClick();
	},

	//Delete(삭제)
	onButtonDelete: function (e) {
		this.showProgressbar();
		var _success = true;                                                                    //Validity check success of each stage(각 단계별 유효성체크 성공여부)
		var btnDelete = this.footer.get(0).getControl("deleteRestore");

		//1. Permission(권한체크)
		if (_success) {
			_success = this.checkDeleteCustPermission(function () {                             //Check ESA002M Delete Permission(거래처입력 입력 권한체크)
				this.hideProgressbar();                                                         //Activated when Permission check to fail(권한체크 실패시 다시 활성화)
				btnDelete.setAllowClick();                                                      //Acceptance check storage button when they fail again permission(권한체크 실패 시 저장버튼 다시허용)
			}.bind(this));
		}

		if (_success) {
			ecount.confirm(ecount.resource.MSG00299, function (_confirm) {                      //Resource : 삭제하겠습니까?
				if (!_confirm) {
					btnDelete.setAllowClick();
					this.hideProgressbar();
					return false;
				}

                var formdata = {
                    Data: {
                        DeleteCodes: {
                            MENU_CODE: "Customer",                                                  //Delete type ( the customer : customers )(삭제 유형 (Customer:거래처))
                            CHECK_TYPE: "B",                                                        //Check the destination before deleting menu (S: Inventory , A: Common Account , B: (S && ​​A), N:!(S && ​​A)(삭제 전 체크대상메뉴 (S:재고공통, A:회계공통, B:(S && A), N: !(S && A))
                            DELETE_TYPE: "SEARCH",                                                  //Delete type (SEARCH: and deal , select Delete - check perform logic , ALL: Delete All , Delete Data Management - Check logic non- performing )(삭제 타입 (SEARCH:건별,선택삭제 -체크로직 수행, ALL:전체삭제, 데이터관리 삭제 -체크로직 미수행))
                            PARAMS: [this.custDataSet.Cust.BUSINESS_NO]                             //Should be deleted Cust Code(삭제할 거래처코드)                        
                        }
                    }
				};

				//Call Delete API(삭제 API호출)
				ecount.common.api({
					url: "/SVC/Account/Basic/CustDeleteList",
					data: Object.toJSON(formdata),
					error: function (e) {
						this.hideProgressbar();
					}.bind(this),
					success: function (result) {
						if (result.Status != "200")
							ecount.alert(result.fullErrorMsg + result.Data);
						else if (result.Data != null && result.Data != "")
							this.showNoticeCannotDelete(result.Data);                           //The code is not possible to delete a pop-up connections(삭제불가 코드 팝업창 연결)
						else {
							this.sendMessage(this, {});
							this.setTimeout(function () {
								this.close();
							}.bind(this), 0);
						}

						this.hideProgressbar();
					}.bind(this),
					complete: function () {
						btnDelete.setAllowClick();
					}
				});
			}.bind(this));
		}
	},

	// History 
	onFooterHistory: function () {
		var wdate = this.custDataSet.Cust.WDATE,
			wid = this.custDataSet.Cust.WID;

		if ($.isEmpty(wdate))
			wdate = this.custDataSet.EG_CardComment.WDATE;

		if ($.isEmpty(wid))
			wid = this.custDataSet.EG_CardComment.WID;

		this.openWindow({
			url: '/ECERP/Popup.Search/ES303P',
			name: ecount.resource.LBL07280,                                                     //Resource : 전표이력보기
			param: {
				width: 435,
				height: 300,
				menuType: "C",
				historySlipNo: this.custDataSet.EG_CardCom.CUST_IDX,
				isLastDateShow: true,
				lastData: $.isEmpty(wdate) ? "" : String.format("{0}[{1}]", ecount.infra.getECDateFormat('date11', false, wdate.toDatetime()), wid)
			}
		});
	},

    /********************************************************************** 
    *  hotkey [f1~12, 방향키등.. ] 
    **********************************************************************/
	ON_KEY_F8: function () {
		if (!this.custContentViewDto || this.custContentViewDto.isView != 'Y') { // View 모드아닌 경우
			this.setFocusOutPage();                                                                 //FocusOutAfterSave(포커스 벗어난 후에, Action실행)
			this.onFooterSave();                                                    //SaveAndPopupClose(저장/팝업닫기)
		}
	}, 

	//Common page call checking duplicates(중복체크 공통페이지 호출)
	//param1 : Title pop-up resources(팝업창 타이틀 리소스)
	//param2 : Duplicate be processed in quarter common type of pop-up confirmation(공통팝업창에서 분기처리 될 중복확인 타입)
	//param3 : Duplicate check target keywords(중복확인 대상 키워드)
	callOverlapCheckCommon: function (_titleResource, _SearchType, _Keyword) {
		var param = {
			width: 430,
			height: 450,
			keyword: _Keyword,
			searchType: _SearchType,
			isColumSort: true
		};

		this.openWindow({
			url: '/ECERP/Popup.Search/ES013P',
			name: String.format('{0} ({1})', ecount.resource.BTN00236, _titleResource),         //Resource : 중복확인
			param: param,
			additional: false
		});
	},

	//callMoblieEmailAddingPage(모바일/Email다중등록 페이지 호출)
	callMoblieEmailAddingPage: function () {
		var param = {
			width: 950,
			height: 550,
			CUST: this.custDataSet.Cust.BUSINESS_NO,
			DOC_GUBUN: 'ALL'
		};

		this.openWindow({// Open popup
			url: '/ECERP/ESA/ESA001P_09',
			name: '모바일/Email다중등록',
			param: param
		});
	},

	//When you save a file in the file management also must change the color of the part(파일관리에서 파일 저장 후 색이 변해야 함)
	setFileLinkCss: function () {
		this.contents.getControl('FILECNT', "CUST").changeCss("text-warning-inverse", true);
	},

	//setting Focus(해당 위젯항목에 맞는 포커스 설정)
	setFocus: function (id, subIndex, widgetTabId, message) {
		var _checkControl;
		var _currentTabId = this.contents.currentTabId;
		if (widgetTabId == _currentTabId)
			_checkControl = this.contents.getControl(id, widgetTabId);
		else {
			_checkControl = this.contents.getControl(id, 'BASIC');

			if (_checkControl)
				this.contents.changeTab('BASIC', false);
			else {
				this.contents.changeTab(widgetTabId, false);
				_checkControl = this.contents.getControl(id, widgetTabId);
			}
		}

		_checkControl.showError(message);

		if (subIndex !== 0)
			_checkControl.get(subIndex).setFocus(0);
		else
			_checkControl.setFocus(0);
	},

	//Unable to delete messages pop up(삭제불가 메세지 팝업창)
	showNoticeCannotDelete: function (businessNo) {
		var param = {
			width: 520,
			height: 300,
			datas: Object.toJSON(businessNo),
			parentPageID: this.pageID,
			responseID: this.callbackID,
			MENU_CODE: "Customer"
		};

		this.openWindow({
			url: "/ECERP/Popup.Common/NoticeNonDeletable",
			name: ecount.resource.LBL11065,                                                 //Resource : 삭제불가코드
			popupType: false,
			additional: false,
			param: param
		});
	},

	//SaveFunction(저장 함수)
	dataSave: function (_action) {
		var self = this;
		var _success = true;

		// DataSerialize(데이터 Mapping)
		if (_success) {
			//CustDataSerialize(거래처정보 Mapping)
			$(this.tabTitleArray).each(function (i, data) {
				$.extend(this.custDataSet.Cust, this.contents.serialize(data).result);
				var addr1 = this.contents.getControl("POST_NO");
				var addr2 = this.contents.getControl("DM_POST");

				//주소부분 수정으로 Depth가 생겨서 일반적인 serialize로는 값이 나오지 않음
				if (ecount.config.limited.feature.USE_POST) {
					if (addr1 != undefined) {
						this.custDataSet.Cust.ADDR = addr1.getValue()[2];
					}
					if (addr2 != undefined) {
						this.custDataSet.Cust.DM_ADDR = addr2.getValue()[2];
					}
				} else {
					if (addr1 != undefined) {
						this.custDataSet.Cust.ADDR = addr1.getValue()[0];
					}
					if (addr2 != undefined) {
						this.custDataSet.Cust.DM_ADDR = addr2.getValue()[0];
					}
				}
			}.bind(this));

			//CustLevelGroup Mapping(거래처계층그룹 Mapping)
			this.SerializeCustLevelGroup();

			//EGCardCom Mapping(잠재거래처 정보 Mapping)
			this.SerializeEGCardCom(this.custDataSet.EG_CardCom.CUST_IDX || 0);

			//EGCardComment Mapping(명함관리 정보 Mapping)
			this.SerializeEGCardComent(this.custDataSet.EG_CardComment.CUST_IDX || 0, this.custDataSet.EG_CardComment.SER_NO || 0);

			//EGMail01 Mapping(메일수신 정보 Mapping(신규저장 시 해당메일이 전체 메일수신정보 기본으로 설정))
			if ($.isEmpty(this.Cust))
				this.SelializeEGMail01([
					{ DocumentCode: 22, Approval_YN: 'Y' },      //EST_MAIL
					{ DocumentCode: 23, Approval_YN: 'Y' },      //ORD_MAIL
					{ DocumentCode: 24, Approval_YN: 'Y' },      //PRICEREQ_MAIL
					{ DocumentCode: 33, Approval_YN: 'Y' },      //DEM_MAIL
					{ DocumentCode: 34, Approval_YN: 'Y' },      //PURCHASE_MAIL
					{ DocumentCode: 44, Approval_YN: 'Y' },      //TAX_MAIL
					{ DocumentCode: 45, Approval_YN: 'Y' },      //ETAX_MAIL
					{ DocumentCode: 46, Approval_YN: 'Y' },      //PACKING_MAIL
					{ DocumentCode: 66, Approval_YN: 'Y' },      //STATE_MAIL
					{ DocumentCode: 88, Approval_YN: 'Y' },      //CUST_AGREE
					{ DocumentCode: 89, Approval_YN: 'Y' },      //CUST_MAIL2
					{ DocumentCode: 92, Approval_YN: 'Y' },      //REPAIR_MAIL
					{ DocumentCode: 48, Approval_YN: 'Y' },      //CONT_MAIL
					{ DocumentCode: 70, Approval_YN: 'Y' },      //INTERNAL_USE_MAIL
					{ DocumentCode: 36, Approval_YN: 'Y' },      //GOODS ISSUED
					{ DocumentCode: 26, Approval_YN: 'Y' },      //Ship order
					{ DocumentCode: 27, Approval_YN: 'Y' },      //SHIP_MAIL
					{ DocumentCode: 38, Approval_YN: 'Y' },      //LOCATION TRANS
					{ DocumentCode: 35, Approval_YN: 'Y' },      //JOB Order
					{ DocumentCode: 72, Approval_YN: 'Y' },      //Quality Insp.
					{ DocumentCode: 28, Approval_YN: 'Y' },      //Release Sales Order
                    { DocumentCode: 37, Approval_YN: 'Y' },      //Goods Receipt
                    { DocumentCode: 29, Approval_YN: 'Y' },       //DepositSlip
                    { DocumentCode: 73, Approval_YN: 'Y' }       //DepositSlip
				]);
		}

		//4. Custom Validation Check(특정항목에 대한 유효성 체크)
		if (_success) {
			_success = this.checkControlValidationByCustom(function () {
				this.hideProgressbar();                                                             //Rights city check failure and reactivate(권한체크 실패 시 다시 활성화)
				this.footer.getControl("save").setAllowClick();                                     //Acceptance check storage button when they fail again permission(권한체크 실패 시 저장버튼 다시허용)
			}.bind(this));
		}

		if (_success) {
            //저장 API호출
            ecount.common.api({
                url: "/SVC/Account/Basic/SaveCustData",
                data: Object.toJSON({
                    Data: {
                        CUST: this.custDataSet.Cust,                                                    //Saving CustData(저장 할 거래처정보 데이터)
                        CUST_LEVEL_GROUP_CODES: this.custDataSet.CustLevelGroupData,                    //Saving CustLevelGroupData(저장 할 계층그룹코드(SerializeCustLevelGroup에서 가공 됨))
                        EG_CARDCOM: this.custDataSet.EG_CardCom,                                       //Saving EGCardComData(저장 할 잠재거래처정보 데이터)
                        EG_CARDCOMMENT: this.custDataSet.EG_CardComment,                                //Saving EGCardCommentData(저장 할 명함관리정보 데이터)
                        EGMAIL01: this.custDataSet.EGMail01,                                            //Saving ReceiceMailInfomationData(저장 할 메일수신정보)
                        EDIT_FLAG: !$.isEmpty(this.Cust) ? 'M' :                                        //If you modify the code information suppliers(거래처코드 정보가 있다면 수정)
                            ($.isEmpty(this.custDataSet.EG_CardCom.CUST_IDX) ||             //EGCardCom Is Null?(저장 할 잠재거래처정보에 업체코드가 비어있거나,)
                                this.custDataSet.EG_CardCom.CUST_IDX == 0 ?                    //CustIDX is 0?(저장 할 잠재거래처정보에 업체코드가 0이라면,)
                                'I' : 'IE'),                                                    //I, IE(신규(I)이고, 그렇지 않으면 신규면서 잠재거래처연결(IE))
                        isUpload: false
                    }
                }),
				error: function (e, status, messageInfo) {
					if (self.IsJsonString(messageInfo.Message)) {
						//var errResult = JSON.parse(messageInfo.Message);
						//var _checkControl = this.contents.getControl('MAIN_CD', 'PRICE');
						//if (errResult.errpr_type && [110, 120].contains(errResult.errpr_type)) {
						//	this.hideProgressbar();
						//	this.footer.getControl("save").setAllowClick();
						//	_checkControl.showError(errResult.Err_Message);
						//} else {
							this.hideProgressbar();
							this.footer.getControl("save").setAllowClick();
						//}

					} else {

						ecount.alert(messageInfo.Message, function () {
							this.hideProgressbar();
							this.footer.getControl("save").setAllowClick();
						}.bind(this));
					}

				}.bind(this),
				success: function (result) {
					if (!this.custContentViewDto) {                                                 //따로 부가적인 파라미터를 받지않는 기본 거래처 수정이거나
						if (this.parentPageID && ['ESQ501M'].contains(this.parentPageID))
							this.sendMessage(this, { action: _action });
						else
							this.sendMessage(this, {});
					} else {
						if (this.custContentViewDto.isSaveAndMessageHandlerProcess) {               //명시적으로 부가적인 파라미터를 받았고, 부모창의 동작을 원한다면
							this.sendMessage(this, {
								CUST: this.custDataSet.Cust,
								callback: this.setTimeout(function () {
									this.close();
								}.bind(this), 0)
							});
						}
					}

					switch (_action) {
						case 'SAVEANDNEW':                                                          //SaveAndPopupNew(저장/신규)
							var param = {
								Save_Cust: this.custDataSet.Cust.BUSINESS_NO
							}
							this.onAllSubmitSelf("/ECErp/ESA/ESA002M", param);
							break;
						case 'SAVEANDMODIFY':                                                       //SaveAndPopupModify(저장/내용유지)
							this.reloadPage(this.custDataSet.Cust.BUSINESS_NO);
							break;
						case 'SAVEANDCLOSE':                                                        //SaveAndPopupClose(저장/팝업닫기)
						default:
							this.setTimeout(function () {
								this.close();
							}.bind(this), 0);
							break;
					}
				}.bind(this)
			});
		}
	},

	//reloadPage(페이지 Reflash용도)
	reloadPage: function (custCode) {
		var param = {
			Cust: custCode == undefined ? this.Cust : custCode
		};

		this.onAllSubmitSelf("/ECErp/ESA/ESA002M", param);
	},

	//CheckCreateCustPermission(거래처입력 입력 권한체크)
	//Action callBack is operated upon validation failure(callBack은 유효성 실패 시 동작할 Action)
	checkCreateCustPermission: function (callBack) {
		if (this.custDataSet.CustPermission.Value != 'W' && this.custDataSet.CustPermission.Value != 'U') {
			var msgdto = ecount.common.getAuthMessage("", [{
				MenuResource: ecount.resource.LBL00336, PermissionMode: "W"                                       //Resource : 거래처등록  
			}]);
			ecount.alert(msgdto.fullErrorMsg);

			if (callBack) callBack();
			return false;
		}

		return true;
	},

	//checkModifyCustPermission(거래처입력 수정 권한체크)
	//Action callBack is operated upon validation failure(callBack은 유효성 실패 시 동작할 Action)
	checkModifyCustPermission: function (callBack) {
		if (this.custDataSet.CustPermission.Value != 'W') {
			var msgdto = ecount.common.getAuthMessage("", [{
				MenuResource: ecount.resource.LBL00336, PermissionMode: "U"                                       //Resource : 거래처등록
			}]);
			ecount.alert(msgdto.fullErrorMsg);

			if (callBack) callBack();
			return false;
		}

		return true;
	},

	//checkDeleteCustPermission(거래처입력 삭제 권한체크)
	//checkDeleteCustPermission(callBack은 유효성 실패 시 동작할 Action)
	checkDeleteCustPermission: function (callBack) {
		if (this.custDataSet.CustPermission.Value != 'W') {
			var msgdto = ecount.common.getAuthMessage("", [{
				MenuResource: ecount.resource.LBL00336, PermissionMode: "D"                                       //Resource : 거래처등록
			}]);
			ecount.alert(msgdto.fullErrorMsg);

			if (callBack) callBack();
			return false;
		}

		return true;
	},

	//checkControlValidationByDefalut(거래처등록 위젯 컨트롤의 입력한 값에 대해서 기본적인 Validation)
	//checkDeleteCustPermission(callBack은 유효성 실패 시 동작할 Action)
	checkControlValidationByDefalut: function (callBack) {
		var _success = true;

		$(this.tabTitleArray).each(function (i, thisTab) {

			//이메일 예외처리
			if (this.contents.getControl("EMAIL", "CUST").getValue() == ""
				&& this.contents.getControl("EMAIL", "CUST").colEssentialYn == "Y") {
				this.contents.getControl("EMAIL", "CUST").dataRules[0] = "required";
			}

			var ValidationResult = this.contents.validate(thisTab);                 //For the current item in the widget Tab Validate execution(현재 Tab내의 위젯항목에 대해 Validate실행)
			if (this.contents.getControl)
				var focusControl;

			if (ValidationResult.result.length > 0) {                               //If the item fails validation exists(유효성 실패한 항목이 존재한다면)
				focusControl = this.contents.getControl(ValidationResult.result
					.first().first()
					.control.id);

				if (!focusControl) {
					this.contents.changeTab(ValidationResult.tabId, false);
					focusControl = this.contents.getControl(ValidationResult.result
						.first().first()
						.control.id);
				}

				if ((focusControl.id == "POST_NO" || focusControl.id == "DM_POST") && ecount.config.limited.feature.USE_POST)             //ADDR/DM_ADDR, focus in address TextBox(주소1, 주소2항목은 주소란에 focus가 가야함)
					focusControl.setFocus(2);
				else
					focusControl.setFocus(0);

				_success = false;
				return false;
			}
		}.bind(this));

		if (!_success) {
			if (callBack) callBack();
			return false;
		}

		return true;
	},

	//checkControlValidationByCustom(거래처등록 위젯 컨트롤의 입력한 값 중 특정항목에 대해서 예외적인 Validation)
	//Action callBack is operated upon validation failure(callBack은 유효성 실패 시 동작할 Action)
	//※ Note: If after that the value serialize an object, must be executed after this function to serialize be initiated(※ 주의사항 : 오브젝트에 serialize이후, 실행되어야 함, 이 함수 이후, serialize하게되면 값이 초기화 될 수 있음)
	checkControlValidationByCustom: function (callBack) {
		var _checkControl,
			_success = true,
			_business_no = ($.isEmpty(this.Cust) ? this.contents.getControl('BUSINESS_NO', 'CUST').getValue() : this.custDataSet.Cust.BUSINESS_NO);

		/////////////////////////////////////////////////////////////////
		////////////Check BUSINESS_NO(거래처코드 항목 체크)//////////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('BUSINESS_NO', 'CUST');
			if (_checkControl.getValue() == '0' || _checkControl.getValue() == '000' ||
				(_checkControl.getValue().length == 4 && _checkControl.getValue().substring(0, 3).toUpperCase() == 'ZZZ')) {
				this.setFocus('BUSINESS_NO', 0, 'CUST', ecount.resource.MSG00291);                                                        //Resource : 사용할 수 없는 코드입니다. 다른코드를 등록 바랍니다.
				_success = false;
			}
		}

		/////////////////////////////////////////////////////////////////
		////////////Check FOREIGN_FLAG(외화거래처 항목 체크)/////////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('FOREIGN_FLAG', 'CUST');
			if (_checkControl.getValue() == '99999') {
				this.setFocus('FOREIGN_FLAG', 0, 'CUST', ecount.resource.MSG01119);                                                        //Resource : 외화를 선택 바랍니다.
				_success = false;
			} else {
				if (_checkControl.getValue() != 'N') {
					this.custDataSet.Cust.FOREIGN_FLAG = 'Y';
					this.custDataSet.Cust.EXCHANGE_CODE = _checkControl.getValue();
				} else {
					this.custDataSet.Cust.FOREIGN_FLAG = 'N';
					this.custDataSet.Cust.EXCHANGE_CODE = "";
				}
			}
		}

		/////////////////////////////////////////////////////////////////
		//////////Check IO_CODE_SL(거래유형(영업) 항목 체크)/////////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('IO_CODE_SL', 'CUST');
			if (_checkControl.get(0).getValue() == 'N' && _checkControl.get(1).getValue() == '99999') {
				this.setFocus('IO_CODE_SL', 1, 'CUST', ecount.resource.MSG01121);                                                       //Resource : 거래유형을 선택 바랍니다.
				_success = false;
			}

			if (_checkControl.get(0).getValue() == 'Y')
				this.custDataSet.Cust.IO_CODE_SL = '';
		}

		/////////////////////////////////////////////////////////////////
		/////////Check IO_CODE_BY(거래유형(구매) 항목 체크)//////////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('IO_CODE_BY', 'CUST');
			if (_checkControl.get(0).getValue() == 'N' && _checkControl.get(1).getValue() == '99999') {
				this.setFocus('IO_CODE_BY', 1, 'CUST', ecount.resource.MSG01121);                                                       //Resource : 거래유형을 선택 바랍니다.
				_success = false;
			}

			if (_checkControl.get(0).getValue() == 'Y')
				this.custDataSet.Cust.IO_CODE_BY = '';
		}

		/////////////////////////////////////////////////////////////////
		//////////Check TAX_REG_ID(종사업장 번호 항목 체크)//////////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('TAX_REG_ID', 'CUST');
			if (!$.isEmpty(_checkControl.getValue()) && _checkControl.getValue().length != 4) {
				this.setFocus('TAX_REG_ID', 0, 'CUST', ecount.resource.MSG01674);                                                        //Resource : 종사업장번호는 4자리로만 입력할 수 있습니다.
				_success = false;
			}
		}

		/////////////////////////////////////////////////////////////////
		//////////Check G_BUSINESS(세무신고거래처 항목 체크)/////////////
		/////////////////////////////////////////////////////////////////
        if (_success) {
            _checkControl = this.contents.getControl('G_BUSINESS', 'CUST');
            var control_business_type = Number(_checkControl.get(0).getValue());
            var ctrl_businessno = _checkControl.get(control_business_type).getValue();

            switch (control_business_type) {
                case 1: //The same customers(거래처 동일)
                    this.custDataSet.Cust.G_BUSINESSNO = ctrl_businessno;
                    break;
                case 2: //Enter Search(검색입력)
                case 3: //Direct Input(직접입력)
                    if ($.isEmpty(ctrl_businessno)) { // 입력값이 비어있으면 유효성 체크
                        this.setFocus('G_BUSINESS', control_business_type, 'CUST', ecount.resource.MSG04400);  //Resource : 유효하지 않은 세무신고거래처코드                                                 //Resource : 유효하지 않은 세무신고거래처코드
                        _success = false;
                    } else if (ctrl_businessno == _business_no) { // 세무신고거래처 입력값이 현재 거래처코드와 동일할때(신규,수정)
                        this.custDataSet.Cust.G_BUSINESS_TYPE = '1';
                        this.custDataSet.Cust.G_BUSINESSNO = _business_no;
                    } else {
                        this.custDataSet.Cust.G_BUSINESSNO = ctrl_businessno;
                    }
                    break;
            }

		}

		/////////////////////////////////////////////////////////////////
		//////////Check COLL_PAY_TYPE(수금지급예정일 항목 체크)//////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('COLL_PAY_TYPE', 'PRICE').serialize().value;

			this.custDataSet.Cust.COLL_PAY_TYPE = _checkControl[0];

			if (_checkControl[0] == 'D')                                                                                        //Daily(일 단위)
				this.custDataSet.Cust.COLL_PAY_D = _checkControl[1];
			else if (_checkControl[0] == 'M') {                                                                                 //Monthly(월 단위)
				this.custDataSet.Cust.COLL_PAY_M = _checkControl[1];
				this.custDataSet.Cust.COLL_PAY_D = _checkControl[2];
			}
			else if (_checkControl[0] == "W") {                                                                                 //Weekly(주 단위)
				this.custDataSet.Cust.COLL_PAY_W = _checkControl[1];
				this.custDataSet.Cust.COLL_PAY_DW = _checkControl[2];
			}
		}

		/////////////////////////////////////////////////////////////////
		//////////Check DM Address(주소2(우편번호, 주소) 체크)///////////
		/////////////////////////////////////////////////////////////////
		if (_success) {
			_checkControl = this.contents.getControl('DM_POST', 'CUST');
			if (ecount.config.limited.feature.USE_POST) {
				if ($.isEmpty(_checkControl.get(1).getValue()) && $.isEmpty(_checkControl.get(2).getValue())) {
					this.custDataSet.Cust.DM_POST = this.contents.getControl('POST_NO', 'CUST').get(1).getValue();
					this.custDataSet.Cust.DM_ADDR = this.contents.getControl('POST_NO', 'CUST').get(2).getValue();
				}
			} else {
				if ($.isEmpty(_checkControl.get(0).getValue()))
					this.custDataSet.Cust.DM_ADDR = this.contents.getControl('POST_NO', 'CUST').get(0).getValue();
			}
		}

		/////////////////////////////////////////////////////////////////
		//////////Check MAIN_CD(채권관리코드 체크)///////////////////////
		/////////////////////////////////////////////////////////////////
		//if (_success) {
		//	_checkControl = this.contents.getControl('MAIN_CD', 'PRICE');

		//	var custCd = this.contents.getControl('BUSINESS_NO', 'CUST');

		//	if (_checkControl.getSelectedItem().length > 0 && custCd.getValue() !== "" && custCd.getValue() === _checkControl.getSelectedCode()[0]) {
		//		_success = false;
		//		_checkControl.showError(ecount.resource.MSG07833);
		//	}
		//}

		if (!_success) {
			if (callBack) callBack();
			return false;
		}

		return true;
	},
	checkExistedCustCode: function (callBack, action) {
		var self = this;
		var btn = this.footer.get(0).getControl("save");
		var tabId = this.contents.currentTabId == "BASIC" ? "BASIC" : "CUST";
		var ctrl = this.contents.getControl("BUSINESS_NO", tabId);
		var _custCodeControlValue = ctrl.getValue().trim();

		this.showProgressbar();
		var _success = true;                                                                //Validity check success of each stage(각 단계별 유효성체크 성공여부)

		//1. Permission(권한체크)
		if (_success) {
			if ($.isEmpty(this.Cust))                                                       //If New(거래처 신규등록이라면)
				_success = this.checkCreateCustPermission(function () {                     //Check ESA002M Delete Permission(거래처입력 입력 권한체크)
					this.hideProgressbar();                                                 //Rights city check failure and reactivate(권한체크 실패 시 다시 활성화)
					this.footer.getControl("save").setAllowClick();                         //Acceptance check storage button when they fail again permission(권한체크 실패 시 저장버튼 다시허용)
				}.bind(this));
			else                                                                            //if Modify(기존거래처 수정이라면)
				_success = this.checkModifyCustPermission(function () {                     //Check ESA002M Modify Permission(거래처입력 수정 권한체크)
					this.hideProgressbar();                                                 //Rights city check failure and reactivate(권한체크 실패 시 다시 활성화)
					this.footer.getControl("save").setAllowClick();                         //Acceptance check storage button when they fail again permission(권한체크 실패 시 저장버튼 다시허용)
				}.bind(this));
		}


		//2. Defalut Validation Check(기본 유효성 체크)
		if (_success) {
			_success = this.checkControlValidationByDefalut(function () {
				this.hideProgressbar();                                                     //Rights city check failure and reactivate(권한체크 실패 시 다시 활성화)
				this.footer.getControl("save").setAllowClick();                             //Acceptance check storage button when they fail again permission(권한체크 실패 시 저장버튼 다시허용)
			}.bind(this));
		}

		if (_custCodeControlValue == "") {
			this.hideProgressbar();
			ctrl.showError(ecount.resource.MSG02582);
			ctrl.setFocus(0);
			btn.setAllowClick();
			_success = false;
		}
		//3. 중복체크
		if (_success && this.EditFlag == "I") {
			ecount.common.api({
				url: "/Account/Basic/CheckExistedCustCommon",
				data: Object.toJSON({ CUST: { BUSINESS_NO: _custCodeControlValue } }),
				success: function (result) {
					if (result.Status != "200") {
						alert(result.fullErrorMsg);
					} else {
						if (result.Data != null) {
							var msg = "";
							var tabId = self.contents.currentTabId == "BASIC" ? "BASIC" : "CUST";
							switch (result.Data.GUBUN) {
								case "11":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL00338);
									break;
								case "14":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35400);
									break;
								case "15":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35399);
									break;
								case "20":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35398);
									break;
								case "30":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL35397);
									break;
								case "90":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL01484);
									break;
								case "GY":
									msg = String.format(ecount.resource.MSG08770, ecount.resource.LBL03529);
									break;
								default:
									break;
							}
							self.setTabMove("BUSINESS_NO", tabId, msg);
							this.hideProgressbar();
							btn.setAllowClick();
						} else {
							callBack(action);
						}
					}
				}.bind(this),
				complete: function () {
				}
			});
		} else if (_success && this.EditFlag == "M") {
			callBack(action);
		}
	},

	//CustLevelGroup Mapping(거래처계층그룹 Mapping)
	SerializeCustLevelGroup: function () {
		//CustLevelGroup must apply the existing accounts in the manner of a hierarchical group input ( Group hierarchy of the customers in the SP Delete & Insert)
		//거래처 계층그룹은 기존 거래처입력에서의 계층그룹 방식을 적용함(SP에서 해당 거래처의 계층그룹 Delete&Insert)
		//According to this method Serialize is only allocating codes without a hierarchical group structure as another entry, select
		//이 방식에 따라 Serialize는 다른항목처럼 구조화 하지않고, 선택 된 계층그룹코드만 할당함
		this.custDataSet.CustLevelGroupData = null;
		this.custDataSet.CustLevelGroupData = this.contents.getControl('CUSTLEVELGROUPDATA', 'CUST').getSelectedCode().join(ecount.delimiter);
	},

	//EGCardCom Mapping(잠재거래처 정보 Mapping)
	SerializeEGCardCom: function (_custIdx) {
		if (!$.isEmpty(_custIdx) && _custIdx != 0)                                          //Inde modified or new potential customers if cord is connected ,(수정이거나 신규인데 잠재거래처코드가 연결되어 있다면,)
			this.custDataSet.EG_CardCom = new Object();                                     //After initializing the potential customers basic information, only the information needed for mapping Update(잠재거래처 기본정보를 초기화 한 후, Update에 필요한 정보만 매핑)

		this.custDataSet.EG_CardCom.CUST_IDX = _custIdx;                                    //CustIdx(잠재거래처코드)
		this.custDataSet.EG_CardCom.COMPANY_DES = this.custDataSet.Cust.CUST_NAME;          //CompanyName(업체명)
		this.custDataSet.EG_CardCom.TEL_NO = this.custDataSet.Cust.TEL;                     //TelNo(전화번호)
		this.custDataSet.EG_CardCom.HP_NO = this.custDataSet.Cust.HP_NO;                    //HpNo(핸드폰번호)
		this.custDataSet.EG_CardCom.FAX_NO = this.custDataSet.Cust.FAX;                     //FaxNo(팩스번호)
		this.custDataSet.EG_CardCom.HOMEPAGE = this.custDataSet.Cust.URL_PATH;              //HomePageURL(홈페이지)
		this.custDataSet.EG_CardCom.COM_POST = this.custDataSet.Cust.POST_NO;               //Post_NO(우편번호)
		this.custDataSet.EG_CardCom.COM_ADDR = this.custDataSet.Cust.ADDR;                  //CompanyAddress(회사주소)
		this.custDataSet.EG_CardCom.COMMENT = this.custDataSet.Cust.REMARKS;                //Comment(메모)
		this.custDataSet.EG_CardCom.CUST = this.custDataSet.Cust.BUSINESS_NO;               //CustCode(거래처코드)
		this.custDataSet.EG_CardCom.CUST_DES = this.custDataSet.Cust.CUST_NAME;             //CustName(거래처명)
		this.custDataSet.EG_CardCom.EMAIL = this.custDataSet.Cust.EMAIL;                    //Email(이메일)
	},

	//EGCardComment Mapping(명함관리 정보 Mapping)
	SerializeEGCardComent: function (_custIdx, _serNo) {
		if (!$.isEmpty(_custIdx) && _custIdx != 0)                                          //Inde modified or new potential customers if cord is connected ,(수정이거나 신규인데 잠재거래처코드가 연결되어 있다면,)
			this.custDataSet.EG_CardComment = new Object();                                 //After initializing the card management information base , only the information needed for mapping Update(명함관리 기본정보를 초기화 한 후, Update에 필요한 정보만 매핑)

		this.custDataSet.EG_CardComment.CUST_IDX = _custIdx;                                //CustIdx(잠재거래처코드)
		this.custDataSet.EG_CardComment.SER_NO = _serNo;                                    //SerNo(명함순번)
		this.custDataSet.EG_CardComment.COMPANY_DES = this.custDataSet.Cust.CUST_NAME;      //CompanyName(업체명)
		this.custDataSet.EG_CardComment.EMAIL = this.custDataSet.Cust.EMAIL;                //Email(이메일)
		this.custDataSet.EG_CardComment.HP_NO = this.custDataSet.Cust.HP_NO;                //CellPhone(핸드폰번호)
		this.custDataSet.EG_CardComment.CUST = this.custDataSet.Cust.BUSINESS_NO;           //CustCode(거래처코드)
		this.custDataSet.EG_CardComment.CUST_DES = this.custDataSet.Cust.CUST_NAME;         //CustName(거래처명)
		this.custDataSet.EG_CardComment.IN_GUBUN = '1';                                     //CardType(명함/거래처 구분)

		if ($.isEmpty(this.Cust)) {
			// 대표자명 없는 경우 거래처명 반영
			if (this.custDataSet.Cust.BOSS_NAME) {
				this.custDataSet.EG_CardComment.UNAME = this.custDataSet.Cust.BOSS_NAME;        //BossName(대표자명)
			} else {
				this.custDataSet.EG_CardComment.UNAME = this.custDataSet.Cust.CUST_NAME;
			}
		}
	},

	IsJsonString: function (str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	},

	//EGMail01 Mapping(메일수신 정보 Mapping(신규저장 시 해당메일이 전체 메일수신정보 기본으로 설정))
	SelializeEGMail01: function (_documentCodeArray) {
		this.custDataSet.EGMail01 = (function () {
			var returnArray = [];
			$.each(_documentCodeArray, function (i, data) {
				returnArray.push({
					DOC_GB: data.DocumentCode,
					APPROVAL_YN: data.Approval_YN
				});
			});
			return returnArray;
		})();
	},

	//입력화면 설정에서 필수 값 체크되어 있는 항목 가져오기
	//필수 값 저장 시, formoutsetdetail의 colEssentialYn Y로 저장
	getColEssentialYn: function (tab, cid) {
		if (this.viewBag.FormInfos.SI902) {
			var subiTem = this.viewBag.FormInfos.SI902.items.where(function (item) {
				return item.id == tab;
			}).select(function (subitem) {
				return subitem.subItems;
			}).first();
			return subiTem.any(function (itemid) {
				return itemid.id == cid && itemid.colEssentialYn == "Y";
			});
		}
		return false;
	}
});