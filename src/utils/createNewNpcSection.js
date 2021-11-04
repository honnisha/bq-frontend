import defaultConversationText from '../assets/defaultConversation.yml?raw'
import yaml from 'js-yaml'


export function createNewNpcSection(sectionInfo, newName, newNPCID, newNPCholograms, lang) {

  if (!sectionInfo.conversations) sectionInfo.conversations = {}

  const defaultConversationReplaced = defaultConversationText.replaceAll(
    '{npcName}', newName
  ).replaceAll(
    '{npcID}', newNPCID
  ).replaceAll(
    '{langSlug}', lang
  )
  const defaultConversationJson = yaml.load(defaultConversationReplaced)

  sectionInfo.conversations[newName] = defaultConversationJson.conversations

  if (newNPCID) {
    sectionInfo.main.npcs[newNPCID] = newName

    if (!sectionInfo.custom) sectionInfo.custom = { npc_holograms: { check_interval: 100 } }
    if (newNPCholograms) {
      sectionInfo.custom.npc_holograms = Object.assign(
        {}, sectionInfo.custom.npc_holograms, defaultConversationJson.npc_holograms
      )
    }
    if (newNPCholograms) {
      sectionInfo.conditions = Object.assign(
        {}, sectionInfo.conditions, defaultConversationJson.conditions
      )
    }
  }
}
