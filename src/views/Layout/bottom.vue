<template>
  <div class="bottom">
    <div class="itemLeft">
      <Iconfont
        name="iconsearch"
        @click="showOpertion = !showOpertion"
        size="20"
        color="#2B2C33"
      />
      <input type="text" placeholder="输入消息" />
    </div>
    <div class="itemRight">
      <Iconfont name="iconbiaoqing" size="20" color="#2B2C33" />
      <Iconfont
        @click="burnInfo.show = !burnInfo.show"
        name="iconyuehoujifen"
        size="24"
        :color="burnInfo.show ? '#0085FF' : '#2B2C33'"
      />
      <Iconfont name="iconyuyin" size="20" color="#2B2C33" />
    </div>
    <!-- 操作弹框 -->
    <div class="boxOperation" v-if="showOpertion">
      <div class="child">
        <div class="opeItem">
          <Iconfont name="iconxiangce" size="20" color="#111111" />
          <div>相册</div>
        </div>
        <div class="opeItem">
          <Iconfont name="iconicon_yuyinshipin" size="20" color="#111111" />
          <div>语音视频</div>
        </div>
        <div class="opeItem">
          <Iconfont name="iconpaishe" size="20" color="#111111" />
          <div>拍摄</div>
        </div>
      </div>
      <div class="child">
        <div class="opeItem">
          <Iconfont name="iconwenjian1" size="20" color="#111111" />
          <div>文件</div>
        </div>
        <div class="opeItem">
          <Iconfont name="icontuijianhaoyou" size="20" color="#111111" />
          <div>推荐好友</div>
        </div>
        <div class="opeItem">
          <Iconfont name="iconweizhi" size="20" color="#111111" />
          <div>位置</div>
        </div>
      </div>
    </div>
    <!-- 设置焚阅时间 -->
    <div class="burnRead" v-if="burnInfo.show">
      <div class="title">设置焚毁时间</div>
      <div class="burnBox">
        <div
          class="burnItem"
          @click="burnInfo.active = item.id"
          v-for="item in burnInfo.list"
          :key="item.id"
          :class="{ active: item.id === burnInfo.active }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { defineComponent, ref, reactive } from 'vue';
export default defineComponent({
  name: 'bottom',
});
</script>
<script setup lang="ts">
// 是否显示操作弹框
const showOpertion = ref(false);

// 焚阅时间
const burnInfo = reactive({
  list: [
    { id: 0, name: '10秒钟' },
    { id: 1, name: '1分钟' },
    { id: 2, name: '10分钟' },
    { id: 3, name: '1小时' },
    { id: 4, name: '1天' },
    { id: 5, name: '关闭焚毁' },
  ],
  active: 0,
  show: false,
});

const keys = require
  .context('../../assets/img/expression/', true, /\.png$/)
  .keys();

const expression = keys.map((e, k) => {
  return {
    id: k,
    name: e.slice(2, -4),
    path: require(`../../assets/img/expression/${e.substr(2, e.length - 2)}`),
  };
});

// 图标列表
const expressionList = reactive(expression);
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  position: absolute;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-top: 1px solid #eaebea;
  display: flex;
  justify-content: space-between;
}
.burnRead {
  width: 130px;
  height: 150px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  position: absolute;
  bottom: 100%;
  margin-bottom: 10px;
  right: 20px;
  box-sizing: border-box;
  .title {
    font-size: 12px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #050505;
    line-height: 18px;
    text-align: center;
    margin: 15px 0 10px;
  }
  .burnBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    .burnItem {
      width: 50px;
      height: 22px;
      border-radius: 4px;
      border: 1px solid #bdbdbd;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #000000;
      line-height: 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
      cursor: pointer;
      &.active {
        color: #0085ff;
        border: 1px solid #0085ff;
      }
    }
  }
}
.boxOperation {
  position: absolute;
  width: 200px;
  height: 135px;
  background: #ffffff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  bottom: 100%;
  margin-bottom: 10px;
  left: 20px;
  padding: 20px;
  box-sizing: border-box;
  .child {
    display: flex;
    justify-content: space-between;
    .opeItem {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 15px;
      cursor: pointer;
      div {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        margin-top: 3px;
      }
    }
  }
}
.itemLeft {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
  .iconfont {
    cursor: pointer;
    margin-right: 20px;
  }
  input {
    flex: 1;
    height: 20px;
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #000;
    line-height: 20px;
    letter-spacing: 0px;
  }
}
.itemRight {
  display: flex;
  align-items: center;
  .iconfont {
    cursor: pointer;
    margin-left: 20px;
  }
}
</style>
