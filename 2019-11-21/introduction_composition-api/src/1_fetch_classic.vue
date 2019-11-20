<template>
  <div>
    Fetch example: Classic
    <div v-if="loading">loading...</div>
    <div v-else-if="error">Error: {{error}}</div>
    <div v-else>{{ result }}</div>
  </div>
</template>
<script>
export default {
  props: {
    url: String
  },
  data: {
    loading: false,
    result: null,
    error: null
  },
  methods: {
    async fetch() {
      this.loading = true;
      this.error = null;
      try {
        this.result = await fetch(this.url);
      } catch (e) {
        this.result = null;
        this.error = e;
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>