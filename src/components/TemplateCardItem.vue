<script lang="ts">
import mdui from 'mdui';
import { request } from '../Request';

export default {
  name: "TemplateCardItem"
}
</script>

<script setup lang="ts">
const props = defineProps<{
  tid: string,
  title: string,
  updateTime: Date,
  thumbnail: string,
}>()

function edit_template() {
  window.open(`editor?tid=${props.tid}`)
}

function share_template() {
  mdui.prompt('请输入购买价格', '共享模版', (value: string) => {
    // 判断price是否为数字且大于等于0
    if (value.length > 0 && !isNaN(parseFloat(value)) && parseFloat(value) >= 0) {
      // 将value四舍五入转换为整数
      const price = Math.round(parseFloat(value) * 100)
      request("template/share", { tid: props.tid, price: price }, (status, obj) => {
        if (status == 200 && obj?.code === 200 && obj.data != null) {
          mdui.snackbar({
            message: '共享成功',
            position: 'bottom',
          });
          console.log(obj.data) // 共享成功后的数据
        }
      })
    } else {
      mdui.snackbar({
        message: '请输入正确的价格',
        position: 'bottom',
      });
    }
  })
}

function preview_template() {
  window.open(`preview?tid=${props.tid}`)
}
</script>

<template>
  <div class="mdui-col-xs-12 mdui-col-sm-6 mdui-col-md-4" style="margin: 16px 0;">
    <div class="mdui-card">
      <div class="mdui-card-media">
        <img :src="thumbnail" :alt="title" class="image-preview-cover" />
        <div class="mdui-card-primary mdui-card-media-covered">
          <div class="mdui-card-primary-title template-card-title">{{ title }}</div>
          <div class="mdui-card-primary-subtitle">{{ updateTime.toLocaleString() }}</div>
        </div>
      </div>
      <div class="mdui-card-actions">
        <button class="mdui-btn mdui-ripple" @click="share_template">分享</button>
        <div class="mdui-float-right">
          <button class="mdui-btn mdui-btn-icon" @click="preview_template">
            <i class="mdui-icon material-icons">photo</i>
          </button>
          <button class="mdui-btn mdui-btn-icon" @click="edit_template">
            <i class="mdui-icon material-icons">edit</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>