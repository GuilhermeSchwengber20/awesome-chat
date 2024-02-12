<template>
  <LoginPage/>
</template>

<script>
export default {
  name: 'IndexPage',
  mounted() {
    console.log("URL DO BACKEND:", this.$config.BACKEND_URL);
  }
}
</script>
<style>
</style>