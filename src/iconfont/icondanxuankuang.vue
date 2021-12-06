<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M512 0a512 512 0 1 0 512 512A512 512 0 0 0 512 0z m271.36 417.024L494.336 707.584a51.2 51.2 0 0 1-72.448 0l-180.992-181.248a51.2 51.2 0 1 1 72.448-72.192l144.896 144.64 253.44-253.44a51.2 51.2 0 0 1 72.192 72.448z"
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
