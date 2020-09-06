export function isLocationMatch(
  s: string,
  matchPrefix: boolean = false
): boolean {
  let hash = window.location.hash
  if (!hash || hash === '#') {
    hash = '#/'
  }
  if (matchPrefix) {
    return hash.indexOf(`#${s}`) === 0
  } else {
    return hash.trim() === `#${s}`
  }
}

export function isLocationMatchPrefix(s: string): boolean {
  return isLocationMatch(s, true)
}

export function getPathInLocationHash(): string {
  const hash = window.location.hash
  const pos = hash.indexOf('?')
  if (pos === -1) {
    return hash
  }
  return hash.substring(0, pos)
}
