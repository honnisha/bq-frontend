import yaml from  'js-yaml'
import JSZip from 'jszip'

async function loadConversationsConfig(ymlData) {
  return ymlData
}

const subSections = ['conversations', 'menus']

function loadModule(sectionName, content) {
  const nameSplit = sectionName.split('/')
  let sectionData = {
    section: nameSplit[0],
    fileType: nameSplit[1].replace('.yml', ''),
    data: {},
  }
  if (subSections.indexOf(sectionData.fileType) >= 0) {
    sectionData.subsection = nameSplit[2].replace('.yml', '')
  }

  if (content) {
    try {
      const yamlConfig = yaml.load(content)
      sectionData.data = yamlConfig
    } catch (e) {
      console.error(`Section "${sectionName}" error: ${e}`)
    }
  }
  return sectionData
}

export function loadArchive(file, projectData) {
  var dateBefore = new Date();
  JSZip.loadAsync(file).then(function(zip) {
    zip.forEach(function (relativePath, zipEntry) {
      if (!zipEntry.dir) {

        zipEntry.async("text").then(function (content) {

          let sectionData = loadModule(zipEntry.name, content)

          if (!projectData[sectionData.section]) projectData[sectionData.section] = {}

          if (subSections.indexOf(sectionData.fileType) >= 0) {
            if (!projectData[sectionData.section][sectionData.fileType]) projectData[sectionData.section][sectionData.fileType] = {}

            projectData[sectionData.section][sectionData.fileType][sectionData.subsection] = sectionData.data
          } else {
            projectData[sectionData.section][sectionData.fileType] = sectionData.data
          }
        })
      }
    })

  }, function (e) {
    console.error(`Error reading ${f.name}: ${e.message}`)
  })
}
