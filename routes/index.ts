import { AbstractRoute } from './AbstractRoute'
import * as _ from 'lodash'
import { IFilter } from './IFilter'

const URL = '/'

const endpoints = {
}

class Home extends AbstractRoute {
  protected router: any
  constructor () {
    super(endpoints)
    /**
     * add routes
     * @example this.router.use(URL, new Users().getRouter())
     */
  }

  protected getFilter (): IFilter {
    return {
      list: []
    }
  }
}
export default Home
