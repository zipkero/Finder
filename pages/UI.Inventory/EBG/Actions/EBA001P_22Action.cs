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
    /// <summary title="계정코드 등록자료 변경하기">
    /// 1. Create Date : 2019.08.07
    /// 2. Creator     : 이철원
    /// 3. Description : 계정코드 등록자료 변경하기
    /// 4. Precaution  : 
    /// 5. History     : 
    /// 6. MenuPath    : 회계1 > 기초등록 > 계정등록 > 웹자료올리기
    /// 7. OldName     : 
    /// </summary>
    /// <example>
    /// sample codes here
    /// </example>
    [ProgramInfo(NameResource = "LBL93038", ProgramId = "E010107", MultiManualId = "EBA_EBA001P_22")]
    public class EBA001P_22Action : ERPXHttpViewActionBase<EBA001P_22Action, DtoPopupKey>
    {
        #region [Property-public]

        /// <summary>
        /// FORM_TYPE
        /// </summary>
        public string FORM_TYPE { get; set; }

        /// <summary>
        /// Selected Item (Pre-display values is checked)
        /// </summary>
        public string SelectedItem { get; set; }

        /// <summary>
        /// Fixed check column
        /// </summary>
        public string[] FixedCheckColumns { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public bool? IsUploadFormViewColumns { get; set; }

        /// <summary>
        /// Etc
        /// </summary>
        public List<FormViewColumn.Input> EtcColumns { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public ENUM_BIT_TYPE isUseAlloTab { get; set; }


        #endregion

        #region [Property-private]
        /// <summary>
        /// Form Input Info
        /// </summary>
        private HashDictionary<string, IEnumerable<object>> _formInput { get; set; }
        #endregion

        #region [Utility]
        /// <summary>
        /// Get Form Input Info
        /// </summary>
        /// <param name="context"></param>
        private PipeResult GetListFormView(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.Register<IGetDataGyeCodeTemplateForSelectSvc>()
                .Mapping(o => {
                    o.Command.Request = new ERPXRequest();
                    o.Command.FormType = o.Owner.FORM_TYPE;
                })
                .OnExecuted(o => {
                    o.Owner._formInput = o.Command.Result;
                    return true;
                });
            return this.PipeCompleted();
        }
        #endregion

        #region Initiate
        /// <summary>
        /// Initiate
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult OnInitiate(IERPSessionContext context)
        {
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.RegisterCode(o => this.GetListFormView(context));


            return base.OnInitiate(context);
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
                return this.DefaultView("~/View.Account/EBA/Views/XEBA001P_22.js");
            });
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_22Action>
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
        public class ViewBagGenerator : ERPViewBagGenerator<EBA001P_22Action>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                #region [변경항목 관련 세팅]
                MappingFor(m => m.FormInfos, dest => {
                    dest.Assign("Columns", (mo, ctx) => {
                        return mo._formInput["Columns"];
                    });
                    dest.Assign("FixedColumns", (mo, ctx) => {
                        return mo._formInput["FixedColumns"];
                    });
                    dest.Assign("EditorableColumns", (mo, ctx) => {
                        return mo._formInput["EditorableColumns"];
                    });
                    dest.Assign("keyColumns", (mo, ctx) => {
                        return mo._formInput["keyColumns"];
                    });
                    dest.Assign("fixedColCd", (mo, ctx) => {
                        return mo._formInput["fixedColCd"];
                    });
                    dest.Assign("exceptColumns", (mo, ctx) => {
                        return mo._formInput["ExceptColumns"];
                    });
                    dest.Assign("editorableColCd", (mo, ctx) => {
                        return mo._formInput["editorableColCd"];
                    });
                    dest.Assign("BasicColumns", (mo, ctx) => {
                        return mo._formInput["basicColumns"];
                    });
                    dest.Assign("columnGroups", (mo, ctx) => {
                        return mo._formInput["columnGroups"];
                    });
                    dest.Assign("FixedCheckColumns", (mo, ctx) => {
                        return mo.FixedCheckColumns;
                    });
                });
                #endregion

                #region DefaultOption
                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("SelectedItem", (mo, ctx) => mo.SelectedItem);
                    dest.Assign("FORM_TYPE", (mo, ctx) => mo.FORM_TYPE);
                });
                #endregion
            }
        }

        #endregion
    }
   
}