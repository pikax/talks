<template>
  <div>
    <div v-if="loading">loading...</div>
    <div v-else-if="error">Error: {{error}}</div>
    <div v-else>{{ result }}</div>
  </div>
</template>
<script>
import { ref } from "@vue/composition-api";

function useFetch() {
  const loading = ref(false);
  const error = ref(null);
  const result = ref(null);

  const exec = async url => {
    loading.value = true;
    error.value = null;
    result.value = null;

    try {
      result.value = await fetch(url);
    } catch (error) {
      result.value = null;
      error.value = error;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    exec,
    result
  };
}

export default {
  setup(props, context) {
    const { 
      loading,
      error,
      exec,
      result 
    } = useFetch();

    return {
      loading,
      error,
      exec,
      result
    };
  }
};
</script> 