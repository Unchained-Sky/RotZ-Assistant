import { create } from 'zustand'

export type DamageStore = {
	numbers: {
		critValue: number
		power: number
		runeFlat: number
		runeScaling: number
		runeAcc: number
		maxValue: number
	}
	modifiers: {
		confused: boolean
		dodge: boolean
		encouraged: boolean
	}
	result: {
		crit: boolean
		diceSides: number
		minDamage: number
		rolls: number[]
		damage: number
	}
	customHit: number
	updateNumber: (key: keyof DamageStore['numbers'], value: number) => void
	rollDamage: () => void
}

export const useDamageStore = create<DamageStore>()((set, get) => ({
	numbers: {
		critValue: 5,
		power: 0,
		runeFlat: 0,
		runeScaling: 0,
		runeAcc: 0,
		maxValue: 0
	},
	modifiers: {
		confused: false,
		dodge: false,
		encouraged: false
	},
	result: {
		crit: false,
		diceSides: 0,
		minDamage: 0,
		rolls: [],
		damage: 0
	},
	customHit: 0,
	updateNumber: (key, value) => set(state => ({ numbers: { ...state.numbers, [key]: value } })),
	rollDamage: () => {
		const { critValue, power, runeFlat, runeScaling } = get().numbers
		const { confused, dodge, encouraged } = get().modifiers
		const runeAcc = dodge ? 1 : get().numbers.runeAcc

		const didCrit = confused ? false : Math.floor(Math.random() * 100) < critValue

		const maxHit = runeFlat + ((power / 100) * runeScaling)
		let diceSides = Math.ceil(maxHit / runeAcc)

		const accuracyScaling = 5
		const accuracyPercentage = Math.min(runeAcc * accuracyScaling, 100)
		const minDamage = confused ? 0 : ~~((diceSides / 100) * accuracyPercentage)

		if (didCrit) diceSides -= minDamage

		let rolls = new Array(runeAcc)
			.fill(0)
			.map(() => Math.round(Math.random() * diceSides))
		if (didCrit) rolls = rolls.map(roll => roll + minDamage)

		let damage = rolls.reduce((a, b) => a + Math.max(b, minDamage), 0)
		if (encouraged) damage += runeAcc * minDamage

		useDamageStore.setState({
			result: {
				crit: didCrit,
				diceSides,
				minDamage,
				rolls,
				damage
			}
		})
	}
}))
