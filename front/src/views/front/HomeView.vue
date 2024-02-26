<template lang="pug">
v-carousel(hide-delimiters height="100vh")
  v-carousel-item(v-for='(item,i) in items', :key='i', :src='item.src' )
v-container
  v-row
    v-col(cols="12")
      h1.h1 喬一下-師傅
    v-divider
    v-col(cols="12" sm="6" md="4" lg="3" v-for="product in products" :key="product._id")
      ProductCard(v-bind="product")
</template>

<script setup>
import { ref, onMounted, nextTick, reactive } from 'vue'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import ProductCard from '@/components/ProductCard.vue'
import gsap from 'gsap'

const { api } = useApi()

const createSnackbar = useSnackbar()

const products = ref([])

onMounted(async () => {
  try {
    const { data } = await api.get('/products', {
      params: {
        itemsPerPage: -1
      }
    })
    products.value.push(...data.result.data)
    await nextTick()
    gsap
      .to('.product-card', { opacity: 1, duration: 0.5, delay: 0.5 })
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 2000,
        color: 'red',
        location: 'bottom'
      }
    })
  }
})

// 輪播圖

// reactive 函数接收一个普通的 JavaScript 对象（或数组），
// 并返回一个代理对象，该代理对象会在访问和修改数据时跟踪依赖关系。
// 这意味着如果你修改了代理对象中的属性或数组元素，相关的界面部分将会自动更新。
const items = reactive([
  {
    src: new URL('@/assets/ZB.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/toya.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/kuzuha.png', import.meta.url).href
  },
  {
    src: new URL('@/assets/aym.png', import.meta.url).href
  }
])
</script>

<style scoped lang="sass">
.product-card
  opacity: 0
.h1
  color: #d9d5d2
  font-size: 3rem
.bg-color
  background:#403642
.logout-bg-color
  background: #d9d5d2
.logout-color
  color: #403635
</style>
