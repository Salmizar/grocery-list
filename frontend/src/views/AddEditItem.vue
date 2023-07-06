<template>
    <h2>Add/Edit Item</h2>
    <p>Item Id: {{ id }}</p>
</template>

<script>
export default {
    props: {
        id: {
         type: Number,
         default: 0   
        }
    }
}
</script>