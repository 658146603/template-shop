<script lang="ts">
import Toolbar from "./Toolbar.vue"
import TemplateCardItem from "./TemplateCardItem.vue";
import PageBody from "./PageBody.vue";

import { request, api } from "../Request";
import { eval_template, Template } from "../Model";
import { ref } from "vue"
import mdui from "mdui";

export default {
  name: "CraftPage",
  components: { Toolbar, PageBody, TemplateCardItem }
}
</script>

<script setup lang="ts">
const templates = ref<Array<Template>>([])


function get_template_list() {
  request("template/list", {}, (status, obj) => {
    if (status == 200 && obj?.code === 200 && obj.data !== null) {
      templates.value = (<Array<any>>obj.data.templates).map(value => eval_template(value))
    }
  })
}

function create_template() {
  mdui.prompt('模版标题', (value: string) => {
    if (value.length > 0) {
      request("template/insert", { title: value, content: JSON.stringify([]) }, (status, obj) => {
        if (status == 200 && obj?.code === 200 && obj.data != null) {
          mdui.snackbar({
            message: '创建成功',
            position: 'bottom',
            buttonText: '编辑',
            onButtonClick: () => {
              window.open(`editor?tid=${obj.data.tid}`)
            }
          });
          get_template_list()
        }
      })
    } else {
      mdui.snackbar({
        message: '请输入标题',
        position: 'bottom',
      });
    }
  })
}

get_template_list()
</script>

<template>
  <toolbar title="开始创作">
    <a class="mdui-btn mdui-btn-icon" @click="create_template">
      <i class="mdui-icon material-icons">add</i>
    </a>
  </toolbar>
  <page-body>
    <div class="mdui-container">
      <template-card-item v-for="template in templates" :tid="template.tid" :title="template.title"
        :update-time="template.updateTime" :thumbnail="api(`thumbnail/${template.tid}`)" />
    </div>
  </page-body>
</template>