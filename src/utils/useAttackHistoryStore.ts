import { create } from 'zustand'
import { type DamageStore } from './useDamageStore'

export type Attack = {
	name: string
	numbers: DamageStore['numbers']
	modifiers: DamageStore['modifiers']
	result: DamageStore['result']
	time: number
}

type AttackStore = {
	attacks: Attack[]
	addAttack: (attack: Attack) => void
}

export const useAttackHistoryStore = create<AttackStore>()((set, _get) => ({
	attacks: [],
	addAttack: (attack: Attack) => set(state => ({ attacks: [attack, ...state.attacks] }))
}))
