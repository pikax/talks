<template>
	<p>Value: {{value}}</p>
	<button @click="click">Increment</button>
</template>
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import { useVModel } from "vue-composable";

export default defineComponent({
	props: {
		value: {
			type: Number,
			required: true
		},
  },
  
  setup(props){
    const value = useVModel(props, 'value');
    const click = () => ++value.value;

    return {
      value,
      click,
    }
  },
})
</script>
