<template lang="pug">
v-parallax(
    height="300"
    src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg")

v-container
  v-row
    v-col(cols="12")
      h1.text-center 關於我們
    v-col(cols="12" style="white-space: pre-line")
      p 尋找一個讓身心完全放鬆，彷彿置身於日本風情的療癒空間嗎？我們誠摯地邀請您來到我們的日式拉伸店，體驗最純粹的放鬆與舒適。
      p 在這裡，我們將日本古老的拉伸技術與現代舒壓理念相結合，為您提供專業的拉伸服務，讓您的身體得到徹底的舒展與放鬆。無論您是辦公室白領、運動愛好者還是繁忙的家庭主婦，我們都能根據您的需求量身定製最適合您的拉伸方案。
      p 在我們的拉伸店裡，您將感受到日式禪意的氛圍，仿佛置身於一處寧靜的日本庭院。由我們經驗豐富的拉伸師傅為您提供專業的服務，配合舒緩的音樂與舒適的氛圍，讓您在身心皆得到放鬆與平靜的享受。
      p 無論您是想舒緩疲勞、改善姿勢、增加靈活性，還是純粹想享受一段愉悅的時光，我們都能滿足您的需求。讓我們帶您走進一段放鬆與療癒的旅程，讓您重拾活力，迎接美好的每一天。
    v-col(cols="12")
      p 當您感到疲憊、壓力山大時，一段舒適的按摩時光能夠為您帶來身心的放鬆與舒緩。我們專業的按摩師掌握著多種技術，針對不同部位的肌肉緊張和壓力進行針對性的放鬆，讓您重拾活力，舒展身心。以下是我們提供的不同部位的按摩技術：
      div &nbsp;
    v-col(cols="12" v-for='(link, i) in links' :key='i' )
      v-img(:src="link.src")
      h2.mt-4 {{ link.title }}
      p {{ link.p1 }}
      p {{ link.p2 }}
    v-col(cols="12")
      p 不論您是希望釋放壓力、舒緩肌肉緊張，還是想要享受一段身心放鬆的時光，我們的按摩技術將為您提供專業、舒適的服務，讓您感受到全新的活力和輕盈。

</template>

<script setup>
import { onMounted } from 'vue'

const links = [
  { src: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', title: '頭部、肩頸按摩：', p1: '通過溫和的按摩和輕柔的壓力，釋放頭部、肩頸部位的緊張和壓力。', p2: '針對頸椎周圍的肌肉進行輕微拉伸和按摩，促進血液循環，緩解頸部僵硬和不適。' },
  { src: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', title: '背部按摩：', p1: '以不同強度的按摩手法，從上至下覆蓋背部各個區域，釋放背部肌肉的壓力。', p2: '針對脊柱兩側的肌肉進行揉捏和推壓，改善姿勢，減輕背部疲勞和僵硬。' },
  { src: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', title: '上半身按摩：', p1: '聚焦於肩膀、手臂和背部等部位，針對性地緩解上半身的肌肉疲勞和不適。', p2: '透過拍打、揉捏和按壓，促進淋巴循環，幫助排除體內毒素，增加身體活力。' },
  { src: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', title: '下半身按摩：', p1: '聚焦於腰部、臀部、大腿和小腿等部位，舒緩下半身的肌肉疲勞和僵硬。', p2: '以揉捏、拉伸和按壓的手法，促進血液循環，減輕下半身的浮腫和不適感。' },
  { src: 'https://cdn.vuetifyjs.com/images/parallax/material2.jpg', title: '全身按摩：', p1: '綜合運用各種技術手法，從頭到腳全面放鬆肌肉，舒緩身心壓力。', p2: '幫助您重拾活力，提升整體身心的健康和幸福感。' }
]

onMounted(() => {
  // 将滚动位置重置到页面的顶部
  window.scrollTo(0, 0)
})

</script>

<style scoped lang="sass">
p
  font-size: 1.1rem
  font-weight: 300
  line-height: 1.5
  letter-spacing: 0.05em
  color: #d9d5d2
  padding: 1rem

h1
  color: #d9d5d2
  font-size: 3rem
</style>
