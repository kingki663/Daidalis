# 现有模型可视化问题与优化

初次核查与修复日期：2026-11-10；默认组合视图更新日期：2026-11-11。状态：前三项已修复，组成、类型和互连已合为默认视图；主图诊断提示和大图截断提示尚未实施。工具能力与来源见[可视化工具调研](model-visualization-research.md)。

## 当前基础与范围

现有查看器已支持模型图、缩放、元素详情、大纲搜索和源码定位。采用“SysML v2 → Open-MBEE 解析 → 图数据 JSON → 项目前端生成 SVG”，不接入 PlantUML 渲染。独立预览直接复用 `mountDocumentViewer`、`styles.css`、`workspace-ui.css` 和 `document-viewer.css`，不维护另一套绘图样式。

目标链路为“生成模型 → 打开结构与互连图 → 搜索元素 → 跳转源码 → 修改后更新图形”。当前预览只读取仓库样例，默认同时显示组成、类型和端口互连，不再需要切换“子系统互连”。浏览器测试另外生成含嵌套部件的模型，经真实后端导入、保存和查询后验证查看器，再修改节点与连接并重新查询；这不是 Agent 实时生成或仿真验收。双向编辑和自动刷新不在本次范围。

## 问题与优化

| 问题 | 修复前的核查表现 | 优化方向 | 当前状态 |
|---|---|---|---|
| 互连拓扑缺失 | 默认 tree 输出将 3 个 `connection` 列为节点，没有真实端口间的 `connect` 边；同一内核的 interconnection 输出有 3 条边 | 默认合并组成与互连，直接使用内核解析的端点。按具体部件使用与端口 ID 定位，区分同类型部件的端口 | 已修复 |
| 连线信息丢失 | 互连数据经过 `normalizeSemanticGraph` 后丢失连接名称、ID 和源码位置，只剩 `connect` 等关系类别 | 保留连线身份、名称、类型和来源，不只保留两个端点 | 已修复 |
| 方向表达混用 | 绘图为所有关系加单向箭头，调换 `connect` 端点书写顺序时箭头也反转 | 区分连接、流、组成和类型关系，不把书写顺序当作数据流方向 | 已修复 |
| 部分模型提示不足 | 未解析引用导致 `valid=false` 时仍可绘图，主图没有明确“不完整/未通过”提示；诊断 tab 有数字标记 | 允许查看草稿，但在主图明确显示诊断状态，不把出图当作验收通过 | 未实施，本次范围外 |
| 大图截断未提示 | 合成的 4,801 条边被截成 4,800 条，`truncated=false` | 后续补齐边数截断提示；当前小演示未触发，不作为本次完成条件 | 未实施，本次范围外 |

例如 `connection sensorToUart connect sensor.output to uart.input;`，结构树只说明该连接属于系统，互连视图还需说明两个真实端点。连接自身可以保留为详情或可选节点，不能用其归属关系替代端点关系。

连线信息和方向问题最初是在“将真实互连输出交给现有前端”时复现的，不表示修复前的默认页面已经画出了三根错误互连线。多重性 `[4]`、`[0..1]` 初次检查正常；需求追溯、状态转移和动作流尚未逐项核查。

## 前三项实施

后端的无表达式 `query` 保留原结构图字段，增加 `interconnection` 图；`validate` 和导入结果的 `data.graph` 采用同一结构。有表达式的 KerML 查询返回值不变。独立预览返回相同的两种图数据，不解析源码字符串来补造端点。

查看器按内核的部件使用 ID 和端口 ID 绘制互连，将端口放在所属部件边界上。点击连线或按 Enter、空格可查看名称、ID、元类型、限定名和源码行列，再跳转源码；端口详情同时显示所属元素。继承端口仍指向内核报告的声明位置，不伪造使用处的源码位置。

`connect` 不加方向标记；`flow` 使用模型声明的方向。默认图用嵌套框表达组成，用“名称 : 类型”表达类型；“元素与类型关系”图中，`composition` 在所属端显示菱形，`typing` 使用虚线空心三角，普通 `membership` 不加箭头。交换 `connect` 的两端不会改变部件布局或产生数据流箭头。

## 默认组合视图

默认“结构与互连”在同一画布显示父子部件、类型标签、边界端口及真实连接。多层部件按模型归属嵌套布局，连接直接定位具体端口，不再单独画已由连线表示的连接元素。相同类型的两个部件使用仍保留各自的端口 ID。

合并按元素 ID 去重，保留结构图的成员与类型信息，使用互连图的端点及归属信息。tree 输出中的 `parent` 可能是显示分组，因此组成层级依据内核的 `composition` 和互连图的 `parent`，不按名称猜测归属。合并只影响查看器，不修改 SysML 源码或后端模型语义。

下拉选项为“结构与互连”“需求与约束”“元素与类型关系”。后者保留定义节点及类型关系查看入口；默认图隐藏已被部件使用表达的类型定义，只有定义的模型仍可查看定义和端口。大纲与源码保留完整元素浏览。旧 `filter:'interconnection'` 调用兼容到默认组合图，不再作为界面选项。

初次修复由 `87bc7d7` 提交保存，记录独立互连模式及前三项修复；2026-11-11 的组合视图替代该默认显示方式。之前的检查记录保留为历史证据。

## 最小验收条件

- [x] 默认图同时显示组成与类型；[互连样例](assets/model-visualization/connected-demo.sysml) 的三条连接分别连接到正确端口，不补造关系。
- [x] `uart` 和 `flightSoftware` 虽使用同一 `Relay` 定义，其端口仍分别定位，不按名称或类型合并。
- [x] 每条连接保留名称与源码位置；关系样式不根据 `connect` 端点书写顺序虚构数据流方向。
- [x] 原有缩放、选中、大纲搜索和源码定位保持可用。
- [ ] 未通过语义验收的图在主图明确标记为部分结果。本次未实施；现有诊断 tab 仍可查看。
- [x] 修改节点或连接并保存、手动重新读取后，图形反映当前输入，不把旧图当作新结果。浏览器测试覆盖真实后端保存、重新查询和查看器更新，不覆盖 Agent 对话入口。
- [x] 用测试中新生成的嵌套模型走导入、默认组合图、类型关系图、搜索、源码定位、修改和更新链路，并检查截图。不把预置样例当作 Agent 实时生成，不把出图当作仿真通过。

## 复验入口

主要代码入口：[图数据查询](../server/model-backend/worker.mjs)、[图数据整理与绘制](../public/document-viewer.mjs)。原始核查记录在 `.local/model-visualization/results/expression-audit.json` 和 `expression-audit-extra.json`。

以下 6 个测试文件共 72 项通过。回归覆盖真实内核的三条连接、同类型部件端口、连接元数据、端点反写和真实 `flow` 方向，以及图数据合并、多层组成嵌套、边界端口和只有定义的模型；既有工作区和可读缩放测试保持通过。

```sh
node --test tests/model-visualization-preview.test.mjs tests/document-viewer.test.mjs tests/model-backend.test.mjs tests/workspace-viewer.test.mjs tests/workspace-ui.test.mjs tests/semantic-viewport.test.mjs
node tests/ui-document-viewer.mjs
```

浏览器入口需要项目可选依赖 `playwright`，macOS 使用已安装的 Chrome。本次复用本机缓存的 Playwright 1.65.0，未修改依赖清单。9 项浏览器检查通过，控制台无脚本错误；检查了新生成模型的两层部件组成、三条连接、边界端口、连接详情、键盘操作与源码跳转，以及改名并反写连接后的默认图更新和窄窗口行为。

本机复验材料保留在 `.local/model-visualization/results/combined-view/`，包括 `generated-model.json`、`refreshed-model.json`、模型工作区及 `combined-view.png`、`combined-view-refreshed.png`。2026-11-10 的独立互连模式证据仍在 `.local/model-visualization/results/improvements/`。这些材料是可视化证据，不是物理或仿真验收证据。

只读原生预览可按以下命令启动，再打开本机 `http://127.0.0.1:4318`，不需要 Java、Docker 或外部绘图服务：

```sh
node scripts/model-visualization-preview.mjs
```

修改样例并保存后点击“重新读取模型”，服务会重新读取文件并按源码 hash 更新结果。`node scripts/model-visualization-preview.mjs --check-only` 可只核查样例的语义与图数据。预览不再生成 PlantUML 文本、图片或 manifest。
