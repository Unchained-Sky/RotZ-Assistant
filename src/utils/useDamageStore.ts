import { create } from 'zustand'

export type DamageStore = {
	attackName: string
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
		encouraged: boolean
		perfect: boolean
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
	attackName: 'Custom',
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
		encouraged: false,
		perfect: false
	},
	result: {
		crit: false,
		diceSides: 0,
		minDamage: 0,
		rolls: [],
		damage: 0
	},
	customHit: 0,
	updateNumber: (key, value) => {
		set(state => ({
			numbers: { ...state.numbers, [key]: value }
		}))
		if ((['runeFlat', 'runeScaling', 'runeAcc']).includes(key)) {
			set({ attackName: 'Custom' })
		}
	},
	rollDamage: () => {
		const { critValue, power, runeFlat, runeScaling } = get().numbers
		const { confused, encouraged, perfect } = get().modifiers
		const { runeAcc } = get().numbers

		const didCrit = confused ? false : ~~(Math.random() * 100) < critValue

		const maxHit = runeFlat + ((power / 100) * runeScaling)
		const diceSides = maxHit / runeAcc

		const accuracyScaling = 5
		const accuracyPercentage = Math.min(runeAcc * accuracyScaling, 100)
		const minDamage = confused ? 0 : ~~((diceSides / 100) * accuracyPercentage)

		const diceCount = didCrit ? Math.min(maxHit, runeAcc) * 2 : Math.min(maxHit, runeAcc)
		const rolls = new Array(diceCount)
			.fill(0)
			.map(() => perfect ? Math.max(1, diceSides) : Math.max(1, Math.round(Math.random() * diceSides)))

		let damage = Math.round(rolls.reduce((a, b) => a + Math.max(b, minDamage), 0))
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
