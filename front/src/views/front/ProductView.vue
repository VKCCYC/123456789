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
        div &nbsp;
        VBtn.cart-btn(type="submit" prepend-icon="mdi-clock-time-three-outline" :loading="isSubmitting" @click="openDialog()") 選擇時段

//- 單向綁定 :model-value, !product.sell=非上架
VOverlay.align-center.justify-center.text-center(:model-value="!product.sell" persistent)
  h1.textdown 已下架
  div &nbsp
  VBtn.color(to="/" block rounded="xl" elevation="20"  size="x-large") 回首頁

//- 123
v-dialog.w-75(v-model="dialog" )
  v-form(:disabled="isSubmitting" @submit.prevent="submit" v-if="product._id.length>0")
    v-card
      v-card-title 選擇師傅
      v-card-text
        v-text-field(v-model="product.name" variant="outlined" disabled )
        v-text-field(label="價格/1H" v-model="product.price" disabled)

        v-autocomplete(v-model='friends', :disabled='isUpdating', :items='people', chips='', closable-chips, color='blue-grey-lighten-2', item-title='names', item-value='names',multiple label="部位選擇")
            template(v-slot:chip='{ props, item }')
              v-chip(v-bind='props', :prepend-avatar='item.raw.avatar', :text='item.raw.names')
            template(v-slot:item='{ props, item }')
              v-list-item(v-bind='props', :prepend-avatar='item.raw.avatar', :title='item.raw.names', :subtitle='item.raw.group')

        v-combobox(label="時段選擇" :items="['中午時段', '下午時段', '晚上時段']")

        v-textarea(label="備註" v-model="description01.value.value" )

        VTextField(
        label="時數"
        type="text"
        inputmode="numeric"
        min="0" v-model="quantity.value.value"
        :error-messages="quantity.errorMessage.value"
        clearable)

      v-card-actions
        v-spacer
        v-btn(color="red" :disabled="isSubmitting" @click="closeDialog") 取消
        v-btn(color="green" type="submit" :loading="isSubmitting" @click="addCart") 送出
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
  quantity: yup.number().typeError('格式錯誤').required('缺少數量').min(1, '數量最少為 1'),
  name: yup.string().required('缺少師傅姓名')
})

const { isSubmitting, handleSubmit, resetForm } = useForm({
  validationSchema: schema,
  initialValues: {
    quantity: 1,
    name: '',
    price: 0,
    description: '',
    category: '',
    sell: false
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
  try {
    createSnackbar({
      text: '新增成功',
      // 不要出現關閉的按鈕
      showCloseButton: false,
      // 要傳進 snackbarProps 元件的參數
      snackbarProps: {
        // 1.5 秒鐘後消失
        timeout: 1500,
        // 顏色
        color: '#8C8987',
        // 出現在螢幕中間
        location: 'center'
      }
    })

    closeDialog()
  } catch (error) {
    console.log(error)
    const text = error?.response?.data?.message || '發生錯誤，請稍後再試'
    createSnackbar({
      text,
      // 不要出現關閉的按鈕
      showCloseButton: false,
      // 要傳進 snackbarProps 元件的參數
      snackbarProps: {
        // 1.5 秒鐘後消失
        timeout: 1500,
        // 顏色
        color: 'error',
        // 出現在螢幕中間
        location: 'center'
      }
    })
  }
})

const addCart = async () => {
  if (!user.isLogin) {
    router.push('/login')
    return
  }
  try {
    const { data } = await apiAuth.patch('/users/cart', {
      product: product.value._id,
      quantity: quantity.value.value
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
    closeDialog()
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
}

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

// 123
// 表單對話框的開啟狀態
const dialog = ref(false)

const openDialog = () => {
  dialog.value = true
}

// 關閉對話框
const closeDialog = () => {
  dialog.value = false
  resetForm()
}

// 分類

const description01 = useField('description')

const autoUpdate = ref(true)
const friends = ref()
const isUpdating = ref(false)
const names = ref('')
const people = ref([
  { names: ' 頭 ' },
  { names: ' 頸 ' },
  { names: ' 肩 ' },
  { names: ' 背 ' },
  { names: ' 手 ' },
  { names: ' 臀 ' },
  { names: ' 腿 ' },
  { names: ' 腳底 ' },
  { names: ' 上半身 ' },
  { names: ' 下半身 ' },
  { names: ' 全身 ' }
])
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
