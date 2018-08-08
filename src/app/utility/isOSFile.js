function isOSFile(path = '') {
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
