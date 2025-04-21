import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type TokenStore = {
	tokens: Record<string, number>
	addToken: (name: string) => void
	updateToken: (name: string, value: number) => void
	removeToken: (name: string) => void
}

export const useTokenStore = create<TokenStore>()(persist((set, get) => ({
	tokens: {},
	addToken: name => {
		set(state => ({
			tokens: {
				...state.tokens,
				[name]: 0
			}
		}))
	},
	updateToken: (name, value) => {
		set(state => ({
			tokens: {
				...state.tokens,
				[name]: value
			}
		}))
	},
	removeToken: name => {
		const { [name]: _name, ...tokens } = get().tokens
		set({ tokens })
	}
}), { name: 'rotz-assistant-token-store' }))
