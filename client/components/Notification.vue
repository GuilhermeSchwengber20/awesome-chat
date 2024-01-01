<template>
  <div class="container-notification" :class="Notification.type">
    <span>
      {{ Notification.msg }}
    </span>
  </div>
</template>
<script>
export default {
  name: "Notification",
  computed: {
    Notification() {
      return this.$store.state.Notification;
    },
  },
};
</script>
<style scoped>
.warn {
  border: 1px solid var(--warning-normal);
  width: 80%;
  padding: 5px 10px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 20px;
}

.warn span {
  color: var(--warning-normal);
}

.success {
  border: 1px solid var(--success-normal);
  width: 80%;
  padding: 5px 10px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 20px;
}

.success span {
  color: var(--success-normal);
}
</style>
