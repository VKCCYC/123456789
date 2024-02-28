<template lang="pug">
v-carousel.bg-color(hide-delimiters height="calc(100vh - 64px)" cycle interval= 3000 show-arrows="hover")
  v-carousel-item(v-for='(item,i) in items', :key='i', :src='item.src' )

v-container

  v-banner(bg-color="#28231F" color="#D3894D" icon='mdi-newspaper-variant-outline' border="none")
    template(v-slot:prepend)
      v-avatar
    v-banner-text(style="font-size: 1.5rem;") NEWS &nbsp;
      span(style="font-size: 1rem;") &nbsp; 2024/03 活動公告 ~ &nbsp; 儲值 20000 送 2000

  WorkerCard

RoomCard

</template>

<script setup>
import { reactive, onMounted } from 'vue'

// import ProductCard from '@/components/ProductCard.vue'
import WorkerCard from '@/components/WorkerCard.vue'
import RoomCard from '@/components/RoomCard.vue'

// reactive 函数接收一个普通的 JavaScript 对象（或数组），
// 并返回一个代理对象，该代理对象会在访问和修改数据时跟踪依赖关系。
// 这意味着如果你修改了代理对象中的属性或数组元素，相关的界面部分将会自动更新。
const items = reactive([
  {
    src: new URL('@/assets/zombie.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/Kenmochi-Toya01.jpg', import.meta.url).href
  },
  {
    src: new URL('@/assets/kuzuha04.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/aym.jpg', import.meta.url).href
  }
])

onMounted(() => {
  // 将滚动位置重置到页面的顶部
  window.scrollTo(0, 0)
})

</script>

<style lang="sass" scoped>
.bg-color
  background: white
</style>
