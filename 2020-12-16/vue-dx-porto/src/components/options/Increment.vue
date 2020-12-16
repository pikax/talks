<template>
	<p>Value: {{value}}</p>
	<button @click="click">Increment</button>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	props: {
		value: {
			type: Number,
			required: true
		},
	},
	
	methods: {
		click() {
			const v = this.value + 1
			this.$emit('update:value', v)
			return v
		}
	}
})
</script>
