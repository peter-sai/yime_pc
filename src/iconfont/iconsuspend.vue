<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M184.79722258 30.21851907m109.06759249 0l0 0q109.06759251 0 109.06759242 109.06759241l0 763.47314724q0 109.06759251-109.06759242 109.06759255l0 0q-109.06759251 0-109.06759249-109.06759255l0-763.47314724q0-109.06759251 109.06759249-109.06759241Z"
        null
      ></path>
      <path
        :style="{ fill: color }"
        d="M621.06759251 30.21851907m109.06759242 0l0 0q109.06759251 0 109.06759249 109.06759241l0 763.47314724q0 109.06759251-109.06759249 109.06759255l0 0q-109.06759251 0-109.06759242-109.06759255l0-763.47314724q0-109.06759251 109.06759242-109.06759241Z"
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
