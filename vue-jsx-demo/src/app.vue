<template>
  <hello-world />
</template>

<script lang="ts">
export default {
  name: 'app',
  components: {
    HelloWorld: {
      data() {
        return {
          foo: 'foo'
        }
      },
      render() {
        // const h = this.$createElement
        return <div>Hello World!</div>
      }
    }
  },
}
</script>