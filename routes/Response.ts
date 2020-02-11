import { AbstractEntity } from '../entity/AbstractEntity'

/**
 * @author leopold.kamp - Leopold Kamp
 * @date 2019-11-06 23:50:07
 */
export class Response<T extends AbstractEntity> {
  protected message?: string
  protected success: boolean
  protected requestType: ERequestType
  protected entityName: string
  protected code?: number
  protected data?: T

  constructor (success: boolean, requestType: ERequestType, entityName: string = 'Enitity') {
    this.success = success
    this.requestType = requestType
    this.entityName = entityName
    if (success === true) {
      switch (requestType) {
        case ERequestType.CREATE:
        case ERequestType.UPDATE:
          this.setCreated()
          break
        case ERequestType.LIST:
        case ERequestType.VIEW:
        case ERequestType.DELETE:
          this.setOk()
          break
        default:
          this.setOk()
      }
    } else {
      switch (requestType) {
        case ERequestType.CREATE:
        case ERequestType.UPDATE:
          this.code = 403
          break
        case ERequestType.LIST:
        case ERequestType.VIEW:
        case ERequestType.DELETE:
          this.code = 404
          break
        default:
          this.code = 400
      }
    }
  }

  public setOk () {
    this.code = 200
    this.message = 'OK'
    this.success = true
    return this
  }

  public setCreated () {
    this.code = 201
    this.message = `New ${this.entityName} was created.`
    this.success = true
    return this
  }

  public setConflict () {
    this.code = 409
    this.message = `${this.entityName} already exists or could not be created.`
    this.success = false
    return this
  }

  public setNotFound () {
    this.code = 404
    this.message = `${this.entityName} was not found.`
    this.success = false
    return this
  }

  public setUnauthorized () {
    this.code = 401
    this.message = 'You are not Authorized to use this resource'
    this.success = false
    return this
  }

  public setForbidden () {
    this.code = 403
    this.message = 'You cannot use this resource'
    this.success = false
    return this
  }

  public setTeaPot () {
    this.code = 418
    this.message = 'Coffee not found, use Teapot instead.'
    this.success = false
    return this
  }

  public setMessage (message: string) {
    this.message = message
    return this
  }

  public setData (data: T) {
    this.data = data
    return this
  }

  public send (res: any) {
    let response: any = {
      code: this.code,
      message: this.message
    }
    if (this.data !== undefined) {
      response.data = this.data
    }
    res.status(this.code).send(response)
  }
}

export enum ERequestType {
  CREATE,
  DELETE,
  LIST,
  VIEW,
  UPDATE
}
