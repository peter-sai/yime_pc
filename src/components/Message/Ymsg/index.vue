<template>
  <div class="mmsg">
    <div class="img" @click="$emit('click')">
      <Iconfont v-if="userInfo?.isBotUser" name="iconbianzu16" size="44" />
      <img v-else-if="userInfo?.icon" :src="userInfo.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <div class="title" v-if="isGroup">{{ userInfo?.nickname }}</div>
      <ImBg v-bind="$attrs">
        <img
          class="fire"
          v-if="isBurn && fired"
          src="../../../assets/img/fired.svg"
          alt=""
        />
        <img
          class="fire"
          v-if="isBurn && !fired"
          src="../../../assets/img/fire.svg"
          alt=""
        />
        <p
          v-for="item in list"
          :key="item"
          class="text"
          @click="$emit('clickFireMsg')"
        >
          {{ item.replace(/\u0000/g, "") }}
        </p>
      </ImBg>
    </div>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  defineProps,
  useSlots,
  PropType,
  computed,
  defineEmits,
} from "vue";
import ImBg from "../ImgBg/index.vue";
import Iconfont from "@/iconfont/index.vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { IUserInfo } from "@/types/user";
import { key } from "@/store";
export default defineComponent({
  name: "Ymsg",
});
</script>
<script lang="ts" setup>
defineEmits(["click", "clickFireMsg"]);
defineProps({
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
});
const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);
const slots: any = useSlots();

const list = slots.default()[0].children
  ? slots.default()[0].children.split("\n\n")
  : [];
</script>
<style lang="scss" scoped>
@import "@/style/theme/index.scss";
.mmsg {
  display: flex;
  max-width: 80%;
  .title {
    font-size: 16px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    margin-bottom: 5px;
  }
  .text {
    font-size: 16px;
    @include theme("color", main);
    padding: 0;
  }
  .img {
    img {
      width: 46px;
      height: 46px;
      border-radius: 50%;
    }
    margin-right: 10px;
  }
  .pointer {
    cursor: pointer;
  }
  .fire {
    position: absolute;
    right: -6px;
    top: -2px;
  }
}
</style>
