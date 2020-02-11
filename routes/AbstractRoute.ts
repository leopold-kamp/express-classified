/**
 * @author leopold.kamp - Leopold Kamp
 * @date 2019-10-05 11:37:05
 */
import * as express from 'express'
import RoutesConfig from './RoutesConfig'
import * as _ from 'lodash'
import { IFilter } from './IFilter'
import { AbstractEntity } from '../entity/AbstractEntity'
import { ERequestType } from './Response'

export abstract class AbstractRoute {

  protected static getAllowedMethods (path: any) {
    let config: any = RoutesConfig
    let endpointConfig: any = config[path]
    if (endpointConfig !== undefined && ('allowed' in endpointConfig)) {
      return config[path].allowed
    } else {
      return ['OPTIONS']
    }
  }

  protected static getPath (req: any) {
    let path = req.path
    return path
  }

  protected router: any

  public constructor (endpointConfig: any) {
    this.router = express.Router({ mergeParams: true })
    let options = {
      allowedMethods: [],
      class: this.constructor.name
    }
    if (endpointConfig !== undefined) {
      if (endpointConfig.view !== undefined) {
        // @ts-ignore
        options.allowedMethods.push('GET')
        this.router.get(endpointConfig.view,  (req: express.Request, res: express.Response) => {
          this.view(req, res)
        })
      }
      if (endpointConfig.list !== undefined) {
        if (options.allowedMethods.length === 0) {
          // @ts-ignore
          options.allowedMethods.push('GET')
        }
        this.router.get(endpointConfig.list, (req: express.Request, res: express.Response) => {
          this.list(req, res)
        })
      }
      if (endpointConfig.create !== undefined) {
        // @ts-ignore
        options.allowedMethods.push('POST')
        this.router.post(endpointConfig.create, (req: express.Request, res: express.Response) => {
          this.create(req, res)
        })
      }
      if (endpointConfig.update !== undefined) {
        // @ts-ignore
        options.allowedMethods.push('PATCH')
        this.router.patch(endpointConfig.update,  (req: express.Request, res: express.Response) => {
          this.update(req, res)
        })
      }
      if (endpointConfig.delete !== undefined) {
        // @ts-ignore
        options.allowedMethods.push('DELETE')
        this.router.delete(endpointConfig.delete,  (req: express.Request, res: express.Response) => {
          this.delete(req, res)
        })
      }
    }
    // @ts-ignore
    options.allowedMethods.push('OPTIONS')
    if (endpointConfig !== undefined && options.allowedMethods.length > 0) {
      let middleware = this.middlewareBuilder(options)
      this.router.use(middleware)
    }
  }

  public getRouter () {
    return this.router
  }

  public middlewareBuilder (options: any) {
    let className = options.class + ''
    return (req: any, res: any, next: any) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authentication')
      let path = AbstractRoute.getPath(req)
      let methods = AbstractRoute.getAllowedMethods(path).toString()
      res.header('Access-Control-Allow-Methods', methods)
      res.header('Access-Control-Expose-Headers', 'Location')
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json')
      }
      next()
    }
  }

  protected abstract getFilter (): IFilter

  protected setLocation (req: any, res: any, location: any) {
    let path = AbstractRoute.getPath(req)
    if (location === null || location === undefined) {
      res.location(path)
    } else {
      res.location(`${path}/${location}`)
    }
  }

  protected view (req: express.Request, res: express.Response) {
    res.send({
      code: 200,
      message: 'Route not defined'
    })
  }
  protected list (req: express.Request, res: express.Response) {
    res.send({
      code: 404,
      message: 'Route not defined'
    })
  }
  protected create (req: express.Request, res: express.Response) {
    res.send({
      code: 404,
      message: 'Route not defined'
    })
  }
  protected update (req: express.Request, res: express.Response) {
    res.send({
      code: 404,
      message: 'Route not defined'
    })
  }
  protected delete (req: express.Request, res: express.Response) {
    res.send({
      code: 404,
      message: 'Route not defined'
    })
  }

  protected getIdOrFail (req: any, param: string ) {
    let id = _.toNumber(req.params[param])
    if (_.isNaN(id)) {
      throw new Error( param + ' ist No a Number')
    }
    return id
  }

  /**
   * Get Filter Options from Request
   * @param req
   * @param type
   */
  protected getFilterOptions (req: express.Request, type: ERequestType) {
    let options: any = {}
    let filters: any[] | undefined = []
    if (type === ERequestType.LIST && this.getFilter().list !== undefined) {
      filters = this.getFilter().list
    } else {
      return options
    }
    _.forEach(filters, (element: any) => {
      /**
       * if current element is a string.
       */
      if (_.isString(element)) {
        if (req.query[element] !== undefined) {
          let opt = req.query[element]
          if (_.isNumber(opt)) {
            opt = _.toNumber(opt)
          }
          options[element] = opt
        }
      } else {
        let prefix = _.keys(element)[0]
        let match = ''
        _.forEach(element[prefix], (subElement) => {
          match = prefix + subElement
          if (req.query[match] !== undefined) {
            let tmpObj: any = {}
            let key = _.lowerFirst(subElement)
            let opt = req.query[match]
            if (_.isNumber(opt)) {
              opt = _.toNumber(opt)
            }
            tmpObj[key] = opt
            options[prefix] = tmpObj
            return
          }
        })
      }
    })
    return options
  }

  /**
   *
   * @param req
   * @param entity
   */
  protected getEmbedOptions (req: express.Request, entity: AbstractEntity): string[] {
    let embedParam = req.query.embeds
    if (_.isString(embedParam)) {
      let embedArr = embedParam.split(',')
      let embeds = entity.checkEmbeds(embedArr)
      return embeds
    } else {
      return []
    }
  }
}
