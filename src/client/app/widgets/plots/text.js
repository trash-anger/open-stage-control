var {iconify} = require('../../ui/utils'),
    Widget = require('../common/widget'),
    html = require('nanohtml'),
    StaticProperties = require('../mixins/static_properties')

module.exports = class Text extends StaticProperties(Widget, {bypass: true}) {

    static description() {

        return 'Display text.'

    }

    static defaults() {

        return super.defaults({

            _text: 'text',

            vertical: {type: 'boolean', value: false, help: 'Set to `true` to display the text vertically'},
            wrap: {type: 'boolean', value: false, help: [
                'Set to `true` to wrap long lines automatically.',
                'This will not break overflowing words by default, word-breaking can be enabled by adding `word-break: break-all;` to the `css` property',
            ]},
            align: {type: 'string', value: '', help: 'Set to `left` or `right` to change text alignment (otherwise center)'},

        }, ['precision', 'bypass'], {})

    }

    constructor(options) {

        // backward compat
        if (options.props.widgetId) {
            options.props.value = '@{' + options.props.widgetId + '}'
            delete options.props.widgetId
        }
        super({...options, html: html`<div class="text"></div>`})

        if (this.getProp('vertical')) this.widget.classList.add('vertical')
        if (this.getProp('align') === 'left') this.widget.classList.add('left')
        if (this.getProp('align') === 'right') this.widget.classList.add('right')
        if (this.getProp('wrap')) this.widget.classList.add('wrap')

        this.defaultValue = this.getProp('default') || ( this.getProp('label')===false ?
            this.getProp('id'):
            this.getProp('label')=='auto'?
                this.getProp('id'):
                this.getProp('label') )

        this.value = this.defaultValue

        this.setValue(this.value)

    }


    setValue(v, options={}) {

        this.value = v==null ? this.defaultValue : v

        var s = String(this.value)
        if (s.indexOf('^') > -1) {
            this.widget.innerHTML = iconify(s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g,'<br/>'))
        } else {
            this.widget.textContent = s.replace(/\n/g,'\r\n')
        }

        if (options.sync) this.changed(options)

    }

}