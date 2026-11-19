# 页面截图 OCR 索引

`images/页面/*_NNN_772.png` 的离线 OCR + 取色结果，供不接图像输入的模型查页面结构。

## 文件

- `NNN.json`：页号 NNN 的截图分析，坐标单位是截图像素（宽 621，长页最高 4629）。
- `index.json`：页号、源文件、宽高、行数汇总。

## 字段

```json
{
  "width": 621,
  "height": 1170,
  "lines": [
    { "text": "请输入手机号", "x": 61, "y": 590, "w": 160, "h": 34, "fg": "#999999", "bg": "#FFFFFF" }
  ],
  "bands": [
    { "y0": 0, "y1": 88, "color": "#FAF7F0" }
  ]
}
```

- `lines`：OCR 行。`x/y` 左上角，`w/h` 宽高，`fg` 文字色，`bg` 行背景色（边框众数）。
- `bands`：每 5 列采样的横向色带，用于快速判断分区底色。
- 中文按行拼接、不加空格；英文单词间保留空格。
- 颜色量化为 16 级，够比对，不用于精确取色。

## 重新生成

```powershell
powershell -NoProfile -File tools/screen/batch.ps1
```

依赖 Windows.Media.Ocr（zh-Hans-CN）和 Python + Pillow；单张 621×4629 约 3–5 秒。
