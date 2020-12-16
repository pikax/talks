
// still needed because the tsplugin is not currently working,
// this allows the test to still be valid
declare module '*.vue' {
  import { DefineComponent } from "vue";
  const t: DefineComponent<unknown>
  export default t
}