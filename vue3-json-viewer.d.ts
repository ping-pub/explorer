declare module 'vue3-json-viewer' {
    import { AllowedComponentProps, App, Component, ComponentCustomProps, VNodeProps } from 'vue'
    interface JsonViewerProps {
        value: Object | Array<any> | string | number | boolean; // Object
        expanded: boolean; // Whether to automatically expand
        expandDepth: number; // Expand depth
        copyable: boolean | object; // Whether it is copyable
        sort: boolean; // Whether to sort
        boxed: boolean; // Whether boxed
        theme: string; // Theme jv-dark | jv-light
        previewMode: boolean; // Whether it is copyable
        timeformat: (value: any) => string // Time format function
    }
    type JsonViewerType = JsonViewerProps & VNodeProps & AllowedComponentProps & ComponentCustomProps
    const JsonViewer: Component<JsonViewerType>
    export { JsonViewer }
    const def: { install: (app: App) => void }
    export default def
}
