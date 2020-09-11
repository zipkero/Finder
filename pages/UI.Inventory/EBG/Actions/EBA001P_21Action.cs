using System;
using System.Collections.Generic;
using System.Threading.Tasks;

using ECount.Core.Framework;
using ECount.ERP.Framework;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Infra;
using ECount.ERP.Entity.ACCT;
using ECount.ERP.Entity.ACCT_AC;

namespace ECount.ERP.View.EBA
{
    /// <summary title="간편등록기본값설정">
    /// 1. Create Date : 2019.07.22
    /// 2. Creator     : 김대호
    /// 3. Description : 간편등록기본값설정
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 간편일괄등록
    /// 7. OldName     : 
    /// </summary>    
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA001P_21")]
    public class EBA001P_21Action : ERPXHttpViewActionBase<EBA001P_21Action, ERPXRequest>
    {
        #region [Property-public]

        #endregion

        #region [Execute]

        /// <summary>
        /// Executing
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult OnExecuting(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Required);

            #region [설정한 값이 있는지 체크 후 없으면 za값 복사]

            pipe.RegisterDacWithName<DB_ACCT_AC>("SettingData")
                .Mapping(o => o.CmdExecutor = o.Db.Select<ACC002_PRESET>(opt => opt.WhereOption = ENUM_ORM_WHERE_OPTION.NoPrimaryKey)
                                                 .Where(x => x.Key.COM_CODE == o.Context.COM_CODE))
                .OnExecute(o => o.Db.Query<ACC002_PRESET>(o.CmdExecutor))
                .OnExecuted(o => {
                    return true;
                });

            pipe.RegisterCode(o => {
                return context.Config.ZTCode[ENUM_ZT_CODE_CATEGORY.Account].ZTCode.vSafe(ERPConsts.DefaultZTCode[ENUM_ZT_CODE_CATEGORY.Account]);
            }, "ZaCode");

            pipe.RegisterDac<DB_ACCT_AC>()
                .AddFilter(o => o.GetValue<IEnumerable<ACC002_PRESET>>("SettingData").vIsEmpty())
                .Mapping(o => o.CmdExecutor =
                    o.Db.Insert<ACC002_PRESET>(x => new {
                        x.Key.COM_CODE, x.Key.INPUT_GUBUN, x.Key.INEX_DV_CD,
                        x.GYE_NAME, x.HANG_NAME, x.SE_NAME, x.GROUP_CODE, x.CR_DR, x.SUM_GUBUN, x.BS_PL_GUBUN,
                        x.BS_PL_DES, x.BS_PL_POSITION, x.SUB_GUBUN, x.USE_BILL_YN, x.APPLY_CODE, x.BS_PL_SORT,
                        x.WID, x.WDATE,
                        x.BS_PL_GUBUN2, x.BS_PL_DES2, x.BS_PL_SORT2, x.BS_PL_POSITION2, x.CHECK_FLAG, x.GYE_DES2,
                        x.GYE_TYPE, x.GYE_CODE_LINK, x.PY_GYE_GUBUN, x.PY_GYE_BALANCE, x.BRACKET, x.PY_GYE_SORT,
                        x.CHECK_FLAG2, x.BRACKET2, x.STEP_FLAG, x.SEARCH_MEMO, x.ACC105_SITE, x.ACC105_PJT, x.ITEM_TYPE_CD
                    }, o.Owner.Request)
                    .SelectFrom(o.Db.Select<ACC002_PRESET>(x => new {
                        COM_CODE = o.Context.COM_CODE, x.Key.INPUT_GUBUN, x.Key.INEX_DV_CD,
                        x.GYE_NAME, x.HANG_NAME, x.SE_NAME, x.GROUP_CODE, x.CR_DR, x.SUM_GUBUN, x.BS_PL_GUBUN,
                        x.BS_PL_DES, x.BS_PL_POSITION, x.SUB_GUBUN, x.USE_BILL_YN, x.APPLY_CODE, x.BS_PL_SORT,
                        WID = o.Context.USERID, WDATE = o.Context.GetLocalTime().vToString(),
                        x.BS_PL_GUBUN2, x.BS_PL_DES2, x.BS_PL_SORT2, x.BS_PL_POSITION2, x.CHECK_FLAG, x.GYE_DES2,
                        x.GYE_TYPE, x.GYE_CODE_LINK, x.PY_GYE_GUBUN, x.PY_GYE_BALANCE, x.BRACKET, x.PY_GYE_SORT,
                        x.CHECK_FLAG2, x.BRACKET2, x.STEP_FLAG, x.SEARCH_MEMO, x.ACC105_SITE, x.ACC105_PJT, x.ITEM_TYPE_CD
                    }, opt => opt.WhereOption = ENUM_ORM_WHERE_OPTION.NoPrimaryKey)
                    .Where(x => x.Key.COM_CODE == o.GetValue<string>("ZaCode")))
                )
                .OnExecute(o => o.Db.Execute(o.CmdExecutor))
                .OnExecuted(o => {
                    return true;
                });

            #endregion

            return base.OnExecuting(context);
        }

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => {
                return this.DefaultView("~/View.Account/EBA/Views/XEBA001P_21.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_21Action>
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
        public class ViewBagGenerator : ERPViewBagGenerator<EBA001P_21Action>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                //Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission["E010107"]);
                });

                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("DefaultData", (mo, ctx) => {
                        IEnumerable<dynamic> result;

                        using (var svc = SvcManager.Create<ECount.ERP.Service.Account.Common.IGetAcc002PresetDefaultDataSvc>()) {
                            svc.Request = new ACC002_PRESET_PK() {
                                COM_CODE = ctx.COM_CODE,
                                INPUT_GUBUN = ENUM_SLIP_INPUT_TYPE.TotalAccount
                            };

                            svc.Execute(ctx);
                            result = svc.Result;
                        }

                        return result;
                    });
                });

            }
        }

        #endregion
    }
}