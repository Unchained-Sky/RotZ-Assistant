import { create } from 'zustand'

export type DamageStore = {
	critValue: number
	maxValue: number
	modifiers: {
		confused: boolean
		dodge: boolean
		encouraged: boolean
	}
	result: {
		crit: boolean
		rolls: number[]
		damage: number
	}
	rollDamage: () => void
}

export const useDamageStore = create<DamageStore>()((_set, get) => ({
	critValue: 5,
	maxValue: 0,
	modifiers: {
		confused: false,
		dodge: false,
		encouraged: false
	},
	result: {
		crit: false,
		rolls: [],
		damage: 0
	},
	rollDamage: () => {
		if (!get().maxValue) return

		const crit = Math.floor(Math.random() * 100) < get().critValue

		let diceCount = 2
		if (get().modifiers.dodge) diceCount -= 1
		if (get().modifiers.encouraged) diceCount += 1

		const rolls = new Array(diceCount).fill(0).map(() => Math.round(Math.random() * get().maxValue))

		const calculateDamage = () => {
			if (rolls.length === 1)	return rolls[0]

			if (!crit) return get().modifiers.confused ? Math.min(...rolls) : Math.max(...rolls)

			const sortedRolls = rolls.toSorted((a, b) => b - a)
			if (get().modifiers.confused) return (sortedRolls.at(-1) ?? 0) + (sortedRolls.at(-2) ?? 0)
			return sortedRolls[0] + sortedRolls[1]
		}

		useDamageStore.setState({
			result: {
				crit,
				rolls,
				damage: calculateDamage()
			}
		})
	}
}))
