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
using ECount.ERP.Service.Account.Basic;

namespace ECount.ERP.View.EBA
{
    /// <summary title="기초,당기,기말설정">
    /// 1. Create Date : 2020.01.07
    /// 2. Creator     : 임명식
    /// 3. Description : 기초,당기,기말설정
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 기초,당기,기말설정
    /// 7. OldName     : 
    /// </summary>
    /// <example>
    /// sample codes here
    /// </example>
    [ProgramInfo(NameResource = "LBL08064", ProgramId = "", MultiManualId = "EBA_EBA001P_08")]
    public class EBA001P_08Action : ERPXViewInputActionBase<EBA001P_08Action, ERPXViewInputRequest<SetBeginningCurrentPeriodEndingRequestDto>, GetListAcc002InventoryDetailResultDto>
    {
        #region [Property-public]


        #endregion

        #region [Util]
        protected PipeResult<IEnumerable<GetListAcc002InventoryDetailResultDto>> GetLoadData(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);
            IEnumerable<GetListAcc002InventoryDetailResultDto> result = null;
            pipe.Register<ECount.ERP.Service.Account.Basic.IGetListAcc002InventoryDetailDataSvc>()
               .Mapping(o => o.Command.Request = new Service.Account.Basic.GetListAcc002InventoryDetailRequestDto {
                   FOREIGN_FLAG = o.Owner.Request.Data.FOREIGN_FLAG
               })
               .OnExecuted(o => {
                   result = o.Command.Result;
                   return true;
               });

            return this.CreatePipeResult(() => result);
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
                return this.DefaultView("~/View.Account/EBA/Views/XEBA001P_08.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_08Action>
        {
            /// <summary>
            /// Check Validator
            /// </summary>
            public Validator()
            {
                InitFor(m => m.Request.Data.FOREIGN_FLAG).DefaultValue(ENUM_FOREIGN_YN.Domestic);
            }
        }

        #endregion

        #region [Generator]

        /// <summary>
        /// ViewBagGenerator
        /// </summary>
        public class ViewBagGenerator : ERPViewBagGenerator<EBA001P_08Action>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                //Permissions
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Self", (mo, ctx) => ctx.Permission["E010107"]);
                });

                // Pre InitDatas
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("deptLoad", (mo, ctx) => {
                        return mo.GetLoadData(ctx);
                    });
                });

                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("FOREIGN_FLAG", (mo, ctx) => mo.Request.Data.FOREIGN_FLAG);
                });
                #endregion
            }
        }

        #endregion
    }
    #region [Request Dto]

    public class SetBeginningCurrentPeriodEndingRequestDto
    {
        /// <summary>
        /// 국외용 여부	
        /// </summary>
        public ENUM_FOREIGN_YN FOREIGN_FLAG { get; set; }
    }

    #endregion
}