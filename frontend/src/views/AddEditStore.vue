<template>
    <h2>Add/Edit Store</h2>
    <p>Store Id: {{ id }}</p>
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