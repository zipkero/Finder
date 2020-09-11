using ECount.Core.Framework;
using ECount.ERP.Data.Account;
using ECount.ERP.Data.Account.Basic;
using ECount.ERP.Data.Common.Infra;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using ECount.ERP.Infra;
using ECount.ERP.Service.Account.Basic;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ECount.ERP.View.EBA
{
    /// <summary title="표시순서설정">
    /// 1. Create Date : 2020.01.08
    /// 2. Creator     : 김용석
    /// 3. Description : 기초,당기,기말 설정
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > Option > 기초,당기,기말 설정 > 표시순서설정
    /// 7. OldName     : 
    /// </summary>
    [ProgramInfo(NameResource = "LBL08064", ProgramId = "E010107", MultiManualId = "")]
    public class EBA001P_13Action : ERPXViewInputActionBase<EBA001P_13Action, ERPXViewInputRequest<GetListAcc002InventoryDetailSubRequestDto>, EBA001P_13ResultDto>
    {
        #region [Property-public]

        #endregion

        #region [Property-private]

        #endregion

        #region [Creator]

        public EBA001P_13Action()
        {

        }

        #endregion

        #region [Utils]

        #region [GetData]

        /// <summary>      
        /// initData
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private PipeResult GetData(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);
            var result = new ViewListData<IEnumerable<GetListAcc002InventoryDetailSubResultDto>>();

            pipe.Register<Service.Account.Basic.IGetListAcc002InventoryDetailSubSvc>()
               .Mapping(o => {
                   o.Command.Request = new Data.Account.Basic.GetListAcc002InventoryDetailSubRequestDto() {
                       COM_CODE = context.COM_CODE,
                       GYE_CODE = o.Owner.Request.Data.GYE_CODE,
                       FOREIGN_FLAG = o.Owner.Request.Data.FOREIGN_FLAG
                   };
               })
               .OnExecuted(o => {
                   this.ViewData.GetDataResult = o.Command.Result;
                   return true;
               });

            return this.PipeCompleted();
        }

        #endregion

        #region [InsertData]

        /// <summary>      
        /// initData
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private PipeResult InsertData(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Required);

            pipe.Register<Service.Account.Basic.IInsertAcc002InventoryDetailsSvc>()
                .Mapping(o => {
                    o.Command.Request = new Data.Account.Basic.InsertAcc002InventoryDetailsRequestDto() {
                        GYE_CODE = o.Owner.Request.Data.GYE_CODE
                    };
                })
                .OnExecuted(o => {
                    return true;
                });

            return this.PipeCompleted();
        }

        #endregion

        #endregion

        #region [OnInitiate]

        /// <summary>
        /// OnInitiate
        /// </summary>
        /// <param name="OnInitiate"></param>
        /// <returns></returns>
        protected override PipeResult OnInitiate(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            //===========================================================
            // Custom
            //===========================================================

            pipe.RegisterCode(o => o.Owner.InsertData(context))
                .AddFilter(o => o.Owner.Request.Data.INPUT_FLAG == ENUM_DEFAULT_YN.None);

            pipe.RegisterCode(o => o.Owner.ViewData = new EBA001P_13ResultDto())
                .AddFilter(o => o.Owner.ViewData.vIsEmpty());

            pipe.RegisterCode(o => o.Owner.GetData(context));

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
        /// <param name="ExecuteCore"></param>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);
        
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA001P_13.js"));
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_13Action>
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
        public class ViewBagGenerator : ViewBagGeneratorRoot<EBA001P_13Action>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region [Permission]
                MappingFor(m => m.Permission, dest => {
                    dest.Assign("Permit", (mo, ctx) => ctx.Permission["E010107"]);
                });
                #endregion

                #region [InitDatas]
                MappingFor(m => m.InitDatas, dest => {
                    dest.Assign("deptLoad", (mo, ctx) => mo.ViewData.GetDataResult);
                });
                #endregion

                #region [DefaultOption]
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("INPUT_FLAG", (mo, ctx) => mo.Request.Data.INPUT_FLAG);
                    dest.Assign("GYE_CODE", (mo, ctx) => mo.Request.Data.GYE_CODE);
                    dest.Assign("ROW_KEY", (mo, ctx) => mo.Request.Data.ROW_KEY);
                    dest.Assign("FOREIGN_FLAG", (mo, ctx) => mo.Request.Data.FOREIGN_FLAG);

                });
                #endregion
            }
        }

        #endregion
    }

    public class EBA001P_13ResultDto : IViewInputData
    {
        /// <summary>
        /// GetDataResult
        /// </summary>
        public IEnumerable<GetListAcc002InventoryDetailSubResultDto> GetDataResult { get; set; }

        #region [override]

        public ENUM_DELETE_YN DeleteYn { get; set; }

        public string WriterID { get; set; }

        public string WriterInPart { get; set; }

        public string EditorID { get; set; }

        public string EditorInPart { get; set; }

        #endregion
    }
}