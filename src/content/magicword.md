---
title: "magicword"
published: 2026-02-10 00:00:00
sticky: 1
---

# MagicWord

> 🚀 **一款基于 Jetpack Compose 和 AI 驱动的现代化 Android 背词应用。**
> 沉浸式学习体验，智能语义分析，让记单词变得简单而高效。

![Version](https://img.shields.io/badge/version-0.0.2-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg) ![Status](https://img.shields.io/badge/status-Active-success.svg)

---

## 📖 简介

EasyWord 旨在通过 AI 技术重塑单词学习流程。不同于传统词典，它利用大语言模型（LLM）深度解析单词，提供语境化的例句和基于词根词缀的记忆法，帮助用户建立深层记忆连接。配合极简的 Material Design 3 界面，提供流畅的沉浸式体验。

## ✨ 核心功能

### 1\. 沉浸式单词学习 (Words Tab)

* **全屏卡片设计**：极简风格，专注于记忆本身。
* **手势交互**：
  * **左右滑动**：流畅切换单词。
  * **3D 翻转动画**：点击卡片查看详情（音标、释义、例句、记忆法）。
* **AI 记忆法**：基于大模型生成的联想记忆或词根词缀助记，这是本应用的核心特色。

### 2\. 智能 AI 查词 (Search Tab)

* **精准单词查询**：调用云端大模型（Qwen-2.5-7B-Instruct）进行深度解析。
* **结构化数据**：自动提取音标、释义、例句及记忆法，并以标准 JSON 格式返回。
* **一键保存**：查词结果可直接保存至当前词库。

### 3\. AI 批量导入 (Library Tab)

* **智能提取**：输入任意文本（文章、段落），AI 自动识别并提取生词。
* **批量解析**：自动并发请求 AI 生成详细词条数据。
* **实时进度**：可视化展示导入任务的处理进度。

### 4\. 测试与复习 (Test Tab)

* **选择题模式**：根据单词选释义，支持即时反馈。
* **拼写模式**：根据中文释义拼写单词，强化输出能力。
* **数据统计**：自动记录复习次数与正确率，辅助记忆曲线分析。

### 5\. 词库管理

* **多词库支持**：支持创建多个词库（如“四级”、“雅思”），一键切换。
* **数据导出**：支持将词库导出为 JSON 文件进行备份或分享。

---

## 🏗 项目结构

项目采用标准的 Android MVVM 架构，代码结构清晰：

```
com.magicword.app
├── MainActivity.kt          # 应用入口
├── data                     # 数据层 (Room Database)
│   ├── AppDatabase.kt       # 数据库配置
│   ├── Word.kt              # 单词实体
│   ├── Library.kt           # 词库实体
│   └── WordDao.kt           # 数据访问对象
├── network                  # 网络层
│   ├── RetrofitClient.kt    # Retrofit & OkHttp 配置 (AI API 调用)
│   └── SiliconFlowApi.kt    # API 接口定义
├── ui                       # UI 层 (Jetpack Compose)
│   ├── MainScreen.kt        # 主界面导航 (HorizontalPager)
│   ├── WordsScreen.kt       # 单词列表/卡片页
│   ├── SearchScreen.kt      # AI 搜词页
│   ├── TestScreen.kt        # 测试页
│   ├── LibraryViewModel.kt  # 词库管理与全局状态
│   └── theme/               # Material3 主题配置
├── utils                    # 工具类
│   └── LogUtil.kt           # 日志系统
└── worker                   # 后台任务
    └── SyncWorker.kt        # 数据同步任务
```

---

## 🚀 快速开始

### 环境要求

* Android Studio Hedgehog | 2023.1.1 或更高版本
* JDK 17
* Android SDK API 34

### 安装步骤

1. **克隆仓库**

   ```
   git clone https://github.com/lijiaxu2021/MagicWord.git
   ```
2. **配置 API Key**

   目前项目使用 SiliconFlow (Qwen模型) 提供 AI 服务。 打开 `app/src/main/java/com/magicword/app/network/RetrofitClient.kt`，将 `API_KEY` 替换为你自己的 Key：

   ```
   private const val API_KEY = "sk-your-api-key-here"
   ```
3. **构建与运行**

   连接 Android 设备或启动模拟器，点击 Android Studio 的 **Run** 按钮。

---

## ⚙️ 构建与 CI/CD (关于签名)

本项目目前使用 GitHub Actions 进行自动构建 (`.github/workflows/android-release.yml`)。

### 签名问题说明

由于签名密钥文件 (`.jks` 或 `.keystore`) 包含敏感信息，且文件较大，不适合直接上传到 Git 仓库。 目前的自动构建流程使用 `assembleDebug`，生成的是使用默认调试签名的 APK。

* **现象**：不同电脑（或 GitHub Action）构建的 Debug APK 签名不一致，导致无法直接覆盖安装，必须先卸载旧版本。

---

## 🛠 技术栈

* **语言**: [Kotlin](https://kotlinlang.org/)
* **UI 框架**: [Jetpack Compose](https://developer.android.com/jetpack/compose) (Material3)
* **架构**: MVVM (Model-View-ViewModel)
* **异步处理**: [Coroutines](https://github.com/Kotlin/kotlinx.coroutines) & [Flow](https://kotlin.github.io/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/)
* **网络**: [Retrofit](https://square.github.io/retrofit/) + [OkHttp](https://square.github.io/okhttp/)
* **本地存储**: [Room Database](https://developer.android.com/training/data-storage/room)
* **AI 模型**: Qwen/Qwen2.5-7B-Instruct (via SiliconFlow API)

---

## 👥 作者与贡献者

* **Author**: [lijiaxu2021](https://github.com/lijiaxu2021)
* **Contributor**: upxuu

## 📄 License

本项目采用 [MIT License](LICENSE) 许可证。
