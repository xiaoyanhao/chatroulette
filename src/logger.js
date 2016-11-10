export const log = function () {
  let array = ['From client:']
  array.push.apply(array, arguments)
  console.log.apply(console, array)
}

export const reportError = error => {
  console.error(error.name, ':', error.message)
}
