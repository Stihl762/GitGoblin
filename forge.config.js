import { VitePlugin } from '@electron-forge/plugin-vite'
import path from 'path'

export default {
  packagerConfig: {},
  rebuildConfig: {},
  plugins: [
    new VitePlugin({
      build: [
        {
          entry: 'src/main/index.js',
          config: 'vite.main.config.js'
        }
      ],
      renderer: [
        {
          name: 'main_window',
          config: 'vite.renderer.config.js'
        }
      ]
    })
  ]
}
