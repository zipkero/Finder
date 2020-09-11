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
using ECount.ERP.Entity.ACCT_AC;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using ECount.ERP.Infra;

namespace ECount.ERP.View.EBA
{
    /// <summary title="하이퍼링크기본값">
    /// 1. Create Date : 2019.07.11
    /// 2. Creator     : 이철원
    /// 3. Description : 하이퍼링크기본값
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 하이퍼링크기본값
    /// 7. OldName     : 
    /// </summary>
    /// <example>
    /// sample codes here
    /// </example>
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA001P_09")]
    public class EBA001P_09Action : ERPXHttpViewActionBase<EBA001P_09Action, ERPXRequest<HyperLinkBaseRequestDto>>
    {
        #region [Property-public]
        /// <summary>
        /// 재무계정 하이퍼링크 코드 (ZA)
        /// </summary>
        public string FNCL_AC_HLINK_CD_ZA { get; set; }

        /// <summary>
        /// 거래처잔액관리계정 하이퍼링크 코드 (ZA)
        /// </summary>
        public string CUST_BAL_MGNT_AC_HLINK_CD_ZA { get; set; }

        /// <summary>
        /// 손익계정 하이퍼링크 코드 (ZA)
        /// </summary>
        public string PNL_AC_HLINK_CD_ZA { get; set; }

        /// <summary>
        /// 원가계정 하이퍼링크 코드 (ZA)
        /// </summary>
        public string COST_AC_HLINK_CD_ZA { get; set; }

        /// <summary>
        /// 계정종류 없음 하이퍼링크 코드 (ZA)
        /// </summary>
        public string ETC_AC_HLINK_CD_ZA { get; set; }

        /// <summary>
        /// 재무계정 하이퍼링크 코드
        /// </summary>
        public string FNCL_AC_HLINK_CD { get; set; }

        /// <summary>
        /// 거래처잔액관리계정 하이퍼링크 코드
        /// </summary>
        public string CUST_BAL_MGNT_AC_HLINK_CD { get; set; }

        /// <summary>
        /// 손익계정 하이퍼링크 코드
        /// </summary>
        public string PNL_AC_HLINK_CD { get; set; }

        /// <summary>
        /// 원가계정 하이퍼링크 코드
        /// </summary>
        public string COST_AC_HLINK_CD { get; set; }

        /// <summary>
        /// 계정종류 없음 하이퍼링크 코드
        /// </summary>
        public string ETC_AC_HLINK_CD { get; set; }

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
                using ( var dac = new GetMypagecompanyDac() ) {
                    dac.COM_CODE = context.Config.ZTCode[ENUM_ZT_CODE_CATEGORY.Account].ZTCode.vSafe(ERPConsts.DefaultZTCode[ENUM_ZT_CODE_CATEGORY.Account]);

                    var result = dac.Execute(o.Context).Data;

                    if ( result.vIsNotNull() ) {
                        o.Owner.FNCL_AC_HLINK_CD_ZA = result.FNCL_AC_HLINK_CD;
                        o.Owner.CUST_BAL_MGNT_AC_HLINK_CD_ZA = result.CUST_BAL_MGNT_AC_HLINK_CD;
                        o.Owner.PNL_AC_HLINK_CD_ZA = result.PNL_AC_HLINK_CD;
                        o.Owner.COST_AC_HLINK_CD_ZA = result.COST_AC_HLINK_CD;
                        o.Owner.ETC_AC_HLINK_CD_ZA = result.ETC_AC_HLINK_CD;
                    }
                }

                using ( var dac = new GetMypagecompanyDac() ) {
                    dac.COM_CODE = o.Context.COM_CODE;

                    var result = dac.Execute(o.Context).Data;

                    if ( result.vIsNotNull() ) {
                        o.Owner.FNCL_AC_HLINK_CD = result.FNCL_AC_HLINK_CD.vSafe(o.Owner.FNCL_AC_HLINK_CD_ZA);
                        o.Owner.CUST_BAL_MGNT_AC_HLINK_CD = result.CUST_BAL_MGNT_AC_HLINK_CD.vSafe(o.Owner.CUST_BAL_MGNT_AC_HLINK_CD_ZA);
                        o.Owner.PNL_AC_HLINK_CD = result.PNL_AC_HLINK_CD.vSafe(o.Owner.PNL_AC_HLINK_CD_ZA);
                        o.Owner.COST_AC_HLINK_CD = result.COST_AC_HLINK_CD.vSafe(o.Owner.COST_AC_HLINK_CD_ZA);
                        o.Owner.ETC_AC_HLINK_CD = result.ETC_AC_HLINK_CD.vSafe(o.Owner.ETC_AC_HLINK_CD_ZA);
                    }
                }
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
                return this.DefaultView("~/View.Account/EBA/Views/XEBA001P_09.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_09Action>
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
        public class ViewBagGenerator : ERPViewBagGenerator<EBA001P_09Action>
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

                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("FNCL_AC_HLINK_CD_ZA", (mo, ctx) => mo.FNCL_AC_HLINK_CD_ZA);
                    dest.Assign("CUST_BAL_MGNT_AC_HLINK_CD_ZA", (mo, ctx) => mo.CUST_BAL_MGNT_AC_HLINK_CD_ZA);
                    dest.Assign("PNL_AC_HLINK_CD_ZA", (mo, ctx) => mo.PNL_AC_HLINK_CD_ZA);
                    dest.Assign("COST_AC_HLINK_CD_ZA", (mo, ctx) => mo.COST_AC_HLINK_CD_ZA);
                    dest.Assign("ETC_AC_HLINK_CD_ZA", (mo, ctx) => mo.ETC_AC_HLINK_CD_ZA);
                    dest.Assign("FNCL_AC_HLINK_CD", (mo, ctx) => mo.FNCL_AC_HLINK_CD);
                    dest.Assign("CUST_BAL_MGNT_AC_HLINK_CD", (mo, ctx) => mo.CUST_BAL_MGNT_AC_HLINK_CD);
                    dest.Assign("PNL_AC_HLINK_CD", (mo, ctx) => mo.PNL_AC_HLINK_CD);
                    dest.Assign("COST_AC_HLINK_CD", (mo, ctx) => mo.COST_AC_HLINK_CD);
                    dest.Assign("ETC_AC_HLINK_CD", (mo, ctx) => mo.ETC_AC_HLINK_CD);
                });
                #endregion
            }
        }

        #endregion
    }
    #region [Request Dto]

    public class HyperLinkBaseRequestDto
    {
        
    }

    #endregion
}