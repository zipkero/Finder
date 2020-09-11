using System;
using System.Threading.Tasks;
using System.Collections.Generic;

using ECount.Core.Framework;
using ECount.ERP.Framework;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Infra;
using ECount.ERP.Entity.ACCT;
using ECount.ERP.Entity.ACCT_AC;

namespace ECount.ERP.View.EBA
{
    /// <summary title="비영리용 간편일괄등록">
    /// 1. Create Date : 2019.07.18
    /// 2. Creator     : 김대호
    /// 3. Description : 비영리용 간편일괄등록
    /// 4. Precaution  : 
    /// 5. History     : 2020.01.07 (Nguyen Thanh Trung) A19_04630 - ecmodule 경로 변경 후속처리 요청
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 간편일괄등록
    /// 7. OldName     : 
    /// </summary>
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA001P_24")]
    public class EBA001P_24Action : ERPXViewInputActionBase<EBA001P_24Action, ERPXViewInputRequest, SimpleBatchGyeCodeInputDto>
    {
        #region [Property-public]

        #endregion

        #region [Variable-private]

        /// <summary>
        /// 계정코드 자동생성시 기본값
        /// </summary>
        private List<ACC002_PRESET> _defaultSettings = new List<ACC002_PRESET>();

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

        #region [Utility]

        /// <summary>
        /// 간편등록 기본값
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private PipeResult<List<ACC002_PRESET>> GetAcc002PresetData(IERPSessionContext context, string comCode)
        {
            List<ACC002_PRESET> result = null;
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.RegisterDac<DB_ACCT_AC>()
                .Mapping(o => o.CmdExecutor = o.Db.Select<ACC002_PRESET>(opt => opt.WhereOption = ENUM_ORM_WHERE_OPTION.NoPrimaryKey)
                                                 .Where(x => x.Key.COM_CODE == comCode))
                .OnExecute(o => o.Db.Query<ACC002_PRESET>(o.CmdExecutor))
                .OnExecuted(o => {
                    result = o.Result.vToList();
                    return true;
                });

            return CreatePipeResult(() => result);
        }

        #endregion

        #region [Execute]

        /// <summary>
        /// Executing
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult OnExecuting(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.RegisterCode(o => {
                o.Owner._defaultSettings = RunPipe(() => o.Owner.GetAcc002PresetData(context, o.Context.COM_CODE));
            });
            
            #region [설정한 값이 없으면 za값]

            pipe.RegisterCode(o => {
                o.Owner._defaultSettings = RunPipe(() => o.Owner.GetAcc002PresetData(context, context.Config.ZTCode[ENUM_ZT_CODE_CATEGORY.Account].ZTCode.vSafe(ERPConsts.DefaultZTCode[ENUM_ZT_CODE_CATEGORY.Account])));
            })
            .AddFilter(o => o.Owner._defaultSettings.vIsEmpty());

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
                return this.DefaultView("~/View.Account/EBA/Views/XEBA001P_24.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_24Action>
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
        public class ViewBagGenerator : ViewBagGeneratorInputBase<EBA001P_24Action>
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

                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("AutoCodeData", (mo, ctx) => {
                        return ctx.AutoCode[ENUM_AUTO_CODE_TYPE.Account];
                    });

                    dest.Assign("DefaultSettings", (mo, ctx) => {
                        return mo._defaultSettings;
                    });

                    dest.Assign("xFormInfos", (mo, ctx) => {
                        return new {
                            mo.XFormView.ViewData.formType,
                            mo.XFormView.ViewData.formSeq,
                            mo.XFormView.ViewData.companyType
                        };
                    });
                });
            }
        }

        #endregion
    }

    #region [Request Dto]

    public class EmptyDto
    {
    }

    #endregion

    #region [View Dto]

    public class SimpleBatchGyeCodeInputDto : IViewInputData
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