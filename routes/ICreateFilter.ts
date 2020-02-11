/**
 * @author leopold.kamp - Leopold Kamp
 * @date 2019-11-06 23:27:02
 */

export interface ICreateFilter {
  reload: boolean
  include?: string[]
  hasReload (): boolean
  /**
   * @param value The new reload value
   */
  setReload (value: boolean)

  /**
   * @param value the new include val string
   */
  setInclude (value: string)

  getInclude (): string[]
}
