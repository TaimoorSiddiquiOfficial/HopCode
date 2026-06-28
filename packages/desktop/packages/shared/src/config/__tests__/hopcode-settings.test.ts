import { describe, expect, it } from 'bun:test'
import { normalizeHopCodeMemorySettings } from '../hopcode-settings.ts'

describe('Qwen memory settings', () => {
  it('defaults missing memory settings', () => {
    expect(normalizeHopCodeMemorySettings(undefined)).toEqual({
      enableManagedAutoMemory: true,
      enableManagedAutoDream: false,
      enableTeamMemory: false,
      enableTeamMemorySync: false,
      enableAutoSkill: false,
      autoSkillConfirm: true,
    })
  })

  it('keeps boolean values and ignores non-boolean values', () => {
    expect(
      normalizeHopCodeMemorySettings({
        enableManagedAutoMemory: false,
        enableManagedAutoDream: 'yes',
        enableTeamMemory: true,
        enableTeamMemorySync: true,
        enableAutoSkill: true,
        autoSkillConfirm: false,
      }),
    ).toEqual({
      enableManagedAutoMemory: false,
      enableManagedAutoDream: false,
      enableTeamMemory: true,
      enableTeamMemorySync: true,
      enableAutoSkill: true,
      autoSkillConfirm: false,
    })
  })
})
