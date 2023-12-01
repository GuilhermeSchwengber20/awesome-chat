<template>
    <div :class="`message ${message.owner ? 'owner' : ''}`">
       <p>{{ message.content }}</p>
    </div>
</template>
<script>
export default {
    name: "Message",

    props: {
        message: Object
    },
}
</script>
<style scoped>
.message {
    width: auto;
    background-color: var(--soft-black);
    max-width: 250px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    line-height: 22px;
    padding: 10px 15px;
    border: 1px solid #292929;
    border-radius: 10px;
    color: var(--white-dark);
    margin: 5px 10px;
    align-self: start;

}
.owner {
    align-self: end;
}
</style>
