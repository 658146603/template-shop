import { defineComponent } from "vue";

const ConfigPanelRoot = defineComponent({
    props: {
        // prop of is-heder-on
        isHeaderOn: { type: Boolean, required: true },
        //porp of is-footer-on
        isFooterOn: { type: Boolean, required: true },
    },
    emits: ["headerOn", "footerOn"],
    setup(props, ctx) {
        return () => (
            <div class=''>
                <div class='style_editor_group'>
                    <p>开启Header</p>
                    <div class={'mdui-text-center'}>
                        <label class="mdui-switch">
                            <input type='checkbox' checked={props.isHeaderOn} onChange={() => { ctx.emit('headerOn') }} />
                            <i class="mdui-switch-icon"></i>
                        </label>
                    </div>
                </div>

                <div class='style_editor_group'>
                    <p>开启Footer</p>
                    <div class={'mdui-text-center'}>
                        <label class="mdui-switch">
                            <input type='checkbox' checked={props.isFooterOn} onChange={() => { ctx.emit('footerOn') }} />
                            <i class="mdui-switch-icon"></i>
                        </label>
                    </div>
                </div>
            </div>
        )
    }
})

export default ConfigPanelRoot;