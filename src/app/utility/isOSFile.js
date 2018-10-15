// @flow strict

function isOSFile(path: string = ''): boolean {
  if (
    path.toLowerCase().endsWith('.ds_store')
    || path.toLowerCase().endsWith('thumbs.db')
    || path.toLowerCase().endsWith('ethumbs.db')
  ) {
    return true;
  }
  return false;
}

export default isOSFile;
