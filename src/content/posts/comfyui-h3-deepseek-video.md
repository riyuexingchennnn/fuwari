---
title: '用 ComfyUI 给舞蹈视频换角：MiniMax H3、慢放与 SeedVR2 实测'
published: 2026-11-18
description: '用 DeepSeek 鲸鱼娘三视图复现舞蹈动作，对比 Turbo 8 步、原生 20 步、两种慢放倍率和 SeedVR2 超分缩回。'
image: '/posts/comfyui-h3-deepseek-video/seedvr2-resize-comparison.webp'
tags: ['ComfyUI', 'MiniMax H3', 'SeedVR2', '视频生成']
category: 'AI'
draft: false
lang: 'zh-CN'
---

这次用 RTX 5070 Ti 在 ComfyUI 里做一段舞蹈换角：把参考视频里的角色换成 DeepSeek 鲸鱼娘，同时尽量保住手势、视线、表情和口型。结果是：**原速 Turbo 8 步更适合作为预览基线；SeedVR2 能让轮廓更清楚，但增加采样步数、慢放后复速、超分都没能可靠修正动作。** 下文的动图均为静音 WebP，统一用 12 fps、300×400 展示，便于加载和并排观察；帧号与时间以下文 24 fps 的原始输出为准，不以网页动图判断口型同步。

## 一、换角工作流：三视图管身份，视频管动作

![ComfyUI MiniMax H3 换角完整工作流](/posts/comfyui-h3-deepseek-video/character-workflow.webp)

[打开原尺寸工作流截图](/posts/comfyui-h3-deepseek-video/character-workflow.webp)

左上四个输入依次是角色正面、左侧、背面，以及原动作视频。三视图和动作帧进入 H3 条件节点；模型挂载换角 LoRA v1.5 与 Turbo LoRA v1.1，再经过采样、VAE 解码、视频封装。主对照使用 672×896、24 fps，采样器 `er_sde`、调度器 `beta`。尽量固定种子、参考图和采样设置；看参数图时，重点区分模型支路、图像支路和原声音轨，不要把合成用的声音当作慢放输入。

角色设定来自 ZipZipPipe（胖次狐），本次使用旧项目留存的鲸鱼娘正、左、背三视图。补全设定图仓库：[lmy414/ai-chan-sheets](https://github.com/lmy414/ai-chan-sheets)，仓库标注 CC BY-NC-SA 4.0；下图为本次输入所用设定图的缩放 WebP 展示，不是 DeepSeek 官方立绘。

![DeepSeek 鲸鱼娘设定图](/posts/comfyui-h3-deepseek-video/deepseek-sheet.webp)

## 二、Turbo 8 步和原生 20 步：时间翻倍，动作没修好

两组都取参考前 90 帧（3.75 秒），保留换角 v1.5、三视图、种子与采样器；原生组移除 Turbo v1.1 并改成 20 步。这里比较的是两套配置，而不是单独改变步数的消融实验。

| 配置 | 生成耗时 | 同帧观察 |
| --- | ---: | --- |
| Turbo v1.1，8 步 | 4 分 44 秒 | 第 19–21 帧误闭眼；约 2 秒处口型不匹配 |
| 原生 H3，20 步 | 10 分 53 秒 | 第 0 帧手已下移，原片双臂仍交叠；第 19–21 帧眼睑压低，约 2 秒口型仍不匹配 |

| 参考 | 原速 Turbo 8 步 | 原速原生 20 步 |
| --- | --- | --- |
| ![参考](/posts/comfyui-h3-deepseek-video/reference.webp) | ![Turbo 8 步](/posts/comfyui-h3-deepseek-video/turbo-8steps.webp) | ![原生 20 步](/posts/comfyui-h3-deepseek-video/native-20steps.webp) |

![参考、Turbo 和原生 H3 同帧对照](/posts/comfyui-h3-deepseek-video/steps-comparison.webp)

这台机器上，原生组耗时约为 Turbo 组的 2.3 倍，实测显存峰值 15.17 GiB。Turbo 组没有峰值遥测，不能据此比较两组的显存开销。两组都生成了可解码的视频，但都没有通过动作和表情验收。

## 三、两倍、三倍慢放：没有时间偏移，也可能做错动作

慢放输入不做光流插值：每张原画面重复两次或三次，仍按 24 fps 封装，先剥离声音，生成后按固定相位抽帧回到原速。输入抽样验过画面哈希，避免把编码或抽帧偏移误当成动作差异。

| 方案 | 慢放输入 | 复速前后的处理 |
| --- | --- | --- |
| 原速生成 | 90 帧，3.75 秒 | 直接生成，用作基线 |
| 2× 慢放生成 | 原片前 96 帧重复为 192 帧、8 秒；正好符合 `5+17×11`，不补尾 | 每两帧取一帧，恢复 96 帧、4 秒；未过动作验收，未超分 |
| 3× 慢放生成 | 原片前 90 帧重复为 270 帧、11.25 秒；再复制末帧 7 次，得到对齐的 277 帧 | 丢弃补尾，只取前 270 帧每组三帧的中间帧，恢复 90 帧、3.75 秒 |

| 原速 Turbo | 2× 慢放后复速 | 3× 慢放后复速 |
| --- | --- | --- |
| ![原速生成](/posts/comfyui-h3-deepseek-video/turbo-8steps.webp) | ![两倍慢放复速](/posts/comfyui-h3-deepseek-video/slow-2x-restored.webp) | ![三倍慢放复速](/posts/comfyui-h3-deepseek-video/slow-3x-restored.webp) |

![0.83 秒和 2 秒的手势对照](/posts/comfyui-h3-deepseek-video/speed-mismatch.webp)

2× 组在 0.83–0.92 秒仍把手停在胸前，而参考已向外伸；2 秒时参考向前托掌，生成版的手还垂在身侧；3.83–3.96 秒出现参考没有的连续闭眼。3× 组片尾部分手部轮廓更清楚，但第 20 帧仍有误闭眼，约 2 秒处仍有手势和口型偏差。两组都出现了非预期动作。这些样本的总长度不同，2× 组还加强了动作约束提示词，所以只应比较共同时间区间的具体现象，不能将所有差异归因于倍率。

## 四、SeedVR2 2× 后缩回 720×960：能修清晰度，不能修动作

![ComfyUI SeedVR2 完整工作流](/posts/comfyui-h3-deepseek-video/seedvr2-workflow.webp)

[打开原尺寸超分工作流截图](/posts/comfyui-h3-deepseek-video/seedvr2-workflow.webp)

对照取**同一条原速 Turbo 成片**：读取视频帧，用 SeedVR2 v2.5.24（3B FP8、分块 VAE）从 672×896 超分到 1344×1792，再缩回参考分辨率 720×960。不插帧，三份样本均为 90 帧、24 fps、3.75 秒。超分实测 5 分 37 秒、显存峰值 7.40 GiB；缩回只做空间重采样，没有另加降噪。

| Turbo 原始 | SeedVR2 2× | 2× 后缩回 720×960 |
| --- | --- | --- |
| ![Turbo 原始](/posts/comfyui-h3-deepseek-video/turbo-8steps.webp) | ![SeedVR2 两倍超分](/posts/comfyui-h3-deepseek-video/seedvr2-2x.webp) | ![超分后缩回参考分辨率](/posts/comfyui-h3-deepseek-video/seedvr2-resized.webp) |

![超分前、超分后与缩回参考尺寸的同帧对照](/posts/comfyui-h3-deepseek-video/seedvr2-resize-comparison.webp)

超分让发丝和衣服边缘更清楚，但也可能把片尾的手部拖影和噪点变得更显眼。缩回参考尺寸是为了让细节观感更克制，不等于消除重影。**皮肤、发丝和衣服边缘偏软，可以试超分；手多了一道轮廓、手势提前或滞后，先回到生成阶段检查。** 这两类问题不能用同一个锐化指标验收。

实际排查时，先保留原速 8 步基线，在明显摆臂、手部交叠和口型变化处逐帧对齐参考。先验姿势与时序，再决定是否超分；画面通过后才锁定音频和最终分辨率。若继续寻找重影的修正方案，下一轮应固定同一段 90 帧、同一提示词与种子，每次只更改一个变量，先用同帧图验证改善，再跑长片。技术验收和视觉验收分开记录：文件能播放、音轨哈希一致，不代表角色动作正确。
