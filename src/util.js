export default {
  log (text) {
    const time = new Date()
    console.log('[' + time.toLocaleString() + '] ' + text)
  },

  trace (text) {
    const time = new Date()
    console.trace('[' + time.toLocaleString() + '] ' + text)
  }
}
