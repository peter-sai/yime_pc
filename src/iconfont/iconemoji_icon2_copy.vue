<template>
  <div style="display: flex; align-items: center">
    <svg viewBox="0 0 1024 1024" :width="size" :height="size">
      <path
        :style="{ fill: color }"
        d="M509.682526 953.020632a474.597053 474.597053 0 1 0 0-949.194106 474.597053 474.597053 0 0 0 0 949.194106z"
        fill="#617EE0"
      ></path>
      <path
        :style="{ fill: color }"
        d="M543.582316 139.425684a33.899789 33.899789 0 1 0-67.799579 0v364.436211a33.953684 33.953684 0 0 0 11.533474 25.49221l203.398736 177.960421a33.953684 33.953684 0 0 0 44.732632-50.984421l-191.865263-167.882105V139.425684z"
        fill="#FAFBFA"
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
