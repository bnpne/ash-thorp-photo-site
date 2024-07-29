export const doWait = from => {
  return useState('waiting', () => {
    if (from) {
      if (from === '/') {
        return true
      } else {
        return false
      }
    }
    return false
  })
}
