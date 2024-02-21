<template lang="pug">
VContainer
  VRow
    VCol.titel(cols="12")
      h1 {{ product.name }}
    VCol(cols="12" md="6")
      template(v-if='product.image && product.image.length > 0')
        v-carousel(show-arrows='hover' hide-delimiters  progress="#403635")
          v-carousel-item(v-for='(img, index) in product.image', :key='index', :src='img')
    VCol.my-auto(cols="12" md="6")
      h2 1HR &nbsp  $ {{ product.price }}
      p.my-3(style="white-space: pre;") {{ product.description }}
      div &nbsp;
      VForm(:disabled="isSubmitting" @submit.prevent="submit")
        VTextField(
        type="text"
        inputmode="numeric"
        min="0" v-model="quantity.value.value"
        :error-messages="quantity.errorMessage.value"
        clearable variant="outlined"  :style="{ width: '300px' }")
        div &nbsp;
        VBtn.cart-btn(type="submit" prepend-icon="mdi-cart" :loading="isSubmitting") 加入購物車
//- 單向綁定 :model-value, !product.sell=非上架
VOverlay.align-center.justify-center.text-center(:model-value="!product.sell" persistent)
  h1.textdown 已下架
  div &nbsp
  VBtn.color(to="/" block rounded="xl" elevation="20"  size="x-large") 回首頁
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApi } from '@/composables/axios'
import { useSnackbar } from 'vuetify-use-dialog'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useUserStore } from '@/store/user'

const route = useRoute()
const router = useRouter()
const { api, apiAuth } = useApi()
const createSnackbar = useSnackbar()
const user = useUserStore()

const product = ref({
  _id: '',
  name: '',
  price: 0,
  description: '',
  image: '',
  sell: true,
  category: ''
})

const schema = yup.object({
  quantity: yup.number().typeError('格式錯誤').required('缺少數量').min(1, '數量最少為 1')
})
const { isSubmitting, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: {
    quantity: 1
  }
})
const quantity = useField('quantity')

const submit = handleSubmit(async (values) => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product: product.value._id,
      quantity: values.quantity
    })
    user.cart = data.result
    createSnackbar({
      text: '新增成功',
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: '#8C8987',
        location: 'center'
      }
    })
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: 'error',
        location: 'center'
      }
    })
  }
})

onMounted(async () => {
  try {
    const { data } = await api.get('/products/' + route.params._id)
    product.value._id = data.result._id
    product.value.name = data.result.name
    product.value.price = data.result.price
    product.value.description = data.result.description
    product.value.image = data.result.image
    product.value.sell = data.result.sell
    product.value.category = data.result.category

    document.title = `出來喬師傅 | ${product.value.name}`
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      showCloseButton: false,
      snackbarProps: {
        timeout: 1500,
        color: 'error',
        location: 'center'
      }
    })
    router.push('/')
  }
})
</script>

<style scoped lang="sass">
  .color
    background-color:#BFB9B8
    color: #16403C
    font-weight: bolder
    font-size: 2rem
  .textdown
    font-size: 300px
    color: #403635
    text-shadow: 10px 10px 30px #595552 ,10px 10px 10px #d9d5d2
  .titel
    font-size: 3rem
    color: #D3894D
    text-align: center
  .cart-btn
    background: #d9d5d2
    color: #403635
    margin-bottom: 5rem
  .v-carousel-item
    padding: 2rem
  </style>
