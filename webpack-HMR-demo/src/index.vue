<template>
  <div>
    {{ title }} + 11
    <foo />
  </div>
</template>

<script>
import Foo from './foo.vue';
export default {
  name: 'HelloWorld3',
  components: {
    Foo
  },
  data () {
    return {
      title: 'Hello World1!'
    }
  }
}
</script>

<style scoped>

</style>