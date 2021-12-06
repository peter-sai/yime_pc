<template>
  <div style="flex: 1" @click.stop="showMenu = false">
    <MessageHeader />
    <div class="message">
      <div class="tableItem" @contextmenu="contextmenu">
        <TableDouble>
          <template v-slot:subTitle> 我们会带领大家走上致富的道路... </template>
          <template v-slot:title> Biconomy </template>
          <template v-slot:userImg>
            <div class="userImg">
              <img src="img/notice.svg" />
            </div>
          </template>
          <template v-slot:time> </template>
          <template v-slot:num>
            <Badge :isMute="false" :num="1" />
          </template>
        </TableDouble>
        <div class="box" v-if="showMenu">
          <div class="item">
            <Iconfont name="iconbianzu9" size="15" />
            <span>已读</span>
          </div>
          <div class="item">
            <Iconfont name="iconxitongjingyin" size="12" />
            <span>静音</span>
          </div>
          <div class="item">
            <Iconfont name="icontuichu" size="12" />
            <span>退出群聊</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'message',
});
</script>
<script setup lang="ts">
import TableDouble from '@/components/TableDouble/index.vue';
import Badge from '@/components/Badge/index.vue';
import Iconfont from '@/iconfont/index.vue';
import MessageHeader from './header.vue';
import { ref } from 'vue';
const showMenu = ref(false);
const contextmenu = (e: any) => {
  e.preventDefault();
  showMenu.value = !showMenu.value;
};
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.tableDouble {
  padding: 17px 13px;
  position: relative;
  &::after {
    @include tableBottomLine;
  }
}
.tableItem {
  position: relative;
  .box {
    position: absolute;
    width: 106px;
    background: #f9f9f9;
    border-radius: 5px;
    box-shadow: 0px 0px 26px 0px rgba(0, 0, 0, 0.2);
    z-index: 99;
    padding: 13px 5px;
    box-sizing: border-box;
    top: 75%;
    right: 13px;
    .item {
      display: flex;
      cursor: pointer;
      align-items: center;
      padding: 6px 8px;
      &:hover {
        background: #eee;
      }
      span {
        color: #000000;
        font-size: 14px;
        margin-left: 8px;
      }
    }
  }
}
</style>
