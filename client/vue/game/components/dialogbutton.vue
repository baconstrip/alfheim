<template>
    <button class="btn btn-large" id="{{ identifier }}">{{ label }}</button>
</template>
<script>
export default {
    props: ['label', 'identifier'],
}
</script>