<script lang="tsx">
import { ElInputNumber } from "element-plus";
import mdui from "mdui";
import { SlotProp, Widget } from "../Widget";
import { form_group, config_items } from "../Widget";
import { ControlListItem } from "./ControlListItem";
import { ListItemEdit } from "./ListItemEdit";

export default {
    name: "ConfigPanelContainer",
    components: {
        ControlListItem,
        ListItemEdit,
    },
}
</script>

<script setup lang="tsx">
const props = defineProps<{
    selected_item: Widget
}>()

const children_slot = {
    item: (item: { element: SlotProp, index: number }): JSX.Element => {
        return (
            <ElInputNumber v-model={item.element.size} min={1} max={12}></ElInputNumber>
        )
    },
    add_item(size: number = 6) {
        props.selected_item.children.push(
            {
                size: size,
                children: []
            }
        )
    },
    remove_item(index: number) {
        if (props.selected_item.children[index].children.length > 0) {
            mdui.snackbar({
                message: "删除前请先清空子项",
                position: "bottom",
            })
        } else {
            props.selected_item.children.splice(index, 1)
        }
    }
}
</script>

<template>
    <control-list-item title="组件标识">
        <p>{{selected_item.id}}</p>
    </control-list-item>

    <control-list-item title="容器类型">
        <el-radio-group v-model="selected_item.type" size="small">
            <el-radio-button label="CONTAINER">容器</el-radio-button>
            <el-radio-button label="FORM">表单</el-radio-button>
        </el-radio-group>
    </control-list-item>

    <control-list-item title="表单方法" v-if="config_items.FORM_METHOD.includes(selected_item.type)">
        <el-radio-group v-model="selected_item.form_prop.method" size="small">
            <el-radio-button v-for="method in form_group.methods" :label="method.name">
                {{ method.name }}
            </el-radio-button>
        </el-radio-group>
    </control-list-item>

    <control-list-item title="容器插槽" :vertical="true">
        <list-item-edit :items="selected_item.children" :item_slot="children_slot"></list-item-edit>
    </control-list-item>
</template>