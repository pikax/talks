<template>
  <div>
    Fetch example: Classic
    <div v-if="loading">loading...</div>
    <div v-else-if="error">Error: {{error}}</div>
    <div v-else>{{ result }}</div>
  </div>
</template>
<script>
const fetchMixin = {
  data() {
    return {
      loading: false,
      result: null,
      error: null
    };
  },

  methods: {
    async fetch(url) {
      this.loading = true;
      this.error = null;
      try {
        this.result = await fetch(url);
      } catch (e) {
        this.result = null;
        this.error = e;
      } finally {
        this.loading = false;
      }
    }
  }
};

export default {
  props: {
    url: String
  },
  mixins: [fetchMixin]
};
</script>