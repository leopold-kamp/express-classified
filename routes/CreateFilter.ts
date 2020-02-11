import { ICreateFilter } from './ICreateFilter'

/**
 * @author leopold.kamp - Leopold Kamp
 * @date 2019-11-06 23:37:14
 */

const RELOAD = 'reload'
const INCLUDE = 'include'

export class CreateFilter implements ICreateFilter {
  public reload: boolean = false
  public include?: string[]
  constructor (query: any[]) {
    if (query[RELOAD] !== undefined && query[RELOAD] === '1') {
      this.setReload(true)
    }
    if (query[INCLUDE] !== undefined) {
      this.setInclude(query[INCLUDE])
    }
  }

  public setInclude (value: string) {
    this.include = value.split(',')
  }

  public setReload (value: boolean) {
    this.reload = value
  }

  public getInclude (): string[] {
    return this.include
  }

  public hasReload (): boolean {
    return this.reload
  }
}
