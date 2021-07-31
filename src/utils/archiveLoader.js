import './archives/uncompress.js'
import yaml from  'js-yaml'

async function loadConversationsConfig(ymlData) {
  return ymlData
}

const subSections = ['conversations', 'menus']

async function loadModule(section, arryBytes) {
  const nameSplit = section.name.split('/')
  let sectionData = {
    section: nameSplit[0],
    fileType: nameSplit[1].replace('.yml', ''),
    data: {},
  }
  if (subSections.indexOf(sectionData.fileType) >= 0) {
    sectionData.conversation = nameSplit[2].replace('.yml', '')
  }

  if (arryBytes) {
    const blobData = new Blob([arryBytes])
    const text = await new Response(blobData).text()

    try {
      const yamlConfig = yaml.load(text)
      if (sectionData.fileType === 'conversations') {
        sectionData.data = await loadConversationsConfig(yamlConfig)
      } else {
        sectionData.data = yamlConfig
      }
    } catch (e) {
      console.error(`Section "${section.name}" error: ${e}`)
    }
  }
  return sectionData
}

export async function loadArchive(file, projectData) {

  console.log(`Load zip archive format...`)
  loadArchiveFormats(['zip'], function() {
    console.log(`Uncompressing ${file.name}...`)
    archiveOpenFile(file, null, async function(archive, err) {
      if (archive) {

	await archive.entries.forEach(async function(section) {
	  if (section.is_file) {
            await section.readData(async function(arryBytes, err) {

              let sectionData = await loadModule(section, arryBytes)

              if (!projectData[sectionData.section]) projectData[sectionData.section] = {}

              if (subSections.indexOf(sectionData.fileType) >= 0) {
                if (!projectData[sectionData.section][sectionData.fileType]) projectData[sectionData.section][sectionData.fileType] = {}

                projectData[sectionData.section][sectionData.fileType][sectionData.conversation] = sectionData.data
              } else {
                projectData[sectionData.section][sectionData.fileType] = sectionData.data
              }
            })
          }
	})
      } else {
        console.error(`Zip unpack "${file.name}" error: ${err}`)
      }
      archiveClose(archive);
    })
  })
}
