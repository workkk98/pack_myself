<template>
  <div>
    <p>基础的计数器：{{count}}</p>
    <button @click="count++">count+</button>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      count: 0
    }
  }
}
</script>

<style scoped>

</style>

<markdown>
# 计数器count 🖖

* 快速
* 专业

| 组件props | 作用 |
| :--: | :--: |
| count | 入参 |

> 引用一些内容 💁

### source
```html
<template>
  <div>
    <p>基础的计数器：{{count}}</p>
    <button @click="count++">count++</button>
  </div>
</template>
```
</markdown>