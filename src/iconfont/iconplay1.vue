<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M250.23777812 882.8298144v-741.6596288a109.06759251 109.06759251 0 0 1 174.50814789-87.25407395l494.40339665 370.82981436a109.06759251 109.06759251 0 0 1 0 174.50814798L424.74592601 970.08388835a109.06759251 109.06759251 0 0 1-174.50814789-87.25407395z"
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
