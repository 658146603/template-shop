<script lang="ts">
import { ref } from "vue";
import { class_group, input_type_group, config_items } from "../Widget"
import { Widget } from "../Widget";
import { eval_image, Image } from "../Model";
import { request, api } from "../Request";
import { ElButton, ElPopover } from "element-plus";
import { ControlListItem } from "./ControlListItem";
import { UniversalPropEditor } from "./Template";
export default {
    name: "ConfigPanelItem",
    components: {
        ElButton,
        ElPopover,
        ControlListItem,
        UniversalPropEditor,
    },
}
</script>

<script setup lang="ts">
defineProps<{
    selected_item: Widget
}>()


function item_set_text_color(selected_item: Widget, clazz: string) {
    let prop = selected_item.node_prop
    if (prop.clazz == undefined) {
        prop.clazz = {}
    }
    prop.clazz.textColor = clazz
}

function item_set_text_size(selected_item: Widget, clazz: string) {
    let prop = selected_item.node_prop
    if (prop.clazz == undefined) {
        prop.clazz = {}
    }
    prop.clazz.textSize = clazz

}

function item_set_background_color(selected_item: Widget, clazz: string) {
    let prop = selected_item.node_prop
    if (prop.clazz == undefined) {
        prop.clazz = {}
    }
    prop.clazz.backgroundColor = clazz
}

function item_set_text_align(selected_item: Widget, clazz: string) {
    let prop = selected_item.node_prop
    if (prop.clazz == undefined) {
        prop.clazz = {}
    }
    prop.clazz.textAlign = clazz

}

function item_set_url(selected_item: Widget, url: string) {
    let prop = selected_item.node_prop
    if (prop.clazz == undefined) {
        prop.clazz = {}
    }
    prop.url = url
}

function get_all_images() {
    request('image/list', {}, (status, result) => {
        if (status === 200 && result.code === 200) {
            console.log(result.data);
            all_images.value = (result.data as any[]).map(item => eval_image(item));
        }
    });
}

const all_images = ref<Image[]>([]);

get_all_images()
</script>

<template>
    <control-list-item title="组件标识">
        <p>{{selected_item.id}}</p>
    </control-list-item>

    <control-list-item title="字段类型" v-if="config_items.TYPE.includes(selected_item.type)">
        <el-popover :width="350" trigger="click">
            <template #reference>
                <div>{{ selected_item.node_prop.type }}</div>
            </template>
            <template #default>
                <el-radio-group v-model="selected_item.node_prop.type">
                    <el-radio v-for="input_type in input_type_group" :label="input_type.type">
                        {{ input_type.desc }}
                    </el-radio>
                </el-radio-group>
            </template>
        </el-popover>
    </control-list-item>

    <control-list-item title="图片内容" v-if="config_items.IMAGE.includes(selected_item.type)">
        <div class="mdui-col-xs-6">
            <el-popover :width="360" trigger="click">
                <template #reference>
                    <div>图床选择</div>
                </template>
                <template #default>
                    <div class="mdui-container-fluid">
                        <div v-for="image in all_images" class="mdui-col-xs-4">
                            <img :src="api(`image/${image.imageId}`)" class="template-image-cell"
                                @click="item_set_url(selected_item, api(`image/${image.imageId}`))" />
                        </div>
                    </div>
                </template>
            </el-popover>
        </div>
        <div class="mdui-col-xs-6">
            <el-popover :width="360" trigger="click">
                <template #reference>
                    <div>输入地址</div>
                </template>
                <template #default>
                    <el-input type="url" v-model="selected_item.node_prop.url" />
                </template>
            </el-popover>
        </div>
    </control-list-item>

    <control-list-item title="文本颜色">
        <el-popover :width="360" trigger="click">
            <template #reference>
                <div>
                    <i class="mdui-icon material-icons mdui-text-color-grey">color_lens</i>
                    <span :class="[selected_item.node_prop.clazz?.textColor]">示例颜色</span>
                </div>
            </template>
            <template #default>
                <div class="mdui-container-fluid">
                    <div v-for="choice in class_group.textColor" class="mdui-col-xs-4 template-color-choice-cell"
                        @click="item_set_text_color(selected_item, choice.className)">
                        <i class="mdui-icon material-icons" :class="choice.className">color_lens</i>
                        <div>{{ choice.classDesc }}</div>
                    </div>
                </div>
            </template>
        </el-popover>
    </control-list-item>

    <control-list-item title="背景颜色">
        <el-popover :width="360" trigger="click">
            <template #reference>
                <div>
                    <i class="mdui-icon material-icons mdui-text-color-grey">color_lens</i>
                    <span :class="[selected_item.node_prop.clazz?.backgroundColor]">示例背景</span>
                </div>
            </template>
            <template #default>
                <div class="mdui-container-fluid">
                    <div v-for="choice in class_group.backgroundColor" class="mdui-col-xs-4 template-color-choice-cell"
                        @click="item_set_background_color(selected_item, choice.className)">
                        <i class="mdui-icon material-icons mdui-text-color-light-grey"
                            :class="choice.className">color_lens</i>
                        <div>
                            {{ choice.classDesc }}
                        </div>
                    </div>
                </div>
            </template>
        </el-popover>
    </control-list-item>

    <control-list-item title="文本大小">
        <el-popover :width="360" trigger="click">
            <template #reference>
                <div>
                    <i class="mdui-icon material-icons mdui-text-color-grey">format_size</i>
                    <span :class="[selected_item.node_prop.clazz?.textSize]">示例大小</span>
                </div>
            </template>
            <template #default>
                <div class="mdui-container-fluid">
                    <div v-for="choice in class_group.textSize" class="mdui-col-xs-4 template-color-choice-cell"
                        @click="item_set_text_size(selected_item, choice.className)">
                        <i class="mdui-icon material-icons mdui-text-color-light-grey" :class="choice.className">
                            format_size
                        </i>
                        <div>{{ choice.classDesc }}</div>
                    </div>
                </div>
            </template>
        </el-popover>
    </control-list-item>

    <control-list-item title="文本对齐">
        <div v-for="choice in class_group.textAlign" class="mdui-col-xs-4 template-color-choice-cell"
            @click="item_set_text_align(selected_item, choice.className)">
            <i class="mdui-icon material-icons mdui-text-color-light-grey" :class="choice.className">
                {{ choice.classDesc }}
            </i>
        </div>
    </control-list-item>

    <control-list-item title="内容文本">
        <el-input type="text" v-model="selected_item.node_prop.content" placeholder="内容文本" />
    </control-list-item>

    <control-list-item title="字段名称" v-if="config_items.NAME.includes(selected_item.type)">
        <el-input type="text" v-model="selected_item.node_prop.name" placeholder="字段名称" />
    </control-list-item>

    <universal-prop-editor :selected_item="selected_item" :key="`universal-${selected_item.id}`" />
</template>

<style>
.template-image-cell {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.template-color-choice-cell {
    height: 48px;
}

.template-color-choice-cell i {
    cursor: pointer;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.05);
}

.template-color-choice-cell div {
    margin: 8px;
    display: inline;
}
</style>