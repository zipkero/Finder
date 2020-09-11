using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
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
using ECount.ERP.Service.Account.Basic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="Payment Agency">
    /// 1. Create Date : 2020.03.19
    /// 2. Creator     : Nguyen Duc Tai
    /// 3. Description : Payment Agency
    /// 4. Precaution  : 
    /// 5. History     : 2020.07.10 (LuuVinhThanh): A20_03161 - 기초등록 > My탭추가
    /// 6. MenuPath    : Acct.1 > Setup > Payment Agency
    /// 7. OldName     : 
    /// </summary>

    [ProgramInfo(NameResource = "LBL93038", ProgramId = ERPProgramId.Account.PaymentAgency, MultiManualId = "EBA_EBA011M")]
    public class EBA011MAction : ERPXViewListActionAccountBase<EBA011MAction, ERPXViewListAccountRequest<GetListPaymentAgencyBySearchRequest>, GetListPaymentAgencyBySearchResult>
    {
        /// <summary>
        /// 데이터관리 > 호출유형
        /// </summary>
        public string ManagementType { get; set; }   // BA:Excel, UF:자료올리기형태, ZI:백업, AT:첨부파일, SD:조건삭제
        /// <summary>
        /// 검색창 Display Mode // [1: Yes, 0:No]
        /// </summary>
        public bool isShowSearchForm { get; set; }
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

                //o.Owner.FormViewType = ENUM_XFORM_VIEW_TYPE.List;

                o.Owner.DataViewType = ENUM_DATA_VIEW_TYPE.DataApi;
                o.Owner.FormQueryOptionOutput = new XFormQueryOption() { FormType = "AR773", IsCheckFilter = true };
                o.Owner.FormQueryOptionSearch = new XFormQueryOption() { FormType = "AN773" };
                o.Owner.IsCustomTabUse = true;
                this.IsChangeDateFormat = false;
                this.IsSimpleSearchUse = false;
                this.UseDefaultSearchParam = true;
            });

            //===========================================================
            // Base class
            //===========================================================          
            pipe.RegisterCode(o => base.OnInitiate(context));

            return this.PipeCompleted();
        }

        #endregion


        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA011M.js"));
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : ValidatorListAccountBase<EBA011MAction>
        {
            /// <summary>
            /// Check Validator
            /// </summary>
            public Validator()
            {
                InitFor(m => m.Request.Data).DefaultValue(new GetListPaymentAgencyBySearchRequest());
                InitFor(m => m.Request.Data.PAGE_CURRENT).AssignValue(1);
                InitFor(m => m.Request.Data.PARAM).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.BUSINESS_NO).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.CUST_NAME).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.BOSS_NAME).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.BANK_ACC_IN).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.GYE_CODE).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.GROUP_CD1).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.GROUP_CD2).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.G_GUBUN).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.REMARKS_WIN).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.REMARKS).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.CANCEL).DefaultValue("N");
                InitFor(m => m.Request.Data.BASE_DATE_CHK).DefaultValue(false);
                InitFor(m => m.Request.Data.EMAIL).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.TEL).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.UPTAE).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.JONGMOK).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.ADDR).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.EMP_CD).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.POST_NO).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.DM_ADDR).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.DM_POST).DefaultValue(string.Empty);
                InitFor(m => m.Request.Data.G_BUSINESSNO).DefaultValue(string.Empty);
            }
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ViewBagGeneratorListAccountBase<EBA011MAction>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region [config]
                MappingFor(m => m.Company, ctx => ctx.Company, dest => {
                    dest.Assign(src => src.COM_DES);
                });

                MappingFor(m => m.Config.User, ctx => ctx.Config.User, dest => {
                    dest.Assign(src => src.USE_EXCEL_CONVERT);
                });

                #endregion

                #region Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("setting", (mo, ctx) => ctx.Permission[ERPProgramId.Account.PaymentAgency]);
                });
                #endregion

                #region [DefaultOption]
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("PARAM", (mo, ctx) => mo.Request.Data.PARAM);
                    dest.Assign("BUSINESS_NO", (mo, ctx) => mo.Request.Data.BUSINESS_NO);
                    dest.Assign("CUST_NAME", (mo, ctx) => mo.Request.Data.CUST_NAME);
                    dest.Assign("BOSS_NAME", (mo, ctx) => mo.Request.Data.BOSS_NAME);
                    dest.Assign("BANK_ACC_IN", (mo, ctx) => mo.Request.Data.BANK_ACC_IN);
                    dest.Assign("GYE_CODE", (mo, ctx) => mo.Request.Data.GYE_CODE);
                    dest.Assign("COST_RATE", (mo, ctx) => mo.Request.Data.COST_RATE);
                    dest.Assign("GROUP_CD1", (mo, ctx) => mo.Request.Data.GROUP_CD1);
                    dest.Assign("GROUP_CD2", (mo, ctx) => mo.Request.Data.GROUP_CD2);
                    dest.Assign("G_GUBUN", (mo, ctx) => mo.Request.Data.G_GUBUN);
                    dest.Assign("REMARKS_WIN", (mo, ctx) => mo.Request.Data.REMARKS_WIN);
                    dest.Assign("REMARKS", (mo, ctx) => mo.Request.Data.REMARKS);
                    dest.Assign("CANCEL", (mo, ctx) => mo.Request.Data.CANCEL);
                    dest.Assign("BASE_DATE_CHK", (mo, ctx) => mo.Request.Data.BASE_DATE_CHK);
                    dest.Assign("EMAIL", (mo, ctx) => mo.Request.Data.EMAIL);
                    dest.Assign("TEL", (mo, ctx) => mo.Request.Data.TEL);
                    dest.Assign("UPTAE", (mo, ctx) => mo.Request.Data.UPTAE);
                    dest.Assign("JONGMOK", (mo, ctx) => mo.Request.Data.JONGMOK);
                    dest.Assign("ADDR", (mo, ctx) => mo.Request.Data.ADDR);
                    dest.Assign("EMP_CD", (mo, ctx) => mo.Request.Data.EMP_CD);
                    dest.Assign("POST_NO", (mo, ctx) => mo.Request.Data.POST_NO);
                    dest.Assign("DM_POST", (mo, ctx) => mo.Request.Data.DM_POST);
                    dest.Assign("DM_ADDR", (mo, ctx) => mo.Request.Data.DM_ADDR);
                    dest.Assign("G_BUSINESSNO", (mo, ctx) => mo.Request.Data.G_BUSINESSNO);
                    dest.Assign("ManagementType", (mo, ctx) => mo.ManagementType);
                    dest.Assign("isShowSearchForm", (mo, ctx) => mo.isShowSearchForm);
                });
                #endregion
            }
        }

        #endregion
    }
}