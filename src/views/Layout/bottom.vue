<template>
  <div class="bottom">
    <div class="content">
      <div class="itemLeft">
        <Iconfont
          name="iconsearch"
          @click.stop="showOpertion = !showOpertion"
          size="20"
          color="#2B2C33"
        />
        <input
          type="text"
          ref="input"
          placeholder="输入消息"
          :value="modelValue"
          @click.stop=""
          @input="onInput"
          @keydown.enter="$emit('enter')"
        />
      </div>
      <div class="itemRight">
        <Iconfont
          @click.stop="toggleExpres"
          name="iconbiaoqing"
          size="20"
          color="#2B2C33"
        />
        <!-- <Iconfont
          @click.stop="burnInfo.show = !burnInfo.show"
          name="iconyuehoujifen"
          size="24"
          :color="burnInfo.show ? '#0085FF' : '#2B2C33'"
        /> -->
        <Iconfont name="iconyuyin" size="20" color="#2B2C33" />
      </div>
      <!-- 操作弹框 -->
      <div class="boxOperation" v-if="showOpertion">
        <div class="child">
          <div class="opeItem" @click.stop="$emit('sendImg')">
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
          <div class="opeItem" @click.stop="$emit('sendFile')">
            <Iconfont name="iconwenjian1" size="20" color="#111111" />
            <div>文件</div>
          </div>
          <div class="opeItem" @click="$emit('recommend')">
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
            @click.stop="burnInfo.active = item.id"
            v-for="item in burnInfo.list"
            :key="item.id"
            :class="{ active: item.id === burnInfo.active }"
          >
            {{ item.name }}
          </div>
        </div>
      </div>
    </div>
    <div class="box" v-if="showExpres">
      <div class="expres" v-if="!showCacheEmoji">
        <div
          class="item"
          @click.stop="select(item, modelValue)"
          v-for="item in expressionList"
          :key="item.id"
        >
          <img class="img" :src="item.path" alt="" />
        </div>
      </div>
      <div class="expres" v-else>
        <div
          class="item"
          @click.stop="select(item, modelValue)"
          v-for="item in emojiList"
          :key="item.id"
        >
          <img class="img" :src="item.path" alt="" />
        </div>
      </div>
    </div>
    <div class="btn" v-if="showExpres">
      <Iconfont
        v-if="!showCacheEmoji"
        class="iconfont"
        @click.stop="changeCacheEmoji(true)"
        name="iconshijian"
        color="main"
        size="18"
      />
      <Iconfont
        v-else
        class="iconfont"
        @click.stop="changeCacheEmoji(true)"
        name="iconemoji_icon2_copy"
        size="18"
      />
      <Iconfont
        v-if="showCacheEmoji"
        class="iconfont"
        name="iconemoji_icon3"
        size="18"
        color="main"
        @click.stop="changeCacheEmoji(false)"
      />
      <Iconfont
        v-else
        class="iconfont"
        name="iconicon_xiaolian"
        size="18"
        color="#617EE0"
        @click.stop="changeCacheEmoji(false)"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Iconfont from '@/iconfont/index.vue';
import { getStorage, setStorage } from '@/utils/utils';
import {
  defineComponent,
  ref,
  reactive,
  Ref,
  defineEmits,
  defineProps,
  onMounted,
  onBeforeUnmount,
} from 'vue';
export default defineComponent({
  name: 'bottom',
});

interface IexpressionItem {
  id: number;
  name: string;
  path: string;
}

// input
function useInput(
  emit: (event: 'update:modelValue', ...args: any[]) => void,
  emojiList: Ref<IexpressionItem[]>,
  input: Ref<HTMLInputElement | null>,
) {
  // 选择
  const select = (e: any, modelValue: string) => {
    input.value?.focus();
    if (!emojiList.value.find((v) => v.name === e.name)) {
      emojiList.value.push(e);
    }
    emit(
      'update:modelValue',
      modelValue + String.fromCodePoint(parseInt(e.name, 16)),
    );
    if (emojiList.value.length) {
      setStorage('emojiList', JSON.stringify(emojiList.value));
    }
  };

  const del = (modelValue: string) => {
    const res = [...modelValue].slice(0, [...modelValue].length - 1);
    emit('update:modelValue', res.join(''));
  };

  return {
    select,
    del,
  };
}
</script>
<script setup lang="ts">
const input: Ref<HTMLInputElement | null> = ref(null);
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const showExpres = ref(false);
const emit = defineEmits([
  'update:modelValue',
  'remind',
  'enter',
  'recommend',
  'sendImg',
  'sendFile',
]);
// 是否显示操作弹框
const showOpertion = ref(false);

// 缓存列表
const emojiList: Ref<IexpressionItem[]> = ref([]);

if (!emojiList.value.length) {
  emojiList.value = JSON.parse(getStorage('emojiList')) || [];
}

// 是否显示缓存图标
const showCacheEmoji = ref(false);
// 切换显示缓存图标
const changeCacheEmoji = (item: boolean) => {
  showCacheEmoji.value = item;
};

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

// 输入框
const { select, del } = useInput(emit, emojiList, input);

const onInput = (e: any) => {
  emit('update:modelValue', e.target.value);
  if (e.data === '@') {
    emit('remind');
  }
};

const toggleExpres = () => {
  showExpres.value = !showExpres.value;
  input.value?.focus();
};

const bodyClickCb = () => {
  showExpres.value = false;
  showOpertion.value = false;
  burnInfo.show = false;
  // input.value?.focus();
};

onMounted(() => {
  document.body.addEventListener('click', bodyClickCb);
});

onBeforeUnmount(() => {
  document.body.removeEventListener('click', bodyClickCb);
});
</script>
<style lang="scss" scoped>
@import '@/style/base.scss';
.bottom {
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  border-top: 1px solid #eaebea;
  .content {
    height: 50px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
  }
  .box {
    width: 100%;
    border-top: 1px solid #eaebea;
    .expres {
      box-sizing: border-box;
      display: flex;
      flex-wrap: wrap;
      padding: 10px 0;
      height: 180px;
      overflow: auto;
      background: #f9f9f9;
      .item {
        font-size: 12px;
        width: 5%;
        text-align: center;
        margin: 5px 0;
        cursor: pointer;
        .img {
          width: 28px;
          height: 28px;
        }
      }
    }
  }
  .btn {
    height: 50px;
    border-top: 1px solid #eaebea;
    display: flex;
    align-items: center;
    padding: 0 20px;
    .iconfont {
      margin-right: 15px;
      cursor: pointer;
    }
  }
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
