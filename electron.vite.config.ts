import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import svgLoader from 'vite-svg-loader'
import AutoImport from 'unplugin-auto-import/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@main': resolve('src/main')
      }
    },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/renderer/src/icons')], // 指定 SVG 图标存放路径
        symbolId: 'icon-[name]', // 定义 symbolId 格式
        inject: 'body-last', // 插入位置，可选值为 'body-first' 或 'body-last'
        customDomId: '__svg__icons__dom__' // SVG 元素的自定义 ID
      }),
      AutoImport({
        // 指定要自动导入的库
        imports: [
          'vue',
          'vue-router',
          {
            '@renderer/utils/electronAPI/index': [
              // 列出你需要自动导入的函数或变量名
              'electron'
            ]
          }
        ],
        // 生成TypeScript声明文件
        dts: 'src/auto-imports.d.ts'
        // 其他配置选项...
      })
    ],
    // optimizeDeps: {
    //   include: ['vue3-particles']
    // },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or "modern", "legacy"
          importers: [
            // ...
          ]
        }
      }
    }
  }
})
