import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import moment from 'moment'
import { dumpYaml } from './yamlUtils.js'

const subSections = ['conversations', 'menus']

export function saveArchive(projectData) {
  var zip = new JSZip();

  for (const [sectionName, section] of Object.entries(projectData)) {

    if (section.events) zip.file(`${sectionName}/events.yml`, dumpYaml(section.events))
    if (section.conditions) zip.file(`${sectionName}/conditions.yml`, dumpYaml(section.conditions))
    if (section.objectives) zip.file(`${sectionName}/objectives.yml`, dumpYaml(section.objectives))
    if (section.items) zip.file(`${sectionName}/items.yml`, dumpYaml(section.items))
    if (section.main) zip.file(`${sectionName}/main.yml`, dumpYaml(section.main))
    if (section.journal) zip.file(`${sectionName}/journal.yml`, dumpYaml(section.journal))
    if (section.custom) zip.file(`${sectionName}/custom.yml`, dumpYaml(section.custom))

    for (const subSection of subSections) {
      if (section[subSection]) {
        for (const [fileName, subfile] of Object.entries(section[subSection])) {
          zip.file(`${sectionName}/${subSection}/${fileName}.yml`, dumpYaml(subfile))
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
