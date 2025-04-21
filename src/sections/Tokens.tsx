import { ActionIcon, Button, Card, Group, Modal, NumberInput, Stack, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { tooltipProps } from '../utils/tooltipProps'

export default function Tokens() {
	const tokens = useTokenStore(state => state.tokens)
	const [removeTokenModal, removeTokenModalHandlers] = useDisclosure(false)

	return (
		<Card component={Stack} mih={150}>
			<Group justify='space-between' align='flex-start'>
				<Title order={2}>Tokens</Title>
				<Group gap='xs' align='flex-start'>
					<AddToken />
					<RemoveToken
						opened={removeTokenModal}
						open={removeTokenModalHandlers.open}
						close={removeTokenModalHandlers.close}
					/>
				</Group>
			</Group>

			<Group>
				{Object.entries(tokens).map(([name, count]) => {
					return (
						<NumberInput
							key={name}
							label={name}
							value={count}
							onChange={value => useTokenStore.getState().updateToken(name, +value)}
							allowDecimal={false}
							allowNegative={false}
							max={9_999_999_999}
							maw={120}
						/>
					)
				})}
			</Group>
		</Card>
	)
}

function AddToken() {
	const tokens = useTokenStore(state => state.tokens)
	const [tokenName, setTokenName] = useState('')
	const isTokenTaken = useMemo(() => Object.keys(tokens).includes(tokenName), [tokenName, tokens])

	const handleAddToken = () => {
		if (isTokenTaken || tokenName.length === 0) return
		useTokenStore.getState().addToken(tokenName)
		setTokenName('')
	}

	return (
		<TextInput
			value={tokenName}
			onChange={event => setTokenName(event.target.value)}
			error={isTokenTaken ? 'Token name already taken' : undefined}
			rightSection={(
				<Tooltip label='Add Token' {...tooltipProps}>
					<ActionIcon variant='default' onClick={handleAddToken}>
						<IconPlus />
					</ActionIcon>
				</Tooltip>
			)}
		/>
	)
}

type RemoveTokenModalProps = {
	opened: boolean
	open: () => void
	close: () => void
}

function RemoveToken({ opened, open, close }: RemoveTokenModalProps) {
	const tokens = useTokenStore(state => state.tokens)

	return (
		<>
			<Tooltip label='Remove Token' {...tooltipProps}>
				<ActionIcon variant='default' mt={4} onClick={open}>
					<IconMinus />
				</ActionIcon>
			</Tooltip>

			<Modal opened={opened} onClose={close} title='Remove Token'>
				<Stack>
					{
						Object.keys(tokens).map((tokenName, i) => {
							return (
								<Group key={i} justify='space-between'>
									<Text>{tokenName}</Text>
									<Button color='red' onClick={() => useTokenStore.getState().removeToken(tokenName)}>Remove</Button>
								</Group>
							)
						})
					}
				</Stack>
			</Modal>
		</>
	)
}

type TokenStore = {
	tokens: Record<string, number>
	addToken: (name: string) => void
	updateToken: (name: string, value: number) => void
	removeToken: (name: string) => void
}

const useTokenStore = create<TokenStore>()(persist((set, get) => ({
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
