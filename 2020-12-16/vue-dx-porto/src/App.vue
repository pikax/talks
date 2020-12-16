<template>
  <p>Boa tarde Vue Porto</p>

  <div>
    <p>Increment OptionAPI:</p>
    <IncrementOption v-model:value="value"/>
  </div>
  <div>
    <p>Increment CompositionAPI:</p>
    <IncrementComposition v-model:value="value"/>
  </div>
</template>

<script>
import IncrementOption from './components/options/Increment.vue';
import IncrementComposition from './components/composition/Increment.vue';

export default {
  name: 'App',
  components: {
    IncrementOption,
    IncrementComposition
  },

  data(){
    return {
      value: 0
    }
  }
}
</script>
