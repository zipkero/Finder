using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ECount.Core.Framework;
using ECount.ERP.Data.Account.ClosingJournal;
using ECount.ERP.Data.Account.Common;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Data.SelfCustomize;
using ECount.ERP.Entity.ACCT;
using ECount.ERP.Entity.ACCT_AC;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using ECount.ERP.Infra;

namespace ECount.ERP.View.EBA
{
    /// <summary title="계정코드등록">
    /// 1. Create Date : 2019.07.03
    /// 2. Creator     : 이철원
    /// 3. Description : 계정코드등록
    /// 4. Precaution  : 
    /// 5. History     : 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 계정코드등록
    /// 7. OldName     : 
    /// </summary>
    /// <example>
    /// sample codes here
    /// </example>
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA002M")]
    public class EBA002MAction : ERPXViewInputActionBase<EBA002MAction, ERPXViewInputRequest<SaveGyeCodeRequestDto>, GyeCodeInputDto>
    {
        #region [Property-private]
        public IEnumerable<dynamic> DeptLoad { get; set; }

        public IEnumerable<dynamic> DeptLoadChk { get; set; }

        public IEnumerable<dynamic> Acc101GyeCodeChk { get; set; }

        public IEnumerable<dynamic> Acc002GyeCodeChk { get; set; }

        public IEnumerable<dynamic> Acc002InexGyeCodeChk { get; set; }
        public string ClosingExists { get; set; }

        private ENUM_SLIP_INPUT_TYPE _inputGubun;

        #endregion

        #region [Utility]
        private PipeResult<IEnumerable<dynamic>> CheckParentsGyeCodeAcc002(ENUM_SLIP_INPUT_TYPE inputGubun)
        {
            IEnumerable<dynamic> result = null;
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.Register<ECount.ERP.Service.Account.Basic.ICheckParentsGyeCodeAcc002Svc>()
                .Mapping(o => o.Command.Request = new ACC002() {
                    Key = new ACC002_PK() {
                        COM_CODE = o.Context.COM_CODE,
                        GYE_CODE = o.Owner.Request.Data.GYE_CODE
                    },
                    INPUT_GUBUN = inputGubun
                })
                .OnExecuted(o => {
                    result = o.Command.Result;
                    return true;
                });

            return this.CreatePipeResult(() => result);
        }

        private void InitGyeCode()
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.Register<ECount.ERP.Service.Account.Common.IGetAcc002ViewDataSvc>()
                .Mapping(o => o.Command.Request = new Acc002ViewRequestDto() {
                    COM_CODE = o.Context.COM_CODE,
                    GYE_CODE = o.Owner.Request.Data.GYE_CODE,
                    editFlag = o.Owner.Request.EditMode == ENUM_EDIT_MODE.New ? "Copy" : "M"
                })
                .OnExecuted(o => {
                    o.Owner.DeptLoad = o.Command.Result;
                    if (o.Owner.DeptLoad.vIsNotEmpty())
                        _inputGubun = (ENUM_SLIP_INPUT_TYPE)DeptLoad.vToList()[0]["INPUT_GUBUN"];
                    return true;
                });

            pipe.Register<ECount.ERP.Service.Account.Basic.IDeleteCheckAcc002Svc>()
                .Mapping(o => o.Command.Request = new ACC002_PK() {
                    COM_CODE = o.Context.COM_CODE,
                    GYE_CODE = o.Owner.Request.Data.GYE_CODE
                })
                .OnExecuted(o => {
                    o.Owner.DeptLoadChk = o.Command.Result;
                    return true;
                });

            pipe.Register<ECount.ERP.Service.Account.Basic.ICheckGyeCodeAcc101Svc>()
                .Mapping(o => o.Command.Request = new ACC002_PK() {
                    COM_CODE = o.Context.COM_CODE,
                    GYE_CODE = o.Owner.Request.Data.GYE_CODE
                })
                .OnExecuted(o => {
                    o.Owner.Acc101GyeCodeChk = o.Command.Result;
                    return true;
                });

            pipe.Register<ECount.ERP.Service.Account.ClosingJournal.IGetListAutoSBTSetSvc>()
                .Mapping(o => o.Command.Request = new AutoSubstitutionSettingSearchDto() {
                    COM_CODE = o.Context.COM_CODE,
                    IsInventoryClosingGyeCode = false,
                    SBT_BEF_GYE_CD = o.Owner.Request.Data.GYE_CODE
                })
                .OnExecuted(o => {
                    if (o.Command.Result.vIsNotEmpty())
                        o.Owner.ClosingExists = "Y";
                    else
                        o.Owner.ClosingExists = "N";

                    return true;
                });

            pipe.RegisterCode(o => {
                if (o.Owner._inputGubun.vIsEquals(ENUM_SLIP_INPUT_TYPE.PurchaseExpenseAccount, ENUM_SLIP_INPUT_TYPE.TotalAccount)) {
                    o.Owner.Acc002InexGyeCodeChk = o.Owner.RunPipe(() => o.Owner.CheckParentsGyeCodeAcc002(ENUM_SLIP_INPUT_TYPE.PurchaseExpenseAccount));
                }

                if (o.Owner._inputGubun.vIsEquals(ENUM_SLIP_INPUT_TYPE.ParentAccount, ENUM_SLIP_INPUT_TYPE.TotalAccount)) {
                    o.Owner.Acc002GyeCodeChk = o.Owner.RunPipe(() => o.Owner.CheckParentsGyeCodeAcc002(ENUM_SLIP_INPUT_TYPE.ParentAccount));
                }
            })
            .AddFilter(o => o.Owner._inputGubun.vIsEquals(ENUM_SLIP_INPUT_TYPE.PurchaseExpenseAccount, ENUM_SLIP_INPUT_TYPE.ParentAccount, ENUM_SLIP_INPUT_TYPE.TotalAccount));

        }

        #endregion

        #region [OnInitiate]

        /// <summary>
        /// OnInitiate
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult OnInitiate(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            //===========================================================
            // Custom
            //===========================================================
            pipe.RegisterCode(o => {
                this.PrevUrl = "/ECERP/SVC/EBA/EBA002M";

                this.XFormQueryOption = new XFormQueryOption() {
                    FormType = "AI250",
                    FormSeq = 1,
                    IsInput = true,
                    HasBasicTab = true
                };
            });

            //===========================================================
            // Base class
            //===========================================================          
            pipe.RegisterCode(o => base.OnInitiate(context));

            return this.PipeCompleted();
        }

        #endregion

        #region [CanExecute]

        /// <summary>
        /// CanExecute
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult<bool> CanExecute(IERPSessionContext context)
        {
            return CreatePipeResult(() => true);
        }

        #endregion

        #region [OnExecuting]
        protected override PipeResult OnExecuting(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.RegisterCode(o => {
                o.Owner.InitGyeCode();
            })
            .AddFilter(o => o.Owner.Request.Data.GYE_CODE.vIsNotEmpty())
            .AddFilter(o => !o.Owner.Request.Data.IsFromSimpleRegister);

            //===================================================
            // 수입지출 간편일괄등록에서 호출된 경우 처리
            //===================================================
            pipe.Register<ECount.ERP.Service.Account.Common.IGetAcc002PresetDefaultDataSvc>()
                .AddFilter(o => o.Owner.Request.Data.IsFromSimpleRegister)
                .Mapping(o => o.Command.Request = new ACC002_PRESET_PK() {
                    COM_CODE = o.Context.COM_CODE,
                    INPUT_GUBUN = o.Owner.Request.Data.DefaultSettingType,
                    INEX_DV_CD = o.Owner.Request.Data.InexDivCode
                })
                .OnExecuted(o => {
                    o.Owner.DeptLoad = o.Command.Result;
                    o.Owner.ClosingExists = "N";

                    return true;
                });

            return base.OnExecuting(context);
        }

        #endregion

        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => {
                return this.DefaultView("~/View.Account/EBA/Views/XEBA002M.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA002MAction>
        {
            /// <summary>
            /// Check Validator
            /// </summary>
            public Validator()
            {
            }
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorInputBase<EBA002MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                MappingFor(m => m.Config.Company, ctx => ctx.Config.Company, dest => {
                    dest.Assign(src => src.USE_DEPT);
                    dest.Assign(src => src.USE_PJT);
                    dest.Assign(src => src.INCOME_FLAG);
                    dest.Assign(src => src.USE_ACC102_SITE);
                    dest.Assign(src => src.USE_ACC102_PJT);
                });

                MappingFor(m => m.Config.Account, ctx => ctx.Config.Account, dest => {
                    dest.Assign(src => src.ACCT_DATE);
                });

                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.COM_DES);
                    dest.Assign(src => src.INI_YYMM);
                });

                //Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission["E010107"]);
                });

                //Init grid data
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("UseAutoCode", (mo, ctx) => ctx.AutoCode[ENUM_AUTO_CODE_TYPE.Account] as AutoCodeItem);

                    dest.Assign("deptLoad", (mo, ctx) => {
                        return mo.DeptLoad;
                    });

                    dest.Assign("deptLoadChk", (mo, ctx) => {
                        return mo.DeptLoadChk;
                    });

                    dest.Assign("Acc101GyeCodeChk", (mo, ctx) => {
                        return mo.Acc101GyeCodeChk;
                    });

                    dest.Assign("Acc002GyeCodeChk", (mo, ctx) => {
                        return mo.Acc002GyeCodeChk;
                    });

                    dest.Assign("Acc002InexGyeCodeChk", (mo, ctx) => {
                        return mo.Acc002InexGyeCodeChk;
                    });

                    dest.Assign("ClosingExists", (mo, ctx) => {
                        return mo.ClosingExists;
                    });

                    dest.Assign("HyperLinkDefaultList", (mo, ctx) => {
                        List<string> list = new List<string>();

                        var zaContext = ERPSessionContext.Create(ctx, ctx.Company.INNER_GYESET_CD);

                        list.Add(ctx.Entity<MyPageCompany>().FNCL_AC_HLINK_CD.vSafe(zaContext.Entity<MyPageCompany>().FNCL_AC_HLINK_CD));
                        list.Add(ctx.Entity<MyPageCompany>().CUST_BAL_MGNT_AC_HLINK_CD.vSafe(zaContext.Entity<MyPageCompany>().CUST_BAL_MGNT_AC_HLINK_CD));
                        list.Add(ctx.Entity<MyPageCompany>().PNL_AC_HLINK_CD.vSafe(zaContext.Entity<MyPageCompany>().PNL_AC_HLINK_CD));
                        list.Add(ctx.Entity<MyPageCompany>().COST_AC_HLINK_CD.vSafe(zaContext.Entity<MyPageCompany>().COST_AC_HLINK_CD));
                        list.Add(ctx.Entity<MyPageCompany>().ETC_AC_HLINK_CD.vSafe(zaContext.Entity<MyPageCompany>().ETC_AC_HLINK_CD));

                        return list;
                    });

                    dest.Assign("CashAccount", (mo, ctx) => {
                        return ERPConsts.CashAccountCode;
                    });
                });

                MappingFor(m => m.Widgets, dest => {
                    dest.Assign("widget.combine.accountType", (mo, ctx) => {
                        return new WidgetGyeType.WidgetParameter();
                    });

                    dest.Assign("widget.combine.incomeExpenceCode", (mo, ctx) => {
                        return new WidgetGyeType.WidgetParameter();
                    });
                });

                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("GYE_CODE", (mo, ctx) => mo.Request.Data.GYE_CODE);
                    dest.Assign("GYE_DES", (mo, ctx) => mo.Request.Data.GYE_DES);
                    dest.Assign("GROUP_CODE", (mo, ctx) => mo.Request.Data.GROUP_CODE);
                    dest.Assign("GROUP_CODE_DES", (mo, ctx) => mo.Request.Data.GROUP_CODE_DES);
                    dest.Assign("GROUP_INPUT_GUBUN", (mo, ctx) => mo.Request.Data.GROUP_INPUT_GUBUN);
                    dest.Assign("CR_DR", (mo, ctx) => mo.Request.Data.CR_DR);
                    dest.Assign("GYE_TYPE", (mo, ctx) => mo.Request.Data.GYE_TYPE);
                    dest.Assign("EditMode", (mo, ctx) => mo.Request.EditMode);
                    dest.Assign("CopyFlag", (mo, ctx) => mo.Request.Data.CopyFlag);
                    dest.Assign("TabType", (mo, ctx) => mo.Request.Data.TabType);
                    dest.Assign("xFormInfos", (mo, ctx) => {
                        return new {
                            mo.XFormView.ViewData.formType,
                            mo.XFormView.ViewData.formSeq,
                            mo.XFormView.ViewData.companyType
                        };
                    });
                    dest.Assign("IsFromSimpleRegister", (mo, ctx) => mo.Request.Data.IsFromSimpleRegister.vSafe(false));
                    dest.Assign("DefaultSettingType", (mo, ctx) => mo.Request.Data.DefaultSettingType.vSafe(ENUM_SLIP_INPUT_TYPE.SubAccount));
                    dest.Assign("InexDivCode", (mo, ctx) => mo.Request.Data.InexDivCode.vSafe(ENUM_INEX_DIV_CODE.None));
                });
                #endregion
            }
        }

        #endregion
    }

    #region [Request Dto]

    public class SaveGyeCodeRequestDto
    {
        /// <summary>
        /// 복사여부 - UI에서 연동되므로 자바스크립트 명명규칙으로 처리 
        /// </summary>
        public ENUM_USE_YN CopyFlag { get; set; }

        /// <summary>
        /// 계정코드
        /// </summary>
        public string GYE_CODE { get; set; }


        /// <summary>
        /// 상위계정
        /// </summary>
        public string GROUP_CODE { get; set; }

        /// <summary>
        /// 상위계정명
        /// </summary>
        public string GROUP_CODE_DES { get; set; }

        /// <summary>
        /// 상위계정속성
        /// </summary>
        public string GROUP_INPUT_GUBUN { get; set; }

        /// <summary>
        /// 계정명
        /// </summary>
        public string GYE_DES { get; set; }

        /// <summary>
        /// 간편일괄등록에서 호출됐는지 여부
        /// </summary>        
        public bool IsFromSimpleRegister { get; set; }

        /// <summary>
        /// 차변/대변 구분
        /// </summary>
        public ENUM_CRDR_TYPE CR_DR { get; set; }

        /// <summary>
        /// 기본값 등록 타입(Y:전표입력계정, I:수입지출 집계계정)
        /// </summary>
        public ENUM_SLIP_INPUT_TYPE DefaultSettingType { get; set; }

        /// <summary>
        /// 수입지출구분코드
        /// </summary>
        public ENUM_INEX_DIV_CODE InexDivCode { get; set; }

        /// <summary>
        /// 계정타입
        /// </summary>
        public ENUM_ACCOUNT_CATEGORY GYE_TYPE { get; set; }

        /// <summary>
        /// 탭 타입 ( 1: 재무제표, 2: 수입지출명세서)
        /// </summary>
        public string TabType { get; set; }
    }

    #endregion

    #region [View Dto]
    public class GyeCodeInputDto : IViewInputData
    {
        #region [override]

        public ENUM_DELETE_YN DeleteYn { get; set; }

        public string WriterID { get; set; }

        public string WriterInPart { get; set; }

        public string EditorID { get; set; }

        public string EditorInPart { get; set; }

        #endregion
    }
    #endregion
}