/**
 * @author leopold.kamp - Leopold Kamp
 * @date 2019-10-05 11:36:53
 */
import * as _ from 'lodash'

export abstract class AbstractEntity {

  public abstract getFillable (): string[]

  public fill (json: any) {
    let self: any = this
    let fillable = this.getFillable()
    fillable.forEach((value, key) => {
      if (_.isUndefined(json[value])) {
        return
      } else {
        self[value] = json[value]
      }
    })
  }

  public checkEmbeds (toTest: string[]) {
    return _.intersection(this.getEmbeds(), toTest)
  }

  public getEntityName (): string {
    return this.constructor.name
  }

  protected abstract getEmbeds (): string[]
}
