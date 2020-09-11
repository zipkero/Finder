using System;
using System.Collections.Generic;
using System.Linq;
using ECount.Core.Framework;
using ECount.ERP.Data.RequestBase;
using ECount.ERP.Framework;
using ECount.ERP.Framework.Dto;
using ECount.ERP.Infra;
using ECount.ERP.Data.Admin.Manage;
using ECount.ERP.Entity.MYSQL_ACCT;
using ECount.ERP.Service.GmcAdmin.Manage;


namespace ECount.ERP.View.EBA
{
    /// <summary title="계정 기본값 복원 팝업창">
    /// 1. Create Date :  2020.06.08
    /// 2. Creator : 김대호
    /// 3. Description : 계정 기본값 복원 팝업창
    /// 4. Precaution : 
    /// 5. History : 
    /// 6. MenuPath :  회계1>기초등록>계정등록
    /// 7. OldName : New
    /// </summary>
    [ProgramInfo(NameResource = "LBL00055", ProgramId = "E010107", MultiManualId = "EBA_EBA001P_30")]
    public class EBA001P_30Action : ERPXHttpViewActionBase<EBA001P_30Action, ERPXRequest<GetListZTCodeRequestDto>>
    {
        #region [Private-variables]

        private HashDictionary<ENUM_FOREIGN_TYPE, string> _branchDict = new HashDictionary<ENUM_FOREIGN_TYPE, string> {
            { ENUM_FOREIGN_TYPE.Korea, "BR_KO" },
            { ENUM_FOREIGN_TYPE.America, "BR_US" },
            { ENUM_FOREIGN_TYPE.Japan, "BR_JP" },
            { ENUM_FOREIGN_TYPE.China, "BR_CN" },
            { ENUM_FOREIGN_TYPE.Taiwan, "BR_TW" },
            { ENUM_FOREIGN_TYPE.Vietnam, "BR_VN" },
            { ENUM_FOREIGN_TYPE.Indonesia, "BR_ID" },
            { ENUM_FOREIGN_TYPE.Thailand, "BR_TH" },
            { ENUM_FOREIGN_TYPE.Singapore, "BR_SG" },
            { ENUM_FOREIGN_TYPE.Malaysia, "BR_MY" }
        };

        #endregion

        #region [Utility]

        /// <summary>
        /// 사용자지정양식 생성(리스트 양식)
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        private XFormDefListView.UIData GetXFormInfoForList(IERPSessionContext context)
        {
            XFormDefListView.UIData xFormInfo = new XFormDefListView.UIData();

            List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto> detailOptions = new List<Data.Common.XForm.XFormSetManuallyDetailListOptionDto>();

            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "ZT_NAME",
                ColNm = context.GetResource("LBL19144"),
                ControlType = "widget.link",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 200,
                Align = ENUM_ALIGN.Center
            });

            detailOptions.Add(new Data.Common.XForm.XFormSetManuallyDetailListOptionDto() {
                ColCd = "PREVIEW",
                ColNm = context.GetResource("LBL05624"),
                ControlType = "widget.link",
                DataType1 = ENUM_DATA_TYPE1.Text,
                FieldSize = 200,
                Align = ENUM_ALIGN.Center
            });

            xFormInfo = context.GetXFormXListManually(new XFormQueryOption() {
                FormType = "TR003",
                FormSeq = 1,
                SetManuallyOption = new Data.Common.XForm.XFormSetManuallyMainOptionDto() {
                    ViewType = ENUM_XFORM_VIEW_TYPE.List,
                    DetailOption = detailOptions
                }
            });

            return xFormInfo;
        }

        /// <summary>
        /// InitViewData
        /// </summary>
        /// <param name="context"></param>
        private PipeResult<IEnumerable<GetListZTCodeDefaultListResultDto>> GetZtListData(IERPSessionContext context)
        {
            IEnumerable<GetListZTCodeDefaultListResultDto> result = Enumerable.Empty<GetListZTCodeDefaultListResultDto>();
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.Register<IGetListZTCodeDefaultListSvc>()
                .Mapping(o => {
                    o.Command.Request = new GetListZTCodeRequestDto() {
                        CAT_ATTR_ID = o.Owner.Request.Data.CAT_ATTR_ID,
                        SHOW_ALL = o.Owner.Request.Data.SHOW_ALL,
                        LAN_TYPE_ID = context.Language,
                        BRANCH = o.Owner._branchDict[context.Entity<ECount.ERP.Entity.ACCT.ACC001>().FOREIGN_YN]
                    };
                })
                .OnExecuted(o => {
                    result = o.Command.Result;
                    return true;
                });

            return this.CreatePipeResult(() => result);
        }

        private PipeResult<string> GetCurrentZtData(IERPSessionContext context)
        {
            string result = string.Empty;
            var pipe = this.CreatePipeline(TransactionOption.Suppress);

            pipe.RegisterDac<DB_MYSQL_ACCT>()
                .Mapping(o => {
                    o.CmdExecutor = o.Db.Select<CO_ZT_CD_T>(opt => opt.WhereOption = ENUM_ORM_WHERE_OPTION.NoPrimaryKey)
                        .Where(x => x.Key.ZT_ATTR_ID == context.Config.ZTCode[o.Owner.Request.Data.CAT_ATTR_ID].ZTCode.vSafe(ERPConsts.DefaultZTCode[o.Owner.Request.Data.CAT_ATTR_ID]))
                        .And(x => x.Key.SETUP_ATTR_ID == context.Language)
                        .And(x => x.ATTR_ID == "ZT_CODE_NAME");
                })
                .OnExecute(o => o.Db.Fetch<CO_ZT_CD_T>(o.CmdExecutor))
                .OnExecuted(o => {
                    if (o.Result.vIsNotEmpty()) {
                        result = o.Result.SETUP_ATTR_VAL;
                    }
                    
                    return true;
                });

            return this.CreatePipeResult(() => result);
        }

        #endregion

        #region [InitViewData]

        #endregion

        #region [Execute]

        /// <summary>
        /// ExecuteCore
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        protected override PipeResult<HttpActionResult> ExecuteCore(IERPSessionContext context)
        {
            return CreatePipeResult(() => this.DefaultView("~/View.Account/EBA/Views/XEBA001P_30.js"));
        }

        #endregion

        #region [Validator]

        /// <summary>
        /// Check Validator
        /// </summary>
        public class Validator : Validator<EBA001P_30Action>
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
        public class ViewBagGenerator : ERPViewBagGenerator<EBA001P_30Action>
        {
            /// <summary>
            /// ViewBagGenerator
            /// </summary>
            public ViewBagGenerator()
            {
                MappingFor(m => m.XFormInfos, dest => {
                    // 그리드
                    dest.Assign("outputForm", (mo, ctx) => {
                        return mo.GetXFormInfoForList(ctx).ViewModel[0];
                    });

                    // 그리드 폼타입
                    dest.Assign("formType", (mo, ctx) => {
                        return "TR003";
                    });
                });

                #region DefaultOption

                MappingFor(m => m.DefaultOption, dest => {
                    dest.Assign("ZTList", (mo, ctx) => mo.GetZtListData(ctx));
                    dest.Assign("CurrentZT", (mo, ctx) => mo.GetCurrentZtData(ctx));
                    dest.Assign("SHOW_ALL", (mo, ctx) => mo.Request.Data.SHOW_ALL);
                });
                
                #endregion
            }
        }

        #endregion
    }
}
