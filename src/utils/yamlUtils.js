import yaml from  'js-yaml'

const jsonLoadOptions = {
  schema: yaml.DEFAULT_SCHEMA,
}

const jsonDumpOptions = {
  schema: yaml.DEFAULT_SCHEMA,
  lineWidth: -1,
}

export function loadYaml(yamlData) {
  let jsonData = yaml.load(yamlData.replaceAll('>-', '|-'), jsonLoadOptions)
  return jsonData
}

export function dumpYaml(jsonData) {
  let yamlData = yaml.dump(jsonData, jsonDumpOptions)
  return yamlData.replaceAll('|-', '>-')
}
