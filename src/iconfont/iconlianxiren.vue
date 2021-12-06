<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M512 0C229.13219 0 0 229.13219 0 512S229.13219 1024 512 1024 1024 794.86781 1024 512 794.86781 0 512 0z m0 153.6a153.6 153.6 0 1 1 0.097524 307.297524A153.6 153.6 0 0 1 512 153.6z m0 727.04a368.64 368.64 0 0 1-307.2-164.864c1.26781-101.61981 205.04381-157.696 307.2-157.696 102.15619 0 305.639619 56.07619 307.2 157.696a368.64 368.64 0 0 1-307.2 164.864z"
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
