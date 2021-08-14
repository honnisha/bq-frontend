import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import yaml from  'js-yaml'
import moment from 'moment'

const subSections = ['conversations', 'menus']

export function saveArchive(projectData) {
  var zip = new JSZip();
  const options = {lineWidth: -1}

  for (const [sectionName, section] of Object.entries(projectData)) {

    if (section.events) zip.file(`${sectionName}/events.yml`, yaml.dump(section.events, options))
    if (section.conditions) zip.file(`${sectionName}/conditions.yml`, yaml.dump(section.conditions, options))
    if (section.objectives) zip.file(`${sectionName}/objectives.yml`, yaml.dump(section.objectives, options))
    if (section.items) zip.file(`${sectionName}/items.yml`, yaml.dump(section.items, options))
    if (section.main) zip.file(`${sectionName}/main.yml`, yaml.dump(section.main, options))
    if (section.journal) zip.file(`${sectionName}/journal.yml`, yaml.dump(section.journal, options))
    if (section.custom) zip.file(`${sectionName}/custom.yml`, yaml.dump(section.custom, options))

    for (const subSection of subSections) {
      if (section[subSection]) {
        for (const [fileName, subfile] of Object.entries(section[subSection])) {
          zip.file(`${sectionName}/${subSection}/${fileName}.yml`, yaml.dump(subfile, options))
        }
      }
    }
  }

  zip.generateAsync({type:"blob"}).then(function (blob) {
    const date = moment().format('YYYY-MM-DD-HH-MM');
    const fileName = `bq${date}.zip`
    saveAs(blob, fileName)
  }, function (err) {
    console.log(`Error with zip save: ${err}`)
  })
}
