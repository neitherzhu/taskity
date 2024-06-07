import type { ResolveOptions } from 'webpack'
import path from 'path'

export const alias: Required<ResolveOptions>['alias'] = {
  '@app': path.resolve(__dirname, './src/app/')
}
