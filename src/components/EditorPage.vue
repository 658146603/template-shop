<script lang="ts">
import Draggable from "vuedraggable";
import Toolbar from "./Toolbar.vue";
import PageBody from "./PageBody.vue";
import ConfigPanelItem from "./ConfigPanelItem.vue";
import ConfigPanelContainer from "./ConfigPanelContainer.vue";
import ConfigPanelRoot from "./ConfigPanelRoot";
import { TemplateDraggable } from "./TemplateDraggable";
import { TemplateDraggableSource } from "./TemplateDraggable";
import { TemplateDraggableTrash } from "./TemplateDraggable";
import { ElPopover } from "element-plus";
import { ref, computed, onMounted } from "vue";
import { config_items } from "../Widget";
import { Widget } from "../Widget";
import { request, request_urlencoded } from "../Request";
import { eval_template } from "../Model";
import QrCodeImage from "./QrCodeImage";
import mdui from "mdui";
import html2canvas from "html2canvas";

export default {
  name: "EditorPage",
  components: {
    Draggable,
    Toolbar,
    PageBody,
    TemplateDraggable,
    TemplateDraggableSource,
    TemplateDraggableTrash,
    ConfigPanelItem,
    ConfigPanelContainer,
    ConfigPanelRoot,
    QrCodeImage,
    ElPopover,
  }
}
</script>

<script setup lang="ts">
onMounted(() => {
  // is mobile
  if (window.innerWidth < 768) {
    const params = new URLSearchParams(location.search)
    const _tid = params.get('tid')
    window.location.href = `/editor/mobile?tid=${_tid}`;
  }
});

const content_editor = ref<Widget[]>([])

const page_title = ref<string>("")
const page_tid = ref<string>("")
const page_update_time = ref<Date | undefined>()

const content_draggable = ref<boolean>(true)

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
    <el-switch class="mdui-hidden-xs" v-model="content_draggable" active-text="拖拽" inactive-text="滑动" />
    <el-popover trigger="hover" width="128">
      <template #reference>
        <a class="mdui-btn mdui-btn-icon mdui-hidden-xs">
          <i class="mdui-icon material-icons">smartphone</i>
        </a>
      </template>
      <template #default>
        <qr-code-image :text="preview_url" />
      </template>
    </el-popover>
    <a class="mdui-btn mdui-btn-icon" @click="preview_template">
      <i class="mdui-icon material-icons">photo</i>
    </a>
    <a class="mdui-btn mdui-btn-icon" @click="save_template">
      <i class="mdui-icon material-icons">save</i>
    </a>
  </toolbar>
  <page-body>
    <div class="mdui-container">
      <div class="template-editor-area template-editor-area-widget">
        <div id="template-source" class="template-source mdui-center">
          <template-draggable-source />
        </div>

        <div class="mdui-divider" style="margin: 16px 0;"></div>

        <div>
          <div class="mdui-text-center mdui-center">垃圾桶</div>
          <div id="template-trash">
            <template-draggable-trash class="template-trash mdui-center" />
          </div>
        </div>
      </div>

      <div class="template-editor-area template-editor-area-content">
        <div class="mdui-textfield">
          <label class="mdui-textfield-label">页面标题</label>
          <input class="mdui-textfield-input" type="text" v-model="page_title" />
        </div>
        <template-draggable @click="select_item(undefined)" id="template-container-root"
          :enable_drag="content_draggable" class="template-container-root mdui-center" :data="content_editor"
          :selected_item="selected_item" :select_item="select_item" />
      </div>

      <div class="template-editor-area template-editor-area-prop">
        <div v-if="selected_item !== undefined">
          <config-panel-container v-if="config_items.CONTAINER.includes(selected_item.type)"
            :selected_item="(selected_item)" :key="`container-${selected_item.id}`" />
          <config-panel-item v-else :selected_item="selected_item" :key="`item-${selected_item.id}`" />
        </div>
        <div v-else>
          <config-panel-root :header-on="headerOn" :footer-on="footerOn" @header-on="headerOn = !headerOn"
            @footer-on="footerOn = !footerOn" />
        </div>
      </div>
    </div>
  </page-body>
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

.template-editor-area-widget {
  left: 0;
  width: 25%;
  /* margin: 8px 40px; */
}

.template-editor-area-prop {
  right: 0;
  width: 25%;
  /* padding: 8px 16px; */
}

.template-editor-area-content {
  left: 30%;
  width: 40%;
  overflow-x: scroll;
}
</style>