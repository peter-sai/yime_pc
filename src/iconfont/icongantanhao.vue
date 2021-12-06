<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M512 0C229.205333 0 0 229.226667 0 512c0 282.794667 229.205333 512 512 512s512-229.205333 512-512C1024 229.226667 794.794667 0 512 0zM512 944C273.408 944 80 750.592 80 512 80 273.408 273.408 80 512 80S944 273.408 944 512C944 750.592 750.592 944 512 944z"
        null
      ></path>
      <path
        :style="{ fill: color }"
        d="M480 469.312 492.458667 640 531.562667 640 544 467.754667 544 256 480 256Z"
        null
      ></path>
      <path
        :style="{ fill: color }"
        d="M480 704l64 0 0 64-64 0 0-64Z"
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
