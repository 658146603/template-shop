<template>
  <div class="mdui-col-xs-12 mdui-col-sm-6 mdui-col-md-4" style="margin: 16px 0;">
    <div class="mdui-card">
      <div class="mdui-card-media">
        <img :src="thumbnail" :alt="title" class="image-preview-cover" />
        <div class="mdui-card-primary mdui-card-media-covered">
          <div class="mdui-card-primary-title template-card-title">{{ title }}</div>
          <div class="mdui-card-primary-subtitle">{{ shareTime.toLocaleString() }}</div>
        </div>
      </div>
      <div class="mdui-card-actions">
        <button class="mdui-btn" disabled>¥{{ price / 100 }}</button>
        <button class="mdui-btn mdui-float-right" @click="buy_template">购买</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import mdui from 'mdui';
import { request } from '../Request';

export default {
  name: "TemplateSellItem"
}
</script>

<script setup lang="ts">
const props = defineProps<{
  tid: string,
  title: string,
  price: number,
  shareTime: Date,
  thumbnail: string,
}>()

function buy_template() {
  mdui.dialog({
    title: '购买模版', content: `确认以${props.price / 100}元的价格购买模版?`, buttons: [
      { text: '取消' },
      {
        text: '确认', onClick: () => {
          request("template/buy", { tid: props.tid }, (status, obj) => {
            if (status == 200 && obj?.code === 200 && obj.data != null) {
              mdui.snackbar({
                message: '购买成功',
                position: 'bottom',
              });
              console.log(obj.data) // 购买成功后的数据
            } else {
              // 购买失败
              mdui.snackbar({
                message: `购买失败, ${obj?.message || '未知错误'}`,
                position: 'bottom',
              });
            }
          })
        }
      }
    ]
  })
}
</script>