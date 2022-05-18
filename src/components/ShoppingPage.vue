<script lang="ts">
import Toolbar from "./Toolbar.vue"
import PageBody from "./PageBody.vue";
import TemplateSellItem from "./TemplateSellItem.vue";
import { request, api } from "../Request";
import { eval_template_share, TemplateShare } from "../Model";
import { ref } from "vue";

export default {
  name: "ShoppingPage",
  components: { Toolbar, PageBody, TemplateSellItem }
}
</script>

<script setup lang="ts">
const templates = ref<Array<TemplateShare>>([])

// 获取共享模版列表
function get_shared_template_list() {
  request("template/share/list", {}, (status, obj) => {
    if (status == 200 && obj?.code === 200 && obj.data !== null) {
      console.log(obj.data)
      templates.value = (<Array<any>>obj.data.templates).map(value => eval_template_share(value))
    }
  })
}

get_shared_template_list()
</script>


<template>
  <toolbar title="模版市场">
    <a class="mdui-btn mdui-btn-icon" @click="get_shared_template_list">
      <i class="mdui-icon material-icons">refresh</i>
    </a>
  </toolbar>
  <page-body>
    <div class="mdui-container">
      <template-sell-item v-for="template in templates" :tid="template.tid" :title="template.title"
        :price="template.price" :share-time="template.shareTime" :thumbnail="api(`thumbnail/${template.tid}`)" />
    </div>
  </page-body>
</template>