import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useDamageStore } from './useDamageStore'

type CharacterType = 'players' | 'summons'
type Operation = 'add' | 'remove'

type HealthStore = {
	players: Record<string, {
		shieldDurability: number
		currentShield: number
		maxShield: number
		currentHealth: number
		maxHealth: number
		barrier: number
	}>
	summons: Record<string, {
		currentHealth: number
		maxHealth: number
		healthDrain: number
	}>
	addPlayer: (name: string, shieldAmount: number, shieldDurability: number, maxHealth: number) => void
	addSummon: (name: string, maxHealth: number, healthDrain: number) => void
	removeCharacter: (name: string, type: CharacterType) => void
	updateCurrentHealth: (name: string, operation: Operation, type: CharacterType) => void
	updatePlayerBarrier: (name: string, operation: Operation) => void
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
					maxHealth,
					barrier: 0
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
	updatePlayerBarrier: (name, operation) => {
		const damage = useDamageStore.getState().customHit || useDamageStore.getState().result.damage
		const shieldOverflowDamage = Math.min(get().players[name].barrier - damage, 0)

		set(state => ({
			players: {
				...state.players,
				[name]: {
					...state.players[name],
					barrier: operation === 'add'
						? state.players[name].barrier + damage
						: Math.max(state.players[name].barrier - damage, 0),
					currentShield: operation === 'remove'
						? Math.max(state.players[name].currentShield + shieldOverflowDamage, 0)
						: state.players[name].currentShield
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
