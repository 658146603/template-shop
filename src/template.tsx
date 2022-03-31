import { defineComponent } from 'vue'
import { ClassProp, NodeProp } from "./widget";

function create_class_list(init: Array<string>, prop?: ClassProp): Array<string> {
    let classList = Array.from(init)

    if (prop != undefined) {
        if (prop.backgroundColor != undefined) {
            classList.push(prop.backgroundColor)
        }
        if (prop.textColor != undefined) {
            classList.push(prop.textColor)
        }
        if (prop.textSize != undefined) {
            classList.push(prop.textSize)
        }
        if (prop.textAlign != undefined) {
            classList.push(prop.textAlign)
        }
    }

    return classList
}

export function template_p(prop: NodeProp): JSX.Element {
    if (prop.content == undefined) {
        prop.content = '单行文本'
    }

    let classList: Array<string> = create_class_list(['template-item', 'template-default-p'], prop.clazz)

    return (<p class={classList} style={prop.styles}>{prop.content}</p>);
}

// export const TemplateP = defineComponent<{ type: string, node_prop: NodeProp, }>({
//     render() {
//         return template_p(this.$props.node_prop)
//     }
// })

export function template_input(prop: NodeProp): JSX.Element {
    if (prop.content == undefined) {
        prop.content = '请输入文本'
    }

    let classList: Array<string> = create_class_list(['template-item', 'mdui-textfield-input'], prop.clazz)

    return (<input type='text' class={classList} name={prop.name} placeholder={prop.content}/>)
}

export function template_button(prop: NodeProp): JSX.Element {
    if (prop.content == undefined) {
        prop.content = '普通按钮'
    }

    let classList: Array<string> = create_class_list(['template-item', 'template-default-button'], prop.clazz)

    return (<button class={classList}>{prop.content}</button>)
}

export function template_checkbox(prop: NodeProp) {
    if (prop.content == undefined) {
        prop.content = '多选框'
    }

    if (prop.name == undefined) {
        prop.name = 'default_checkbox_group'
    }

    let classList: Array<string> = create_class_list(['template-item'], prop.clazz)

    return (
        <div class={classList}>
            <label class='mdui-checkbox'>
                <input type='checkbox' name={prop.name}/>
                <i class='mdui-checkbox-icon'/>
                {prop.content}
            </label>
        </div>
    );
}

export function template_radio(prop: NodeProp): JSX.Element {
    if (prop.content == undefined) {
        prop.content = '单选框'
    }

    if (prop.name == undefined) {
        prop.name = 'default_radio_group'
    }

    let classList: Array<string> = create_class_list(['template-item'], prop.clazz)

    return (
        <div class={classList}>
            <label class='mdui-radio'>
                <input type='radio' name={prop.name}/>
                <i class='mdui-radio-icon'/>
                {prop.content}
            </label>
        </div>
    )
}

export function template_container(prop: NodeProp): JSX.Element {
    return (<div>容器组件</div>)
}

export const TYPE_RENDER_MAP: {[key: string]: (prop: NodeProp) => JSX.Element} = {
    'P': template_p,
    'INPUT': template_input,
    'BUTTON': template_button,
    'CHECKBOX': template_checkbox,
    'RADIO': template_radio,
    'CONTAINER': template_container,
}