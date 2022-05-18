<script lang="ts">
import Draggable from "vuedraggable";
import Toolbar from "./Toolbar.vue";
import PageBody from "./PageBody.vue";
import ConfigPanelItem from "./ConfigPanelItem.vue";
import ConfigPanelContainer from "./ConfigPanelContainer.vue";
import ConfigPanelRoot from "./ConfigPanelRoot";
import { TemplateDraggable } from "./TemplateDraggable";
import { TemplateClickSource } from "./TemplateDraggable";
import { TemplateDraggableTrash } from "./TemplateDraggable";
import { ElPopover } from "element-plus";
import { ref, computed, onMounted } from "vue";
import { config_items } from "../Widget";
import { Widget } from "../Widget";
import { request, request_urlencoded } from "../Request";
import { eval_template } from "../Model";
import { TemplateWidget } from "./Template";
import mdui from "mdui";
import html2canvas from "html2canvas";

export default {
    name: "EditorPageMobile",
    components: {
        Draggable,
        Toolbar,
        PageBody,
        TemplateDraggable,
        TemplateClickSource,
        TemplateDraggableTrash,
        ConfigPanelItem,
        ConfigPanelContainer,
        ConfigPanelRoot,
        ElPopover,
    }
}
</script>

<script setup lang="ts">
onMounted(() => {
    // is mobile
    if (window.innerWidth > 768) {
        const params = new URLSearchParams(location.search)
        const _tid = params.get('tid')
        window.location.href = `/editor?tid=${_tid}`;
    }
});
const content_editor = ref<Widget[]>([])

const page_title = ref<string>("")
const page_tid = ref<string>("")
const page_update_time = ref<Date | undefined>()

const content_draggable = ref<boolean>(false)
const add_element_drawer = ref<boolean>(false)
const edit_element_drawer = computed({
    get: function () {
        return selected_item.value != null
    },
    set: function (value: boolean) {
        if (!value) {
            selected_item.value = undefined
        }
    }
})

const selected_item = ref<Widget | undefined>(undefined)

function export_data(): string {
    return JSON.stringify(content_editor.value)
}

function import_data(value?: string) {
    if (value == null || value.length == 0) return
    content_editor.value = JSON.parse(value) as Widget[]
}

function get_template() {
    if (page_tid.value == null || page_tid.value.length == 0) {
        return
    }
    request(
        `template/${page_tid.value}`,
        {},
        (status, obj) => {
            if (status == 200 && obj.code == 200 && obj.data != null) {
                let template = eval_template(obj.data.template)
                page_title.value = template.title
                page_update_time.value = template.updateTime
                import_data(template.content)
            } else if (status == 200) {
                console.log(obj)
                page_tid.value = ""
                mdui.snackbar({
                    message: '模版不存在',
                    position: 'bottom',
                });
            }
        }
    )
}

function save_template() {
    console.log(page_tid.value)
    request(
        "template/save",
        {
            tid: page_tid.value,
            title: page_title.value,
            content: export_data(),
        },
        (status, obj) => {
            if (status == 200 && obj.code == 200 && obj.data != null) {
                mdui.snackbar({
                    message: '保存成功',
                    position: 'bottom',
                });
                page_update_time.value = new Date(obj.data.updateTime)
            } else if (status == 200 && obj.message != null) {
                mdui.snackbar({
                    message: obj.message,
                    position: 'bottom',
                });
            } else {
                mdui.snackbar({
                    message: '未知异常',
                    position: 'bottom',
                });
            }
        }
    )
  upload_thumbnail()
}

function upload_thumbnail() {
  const page_content = document.getElementById('template-container-root')
  if (page_content != null) {
    html2canvas(page_content, { useCORS: true }).then(canvas => canvas.toBlob(blob => {
      if (blob != null) {
        const formData = new FormData()
        formData.append('file', blob)
        formData.append('tid', page_tid.value)
        request_urlencoded("thumbnail/upload", formData, (status, obj) => {
          console.log(status, obj)
        })
      }
    }))
  }
}

function preview_template() {
    window.open(`/preview?tid=${page_tid.value}`)
}

function select_item(widget?: Widget) {
    console.log(`item select: ${widget?.id}`)
    selected_item.value = widget
}

function add_element(template: TemplateWidget) {
    content_editor.value.push(template.template())
    add_element_drawer.value = false
}

const preview_url = computed(() => {
    return `${location.origin}/preview?tid=${page_tid.value}`
})

const params = new URLSearchParams(location.search)
const _tid = params.get('tid')
if (_tid != null && _tid.length > 0) {
    page_tid.value = _tid
}

get_template()

// for test only
const headerOn = ref(false)
const footerOn = ref(false)
</script>

<template>
    <toolbar title="编辑页面">
        <div v-if="page_update_time !== undefined" class="mdui-typo-caption">
            最后更新 {{ page_update_time.toLocaleString() }}
        </div>
        <a class="mdui-btn mdui-btn-icon" @click="preview_template">
            <i class="mdui-icon material-icons">photo</i>
        </a>
        <a class="mdui-btn mdui-btn-icon" @click="save_template">
            <i class="mdui-icon material-icons">save</i>
        </a>
    </toolbar>
    <page-body>
        <div>
            <div class="mdui-textfield" style="padding: 0 12px 12px 12px;">
                <label class="mdui-textfield-label">页面标题</label>
                <input class="mdui-textfield-input" type="text" v-model="page_title" />
            </div>
            <template-draggable @click="select_item(undefined)" id="template-container-root"
                :enable_drag="content_draggable" class="template-container-root mdui-center" :data="content_editor"
                :selected_item="selected_item" :select_item="select_item" />
        </div>
    </page-body>
    <div class="mdui-bottom-nav mdui-color-grey-100 mdui-valign template-toolbar">
        <div>
            <el-switch v-model="content_draggable" active-text="拖拽" inactive-text="滑动" />
        </div>
        <div @click="add_element_drawer = true" class="mdui-btn mdui-btn-icon">
            <i class="mdui-icon material-icons">add</i>
        </div>
    </div>

    <el-drawer v-model="add_element_drawer" direction="btt" :fullscreen="true" size="60%" :with-header="false">
        <template #default>
            <template-click-source :item_click="add_element" />
        </template>
    </el-drawer>

    <el-drawer v-model="edit_element_drawer" direction="btt" :fullscreen="true" size="60%" :with-header="false">
        <template #default>
            <div v-if="selected_item !== undefined">
                <config-panel-container v-if="config_items.CONTAINER.includes(selected_item.type)"
                    :selected_item="(selected_item)" :key="`container-${selected_item.id}`" />
                <config-panel-item v-else :selected_item="selected_item" :key="`item-${selected_item.id}`" />
            </div>
            <div v-else>
                <config-panel-root :header-on="headerOn" :footer-on="footerOn" @header-on="headerOn = !headerOn"
                    @footer-on="footerOn = !footerOn" />
            </div>
        </template>
    </el-drawer>
</template>

<style scoped>
.template-editor-area {
    position: fixed;
    top: 64px;
    height: calc(100% - 84px);
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 8px 4px;
    background-color: white;
}

.template-editor-area::-webkit-scrollbar {
    width: 0px;
}

.template-toolbar {
    width: 100%;
    overflow-x: scroll;
    padding: 0 8px;
}

.template-toolbar>div {
    display: inline-block;
    margin-right: 8px;
    margin-left: 8px;
}

.template-toolbar::-webkit-scrollbar {
    width: 1px;
    height: 1px;
}
</style>