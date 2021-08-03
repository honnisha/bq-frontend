import JSZip from 'jszip'
import { saveAs } from 'file-saver';
import yaml from  'js-yaml'

const subSections = ['conversations', 'menus']

export function saveArchive(projectData) {
  var zip = new JSZip();

  for (const [sectionName, section] of Object.entries(projectData)) {

    if (section.events) zip.file(`${sectionName}/events.yml`, yaml.dump(section.events))
    if (section.conditions) zip.file(`${sectionName}/conditions.yml`, yaml.dump(section.conditions))
    if (section.objectives) zip.file(`${sectionName}/objectives.yml`, yaml.dump(section.objectives))
    if (section.items) zip.file(`${sectionName}/items.yml`, yaml.dump(section.items))
    if (section.main) zip.file(`${sectionName}/main.yml`, yaml.dump(section.main))
    if (section.journal) zip.file(`${sectionName}/journal.yml`, yaml.dump(section.journal))
    if (section.custom) zip.file(`${sectionName}/custom.yml`, yaml.dump(section.custom))

    for (const subSection of subSections) {
      if (section[subSection]) {
        for (const [fileName, subfile] of Object.entries(section[subSection])) {
          zip.file(`${sectionName}/${subSection}/${fileName}.yml`, yaml.dump(subfile))
        }
      }
    }
  }

  zip.generateAsync({type:"blob"}).then(function (blob) {
    const date = JSON.stringify(new Date());
    const fileName = `bq${date}.zip`
    saveAs(blob, fileName)
  }, function (err) {
    console.log(`Error with zip save: ${err}`)
  })
}
