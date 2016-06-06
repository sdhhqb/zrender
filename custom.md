### zrender自定义修改说明

#### 1.label有多行时，可以单独指定各行的字体

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