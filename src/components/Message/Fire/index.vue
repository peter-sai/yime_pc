<template>
  <div class="fireBox">
    <img
      :style="`right:${right};top:${top};left:${left}`"
      class="fire"
      v-if="isBurn && fired"
      src="../../../assets/img/fired.svg"
      alt=""
    />
    <img
      :style="`right:${right};top:${top};left:${left}`"
      class="fire"
      v-if="isBurn && !fired"
      src="../../../assets/img/fire.svg"
      alt=""
    />
  </div>
</template>
<script lang="ts">
import { defineComponent, defineProps, defineEmits } from "vue";
export default defineComponent({
  name: "Fire",
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
  right: {
    type: String,
    default: "auto",
  },
  top: {
    type: String,
    default: "auto",
  },
  left: {
    type: String,
    default: "auto",
  },
});
</script>
<style lang="scss" scoped>
.fireBox {
  position: relative;
  .fire {
    position: absolute;
  }
}
</style>
