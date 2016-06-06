### zrender自定义修改说明

#### 1.label有多行时，可以单独指定各行的字体

主要代码修改：
src/graphic/Text.js 文件中的 brush方法，绘制每一行文字时检查末尾是否有[xfont..字符串，如果有就用指定的字体来绘制字符串。

```js
    // 每一行可以单独设置字体大小
    // 字体是否改变标志
    var fontChged = false;
    // 原始字体
    var oriFont = ctx.font;
    // 原始行高
    var oriLineHeight = lineHeight;

    for (var i = 0; i < textLines.length; i++) {
        // 设置了自定义字体的行
        var customLine = textLines[i].match(/\[xfont(\d+)$/);
        if (customLine) {
        //...
        } else {
        //...
        }
        //...
    }
```

echarts中的配置:

使用formatter设置label文字内容，在'\n'换行符之前插入'[xfont'+'字体数字',如[xfont18

```js
    label: {
        normal: {
            position: 'right-angle',
            formatter: '{b}[xfont14\n{c}\n{d}%'                     
        }
    }
```