module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  // 按需配置element UI
  plugins: [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ]
  ]
}
