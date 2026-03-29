---
published: 2026-03-29 19:49:00
---

### 使用方法

#### 方式一：使用管理器（推荐）

```bash
python cdwmanager.py
```

管理器提供图形界面，可以：

- 设置倒计时名称和日期
- 配置一言 API 参数
- 设置开机自启（通过注册表）
- 一键生成壁纸

#### 方式二：直接生成壁纸

```bash
python CountdownWallpaper.py
```

会自动读取 `cdw.json` 配置文件并生成壁纸。

### 配置文件

配置文件 `cdw.json` 格式：

```json
{
    "countdowns": [
        {
            "name": "地生会考",
            "date": "2026-06-23",
            "enabled": true
        }
    ],
    "wallpaper": {
        "update_time": "07:40",
        "auto_start": false,
        "font_path": "font.ttf",
        "theme": "blue"
    },
    "hitokoto": {
        "enabled": true,
        "types": ["d", "i", "k", "l"]
    }
}
```

## 📁 项目结构

```
countdown-wallpaper/
├── CountdownWallpaper.py    # 壁纸生成器（核心）
├── cdwmanager.py            # 管理器（PyQt5 GUI）
├── cdw.json                 # 配置文件
├── requirements.txt         # 依赖列表
├── font.ttf                 # 自定义字体（可选）
├── README.md               # 说明文档
└── LICENSE                 # GPL-3.0 协议
```

## 🔧 模块说明

### CountdownWallpaper.py - 壁纸生成器

**功能**：

- 从配置文件读取倒计时信息
- 获取 Bing 每日一图
- 调用一言 API 获取励志语录
- 生成带倒计时的壁纸
- 设置 Windows 壁纸

**特点**：

- 专注壁纸生成，无定时任务
- 从配置文件读取所有参数
- 简洁高效

### cdwmanager.py - 管理器

**功能**：

- 图形界面配置倒计时
- 管理多个倒计时项目
- 配置一言 API 参数
- 设置开机自启（注册表）
- 创建定时任务

**依赖**：PyQt5

## 📝 常见问题

### Q: 配置文件在哪里？

A: `cdw.json` 在项目根目录。首次运行管理器会自动创建。

### Q: 如何添加多个倒计时？

A: 运行 `cdwmanager.py`，在"倒计时管理"标签页中添加。

### Q: 开机自启是如何实现的？

A: 通过 Windows 注册表实现，位置：`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`

### Q: 一言 API 失败怎么办？

A: 程序会自动使用内置的备用诗句库。

### Q: 可以自定义壁纸样式吗？

A: 可以！编辑 `cdw.json` 中的配置参数。

## 🛠️ 打包为可执行文件

### 打包壁纸生成器

```bash
pyinstaller --onefile --windowed --icon=icon.ico CountdownWallpaper.py
```

### 打包管理器

```bash
pyinstaller --onefile --windowed --icon=icon.ico cdwmanager.py
```

## 📄 开源协议

本项目采用 [GNU General Public License v3.0](LICENSE) 开源协议。

## 🙏 致谢

- [Bing 每日一图](https://www.bing.com)
- [一言 API](https://hitokoto.cn) - 传递感动的句子
- [Pillow](https://python-pillow.org) - Python 图像处理库
- [PyQt5](https://www.riverbankcomputing.com/software/pyqt/) - Python GUI 框架

## 📧 联系方式

- GitHub: [@ImUpXuu](https://github.com/ImUpXuu)
- 作者：UpXuu

## 🌟 Star History

如果这个项目对你有帮助，请给一个 ⭐ Star 支持！

---

**让每一天的努力都闪闪发光！** ✨

```

```
