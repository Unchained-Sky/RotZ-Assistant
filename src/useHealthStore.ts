import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDamageStore } from './useDamageStore'

type HealthStore = {
	players: Record<string, [currentHealth: number, maxHealth: number]>
	addPlayer: (name: string, maxHealth: number) => void
	removePlayer: (name: string) => void
	updateCurrentHealth: (name: string, operation: 'add' | 'remove') => void
}

export const useHealthStore = create<HealthStore>()(persist((set, get) => ({
	players: {},
	addPlayer: (name: string, maxHealth: number) => {
		set(state => ({
			players: {
				...state.players,
				[name]: [maxHealth, maxHealth]
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

		const newPlayers = omit(get().players, [name])

		set({
			players: newPlayers
		})
	},
	updateCurrentHealth: (name, operation) => {
		const result = useDamageStore.getState().result.damage
		set(state => ({
			players: {
				...state.players,
				[name]: [
					operation === 'add' ? state.players[name][0] + result : state.players[name][0] - result,
					state.players[name][1]
				]
			}
		}))
	}
}), { name: 'rotz-assistant-health-store' }))
