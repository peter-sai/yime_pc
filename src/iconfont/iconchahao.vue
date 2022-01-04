<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M525.850122 442.268735L977.293061 3.354122l71.011266 73.038368-449.374041 436.918857 449.374041 436.918857-71.011266 73.038367-451.437714-438.909387-451.43249 438.909387L3.401143 950.230204 452.780408 513.306122 3.401143 76.39249 74.417633 3.354122l451.432489 438.909388z"
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
