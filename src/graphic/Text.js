/**
 * Text element
 * @module zrender/graphic/Text
 *
 * TODO Wrapping
 *
 * Text not support gradient
 */

define(function (require) {

    var Displayable = require('./Displayable');
    var zrUtil = require('../core/util');
    var textContain = require('../contain/text');

    /**
     * @alias zrender/graphic/Text
     * @extends module:zrender/graphic/Displayable
     * @constructor
     * @param {Object} opts
     */
    var Text = function (opts) {
        Displayable.call(this, opts);
    };

    Text.prototype = {

        constructor: Text,

        type: 'text',

        brush: function (ctx) {
            var style = this.style;
            var x = style.x || 0;
            var y = style.y || 0;
            // Convert to string
            var text = style.text;
            var textFill = style.fill;
            var textStroke = style.stroke;

            // Convert to string
            text != null && (text += '');

            if (text) {
                ctx.save();

                this.style.bind(ctx);
                this.setTransform(ctx);

                textFill && (ctx.fillStyle = textFill);
                textStroke && (ctx.strokeStyle = textStroke);

                ctx.font = style.textFont || style.font;
                ctx.textAlign = style.textAlign;

                if (style.textVerticalAlign) {
                    var rect = textContain.getBoundingRect(
                        text, ctx.font, style.textAlign, 'top'
                    );
                    // Ignore textBaseline
                    ctx.textBaseline = 'middle';
                    switch (style.textVerticalAlign) {
                        case 'middle':
                            y -= rect.height / 2 - rect.lineHeight / 2;
                            break;
                        case 'bottom':
                            y -= rect.height - rect.lineHeight / 2;
                            break;
                        default:
                            y += rect.lineHeight / 2;
                    }
                }
                else {
                    ctx.textBaseline = style.textBaseline;
                }
                var lineHeight = textContain.measureText('国', ctx.font).width;

                var textLines = text.split('\n');

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
                        ctx.font = customLine[1] + "px Microsoft YaHei";
                        lineHeight = textContain.measureText('国', ctx.font).width;
                        y = y - (lineHeight - oriLineHeight);
                        // 剔除掉末尾[xfont..特殊参数的原始字符串
                        var oriText = textLines[i].replace(/\[xfont(\d+)$/, '');
                        textFill && ctx.fillText(oriText, x, y);
                        textStroke && ctx.strokeText(oriText, x, y);
                        y += lineHeight;
                        fontChged = true;
                    } else {
                        textFill && ctx.fillText(textLines[i], x, y);
                        textStroke && ctx.strokeText(textLines[i], x, y);
                        y += lineHeight;
                    }
                    if (fontChged) {
                        ctx.font = oriFont;
                        lineHeight = oriLineHeight;
                        fontChged = false;
                    }
                }

                ctx.restore();
            }
        },

        getBoundingRect: function () {
            if (!this._rect) {
                var style = this.style;
                var textVerticalAlign = style.textVerticalAlign;
                var rect = textContain.getBoundingRect(
                    style.text + '', style.textFont || style.font, style.textAlign,
                    textVerticalAlign ? 'top' : style.textBaseline
                );
                switch (textVerticalAlign) {
                    case 'middle':
                        rect.y -= rect.height / 2;
                        break;
                    case 'bottom':
                        rect.y -= rect.height;
                        break;
                }
                rect.x += style.x || 0;
                rect.y += style.y || 0;
                this._rect = rect;
            }
            return this._rect;
        }
    };

    zrUtil.inherits(Text, Displayable);

    return Text;
});