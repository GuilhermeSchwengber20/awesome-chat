<template>
  <div
    class="user-card capitalize"
    @click="$emit('setReciverMessage', user)"
    :id="`user-${user.id}`"
    :ref="`user_${user.id}`"
  >
    <span class="info-user">
      <span :class="`status ${user.isConnected ? 'connected' : ''}`"></span>
      <span class="username">{{ user.username }}</span>
    </span>
  </div>
</template>
<script>
export default {
  name: "UserInfo",
  props: {
    user: Object,
  },
};
</script>
<style scoped>
.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px;
  border-bottom: 1px solid var(--soft-gray-border);
  cursor: pointer;
}

.info-user {
  display: flex;
  align-items: center;
  gap: 15px;
}

.info-user .username {
  width: 100px;
}

.status {
  width: 10px;
  height: 10px;
  background-color: var(--soft-dark);
  box-shadow: var(--primary-box-shadow);
  border-radius: 50%;
}

.status.connected {
  background-color: green;
}

.capitalize {
  text-transform: capitalize;
}
</style>
