<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M304.87387653 967.67747161a41.42522469 41.42522469 0 0 1-29.41190951-70.83713422L660.71655664 512l-385.25458962-384.84033739a41.5909256 41.5909256 0 0 1 58.82381906-58.82381906l414.2522469 414.25224692a41.42522469 41.42522469 0 0 1 0 58.82381906l-414.2522469 414.25224692a41.42522469 41.42522469 0 0 1-29.41190955 12.01331516z"
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
