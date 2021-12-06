<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M538.624 998.656C276.928 998.656 64 785.728 64 523.968c0-261.696 212.928-474.624 474.624-474.624 261.76 0 474.688 212.928 474.688 474.624C1013.312 785.728 800.384 998.656 538.624 998.656zM538.624 81.344C294.592 81.344 96 279.936 96 523.968c0 244.096 198.592 442.688 442.624 442.688 244.096 0 442.688-198.592 442.688-442.688C981.312 279.936 782.72 81.344 538.624 81.344z"
        null
      ></path>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    size: String,
    color: String,
  },
};
</script>
