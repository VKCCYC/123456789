<template lang="pug">
v-footer.vf
  v-container
    v-row
      v-col(cols="12")
        h1 出來喬

    v-row(justify='center', no-gutters='')
      v-btn.mx-2(v-for='link in links', :key='link', color='#d9d5d2', variant='text', rounded='xl')
        | {{ link }}
      v-col.text-center.mt-4(cols='12')
        | {{ new Date().getFullYear() }} &mdash;
        strong Vuetify

</template>

<script setup>
const links = [
  'Home',
  'About Us',
  'Team',
  'Services',
  'Blog',
  'Contact Us'
]
</script>

<style scoped lang="sass">
h1
  color: #d9d5d2
  font-size: 3rem
.vf
  background-color: #28231F
</style>
