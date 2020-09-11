using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using ECount.Core.Framework;
using ECount.ERP.Data.Account;
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
    /// <summary title="계정코드 표시순서설정">
    /// 1. Create Date : 2019.08.07
    /// 2. Creator     : 이철원
    /// 3. Description : 계정코드 표시순서설정
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 표시순서설정
    /// 7. OldName     : 
    /// </summary>
    /// <example>
    /// sample codes here
    /// </example>
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA001P_23")]
    public class EBA001P_23Action : ERPXHttpViewActionBase<EBA001P_23Action, ReqGyeCodeForBsPlSort>
    {
        #region [Property-public]

        #endregion

        #region [Property-private]
        #endregion

        #region [Utility]
        #endregion

        #region Initiate
        #endregion

        #region [Execute]

        /// <summary>
        /// Execute
        /// </summary>
        /// <param name="context"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.RegisterCode(o => {
                o.Owner.Request.TabType = "1";
            })
            .AddFilter(o => o.Owner.Request.TabType.vIsEmpty());

            pipe.Register<IGetListGyeCodeForBsPlSortSvc>()
                .AddFilter(o => o.Owner.Request.IsDragMode.vSafe(false) || o.Owner.Request.Datas.vIsEmpty())
                .Mapping(o => o.Command.Request = o.Owner.Request)
                .OnExecuted(o => {
                    o.Owner.Request.Datas = o.Command.Result;
                    return true;
                });

            return CreatePipeResult(() => {
                return this.DefaultView("~/View.Account/EBA/Views/XEBA001P_23.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_23Action>
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
        public class ViewBagGenerator : ERPViewBagGenerator<EBA001P_23Action>
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

                #region InitDatas
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("Datas", (mo, ctx) => mo.Request.Datas);
                });
                #endregion

                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("TabType", (mo, ctx) => mo.Request.TabType);
                    dest.Assign("IsDragMode", (mo, ctx) => mo.Request.IsDragMode);
                });
                #endregion
            }
        }

        #endregion
    }
   
}