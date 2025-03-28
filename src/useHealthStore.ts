import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDamageStore } from './useDamageStore'

type HealthStore = {
	players: Record<string, {
		currentShield: number
		maxShield: number
		currentHealth: number
		maxHealth: number
	}>
	addPlayer: (name: string, shield: number, maxHealth: number) => void
	removePlayer: (name: string) => void
	updateCurrentHealth: (name: string, operation: 'add' | 'remove') => void
	resetShield: (name: string) => void
}

export const useHealthStore = create<HealthStore>()(persist((set, get) => ({
	players: {},
	addPlayer: (name: string, shield: number, maxHealth: number) => {
		set(state => ({
			players: {
				...state.players,
				[name]: {
					currentShield: shield,
					maxShield: shield,
					currentHealth: maxHealth,
					maxHealth
				}
			}
		}))
	},
	removePlayer: name => {
		const omit = <T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
			const omitKeys = new Set(keys as string[])
			return Object.fromEntries(
				Object.entries(obj).filter(([key]) => !omitKeys.has(key))
			) as Omit<T, K>
		}

		set({ players: omit(get().players, [name]) })
	},
	updateCurrentHealth: (name, operation) => {
		const result = useDamageStore.getState().result.damage
		set(state => ({
			players: {
				...state.players,
				[name]: {
					...state.players[name],
					currentHealth: operation === 'add'
						? state.players[name].currentHealth + result
						: Math.max(state.players[name].currentHealth - result, 0)
				}
			}
		}))
	},
	resetShield: name => {
		set(state => ({
			players: {
				...state.players,
				[name]: {
					...state.players[name],
					currentShield: state.players[name].maxShield
				}
			}
		}))
	}
}), { name: 'rotz-assistant-health-store' }))
