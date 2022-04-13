export function random_id(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    const len = chars.length
    let s = ''
    for (let i = 0; i < 32; i++) {
        s += chars.charAt(Math.floor(Math.random() * len))
    }
    return s
}

export interface SlotProp {
    size: number
    children: Widget[]
}

export function clone_slot_props(props: Array<SlotProp>): SlotProp[] {
    return props.map(value => ({ size: value.size, children: [] }))
}

export interface FormProp {
    method?: string
    url?: string
}

export interface Widget {
    id: string
    type: string
    node_prop: NodeProp
    children: SlotProp[]
    form_prop: FormProp
}

export function widget_is_container(widget: Widget): boolean {
    return widget.type === 'CONTAINER' || widget.type === 'FORM'
}

export function widget_is_form(widget: Widget): boolean {
    return widget.type === 'FORM'
}

export function clone_widget(widget: Widget): Widget {
    return {
        id: random_id(),
        type: widget.type,
        node_prop: {},
        children: clone_slot_props(widget.children),
        form_prop: { method: widget.form_prop.method, url: widget.form_prop.url }
    }
}

export interface ClassProp {
    textColor?: string
    textSize?: string
    backgroundColor?: string
    textAlign?: string
}

export interface NodeProp {
    clazz?: ClassProp
    name?: string
    content?: string
    url?: string
    styles?: { [key: string]: string }
    type?: string
}

export interface ClassItem {
    className: string
    classDesc: string
}

export interface FormMethod {
    name: string
}


export const template_widgets: Widget[] = [
    { id: '0', type: 'P', node_prop: {}, children: [], form_prop: {} },
    { id: '1', type: 'INPUT', node_prop: {}, children: [], form_prop: {} },
    { id: '2', type: 'BUTTON', node_prop: {}, children: [], form_prop: {} },
    { id: '3', type: 'CHECKBOX', node_prop: {}, children: [], form_prop: {} },
    { id: '4', type: 'RADIO', node_prop: {}, children: [], form_prop: {} },
    { id: '5', type: 'IMAGE', node_prop: {}, children: [], form_prop: {} },
    { id: '6', type: 'FORM', node_prop: {}, children: [{ size: 12, children: [] }], form_prop: {} },
    { id: '7', type: 'CONTAINER', node_prop: {}, children: [{ size: 12, children: [] }], form_prop: {} },
    { id: '8', type: 'CONTAINER', node_prop: {}, children: [{ size: 12, children: [] }, { size: 4, children: [] }, { size: 4, children: [] }, { size: 4, children: [] }], form_prop: {} },
    { id: '9', type: 'CONTAINER', node_prop: {}, children: [{ size: 6, children: [] }, { size: 6, children: [] }], form_prop: {} },
    { id: 'a', type: 'CONTAINER', node_prop: {}, children: [{ size: 9, children: [] }, { size: 3, children: [] }], form_prop: {} },
]

export const class_group: {
    textColor: ClassItem[],
    backgroundColor: ClassItem[],
    textSize: ClassItem[],
    textAlign: ClassItem[]
} = {
    textColor: [
        { className: 'mdui-text-color-green', classDesc: '绿色' },
        { className: 'mdui-text-color-blue', classDesc: '蓝色' },
        { className: 'mdui-text-color-red', classDesc: '红色' },
        { className: 'mdui-text-color-yellow', classDesc: '黄色' },
        { className: 'mdui-text-color-purple', classDesc: '紫色' },
        { className: 'mdui-text-color-orange', classDesc: '橙色' },
        { className: 'mdui-text-color-pink', classDesc: '粉色' },
        { className: 'mdui-text-color-grey', classDesc: '灰色' },
        { className: 'mdui-text-color-black', classDesc: '黑色' },
        { className: 'mdui-text-color-white', classDesc: '白色' },
        { className: 'mdui-text-color-blue-grey', classDesc: '蓝灰色' },
        { className: 'mdui-text-color-deep-purple', classDesc: '深紫色' },
        { className: 'mdui-text-color-indigo', classDesc: '靛青色' },
        { className: 'mdui-text-color-cyan', classDesc: '青色' },
        { className: 'mdui-text-color-teal', classDesc: '青绿色' },
        { className: 'mdui-text-color-lime', classDesc: '黄绿色' },
        { className: 'mdui-text-color-light-green', classDesc: '浅绿色' },
        { className: 'mdui-text-color-deep-orange', classDesc: '深橙色' },
        { className: 'mdui-text-color-brown', classDesc: '褐色' },
    ],
    backgroundColor: [
        { className: "mdui-color-green", classDesc: "绿色" },
        { className: "mdui-color-blue", classDesc: "蓝色" },
        { className: "mdui-color-white", classDesc: "白色" },
        { className: "mdui-color-black", classDesc: "黑色" },
        { className: "mdui-color-red", classDesc: "红色" },
        { className: "mdui-color-yellow", classDesc: "黄色" },
        { className: "mdui-color-orange", classDesc: "橙色" },
        { className: "mdui-color-cyan", classDesc: "青色" },
        { className: "mdui-color-purple", classDesc: "紫色" },
        { className: "mdui-color-blue-grey", classDesc: "蓝灰色" },
        { className: "mdui-color-light-blue", classDesc: "浅蓝色" },
        { className: "mdui-color-pink", classDesc: "粉色" },
        { className: "mdui-color-grey", classDesc: "灰色" },
        { className: "mdui-color-teal", classDesc: "青绿色" },
        { className: "mdui-color-deep-orange", classDesc: "深橙色" },
        { className: "mdui-color-deep-purple", classDesc: "深紫色" },
        { className: "mdui-color-indigo", classDesc: "靛青色" },
        { className: "mdui-color-light-green", classDesc: "浅绿色" },
        { className: "mdui-color-brown", classDesc: "褐色" },
    ],
    textSize: [
        { className: "mdui-typo-headline", classDesc: "大标题" },
        { className: "mdui-typo-title", classDesc: "标题" },
        { className: "mdui-typo-subtitle", classDesc: "副标题" },
        { className: "mdui-typo-body-1", classDesc: "正文1" },
        { className: "mdui-typo-body-2", classDesc: "正文2" },
        { className: "mdui-typo-caption", classDesc: "提示文字" },
        { className: "mdui-typo-footnote", classDesc: "脚注" },
        { className: "mdui-typo-menu", classDesc: "菜单" },
    ],
    textAlign: [
        { className: "mdui-text-left", classDesc: "左对齐" },
        { className: "mdui-text-center", classDesc: "居中" },
        { className: "mdui-text-right", classDesc: "右对齐" },
    ]
}

export const form_group: { method: FormMethod[] } = {
    method: [
        { name: 'GET' },
        { name: 'POST' },
    ]
}