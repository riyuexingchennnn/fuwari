---
title: 【开源】Groot2风格行为树可视化监控软件，能展示20个节点以上
published: 2026-03-29
description: ''
image: './【开源】Groot2风格行为树可视化监控软件，能展示20个节点以上/1.png'
tags: ['软件开发', 'FYT']
category: '软件开发'
draft: false
lang: ''
---

# 前言

> 项目地址：https://github.com/riyuexingchennnn/BehaviorTreeMonitor

在ROS2机器人项目里，行为树是非常常见的任务组织方式。实际调试时，我们经常需要实时看到每个节点的状态变化，尤其是 subtree 内部节点。

我这次开源了一个基于 [BehaviorTree.CPP](https://github.com/BehaviorTree/BehaviorTree.CPP) Groot2 协议的监控工具，目标很直接：

- 实时可视化行为树状态
- 能稳定展示 20 个以上节点
- 对 subtree 内部节点也能完整显示

# 项目效果

![](./【开源】Groot2风格行为树可视化监控软件，能展示20个节点以上/1.png)

![](./【开源】Groot2风格行为树可视化监控软件，能展示20个节点以上/2.png)

# 核心能力

## 1. Groot2 协议兼容

项目通过 BT.CPP 的 Groot2Publisher 对接，能够直接接入已有行为树执行器，不需要改动太多业务代码。

## 2. 大节点量可视化

实际可展示 20+ 节点状态，包含 subtree 内部节点，适合中等复杂度以上的行为树调试。

## 3. 桌面应用 + Web 前端的混合架构

使用 Python 负责协议桥接和桌面承载，使用 Vue 3 + TypeScript 负责交互可视化，兼顾开发效率与可维护性。

# 架构设计

```text
Python (PySide6 + aiohttp)          Vue 3 + TypeScript
┌─────────────────────┐           ┌──────────────────┐
│  Qt WebEngineView   │──HTTP──►  │  前端 (dist/)     │
│  aiohttp Server     │◄─WS───►   │  WebSocket 客户端 │
│  ZMQ Bridge         │◄─ZMQ──►   │                  │
└─────────────────────┘           └──────────────────┘
						    ▲
						    │ ZMQ REQ/REP
						    ▼
					    BT.CPP 执行器
					    (Groot2Publisher)
```

数据流可以理解为三层：

- BT.CPP 执行器通过 ZMQ 与 Python 桥接层通信
- Python 侧通过 aiohttp 提供 WebSocket，将状态推给前端
- Qt WebEngineView 加载前端页面，形成完整桌面体验

# 项目结构

```text
BehaviorTreeMonitor/
├── main.py                 # 入口
├── bt_monitor/
│   ├── protocol.py         # BT.CPP Groot2 协议
│   ├── server.py           # aiohttp WebSocket/ZMQ 桥接
│   └── app.py              # Qt WebEngine 窗口
├── frontend/               # Vue 3 + TypeScript
│   ├── src/
│   │   ├── App.vue
│   │   ├── components/
│   │   ├── composables/
│   │   ├── stores/
│   │   ├── types/
│   │   └── styles/
│   └── ...
└── bt_monitor.spec         # PyInstaller 配置
```

# 快速开始

## 环境

- uv（Python 包管理）
- Node.js 18+
- pnpm

## 安装依赖

```bash
# Python 依赖
uv sync

# 前端依赖
cd frontend && pnpm install
```

## 本地运行

```bash
# 先构建前端
cd frontend
pnpm build

# 回到项目根目录后启动
uv run python main.py
```

# 构建发布

```bash
# 1. 构建前端
cd frontend && pnpm install && pnpm build

# 2. PyInstaller 打包
uv run --group dev pyinstaller --clean --noconfirm bt_monitor.spec
```

输出文件位于：`dist/BehaviorTreeMonitor`

# 下载使用

如果你不想自己构建，可以直接在 Release 页面下载编译版本：

https://github.com/riyuexingchennnn/BehaviorTreeMonitor/releases

Ubuntu 下首次运行需要先给可执行文件增加权限。

```bash
sudo chmod +x BehaviorTreeMonitor.behaviortreemonitor
```

# 结语

这个项目的初衷是解决Groot2监控行为树超过20个节点需要license的问题。如果本项目对你有用，欢迎在 GitHub 上点个 Star，或者在评论区留言交流！
