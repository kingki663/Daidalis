# SysML v2 可视化工具调研

调研日期：2026-11-10。本文只记录工具能力、视觉参考、部署与许可条件，以及检索来源。现有查看器的问题、优化和最小验收条件见[独立文档](model-visualization-improvements.md)。

## 调研范围与结论

目标是找到能将 SysML v2 文本转换为模型视图的现成工具，以 SysModeler 的公开展示作为视觉参考。仅支持 SysML v1、只能手工画图，或无法说明 v2 文本如何进入模型的工具，不列为直接接入候选。

Syside 之外，Eclipse SysON、Tom Sawyer SysML v2 Viewer、JamieD 的 VS Code 扩展、官方 Pilot/Jupyter 都有相关能力。Visual Paradigm SysML v2 Studio、M-Design v2 也有文本驱动图形的官方依据，但其公开渲染接口与嵌入条件尚未核实。[S3–S18]

Open-MBEE sysml-toolkit 既能输出结构化图数据，也能转换为 PlantUML 文本；后者可以再生成 SVG/PNG。它是“语义内核与转换器 + 图形渲染器”的组合，不能将 PlantUML 本身视为 SysML v2 解析器。[S13–S15、S22]

文档声明、源码核查、公开演示和实际运行是不同证据。以下对照不代表完整标准符合性认证，也不是所有工具处理同一模型后的质量排名。

## 工具对照

| 工具 | SysML v2 文本进入方式 | 图形与交互 | 输出、部署与许可 | 核查结果与限制 |
|---|---|---|---|---|
| **Syside Modeler / CLI** | 直接读取 `.sysml`、`.kerml`，支持目录和多文件引用 | General、Interconnection、Action flow、State transition、Sequence；嵌套/树布局、端口、连接和深度控制 | CLI 可无界面输出 SVG/PNG/JPEG；需安装并激活授权。Free Editor 不含模型可视化 | 官方文档和互连 SVG 已核查。可视化、自动布局和 CLI 属于 Business；另有教育科研授权入口。旧 Solo/30-day 文案不能作为当前试用保证。[S3–S6] |
| **Open-MBEE sysml-toolkit + PlantUML** | 由 SysML v2 语义模型生成图数据或 PlantUML | 固定 `0.10.10` 已有 tree、interconnection、state、action、sequence、case、mixed 的 PlantUML 输出；支持样式和源位置链接 | 内核 Apache-2.0；随附 OMG 库另有 EPL-2.0。图片需另配 PlantUML 及布局引擎 | 已核查固定版源码与 API。结构化图和 PlantUML 的视图覆盖不同，不能把七类文本输出等同于七类完整交互图。[S13–S15、S22] |
| **Eclipse SysON** | 上传 `.sysml`，或执行 New objects from text；依赖需先导入 | Web 图形建模、General/Interconnection、嵌套部件和属性面板 | EPL-2.0；应用 + PostgreSQL，可用 Docker Compose；官方 FAQ 声明 SVG 导出 | 完整开源 Web 工作台，不是轻量绘图组件。部分语法可能只导入一部分，需查看限制报告；最新版本的具体导出路径仍需实测。[S7–S9] |
| **Tom Sawyer SysML v2 Viewer** | 连接符合 SysML v2 API 的模型仓库 | 自动布局、嵌套结构、端口与关系展开、序列视图、颜色和线交叉控制 | 商业产品，提供试用和 OEM 嵌入许可；需部署 Viewer 并连接仓库 | 专用 Viewer 候选。未确认任意本地文本直接导入入口；导出 JSON 不等于提供完整 SysML v2 API。[S10、S11] |
| **JamieD / daltskin SysML v2 VS Code Extension** | 打开 `.sysml`；桌面 LSP 和浏览器 Web Worker 均有入口 | 发布版 README 列出 10 类视图，含结构、互连、动作、状态、时序；支持搜索和缩放 | 扩展 MIT，支持 PNG/SVG；图形 shell 依赖 VS Code webview，使用 D3、ELK、Cytoscape 等 | 可作为现成 IDE 工具。嵌入其他应用需适配宿主消息、模型数据与样式，不能当作独立 Web SDK。官方 raw 截图本轮连接失败。[S12] |
| **官方 SysML v2 Pilot / Jupyter** | 在 SysML kernel 中加载文本，使用 `%viz` | 参考实现的 PlantUML 可视化 | EPL-2.0；核查版本需要 Java 21+、Jupyter，图形路径需 Graphviz | 可作为语法与可视化对照。需要独立运行环境，具体参数和图形覆盖应按固定版本确认。[S16] |
| **Visual Paradigm SysML v2 Studio** | 官方文档描述 `.sysml` 编辑后自动出图 | Web 代码/图形并排、布局方向和连线样式调整、显示层级控制 | 官方教程明确 SVG/PNG 导出；使用与嵌入授权需确认 | 相似体验候选，尚未证明存在可调用的公开渲染 CLI/SDK。[S17] |
| **M-Design v2（杭州华望）** | 官方说明支持 SysML v2 文本解析和模型代码联动 | 代码驱动模型生成、需求和架构建模 | 商业工具；官方提供试用和 API 集成说明 | 国内商业备选。具体布局、导出能力、API 文档和权限未实测，不能仅凭“标准 API”判断可直接接入。[S18] |
| **gordo-stell/sysml-playground** | 浏览器粘贴文本，本地解析 | SVG 图、dagre 自动布局、pan/zoom、源码和图并排 | MIT，Web 项目；未查到正式 latest release | 有自有 parser/semantic/renderer。适合作为轻量参考，没有完整标准符合性证据。[S19] |
| **Open-MBEE OpenSysML** | Go CLI/运行时解析文本，支持 view rendering | 输出 Mermaid、DOT、PlantUML、D2 等表示 | Apache-2.0；图片需对应渲染器 | 是另一套运行时，不等同于 Rust/WASM sysml-toolkit。引入它不仅是增加一个图形组件。[S20] |
| **SysModeler.ai** | 官方说明支持手写/AI 生成 v2 文本并自动生成图 | 官方视频列出六类视图、折叠、搜索定位、minimap、源码导航和双向编辑 | 商业平台，公开入口为 Pilot 联系；首页 API 状态仍有 Upcoming | 适合作为体验参考。已核查主页演示与官方视频说明，未取得可复用渲染 SDK 的证据。[S1、S2] |

OMG 工具目录还列出 Siemens Systems Modeler / Simcenter Studio、Ansys SAM、PTC Modeler、CATIA Magic、SysGit、Dalus 等。目录有助于发现候选，但明确不代表 OMG 为工具背书，也不能代替文本导入与图形实测。[S21]

## SysModeler 参考效果

主页公开演示可见代码、模型画布和 Agent 面板并排。官方频道 2026-06-10 的 Graphical Editor 视频说明包含以下特征：[S1、S2]

- General、Interconnection、Action Flow、State Transition、Sequence、Grid 视图。
- 嵌套部件、父节点折叠，以及按类型区分的颜色。
- 搜索后定位并高亮、minimap、缩放、适合窗口和平移。
- 图形元素跳转源码，以及名称和文档的双向编辑。

首页说有五类 v2 views，而上述官方视频说明列出六类；旧材料还说九类 SysML diagrams。不能将三者合成“完整支持所有 v2 图”，也不能把 SysML v1 的九类图直接作为 v2 工具覆盖标准。

Syside 官方 interconnection SVG 可见父部件边界、边界端口、内部子部件和正交连线；SysON 官方截图可见需求、部件、关联和属性面板。二者可作为相近视觉参考，但没有完成各工具同输入的图形质量对比。[S4、S9]

## 接入方式与表达边界

| 表示或方式 | 能表达的内容 | 需要注意的边界 |
|---|---|---|
| SysML v2 文本 | 部件、端口、类型、连接、需求和行为等模型定义 | 需要语义内核处理，不能只靠绘图语法检查 |
| PlantUML 文本 | 选定视图的框、嵌套、连线、标签和样式 | 是绘图中间表示，不保留完整 SysML 语义 |
| SVG | 布局后的坐标、形状、文字和颜色，也可携带链接与元数据 | 是图形输出格式，不自动提供模型编辑或源码同步 |
| CLI 批量出图 | 可重复生成和导出图片，适合文档与流水线 | 版本、视图范围、样式与依赖要固定 |
| Web/IDE 图形工作台 | 搜索、选择、展开、图文联动等交互 | 完整工作台、宿主 webview 和可嵌入 SDK 不是同一类交付物 |
| API 模型仓库 + Viewer | 从标准仓库查询并显示模型 | 本地文件或 compact JSON 不等于标准仓库服务 |

Syside `viz element` 可按 qualified name 选择根元素，`viz view` 可按命名视图批量生成图形，官方文档明确支持 headless。[S3、S5]

sysml-toolkit `0.10.10` 的 WASM 接口接受视图、根元素、样式和源链接参数。`toGraph` 的结构化 emitter 覆盖 tree、interconnection、state、action；sequence、case、mixed 的 PlantUML 输出不能直接当作同样可用的结构化图。tree summary 只用于结构化图，`toPlantuml` 忽略该字段。[S13、S22]

PlantUML 可生成 SVG/PNG。Smetana 是内置 Java 布局路径；Graphviz 是另一条布局路径，两者结果不能不加区分地比较。SVG 文档提供链接及部分图种的关联淡化交互，但这不等于完整图形建模器。[S15、S23]

## 时间与许可核对

下表来自调研时 GitHub release API 的 `published_at`，时间为 UTC。它们是 2026-11-10 的核查快照，不将 tag 名中的月份当作发布日期。

| 项目 | release | 发布时间 UTC | 核对的许可 |
|---|---|---|---|
| 考察的固定 sysml-toolkit | `0.10.10` | 本次不重新判定其发布时间 | Apache-2.0；随附 OMG 库另有 EPL-2.0 |
| 上游 sysml-toolkit | `v0.12.0` | 2026-11-08 23:27:14 | Apache-2.0 |
| Eclipse SysON | `v2026.11.0` | 2026-11-06 11:55:35 | EPL-2.0 |
| JamieD VS Code 扩展 | `v0.59.0` | 2026-10-29 17:49:47 | MIT |
| 官方 Pilot | `2026-09.1` | 2026-10-28 18:20:13 | EPL-2.0 |
| 官方 Release 资料仓库 | `2026-09.1` | 2026-10-30 21:58:27 | EPL-2.0 |
| Open-MBEE OpenSysML | `v0.12.1` | 2026-11-06 02:46:10 | Apache-2.0 |
| sysml-playground | latest release API 返回 404 | 未查到正式 release | MIT |

Syside 文档页本次显示 `1.0.2`，未核实其发布日期。Tom Sawyer 2.1.0 已核实在 2026-05-20 发布，但没有据此认定它为调研日最新版本。SysModeler、Visual Paradigm、M-Design 的公开页未形成可核实的完整版本时间线。[S1、S3、S11、S17、S18]

PlantUML ASL `1.2026.9` 的 Maven 产物与 SHA-256 已核对，用于固定版本的工具验证；没有将“明确选用某版本”表述为“选用最新版本”。[S24]

## 覆盖与限制

- G1–G6 均有执行记录，能力结论引用官方文档、源码或作者资料。第三方榜单只用于发现线索。
- 中文工具覆盖主要落在 M-Design，不能宣称已穷尽国内产品。
- 商业产品的团队实际授权、离线条款、OEM 条款和可用 API 尚未逐一取得，未联系厂商或创建账户。
- SysModeler、Syside 和 SysON 的公开视觉参考已查看；JamieD 官方 raw 截图连接失败，其图形能力依据为发布版文档和源码。
- Context7 MCP 未提供，CLI 请求发生网络错误，已使用一手文档替代。渠道失败不等于没有相关工具或功能。

## 比较维度

| 维度 | 核查内容 |
|---|---|
| 输入 | 是否直接读取 `.sysml`，是否支持 SysML v2、多文件和标准库，需要何种转换 |
| 图形 | 部件定义与用法、嵌套、端口、连接、需求关系；行为和状态视图分开记录 |
| 视觉与交互 | 自动布局、文字和连线可读性、缩放、选择、展开和收起 |
| 集成 | Web 组件、CLI、API、服务、IDE 或桌面程序，宿主适配要求 |
| 导出 | SVG、PNG 等图片及稳定的浏览器显示 |
| 部署与许可 | 开源或商业许可、注册、联网、运行依赖与授权限制 |
| 保真 | 模型与图形如何对应，不支持的语法如何处理，是否可能部分导入或丢失关系 |

## 检索方案

方案于 2026-11-10 确认执行。工具提名经过存在、时间和内容核查；未公开的日期或能力保持未验证，不补造结论。

### 术语

| 概念 | 英文及标识符 | 中文变体 |
|---|---|---|
| 语言 | SysML v2, SysMLv2, SysML 2.0, KerML, textual notation, `.sysml` | SysML v2 文本、系统建模语言、文本建模 |
| 图形 | visualization, graphical notation, diagram, viewer, renderer | 可视化、图形表示、模型视图、渲染器 |
| 结构与关系 | interconnection view, parts, ports, connections, hierarchy, requirement view | 互连视图、部件、端口、连接、嵌套、需求关系 |
| 演示与接入 | text to diagram, auto layout, embeddable, headless, SVG export, API, CLI | 文本生成图、自动布局、嵌入、无界面导出、截图 |

### 渠道

- 通用搜索用于发现产品、文档、仓库和演示；第三方介绍仅作为线索。
- 官方文档用于核查输入、视图、集成和许可；具体 API 优先尝试 Context7，不可用时查一手文档。
- GitHub 使用 `gh` 或官方 API，核查 README、源码、许可和 release。
- 官方演示和截图用于判断视觉特征；无法访问的内容标为未验证。

### 检索组与梯子

先执行第 1 档，不足以回答时再放宽；G4 对每个候选分别执行。

| 组号 | 目的 | 第 1 档 | 第 2 档 | 第 3 档 |
|---|---|---|---|---|
| G1 | 中文工具发现 | `SysML v2 文本 可视化 工具` | `SysMLv2 自动布局 模型视图` | `SysML 2.0 图形建模 开源` |
| G2 | 英文工具发现 | `"SysML v2" "text to diagram"` | `"SysML v2" visualization viewer` | `SysMLv2 graphical modeling tools` |
| G3 | 核对指定参考 | `"Sysmodeler" SysML visualization` | `SysModeler SysML v2 diagram` | `"SysML" "modeler" visualization agent` |
| G4 | 验证主要提名 | `"<候选名称>" "SysML v2" visualization` | `"<候选名称>" diagram import export` | `"<候选名称>" documentation graphical` |
| G5 | 开源实现与集成 | GitHub：`sysmlv2 visualization` | GitHub：`sysml v2 diagram` | GitHub：`sysml language server graphical` |
| G6 | 导出与内核复用 | `"Open-MBEE/sysml-toolkit" visualization PlantUML` | `"SysML v2" SVG export headless` | `"SysML v2" PlantUML Jupyter visualization` |

## 检索记录

命中数只表示工具返回的条目。状态记录当次请求，最终能力结论以工具对照和主要来源为准。

| 编号 | 组号 | 渠道 | 实际检索式或路径 | 返回 | 入选 | 状态与说明 |
|---|---|---|---|---|---|---|
| R1 | G3 | Web 搜索 | `"Sysmodeler" SysML visualization` | 未返回可用条目 | 0 | 用于核对名称；不能据此断言项目不存在 |
| R2 | G1、G2、G3 | Web 搜索 | G1/G2/G3 第 1 档，批量提交 | 无可用正文或来源标识 | 0 | 改用 Tavily 和 Open WebSearch，不视为零命中 |
| R3 | G4 | Tavily advanced | `Syside SysML v2 visualization diagram export` | 6 | 3 | 官方文档、Features 页和 JamieD 扩展线索 |
| R4 | G2 | Open WebSearch / Bing、DuckDuckGo | `"SysML v2" "text to diagram" visualization open source` | 4 | 0 | 结果偏向通识和推广，未用于结论 |
| R5 | G5 | GitHub `gh search repos` | `sysmlv2 visualization` | 0 | 0 | 零返回，执行第 2 档 |
| R6 | G3 | Tavily advanced | `Sysmodeler SysML visualization` | 6 | 3 | 锁定 SysModeler.ai；发现官方视频、OMG 目录和 Tom Sawyer |
| R7 | G1 | Tavily advanced | `SysML v2 文本 可视化 工具` | 6 | 2 | 发现 M-Design；中文转载不代替厂商核验 |
| R8 | G4 | Tavily advanced | `Eclipse SysON SysML v2 textual import export automatic diagram layout documentation` | 6 | 3 | 文本导入文档、FAQ 和官网 |
| R9 | G5 | GitHub `gh search repos` | `sysml v2 diagram` | 1 | 1 | `gordo-stell/sysml-playground` |
| R10 | G5 | GitHub `gh search repos` | `sysmlv2`，按 stars 排序，最多 12 条 | 12 | 4 | SysON、Syside 旧语言服务器、OpenSysML 和官方 API 示例 |
| R11 | G4 | Context7 CLI | `library Syside 'SysML v2 textual model visualization diagrams export embedding'` | `ECONNRESET` | 0 | MCP 未提供，CLI 网络失败，改查官方文档 |
| R12 | G3、G4 | Tavily extract | SysModeler 首页、OMG 目录、Syside opening-diagrams、Features | 4 页成功 | 4 | 核对 v2 能力，不沿用旧“9 类图”宣传 |
| R13 | G2 | Tavily advanced | `"SysML v2" "text to diagram"` | 5 | 0 | 多为原理介绍，放宽至 visualization viewer |
| R14 | G6 | Tavily advanced | `"Open-MBEE/sysml-toolkit" visualization PlantUML` | 5 | 2 | 找到 OpenSysML，需与 Rust/WASM 工具链分开核查 |
| R15 | G3 | Tavily advanced | `Sysmodeler SysML v2 graphical editor` | 5 | 2 | 官方视频 2026-06-10 列六类视图，与首页五类不同 |
| R16 | G2 | Tavily advanced | `"SysML v2" visualization viewer` | 6 | 2 | Tom Sawyer；发现 2.1 发布线索 |
| R17 | G4 | Tavily extract | JamieD Marketplace、Tom Sawyer 产品页、SysON 文本导入、Visual Paradigm 文档 | 4 页成功 | 4 | 确认扩展仓库；SysON 可能部分导入 |
| R18 | G4、G5 | GitHub API | toolkit、SysON、Pilot、Release、playground metadata 与 latest release | 9 成功，1 个 release 404 | 5 | 核对版本、时间和许可；playground 无 latest release |
| R19 | G4 | Tavily extract | Syside coverage、using-diagrams、pricing，SysModeler tutorials | 3 有效，1 站内 404 页 | 3 | pricing 纠正为 plans；tutorials 返回首页，不作独立教程 |
| R20 | G6 | Tavily advanced | `site:docs.sensmetry.com "render" "CLI" diagram` | 5 | 2 | `syside viz` 现行参考；旧文档只作历史线索 |
| R21 | G1 补充 | Tavily advanced | `M-Design v2 SysML 文本 导入 可视化 同元` | 4 | 2 | 实际厂商为杭州华望，不沿用检索词猜测 |
| R22 | G4、G5 | GitHub API | JamieD、OpenSysML metadata/release；toolkit、playground、扩展 README | 7 成功 | 5 | 核对许可、版本及图形路线 |
| R23 | G4 | Tavily extract | Syside viz/plans、SysON quick-start、Visual Paradigm export tutorial | 3 成功，1 404 | 3 | Free 不含可视化；格式宣传与操作文档存在差异 |
| R24 | G5 | GitHub API | 扩展 package/tree、playground tree、Pilot README、SysON tree | 4 成功，Pilot EOF | 3 | 核实扩展为 webview，不视为独立 Web SDK |
| R25 | G4 | GitHub API | 扩展 diagramShell、copy-webview-assets；Pilot 安装路径；SysON README | 3 成功，1 路径 404 | 3 | renderer 使用 D3、ELK、Cytoscape；纠正 Pilot 路径 |
| R26 | G5 | GitHub API / npm registry | SysON 文档 tree；`sysml-v2-lsp/latest` | tree EOF，registry 成功 | 1 | LSP 独立包不等于独立图形组件 |
| R27 | G6 | GitHub API | toolkit `v0.10.10` 的 `sysmlv2-viz/src/lib.rs` | 1 成功 | 1 | 固定版已有七种 PlantUML 视图 |
| R28 | G4 | Tavily extract | Pilot、PlantUML FAQ、M-Design 官方页、Tom Sawyer 2.1 发布页 | 4 成功 | 4 | 核实 2.1 发布日，不将其当作调研日最新版本 |
| R29 | G5 | GitHub API | daltskin LSP metadata/README、Pilot tree、SysON 固定版 compose | 4 成功 | 4 | 核实 SysON 应用与数据库、Pilot 源码路径 |
| R30 | G3、G4 | 浏览器 | SysModeler 首页演示、Syside 互连 SVG、SysON 官网及截图 | 3 类参考 | 3 | 公开页视觉核对，未登录或上传模型 |
| R31 | G4 | 浏览器 | JamieD 官方 GitHub raw 截图 | 连接关闭 | 0 | 未记为视觉实测 |
| R32 | G4 | Web open | Syside viz、plans | 无可用正文或来源标识 | 0 | 使用已提取的一手原文 |
| R33 | G4、G6 | GitHub API | 固定版 Pilot kernel/installer README、SysON 文档 tree | 3 成功 | 3 | 核实 Java 21+、Jupyter、Graphviz 和安装路径 |
| R34 | G4、G6 | Tavily extract | Syside generate-diagrams、SysON 固定版导入、PlantUML SVG | 3 成功 | 3 | 核实 headless、错误处理、SVG 和依赖 |
| R35 | G4、G5 | GitHub API | SysON 固定版安装文档、JamieD `v0.59.0` README、OpenSysML `v0.12.1` README | 4 成功 | 3 | 导航页不作功能依据，其余固定版核验通过 |
| R36 | G6 | GitHub API | 固定版 WASM `lib.rs`，一次 timeout 后成功 | 1 成功，1 网络失败 | 1 | 核查视图、根选择、样式、链接和 summary |
| R37 | G3、G6 | Tavily extract | PlantUML SVG、固定版 WASM 源码、SysModeler 官方视频 | 3 成功 | 3 | SVG 交互边界及搜索、折叠、双向编辑 |
| R38 | G6 | Context7 CLI | `library PlantUML 'SVG hyperlinks and interactive SVG capabilities for embedded model diagrams'` | `EIDLETIMEOUT` | 0 | 改查一手文档和固定源码 |
| R39 | G6 | Web open/search/find | PlantUML SVG、固定版源码、SysModeler 和 SVG 交互查询 | 无可用正文或来源标识 | 0 | 使用 R36、R37 可核对的来源 |
| R40 | 工具补核 | Tavily extract | PlantUML Smetana、SVG、command-line | 3 成功 | 3 | 内置 Java 布局和本地图形输出 |
| R41 | 分发补核 | Maven Central / curl | PlantUML/ASL metadata，固定 1.2026.9 JAR 和 SHA-256 | 成功 | 1 固定版本 | 产物 hash 与来源一致 |
| R42 | 分发补核 | GitHub API | PlantUML latest release | EOF | 0 | 改查明确版本的 Maven 产物 |
| R43 | 布局补核 | Homebrew / Docker CLI | Graphviz 依赖、官方固定镜像及 digest | 成功 | 1 分发方式 | 核对布局依赖和镜像身份 |

## 主要来源

访问日期均为 2026-11-10。以下为官方机构、厂商或项目作者的一手来源。

| 编号 | 来源 | 用途与检索记录 |
|---|---|---|
| S1 | [SysModeler.ai 官方首页](https://www.sysmodeler.ai/) | v2 文本/图形、Pilot 入口、API 状态；R12、R30 |
| S2 | [SysModeler 官方视频：Graphical Editor](https://www.youtube.com/watch?v=SufdT4MHXTw) | 2026-06-10 功能与视图说明；R15、R30 |
| S3 | [Syside：Visualize your model](https://docs.sensmetry.com/extension/diagram-views/opening-diagrams/) | 文件、元素、view 和多文件范围；R12 |
| S4 | [Syside 覆盖表](https://docs.sensmetry.com/about/sysml-v2-diagram-coverage/)；[互连 SVG](https://docs.sensmetry.com/_images/standardViews_iv.svg) | 图形种类、端口、连接、嵌套和不支持项；R19、R30 |
| S5 | [Syside CLI guide](https://docs.sensmetry.com/python-lib/how-to/generate-diagrams/)；[viz reference](https://docs.sensmetry.com/python-lib/cli/viz/)；[UI reference](https://docs.sensmetry.com/extension/diagram-views/using-diagrams/) | headless、格式、根选择、错误与导出；R19、R20、R23、R34 |
| S6 | [Syside plans](https://sensmetry.com/plans/) | Free/Business 和教育科研申请；宣传表含 PDF，具体操作页仅列 SVG/PNG/JPEG；R23 |
| S7 | [SysON 固定版文本导入](https://doc.mbse-syson.org/syson/v2026.11.0/user-manual/features/import-export-textual.html) | 文本、依赖、部分导入和错误报告；R34 |
| S8 | [SysON 固定版安装源码](https://github.com/eclipse-syson/syson/blob/v2026.11.0/doc/content/modules/installation-guide/pages/how-tos/install/local_test.adoc)；[release](https://github.com/eclipse-syson/syson/releases/tag/v2026.11.0) | Docker/PostgreSQL、多架构与版本；R18、R35 |
| S9 | [SysON 官网](https://mbse-syson.org/)；[FAQ](https://doc.mbse-syson.org/syson/v2026.7.0/user-manual/faq/faq.html)；[截图](https://mbse-syson.org/images/screenshots/syson-overview-2025.png) | 工作台、SVG 导出声明和视觉参考；FAQ 为较早版本；R8、R30 |
| S10 | [Tom Sawyer Viewer 产品页](https://www.tomsawyer.com/sysml-v2-viewer) | API 仓库、布局、交互、试用和 OEM；R17 |
| S11 | [Tom Sawyer 2.1.0 官方发布](https://www.tomsawyer.com/news/tom-sawyer-software-releases-sysml-v2-viewer-2.1) | 2026-05-20，多元关系和正交连线；R28 |
| S12 | [JamieD `v0.59.0`](https://github.com/daltskin/VSCode_SysML_Extension/tree/v0.59.0)；[diagram shell](https://github.com/daltskin/VSCode_SysML_Extension/blob/main/src/visualization/core/diagramShell.ts)；[Marketplace](https://marketplace.visualstudio.com/items?itemName=JamieD.sysml-v2-support) | MIT、视图、导出、Web Worker 和宿主要求；R17、R22、R25、R35 |
| S13 | [toolkit 固定版可视化源码](https://github.com/Open-MBEE/sysml-toolkit/blob/v0.10.10/crates/sysmlv2-viz/src/lib.rs) | 七种视图、端口、连接、样式与源链接；R27 |
| S14 | [toolkit README](https://github.com/Open-MBEE/sysml-toolkit)；[上游 release](https://github.com/Open-MBEE/sysml-toolkit/releases/tag/v0.12.0)；[本地 WASM 说明](../toolchains/sysml/package/README.md) | 上游与固定版本能力；R22 |
| S15 | [PlantUML SVG](https://plantuml.com/svg)；[FAQ](https://plantuml.com/faq) | 图像生成和输出边界；R28、R34 |
| S16 | [官方 Pilot](https://github.com/Systems-Modeling/SysML-v2-Pilot-Implementation)；[固定版 kernel README](https://github.com/Systems-Modeling/SysML-v2-Pilot-Implementation/blob/2026-09.1/org.omg.sysml.jupyter.kernel/README.adoc)；[安装文档](https://github.com/Systems-Modeling/SysML-v2-Pilot-Implementation/blob/2026-09.1/org.omg.sysml.jupyter.installer/README.adoc) | Notebook、Java 21+、Graphviz 和 `%viz`；R18、R28、R33 |
| S17 | [Visual Paradigm 可视化指南](https://sysml.visual-paradigm.com/docs/guide/visualizing-your-models)；[导出教程](https://sysml.visual-paradigm.com/docs/tutorials/part-3-visualization-analysis/customizing-and-exporting-system-diagrams) | 自动出图、布局与 SVG/PNG；教程更新于 2026-05-19；R17、R23 |
| S18 | [M-Design v2 官方页](https://www.mbse.com.cn/product/detail/m-designv2) | 文本解析、模型联动、试用和 API 声明；R21、R28 |
| S19 | [sysml-playground 作者仓库](https://github.com/gordo-stell/sysml-playground) | 浏览器文本到 SVG、dagre、MIT 和解析链路；R9、R18、R22、R24 |
| S20 | [OpenSysML `v0.12.1`](https://github.com/Open-MBEE/OpenSysML/tree/v0.12.1) | Go 运行时与视图输出；R22、R35 |
| S21 | [OMG SysML v2 Tools](https://www.omg.org/sysml/sysmlv2/sysml-tool) | 目录和关联候选，不代表 OMG 背书；R6、R7、R12 |
| S22 | [固定版 WASM 参数实现](https://github.com/Open-MBEE/sysml-toolkit/blob/v0.10.10/crates/sysmlv2-wasm/src/lib.rs)；[本地 API 声明](../toolchains/sysml/package/sysmlv2.d.ts) | 根选择、样式、链接、summary 与 emitter 范围；R36、R37 |
| S23 | [PlantUML Smetana](https://plantuml.com/smetana02)；[命令行文档](https://plantuml.com/command-line) | Java 布局与 SVG/PNG 输出；R40 |
| S24 | [固定 ASL JAR 及校验值](https://repo.maven.apache.org/maven2/net/sourceforge/plantuml/plantuml-asl/1.2026.9/) | 1.2026.9 产物来源与 SHA-256；R41 |
