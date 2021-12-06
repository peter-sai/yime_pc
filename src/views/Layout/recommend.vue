<template>
  <div class="recommend">
    <NavigationBar title="推荐好友" hide-left disable-left>
      <template v-slot:left>
        <Iconfont
          class="pointer"
          @click="$emit('toggleBox')"
          name="iconfork"
          size="20"
        />
      </template>
    </NavigationBar>
    <div style="margin: 15px 10px">
      <Search placeholder="搜索好友" :width="60" />
    </div>
    <div class="main">
      <div class="content">
        <div class="item" v-for="(item, key) in list" :key="item.uid">
          <div v-if="item.tag && key === 0" class="tag">{{ item.tag }}</div>
          <div
            v-else-if="item.tag && list[key - 1].tag !== item.tag"
            class="tag"
          >
            {{ item.tag }}
          </div>
          <Table :title="item.name" hideMore>
            <template v-slot:left>
              <img :src="item.icon" alt="" />
            </template>
          </Table>
        </div>
      </div>
      <div class="btn">确定</div>
    </div>
  </div>
</template>
<script lang="ts">
import Table from '@/components/Table/index.vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'recommend',
});
</script>
<script setup lang="ts">
import Iconfont from '@/iconfont/index.vue';
import NavigationBar from '@/components/NavigationBar/index.vue';
import Search from '@/components/Search/index.vue';
const list = ref([
  {
    icon: 'https://123message.oss-accelerate.aliyuncs.com/IM/9daf2c4c8e99fb716ddcd7c08fe30cfb.png',
    name: '123456',
    nickname: '123456',
    tag: '#',
    uid: 758578,
  },
  {
    icon: 'https://123message.oss-accelerate.aliyuncs.com/3cb3d7be78ddee44bc921aae381e7223',
    name: 'ALPS',
    nickname: 'ALPS',
    tag: 'A',
    uid: 940247,
  },
]);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.recommend {
  height: 100%;
  display: flex;
  flex-direction: column;
  .main {
    height: 100%;
    position: relative;
    overflow: auto;
    .content {
      box-sizing: border-box;
      padding: 8px 13px;
      padding-bottom: 70px;
      .item {
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .tag {
          font-size: 14px;
          padding: 5px 0;
          color: #0085ff;
          background: #f4f4f4;
          margin: 0 -13px;
          padding-left: 17px;
        }
        .table {
          padding: 9px 0;
        }
      }
    }
    .btn {
      font-size: 14px;
      position: fixed;
      bottom: 0;
      right: 0;
      cursor: pointer;
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      color: #ffffff;
      width: 320px;
      height: 50px;
      background: #0085ff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
