var log = console.log
var install = require('transformer-installer')
var transformer = require('./')

module.exports = {
  ensureModulesAreInstalled: ensureModulesAreInstalled,
  catchMissingModulesErr: catchInstallErr,
}

function stringModuleIds(str) {
  var re = /transformer\.([a-z0-9-.]+)/ig;
  var matches = [];
  var match;
  while (match = re.exec(str)) {
    matches.push(match[1]);
  }
  return matches;
}

function handleRequiresModulesError(ids) {
  log(install.explanation(ids))
  process.exit(-1)
}

function ensureModulesAreInstalled(ids, global) {
  missing = transformer.loader.missingModules(ids, global)
  if (missing.length > 0)
    handleRequiresModulesError(missing)
}

function catchInstallErr(func) {
  try {
    func()
  } catch (e) {
    if (transformer.loader.errIsModuleNotFound(e)) {
      var m = stringModuleIds(e.toString())
      handleRequiresModulesError(m)
    } else {
      throw e;
    }
  }
}
