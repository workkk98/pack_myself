export const dynamicImport = (filename) => {
  return import(`./locale/${filename}`)
}