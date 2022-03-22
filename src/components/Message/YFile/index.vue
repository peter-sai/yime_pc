<template>
  <div class="ymsg">
    <div @click="$emit('click')">
      <img v-if="userInfo?.icon" :src="userInfo?.icon" />
      <Iconfont v-else name="iconlianxiren" size="46" color="#A8B5BE" />
    </div>
    <div>
      <div class="title1" v-if="isGroup">{{ userInfo?.nickname }}</div>
      <div class="fileBg" @contextmenu="contextmenu" @click="$emit('download')">
        <div class="left">
          <div class="title">{{ item?.fileName }}</div>
          <div class="size">{{ getSize() }}</div>
        </div>
        <div class="right">
          <Iconfont :name="name" size="44" />
        </div>
        <Fire :isBurn="isBurn" :fired="fired" :right="`-20px`" :top="`-48px`" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  defineProps,
  PropType,
  ref,
  defineEmits,
} from "vue";
import Iconfont from "@/iconfont/index.vue";
import Fire from "../Fire/index.vue";
import { useRouter, useRoute } from "vue-router";
import { useGoTo } from "@/hooks";
import { useStore } from "vuex";
import { Toast } from "@/plugin/Toast";
import { useI18n } from "vue-i18n";
import { IUserInfo } from "@/types/user";
import { getTag } from "@/utils/utils";
import { IFileInfo } from "@/types/msg";
import { key } from "@/store";

defineComponent({
  name: "Yfile",
});
</script>
<script lang="ts" setup>
const props = defineProps({
  userInfo: {
    type: Object as PropType<IUserInfo>,
  },
  isBurn: {
    type: Boolean,
  },
  fired: {
    type: Boolean,
  },
  item: {
    type: Object as PropType<IFileInfo>,
  },
});

// 计算大小
const getSize = () => {
  const size = props.item!.fileSize;
  if (size < 1024) {
    return parseInt(size.toString()) + "K";
  } else if (size / 1024 < 1024) {
    return parseInt((size / 1024).toString()) + "KB";
  } else if (size / 1024 / 1024 < 1024) {
    return parseInt((size / 1024 / 1024).toString()) + "M";
  } else if (size / 1024 / 1024 / 1024 < 1024) {
    return parseInt((size / 1024 / 1024 / 1024).toString()) + "G";
  } else {
    return parseInt((size / 1024 / 1024 / 1024 / 1024).toString()) + "T";
  }
};

const name = ref("iconWORD");
const res = props.item!.fileName.split(".");
if (res.length > 1) {
  const suffix = res[1];
  if (suffix.toLocaleLowerCase().includes("doc")) {
    name.value = "iconWORD";
  } else if (suffix.toLocaleLowerCase().includes("xls")) {
    name.value = "iconexcel";
  } else if (suffix.toLocaleLowerCase().includes("pdf")) {
    name.value = "iconpdf";
  } else {
    name.value = "iconwenjian";
  }
}

const store = useStore(key);
const isGroup = computed(() => store.state.activeIsGroup);

const emit = defineEmits(["menuClick", "click", "download"]);

const contextmenu = (e: any) => {
  e.preventDefault();
  emit("menuClick", e);
};
</script>
<style lang="scss" scoped>
@import "@/style/theme/index.scss";
.ymsg {
  display: flex;
  .title1 {
    font-size: 10px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #999999;
    margin-bottom: 5px;
  }
  .longClick {
    display: flex;
  }
  img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .fileBg {
    text-align: left;
    background: #f4f6ff;
    display: flex;
    justify-content: space-between;
    width: 222px;
    height: 88px;
    padding: 12px;
    box-sizing: border-box;
    align-items: center;
    border-radius: 0px 14px 14px 14px;
    .left {
      .title {
        width: 140px;
        height: 44px;
        font-size: 16px;
        color: #333;
        line-height: 22px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        overflow: hidden;
        -webkit-line-clamp: 2;
        word-wrap: break-word;
      }
      .size {
        font-size: 12px;
        color: #666;
        line-height: 17px;
        margin-top: 5px;
      }
    }
  }
}
</style>
