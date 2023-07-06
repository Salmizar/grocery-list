<template>
    <h2>Add/Edit Category</h2>
    <p>Category Id: {{ id }}</p>
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