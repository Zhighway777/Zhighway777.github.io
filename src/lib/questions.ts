import type { Question } from "./types";

export const QUESTION_SET_VERSION = "question-set-v004";

export const questions: Question[] = [
  {
    id: "Q01",
    scenario: "新方法评估",
    text: "你听说一个新工具、新模型或新方法宣称能明显提升某类工作效率。你会首先：",
    options: [
      {
        id: "A",
        text: "收集资料并建议尽快小范围试点",
        impacts: { D1: 3, D2: 2, D4: -1, D7: -1, D8: -1 },
      },
      {
        id: "B",
        text: "先看外部反馈和已有案例",
        impacts: { D1: 1, D4: -1, D6: 1, D9: -1 },
      },
      {
        id: "C",
        text: "比较成本、学习成本和迁移成本",
        impacts: { D5: -1, D7: 3, D6: -1, D8: 1, D9: -1 },
      },
      {
        id: "D",
        text: "先判断它是否解决当前真实问题",
        impacts: { D1: -3, D7: 1 },
      },
      {
        id: "E",
        text: "先记录到观察清单，等更稳定后再评估",
        impacts: { D2: -2, D8: 2 },
      },
    ],
  },
  {
    id: "Q02",
    scenario: "方案分歧",
    text: "跨部门评审中，两个方案都有道理但结论相反。你会：",
    options: [
      {
        id: "A",
        text: "继续收集更多可选方案",
        impacts: { D1: 1, D2: 3, D6: 2 },
      },
      {
        id: "B",
        text: "总结共识和分歧点，推动当场决策",
        impacts: { D2: -3, D6: -2, D5: 1 },
      },
      {
        id: "C",
        text: "建议用数据、案例或小范围试点验证",
        impacts: { D4: 2, D8: 1 },
      },
      {
        id: "D",
        text: "会后先独立研究，形成结论再同步",
        impacts: { D3: -2, D5: -3, D9: -2 },
      },
      {
        id: "E",
        text: "明确影响面，分派相关人并行验证",
        impacts: { D5: 3, D9: 3, D3: 2 },
      },
    ],
  },
  {
    id: "Q03",
    scenario: "客户优先级",
    text: "客户临时提出高优先级需求，但会挤占原有计划。你会：",
    options: [
      {
        id: "A",
        text: "优先响应客户，重新调整内部排期",
        impacts: { D1: -3, D4: -1, D6: -2, D8: -2 },
      },
      {
        id: "B",
        text: "先澄清真实目的和验收标准",
        impacts: { D1: -2, D4: 2, D5: 1 },
      },
      {
        id: "C",
        text: "评估对长期方案和现有质量的影响",
        impacts: { D5: -1, D6: 3, D8: 2, D9: -1 },
      },
      {
        id: "D",
        text: "拉相关负责人共同确认取舍",
        impacts: { D5: 3, D9: 2 },
      },
    ],
  },
  {
    id: "Q04",
    scenario: "效果与成本",
    text: "一个方案能达到更好效果，但需要更多预算、人力或时间。你会：",
    options: [
      {
        id: "A",
        text: "争取资源，把效果做到位",
        impacts: { D3: -1, D7: -3, D6: 2 },
      },
      {
        id: "B",
        text: "先算投入产出，再决定是否值得",
        impacts: { D5: -1, D7: 3, D4: 1, D9: -1 },
      },
      {
        id: "C",
        text: "寻找低成本版本，保留后续升级空间",
        impacts: { D4: -1, D7: 1, D6: -1, D2: -1 },
      },
      {
        id: "D",
        text: "查看同类案例或已有数据，降低不确定性",
        impacts: { D4: 2, D8: 1 },
      },
    ],
  },
  {
    id: "Q05",
    scenario: "共享资源不足",
    text: "多个团队同时需要一份紧缺资源。你会：",
    options: [
      {
        id: "A",
        text: "先保证影响最大的事项使用",
        impacts: { D7: 2, D6: -2, D5: 1 },
      },
      {
        id: "B",
        text: "建立临时分配规则并公开排队",
        impacts: { D8: 3, D9: 3 },
      },
      {
        id: "C",
        text: "寻找替代资源或降低占用的方法",
        impacts: { D1: 1, D2: 2, D4: -1, D5: -1, D7: 1, D8: -2 },
      },
      {
        id: "D",
        text: "先和相关负责人逐个沟通优先级",
        impacts: { D5: 3, D9: 2 },
      },
    ],
  },
  {
    id: "Q06",
    scenario: "结果偶发不一致",
    text: "某个流程或系统偶发异常：输入看起来相同，结果却有时不稳定。你会：",
    options: [
      {
        id: "A",
        text: "先重试并记录复现条件",
        impacts: { D3: -2, D4: -3, D9: -1 },
      },
      {
        id: "B",
        text: "核对步骤、版本、配置和权限",
        impacts: { D4: 3, D3: -1, D5: -1, D10: -1 },
      },
      {
        id: "C",
        text: "请相关负责人检查完整链路",
        impacts: { D3: 3, D5: 2, D4: 1 },
      },
      {
        id: "D",
        text: "先启用备用方案保证业务继续",
        impacts: { D6: -3, D8: -2 },
      },
      {
        id: "E",
        text: "公开同步现象并拉人共同排查",
        impacts: { D9: 3, D5: 3 },
      },
    ],
  },
  {
    id: "Q07",
    scenario: "流程迁移",
    text: "团队需要从熟悉的工作方式迁移到新工具或新流程。你会：",
    options: [
      {
        id: "A",
        text: "先小范围试用，再决定推广节奏",
        impacts: { D2: 1, D4: -1, D8: -1, D6: 1 },
      },
      {
        id: "B",
        text: "明确迁移收益、成本和风险后推进",
        impacts: { D7: 2, D8: 2 },
      },
      {
        id: "C",
        text: "先保证迁移不影响当期交付",
        impacts: { D6: -3, D2: -2 },
      },
      {
        id: "D",
        text: "组织相关人共同设计迁移步骤",
        impacts: { D5: 3, D3: 2 },
      },
    ],
  },
  {
    id: "Q08",
    scenario: "信息不足",
    text: "一项决策必须在今天完成，但关键信息还不完整。你会：",
    options: [
      {
        id: "A",
        text: "先记录假设，给出可回退的决策",
        impacts: { D4: -2, D6: -2, D8: -1 },
      },
      {
        id: "B",
        text: "推迟决策，直到确认关键事实",
        impacts: { D3: -1, D4: 3, D5: -1, D6: 1, D9: -1, D10: -1 },
      },
      {
        id: "C",
        text: "向相关方公开信息缺口和风险",
        impacts: { D9: 3, D5: 2, D10: 1 },
      },
      {
        id: "D",
        text: "拆出可先执行的部分，争议部分后置",
        impacts: { D2: -1, D6: -2, D3: 2 },
      },
    ],
  },
  {
    id: "Q09",
    scenario: "跨团队协作",
    text: "两个团队对责任边界理解不一致，导致任务停滞。你会：",
    options: [
      {
        id: "A",
        text: "先推动会议明确边界和负责人",
        impacts: { D5: 3, D9: 3 },
      },
      {
        id: "B",
        text: "自己先补齐空缺，保证任务继续",
        impacts: { D3: -1, D5: -2, D6: -2, D9: -1 },
      },
      {
        id: "C",
        text: "梳理端到端流程，找出结构性原因",
        impacts: { D3: 3, D6: 2 },
      },
      {
        id: "D",
        text: "升级给共同上级，请其裁定",
        impacts: { D8: 2, D9: 1 },
      },
    ],
  },
  {
    id: "Q10",
    scenario: "里程碑风险",
    text: "项目还有两周交付，但中间里程碑已经延期。你会：",
    options: [
      {
        id: "A",
        text: "重新排任务，锁定必须交付的范围",
        impacts: { D4: -1, D6: -3, D2: -2 },
      },
      {
        id: "B",
        text: "公开风险，让相关负责人重新排序",
        impacts: { D9: 3, D5: 2, D6: -1 },
      },
      {
        id: "C",
        text: "检查是否有一次性补丁和长期隐患",
        impacts: { D5: -1, D6: 3, D8: 2, D9: -1 },
      },
      {
        id: "D",
        text: "寻找替代路径或降低范围",
        impacts: { D1: 1, D2: 2, D7: 1, D8: -2 },
      },
    ],
  },
  {
    id: "Q11",
    scenario: "发现风险",
    text: "你发现别人的方案存在潜在风险，但证据还不完整。你会：",
    options: [
      {
        id: "A",
        text: "立即公开提示风险和建议验证方式",
        impacts: { D9: 3, D8: 2 },
      },
      {
        id: "B",
        text: "先自行确认，再给出完整结论",
        impacts: { D3: -2, D5: -2, D9: -3, D10: -1, D4: 2 },
      },
      {
        id: "C",
        text: "只提醒最关键风险，避免打断节奏",
        impacts: { D8: 1, D6: -2, D10: -1 },
      },
      {
        id: "D",
        text: "拉相关人做快速风险评审",
        impacts: { D5: 3, D3: 2 },
      },
    ],
  },
  {
    id: "Q12",
    scenario: "长期技术路线",
    text: "公司需要判断下一代工作方向，但短期收益还不明确。你会：",
    options: [
      {
        id: "A",
        text: "构建未来场景和技术雷达，寻找提前布局机会",
        impacts: { D1: 3, D2: 3, D5: -1, D6: 3, D7: -1 },
      },
      {
        id: "B",
        text: "对照当前客户痛点，只保留有明确需求的方向",
        impacts: { D1: -3, D6: -2, D7: 2 },
      },
      {
        id: "C",
        text: "做小范围预研，设定观察指标和放弃条件",
        impacts: { D1: 2, D2: 2, D4: -2, D6: 2 },
      },
      {
        id: "D",
        text: "等外部趋势更明确后再投入资源",
        impacts: { D2: -3, D6: -2, D8: 3 },
      },
    ],
  },
  {
    id: "Q13",
    scenario: "工作深度",
    text: "面对一个复杂问题，你更倾向：",
    options: [
      {
        id: "A",
        text: "先深入一个最可疑的点",
        impacts: { D3: -3, D4: 1, D10: -1 },
      },
      {
        id: "B",
        text: "先梳理所有相关环节的关系",
        impacts: { D3: 3, D5: 1 },
      },
      {
        id: "C",
        text: "快速尝试几种可能的解决方式",
        impacts: { D1: 1, D4: -3, D8: -2, D2: 1 },
      },
      {
        id: "D",
        text: "请熟悉各环节的人一起判断",
        impacts: { D5: 3, D3: 2 },
      },
    ],
  },
  {
    id: "Q14",
    scenario: "架构边界",
    text: "一个新需求未来可能被多个团队复用，你会：",
    options: [
      {
        id: "A",
        text: "先设计统一接口、模块边界和演进路径",
        impacts: { D3: 3, D6: 3, D8: 2 },
      },
      {
        id: "B",
        text: "让各团队先按本地方式快速交付",
        impacts: { D6: -3, D8: -3, D3: -2 },
      },
      {
        id: "C",
        text: "在一个团队试点，再决定是否抽象成公共能力",
        impacts: { D2: 2, D4: -2, D3: 1 },
      },
      {
        id: "D",
        text: "先核算复用收益、迁移成本和当前交付影响",
        impacts: { D1: -2, D5: -1, D7: 3, D6: -2, D9: -1 },
      },
      {
        id: "E",
        text: "组织相关团队共同确认职责和数据边界",
        impacts: { D3: 2, D5: 3, D9: 3 },
      },
    ],
  },
  {
    id: "Q15",
    scenario: "数据口径",
    text: "两个团队给出的关键数据结论不一致。你会：",
    options: [
      {
        id: "A",
        text: "先复现一次统计过程",
        impacts: { D4: -2, D3: -1, D5: -1, D9: -1, D10: -1 },
      },
      {
        id: "B",
        text: "核对口径、范围、时间和过滤条件",
        impacts: { D4: 3, D5: -1, D8: 1 },
      },
      {
        id: "C",
        text: "先采用更保守的结论",
        impacts: { D8: 3, D2: -2 },
      },
      {
        id: "D",
        text: "公开差异，让双方共同解释",
        impacts: { D9: 3, D5: 2 },
      },
      {
        id: "E",
        text: "让 AI 辅助汇总口径差异，关键来源仍由人工复核",
        impacts: { D4: 1, D8: 1, D10: 3 },
      },
    ],
  },
  {
    id: "Q16",
    scenario: "AI 多步任务",
    text: "你需要完成一份资料整理或调研报告。你会：",
    options: [
      {
        id: "A",
        text: "自己完整调研，关键结论更可靠",
        impacts: { D3: -2, D10: -3, D5: -2, D9: -1 },
      },
      {
        id: "B",
        text: "让 AI 搜集资料，自己判断和写结论",
        impacts: { D10: 2, D4: 1 },
      },
      {
        id: "C",
        text: "拆成多步交给 AI，并设置来源核查",
        impacts: { D10: 3, D8: 2, D3: 1 },
      },
      {
        id: "D",
        text: "让 AI 直接生成初稿，再人工修改",
        impacts: { D10: 1, D8: -2 },
      },
    ],
  },
  {
    id: "Q17",
    scenario: "AI 边界",
    text: "使用 AI 处理一项涉及内部信息的工作。你会：",
    options: [
      {
        id: "A",
        text: "先判断数据级别、权限和错误成本",
        impacts: { D8: 3, D10: 1 },
      },
      {
        id: "B",
        text: "只交给 AI 处理公开或脱敏内容",
        impacts: { D8: 2, D10: 2 },
      },
      {
        id: "C",
        text: "完整人工处理，避免额外风险",
        impacts: { D3: -1, D5: -1, D9: -1, D10: -3, D8: 1 },
      },
      {
        id: "D",
        text: "让 AI 输出草稿，关键信息由人工补齐",
        impacts: { D10: 1, D8: 1, D5: 1 },
      },
    ],
  },
  {
    id: "Q18",
    scenario: "质量与速度",
    text: "临交付前发现一个小问题，修复可能影响时间点。你会：",
    options: [
      {
        id: "A",
        text: "先按计划交付，记录后续修复",
        impacts: { D6: -3, D8: -2 },
      },
      {
        id: "B",
        text: "评估影响面，再决定是否阻塞交付",
        impacts: { D8: 2, D3: 2 },
      },
      {
        id: "C",
        text: "坚持修复，避免留下隐患",
        impacts: { D6: 3, D7: -2, D8: 3 },
      },
      {
        id: "D",
        text: "请相关负责人共同决策",
        impacts: { D5: 3, D9: 2 },
      },
    ],
  },
  {
    id: "Q19",
    scenario: "知识同步",
    text: "你刚刚解决了一个别人以后也可能遇到的问题。你会：",
    options: [
      {
        id: "A",
        text: "立即在群里同步现象、原因和处理方式",
        impacts: { D9: 3, D5: 3 },
      },
      {
        id: "B",
        text: "整理成简短文档或 FAQ",
        impacts: { D5: -1, D8: 2, D3: 2, D10: -1 },
      },
      {
        id: "C",
        text: "先告知直接相关的人",
        impacts: { D9: -2, D6: -1 },
      },
      {
        id: "D",
        text: "继续处理下一个问题，之后再沉淀",
        impacts: { D9: -3, D6: -2 },
      },
    ],
  },
  {
    id: "Q20",
    scenario: "需求变化",
    text: "临交付前外部需求突然变化。你会：",
    options: [
      {
        id: "A",
        text: "先评估变化是否影响核心目标",
        impacts: { D1: -2, D3: 2 },
      },
      {
        id: "B",
        text: "快速调整计划，先满足新要求",
        impacts: { D6: -3, D8: -2 },
      },
      {
        id: "C",
        text: "确认变化原因，避免反复摇摆",
        impacts: { D4: 2, D6: 2 },
      },
      {
        id: "D",
        text: "组织相关方重新确认范围和优先级",
        impacts: { D5: 3, D9: 3 },
      },
    ],
  },
  {
    id: "Q21",
    scenario: "重复工作改进",
    text: "你连续几次完成同一类重复工作后，更可能：",
    options: [
      {
        id: "A",
        text: "建立复盘清单，持续优化步骤",
        impacts: { D2: 2, D5: -1, D6: 2, D8: 2, D9: -1, D10: 1 },
      },
      {
        id: "B",
        text: "先按原方式完成，避免额外投入",
        impacts: { D3: -1, D6: -3, D9: -1, D10: -1 },
      },
      {
        id: "C",
        text: "尝试模板、脚本或 AI 辅助减少重复",
        impacts: { D1: 1, D2: 2, D10: 3, D8: -1 },
      },
      {
        id: "D",
        text: "收集相关人的反馈，再确定改进点",
        impacts: { D5: 3, D9: 3, D6: 1 },
      },
    ],
  },
  {
    id: "Q22",
    scenario: "工作方式变革",
    text: "一个旧流程已经影响效率，但改变会影响多个团队。你会：",
    options: [
      {
        id: "A",
        text: "收集痛点案例，先形成变革共识",
        impacts: { D5: 3, D9: 2, D6: 2 },
      },
      {
        id: "B",
        text: "设计分阶段过渡方案和责任人",
        impacts: { D3: 3, D6: 3, D8: 2 },
      },
      {
        id: "C",
        text: "先在一个小范围试点，验证后再推广",
        impacts: { D2: 2, D4: -2, D8: -1 },
      },
      {
        id: "D",
        text: "维持现状，直到有明确要求再调整",
        impacts: { D2: -3, D5: -1, D8: 3, D6: -2, D9: -1, D10: -1 },
      },
    ],
  },
  {
    id: "Q23",
    scenario: "多任务切换",
    text: "多个方向同时需要你补位，但你的时间有限。你会：",
    options: [
      {
        id: "A",
        text: "锁定最重要目标，其余事项暂缓",
        impacts: { D6: 3, D8: 2, D5: -1, D10: -1 },
      },
      {
        id: "B",
        text: "在多个缺口之间快速切换补位",
        impacts: { D3: 3, D4: -1, D8: -3, D5: 2, D6: -2 },
      },
      {
        id: "C",
        text: "请相关负责人共同确认优先级",
        impacts: { D5: 3, D9: 3, D8: 2 },
      },
      {
        id: "D",
        text: "沉淀可复用模板，降低每次切换成本",
        impacts: { D1: 1, D2: 3, D6: 2, D7: -1, D10: 2 },
      },
    ],
  },
  {
    id: "Q24",
    scenario: "协作摩擦",
    text: "会议中两个同事争执激烈，讨论开始偏离目标。你会：",
    options: [
      {
        id: "A",
        text: "重述共同目标，把争执转成选项",
        impacts: { D5: 3, D9: 3, D3: 2 },
      },
      {
        id: "B",
        text: "请双方先说明约束和关切",
        impacts: { D5: 3, D9: 2, D4: 2 },
      },
      {
        id: "C",
        text: "暂时搁置争议，会后私下分别沟通",
        impacts: { D9: -3, D5: -2 },
      },
      {
        id: "D",
        text: "直接推进决策，避免继续消耗时间",
        impacts: { D6: -3, D8: -2, D5: -2 },
      },
    ],
  },
  {
    id: "Q25",
    scenario: "新能力学习",
    text: "出现一个与你工作相关的新方法或新工具。你会：",
    options: [
      {
        id: "A",
        text: "安排固定时间学习并做小实验",
        impacts: { D1: 1, D2: 3, D6: 2, D7: -1, D10: 2 },
      },
      {
        id: "B",
        text: "等实际工作明确需要时再学",
        impacts: { D2: -2, D6: -2, D9: -1, D10: -1 },
      },
      {
        id: "C",
        text: "用 AI 辅助整理用法，再亲自验证",
        impacts: { D2: 2, D10: 3, D8: 1 },
      },
      {
        id: "D",
        text: "学习后整理成简短分享给团队",
        impacts: { D5: 3, D9: 3, D10: 1 },
      },
    ],
  },
];
