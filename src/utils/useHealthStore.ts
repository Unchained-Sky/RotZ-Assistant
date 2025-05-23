import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDamageStore } from './useDamageStore'

type HealthStore = {
	players: Record<string, {
		shieldDurability: number
		currentShield: number
		maxShield: number
		currentHealth: number
		maxHealth: number
	}>
	summons: Record<string, {
		currentHealth: number
		maxHealth: number
		healthDrain: number
	}>
	addPlayer: (name: string, shieldAmount: number, shieldDurability: number, maxHealth: number) => void
	addSummon: (name: string, maxHealth: number, healthDrain: number) => void
	removeCharacter: (name: string, type: 'players' | 'summons') => void
	updateCurrentHealth: (name: string, operation: 'add' | 'remove', type: 'players' | 'summons') => void
	resetPlayerShield: (name: string) => void
	summonHealthDrain: (name: string) => void
}

export const useHealthStore = create<HealthStore>()(persist((set, get) => ({
	players: {},
	summons: {},
	addPlayer: (name: string, shieldAmount: number, shieldDurability: number, maxHealth: number) => {
		set(state => ({
			players: {
				...state.players,
				[name]: {
					shieldDurability,
					currentShield: shieldAmount,
					maxShield: shieldAmount,
					currentHealth: maxHealth,
					maxHealth
				}
			}
		}))
	},
	addSummon: (name: string, maxHealth: number, healthDrain: number) => {
		set(state => ({
			summons: {
				...state.summons,
				[name]: {
					currentHealth: maxHealth,
					maxHealth,
					healthDrain
				}
			}
		}))
	},
	removeCharacter: (name, type) => {
		const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
			const omitKeys = new Set(keys as string[])
			return Object.fromEntries(
				Object.entries(obj).filter(([key]) => !omitKeys.has(key))
			) as Omit<T, K>
		}
		set({ [type]: omit(get()[type], [name]) })
	},
	updateCurrentHealth: (name, operation, type) => {
		const damage = useDamageStore.getState().customHit || useDamageStore.getState().result.damage

		set(state => ({
			[type]: {
				...state[type],
				[name]: {
					...state[type][name],
					currentHealth: operation === 'add'
						? Math.min(state[type][name].currentHealth + damage, state[type][name].maxHealth)
						: Math.max(state[type][name].currentHealth - damage, 0)
				}
			}
		}))
	},
	resetPlayerShield: name => {
		set(state => ({
			players: {
				...state.players,
				[name]: {
					...state.players[name],
					currentShield: state.players[name].maxShield
				}
			}
		}))
	},
	summonHealthDrain: name => {
		const maxHealth = Math.max(get().summons[name].maxHealth - get().summons[name].healthDrain, 0)

		set(state => ({
			summons: {
				...state.summons,
				[name]: {
					...state.summons[name],
					maxHealth,
					currentHealth: Math.min(state.summons[name].currentHealth, maxHealth)
				}
			}
		}))
	}
}), { name: 'rotz-assistant-health-store' }))
