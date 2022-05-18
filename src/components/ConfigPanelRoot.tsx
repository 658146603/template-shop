import { ElSwitch } from "element-plus";
import { defineComponent } from "vue";
import { ControlListItem } from "./ControlListItem";

const ConfigPanelRoot = defineComponent({
    name: "ConfigPanelRoot",
    props: {
        headerOn: Boolean,
        footerOn: Boolean,
    },
    emits: ["headerOn", "footerOn"],
    setup(props, ctx) {
        return () => (<div></div>)
    }
})

export default ConfigPanelRoot;