<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M521.97592831 794.49442138l601.15609487-662.65594444a44.39458628 44.39458628 0 0 1 67.0368145 0 56.16063549 56.16063549 0 0 1 0 73.95801893L576.06020187 882.7892231a71.48616076 71.48616076 0 0 1-108.06967247 0L130.33459788 510.72501491a56.16063549 56.16063549 0 0 1-1e-8-73.95801893 44.39458628 44.39458628 0 0 1 67.03681452 0l324.50564129 357.7274254z"
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
