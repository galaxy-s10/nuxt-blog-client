class HeartBeat {
  // 这个ws是data里面的wsInstance
  constructor(ws) {
    this.ws = ws
  }

  ws = null
  timeout = 1000
  timeoutObj = null
  serverTimeoutObj = null

  reset() {
    clearTimeout(this.timeoutObj)
    clearTimeout(this.serverTimeoutObj)
    return this
  }

  start() {
    this.timeoutObj = setTimeout(() => {
      this.serverTimeoutObj = setTimeout(() => {
        this.ws.close()
      }, this.timeout)
    }, this.timeout)
  }
}

export default HeartBeat
