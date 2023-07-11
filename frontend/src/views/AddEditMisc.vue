<template>
    <h2>Edit</h2>
    <p>type: {{ type }}</p>
</template>

<script>
export default {
    props: {
        type: String,
        item: Object,
        index: Number
    }
}
</script>