<script lang="ts">
import mdui from 'mdui';
import { TemplateOrder } from '../Model';
import { request, api } from '../Request';

export default {
  name: "TemplateOrderItem"
}
</script>

<script setup lang="ts">
const props = defineProps<{
  template_order: TemplateOrder
}>()

function create_from_template() {
  request("template/bought/create", { tid: props.template_order.template.tid }, (status, obj) => {
    if (status == 200 && obj?.code === 200 && obj.data != null) {
      mdui.snackbar({
        message: '创建成功',
        position: 'bottom',
        buttonText: '编辑',
        onButtonClick: () => {
          window.open(`editor?tid=${obj.data.tid}`)
        }
      });
    } else {
      // 创建失败
      mdui.snackbar({
        message: `创建失败, ${obj?.message || '未知错误'}`,
        position: 'bottom',
      });
    }
  })
}
</script>

<template>
  <div class="mdui-col-xs-12 mdui-col-sm-6 mdui-col-md-4" style="margin: 16px 0;">
    <div class="mdui-card">
      <div class="mdui-card-media">
        <img :src="api(`thumbnail/${template_order.template.tid}`)" class="image-preview-cover" :alt="template_order.template.title" />
        <div class="mdui-card-primary mdui-card-media-covered">
          <div class="mdui-card-primary-title template-card-title">{{ template_order.template.title }}</div>
          <div class="mdui-card-primary-subtitle">{{ template_order.orderTime.toLocaleString() }}</div>
        </div>
      </div>
      <div class="mdui-card-actions">
        <button class="mdui-btn mdui-ripple" disabled>以 ¥{{ template_order.price / 100 }} 购入</button>
        <button class="mdui-btn mdui-ripple mdui-float-right" @click="create_from_template">从模版创建</button>
      </div>
    </div>
  </div>
</template>