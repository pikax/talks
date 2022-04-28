import { defineMonacoSetup } from "@slidev/types";

export default defineMonacoSetup(async (monaco) => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    // ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
    // jsx: 2,
    // jsx: monaco.languages.typescript.JsxEmit.Preserve,

    // typeRoots: ["node_modules/@types"],

    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.Preserve,
    // reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
    // module: 99,
    // target: 99

    // jsx: 'preserve',
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  return {
    theme: {
      dark: "vs-dark",
      light: "vs",
    },
  };
});
