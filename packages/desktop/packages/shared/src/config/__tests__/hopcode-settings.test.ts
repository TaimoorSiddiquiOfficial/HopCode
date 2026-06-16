import { describe, expect, it } from 'bun:test'
import { normalizeHopCodeMemorySettings } from '../hopcode-settings.ts'

describe('Qwen memory settings', () => {
  it('defaults missing memory settings', () => {
    expect(normalizeHopCodeMemorySettings(undefined)).toEqual({
      enableManagedAutoMemory: true,
      enableManagedAutoDream: false,
      enableAutoSkill: false,
    })
  })

  it('keeps boolean values and ignores non-boolean values', () => {
    expect(
      normalizeHopCodeMemorySettings({
        enableManagedAutoMemory: false,
        enableManagedAutoDream: 'yes',
        enableAutoSkill: true,
      }),
    ).toEqual({
      enableManagedAutoMemory: false,
      enableManagedAutoDream: false,
      enableAutoSkill: true,
    })
  })
})
