---
# try also 'default' to start simple
theme: vuetiful
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://source.unsplash.com/collection/94734566/1920x1080
# apply any windi css classes to the current slide
class: "text-center"
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# show line numbers in code blocks
lineNumbers: false
# some information about the slides, markdown enabled
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# persist drawings in exports and build
drawings:
  persist: false

altCover: true
---

# Deep dive on Vue 3 types

Understanding `defineComponent`

<style>
  code {
    color:#42b883;
    font-weight:bold
  }
</style>

---

Vue 3 is built using typescript.

<!-- <div v-click > -->
  <!-- <img v-click src="public/languages/vue-core-languages.png"> -->

![VueCore Language](/languages/vue-core-languages.png)

<!-- </div> -->

<div v-click>

Vue 2 is built using javascript (with [`Flow`](https://flow.org/)) <span style="font-size:9px">[For now](https://github.com/vuejs/vue/pull/12001)</span>

<!-- <img  src="public/languages/vue-vuejs-languages.png"> -->

![VueCore Language](/languages/vue-vuejs-languages.png)

</div>

---

# What is a Vue Component?

Source: [Vue.js docs](https://vuejs.org/guide/essentials/component-basics.html)

Components allow us to split the UI into independent and reusable pieces, and think about each piece in isolation. It's common for an app to be organized into a tree of nested components:

![Components](/components.png)

---

# Vue Component Typescript

<v-clicks>
Vue component contain different types depending on the context:

- Component Options `(Not only Options API)`

</v-clicks>

<v-clicks>

```ts
const MyComp = defineComponent({
  props: ['bar']
  data: ()=>  ({ foo: 1 }),
  computed: {
    odd() {
      return this.bar + this.foo;
    },
  },
});
```

- Render Component

```tsx
<MyComp ref="comp" :bar="3" />
```

- Public Instance

```ts
this.$refs.comp.foo; // 1
```

</v-clicks>

---

# Options

Options is the way we declare a component in Vue (using Options API, Composition-API, Function API or [Class API\*](https://github.com/vuejs/vue-class-component))

<div class="flex flex-row">
<div class="flex-auto ">

It requires some overloads for `defineComponent`:

- Function component

- No properties component

- Array declaration props component

```ts
defineComponent({ props: ["foo", "bar"] });
```

- Object props component

```ts
defineComponent({ props: { foo: Number } });
```

</div>

<div class="w-1/3">

```ts {monaco}
import { defineComponent } from "vue";

defineComponent({
  data: () => ({ foo: 1 }),
  mounted() {
    this.foo = 1;
  },
});
```

</div>

</div>

<footer class="absolute bottom-2 left-0 right-0 p-2">* plugin</footer>

---

# Render Component

Render component is the TSX compatible usually used in the `<template>`

```ts {monaco}
import { defineComponent, h } from "vue";
const Comp = defineComponent({ props: { foo: Number } });

h(Comp, { foo: 1 }); // equivalent to <Comp foo={1} />;
// @ts-expect-error foo should be a number
h(Comp, { foo: "1" });
```

For this to work it needs to a constructor and have `$props` (and other `$` properties)

```ts {monaco}
import { h } from "vue";
declare const Comp: { new (): { $props: { foo: number } } }; // Fake vue render component

// @ts-expect-error required prop
h(Comp, {});
// @ts-expect-error foo should be number
h(Comp, { foo: "1" });
h(Comp, { foo: 1 });
```

---

# Public Instance

Component proxy (aka `this`, `getCurrentInstance().proxy` and `Template Ref`)

```tsx {2-8|9-10|11-12}
import { defineComponent } from "vue";
// Options
const MyComp = defineComponent({
  props: ["a"],
  mounted() {
    console.log(this.a);
  },
});
// Composition API
getCurrentInstance().proxy
// Template ref
<my-comp ref="(e)=>e">
```

---

# `defineComponent`

> defineComponent is a utility that is primarily used for type inference when declaring components.

<!--
To be able to "glue" these 3 types together we have the utility [defineComponent](https://github.com/vuejs/core/blob/140f08991727d7c15db907eea5a101979fe390b2/packages/runtime-core/src/apiDefineComponent.ts#L81-L190) -->

It has 4 overloads where only the **option** type changes:

- [Functional Component](https://vuejs.org/guide/extras/render-function.html#functional-components)

```ts
defineComponent((props) => h("div", "Hello World " + props.name));
```

- No properties component

```ts
defineComponent({
  render() {
    return h("div", "Hello World");
  },
});
```

- Array declaration props component

```ts
defineComponent({
  props: ["name"],
  render() {
    return h("div", "Hello World " + this.name);
  },
});
```

- Object props component

```ts
defineComponent({
  props: { name: String },
  render() {
    return h("div", "Hello World " + this.name);
  },
});
```

All of them return [DefineComponent](https://github.com/vuejs/core/blob/140f08991727d7c15db907eea5a101979fe390b2/packages/runtime-core/src/apiDefineComponent.ts#L33-L79)

---

# `defineComponent` Functional Component

<div class="two-columns grid grid-cols-2" style="direction:rtl">

<div style="direction:ltr">

```ts {0-3|4-7|8|all}
// overload 1: direct setup function
// (uses user defined props interface)
function defineComponent<Props, RawBindings = object>(
  setup: (
    props: Readonly<Props>,
    ctx: SetupContext
  ) => RawBindings | RenderFunction
): DefineComponent<Props, RawBindings>;
```

</div>

<div style="direction:ltr">

<v-clicks at="0">

- Generics:

  - Props: Props type
  - RawBindings: Type if what's returned is an object

- Setup: Render function

- Return: `DefineComponent` with props and with `RawBindings`

</v-clicks>

</div>

</div>

---

# `defineComponent` Options API + Composition-API

Options API and Composition-API are handled by the same overloads, this allows the
usage of both API on the same component:

```ts
defineComponent({
  setup: () => ({ foo: 1 }),
  mounted() {
    this.foo; //1
  },
});
```

To handle different props declaration we have 3 more overloads, all of them are built on top of [ComponentOptionsBase](https://github.com/vuejs/core/blob/140f08991727d7c15db907eea5a101979fe390b2/packages/runtime-core/src/componentOptions.ts#L108-L203)

---

# LegacyOptions

<div class="two-columns grid grid-cols-2" style="direction:rtl">

<div style="direction:ltr">

```ts {0-8|2,9|3,9|4,10|5,11|6,12|7,13|14-20|all}
interface LegacyOptions<
  Props,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin
> {
  data?: (/* Props, is used here. omitted*/) => D;
  computed?: C;
  methods?: M;
  mixins?: Mixin[];
  extends?: Extends;
  watch?: ComponentWatchOptions;
  provide?: Data | Function;
  inject?: ComponentInjectOptions;

  // allow any custom options
  [key: string]: any;

  /* code omitted */
}
```

</div >
<div style="direction:ltr">

This are options focused for Options API specific.

<v-clicks at="1">

- Props: Properties with type `PropType`

- D: aka `Data`, returned from `data()`

- C: aka `computed` options object

- M: aka `methods` options object

- Mixin: Extending based on mixin array

- Extends: Extending based on Extends

- Others: `Watch`, `provide`, `inject`, etc

</v-clicks>

</div>

</div>

---

# ComponentOptionsBase

<div class="two-columns grid grid-cols-2" style="direction:rtl">

<div style="direction:ltr">

```ts {1-14|3|9-10|11|2-3,15-18|19-26|all}
export interface ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  E extends EmitsOptions,
  EE extends string = string,
  Defaults = {}
> extends LegacyOptions<Props, D, C, M, Mixin, Extends>,
    ComponentInternalOptions,
    ComponentCustomOptions {
  setup?: (
    props,
    ctx: SetupContext<E>
  ) => /**/ RawBindings | RenderFunction | void;
  name?: string;
  template?: string | object;
  render?: Function;
  components?: Record<string, Component>;
  directives?: Record<string, Directive>;
  inheritAttrs?: boolean;
  emits?: (E | EE[]) & ThisType<void>;
  expose?: string[];
}
```

</div >
<div style="direction:ltr">

Options used for OptionsAPI and Composition-API

<v-clicks at="1">

- RawBindings: Return from `setup()`

- E & EE: Emit options & Emit options keys

- Defaults: Property defaults

- Setup

- Others

</v-clicks>

<style>
  .slidev-code {
    /*not pretty but there's too much code here*/
    margin-top: -5em!important
  }
</style>

</div>

</div>

---

# Component Options

<div class="two-columns grid grid-cols-2" style="direction:rtl">

<div style="direction:ltr">

```ts {1-4|6-9|11-14|all}
type ComponentOptionsWithoutProps</* Generics */> = {
  props?: undefined;
} & ComponentOptionsBase</* Generics */> &
  ThisType<CreateComponentPublicInstance</* Generics */>>;

type ComponentOptionsWithArrayProps<PropNames /**/> = {
  props: PropsNames[];
} & ComponentOptionsBase</* Generics */> &
  ThisType<CreateComponentPublicInstance</* Generics */>>;

type ComponentOptionsWithObjectProps<PropsOptions /**/> = {
  props: PropsOptions & ThisType<void>;
} & ComponentOptionsBase</* Generics */> &
  ThisType<CreateComponentPublicInstance</* Generics */>>;
```

</div>

<div style="direction:ltr">

- `ComponentOptionsWithoutProps`

<v-clicks at="1">

- `ComponentOptionsWithArrayProps`

- `ComponentOptionsWithObjectProps`

</v-clicks>

</div>

</div>

<style>
  .slidev-code {
    width: 105%
  }
</style>

---

# `defineComponent` overloads

<div class="two-columns grid grid-cols-2" style="direction:rtl">

<div style="direction:ltr">

```ts {1-6|8-10|12-15|16-19|20-23|all}
function defineComponent<Props, RawBindings = object>(
  setup: (
    props: Readonly<Props>,
    ctx: SetupContext
  ) => RawBindings | RenderFunction
): DefineComponent<Props, RawBindings>;

function defineComponent</* Generics */>(
  options: ComponentOptionsWithoutProps</**/>
): DefineComponent</**/>;

function defineComponent</* Generics */>(
  options: ComponentOptionsWithArrayProps</**/>
): DefineComponent</**/>;

function defineComponent</* Generics */>(
  options: ComponentOptionsWithObjectProps</**/>
): DefineComponent</**/>;

export function defineComponent(options: unknown) {
  return isFunction(options) ? { setup: options, name: options.name } : options;
}
```

</div>

<div style="direction:ltr">

- `Direct Setup Function`: Functional component

<v-clicks at="1">

- `No props`

- `Array props`

- `Object props`

- Actual implementation

</v-clicks>

</div>

</div>

---

# DefineComponent

<div class="two-columns grid grid-cols-2" style="direction:rtl">

<div style="direction:ltr">

```ts {all|1-4|5|6|all}
type DefineComponent</* Generics */> = ComponentPublicInstanceConstructor<
  CreateComponentPublicInstance</*Generics*/> & Props
> &
  ComponentOptionsBase</* Generics */> &
  PP;
```

</div>

<div style="direction:ltr">

Return type of `defineComponent`, containing Render Component and Public Instance

<v-clicks at="1">

- `Render Component` & `Instance Component`

- `Options`

- Public props: [VNodeProps](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/vnode.ts#L93-L106), [AllowedComponentProps](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/component.ts#L78-L84) and [ComponentCustomProps](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/component.ts#L73-L76)

</v-clicks>

</div>

</div>

---

# Usage

```html {2-6|8-9|11-12|14-17}
<script setup>
  import { ref } from 'vue';
  import MyComponent from './MyComponent.vue';

  // Accessing component options *
  const ComponentOptions = MyComponent.props

  // Instance Component Type
  type MyComponentInstance = ReturnType<typeof MyComponent>

  // Instance Component
  const compEl = ref<MyComponentInstance | null>(null)
</script>
<template>
  <!-- Render Component -->
  <my-component ref="compEl">
</template>
```

<footer class="absolute bottom-2 left-0 right-0 p-2">

- \* Not yet correct typed, waiting for [@vuejs/core#5416](https://github.com/vuejs/core/pull/5416)

</footer>

---

# Testing types

- You can use `TSX` or import `h`.

  - `TSX` allows greater control and better errors
  - `h` errors are a bit cryptic

- [Volar](https://github.com/johnsoncodehk/volar) and [VueDX](https://github.com/vuedx/languagetools) both use TSX syntax for Typechecking.

---

# Augmenting Components

```ts
import { defineComponent, DefineComponent } from "vue";
interface KnownAttributes {
  special: number;
}
function augmentComponentProps<T extends DefineComponent<any, any, any>>(
  t: T
): T & { new (): { $props: KnownAttributes } } {
  return t;
}
const Comp = augmentComponentProps(
  defineComponent({
    props: {
      test: Number,
    },
  })
);

<Comp test={1} special={2} />;
// @ts-expect-error invalid special
<Comp test={1} special={"2"} />;
// @ts-expect-error invalid test
<Comp test={"1"} special={2} />;
```

- [source](https://www.typescriptlang.org/play?jsx=1#code/JYWwDg9gTgLgBAbzgEwKYDNgDtUGELgQ5YwA0cAIhtngZMfAL5zpQFwDkAbgK6ocBuAFBDsMVFHQBDAMao4AaSwQA7lgCCMGFGAAjHuIDOiIXDNxDYVDOBSANgC44WHiF0TSQxiPQ8sMmGAiOCkeAHMQVBJ8QgYABTYwQwAeABU4VAAPcSxkYypMHBj6KJhkqSwAT3IK6pCqgD4GgAoYJ1SASna4ADJEZ1QVZq7+gBIwRMMnJVUNLR19IzhmZgRTcyhUGB4oLDgYLxEZIkN4YrgAXhDwyOi6IlKEiCTmtELaWNLmtfM4CeepiZfr8jG04AA5VzuKDrMzeRgdDrCITNZLnUEXBAARmYlmstjsmIATMwAPQNJFCUmkuAAARghgAtFkrAFmVA2FA4NguPZgMgLKyCSi0XR9qhTpicYL8fZMRwiRwyRThNS6QzmZlWTB2ZzuVheXZ+eLTiL0RKYPKsUqZTY5QgSXByZSgA)

---

# Level up with Generic props

```ts
import { defineComponent, DefineComponent } from "vue";
declare class GenericTypedProps<T> {
  declare $props: {
    value: T;
    onChange: (e: T) => void;
  };
}
function augmentComponentProps<T extends DefineComponent<any, any, any>>(
  t: T
): T & typeof GenericTypedProps {
  return t;
}
const Comp = augmentComponentProps(defineComponent({}));

<Comp value={2} onChange={(e) => e + 1} />;
// @ts-expect-error invalid change
<Comp value={{ a: 1 }} onChange={(e) => e + 1} />;
```

- [source](https://www.typescriptlang.org/play?jsx=1#code/JYWwDg9gTgLgBAbzgEwKYDNgDtUGELgQ5YwA0cAIhtngZMfAL5zpQFwDkAbgK6ocBuAFBoAxgBsAhlFRwJkgM4K4AcVQ4owUQBUAnmFTIACmzAKAPNoB8iIXHspU8mXAAkYUwoBcth37hckuJ8Ptqkdv72RLgAFpJYAOaoPgAUyXDaAJRwALw2XBDAyBH2jEJl6DxYojDARHCSPAkg6jD4hAwmEGaWcKgAHjDqyMpUmDjt9K3m8brks-NYulZWKTChmaFwAGRwMPqoEOiq6qiaOgfGnr4OMjA8UFh75UKiRArwk7kNTS0kk0RWl0zCk0ONaB1WikEIxMplhEIUuYvoFgqgcggAEzMaJxRLohCyPJ9OAAajgAEZmAB6KzwoTU6lwAACMAUAFoBgYapyoGwoHBsKiinI8UlEci6AEgnwMUhJD4KXBGDisLF4kkMUSbLJyVS4LT6UA)

---

# Thank you

You can check this talk on

## [github.com/pikax/talks/tree/master/2022-04-28](https://github.com/pikax/talks/tree/master/2022-04-28)
