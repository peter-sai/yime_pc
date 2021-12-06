<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M863.84 127.73a32 32 0 0 1 32 32v704a32 32 0 0 1-32 32h-704a32 32 0 0 1-32-32v-704a32 32 0 0 1 32-32h704m0-64h-704a96 96 0 0 0-96 96v704a96 96 0 0 0 96 96h704a96 96 0 0 0 96-96v-704a96 96 0 0 0-96-96z"
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
