<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M719.12612347 56.32252839a41.42522469 41.42522469 0 0 1 29.41190951 70.83713422L363.28344337 512l385.25458961 384.84033739a41.5909256 41.5909256 0 0 1-58.82381906 58.82381906l-414.25224689-414.25224692a41.42522469 41.42522469 0 0 1 0-58.82381906l414.25224689-414.25224692a41.42522469 41.42522469 0 0 1 29.41190955-12.01331516z"
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
