import { v4 } from "https://deno.land/std@0.93.0/uuid/mod.ts"
import MemoryStore from '../stores/MemoryStore.ts'

export default class SessionData {
  public id: any
  public store: any

  constructor (store?: any) {
    this.store = store || new MemoryStore
  }

  createSession() {
    const newId = v4.generate()
    this.id = newId
    this.store.createSession(this.id)
    return newId
  }

  getSession(id: string) {
    this.id = id
    return this
  }

  get(key: string) {
    return this.store.getSessionVariable(this.id, key)
  }

  set(key: string, value: any) {
    this.store.setSessionVariable(this.id, key, value)
  }
}