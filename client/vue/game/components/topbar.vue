<template>
  <div>
    <div>🌘 🌕 ☀ ⛅</div>
    <div class="text-right">hello, {{username}}</div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      username: renderConsts["username"],
    };
  },
};
</script>