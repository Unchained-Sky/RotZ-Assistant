import { ActionIcon, Button, Card, Chip, Group, NumberInput, Slider, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconReload } from '@tabler/icons-react'
import { forwardRef } from 'react'
import { tooltipProps } from './tooltipProps'
import { type DamageStore, useDamageStore } from './useDamageStore'

export default function DamageCalculator() {
	const rollDamage = useDamageStore(state => state.rollDamage)

	return (
		<Card component={Stack} gap='md' style={{ gridArea: 'Damage' }}>
			<Title order={2}>Damage Calculator</Title>

			<CritChance />

			<Group grow align='end'>
				<MaxHit />
				<Modifiers />
				<Button onClick={rollDamage}>Calculate</Button>
			</Group>
		</Card>
	)
}

function CritChance() {
	const critValue = useDamageStore(state => state.critValue)

	return (
		<Stack gap={0}>
			<Text size='sm'>Crit Chance - {critValue}%</Text>
			<Slider
				value={critValue}
				onChange={value => useDamageStore.setState({ critValue: value })}
				step={5}
				label={null}
				mb={20}
				flex={1}
				marks={[
					{ value: 0, label: '0%' },
					{ value: 25, label: '25%' },
					{ value: 50, label: '50%' },
					{ value: 75, label: '75%' },
					{ value: 100, label: '100%' }
				]}
			/>
		</Stack>
	)
}

function MaxHit() {
	const maxValue = useDamageStore(state => state.maxValue)

	return (
		<NumberInput
			label='Max Hit'
			value={maxValue}
			onChange={value => useDamageStore.setState({ maxValue: +value })}
			allowDecimal={false}
			allowNegative={false}
			rightSection={(
				<Tooltip label='Reset Max Hit' {...tooltipProps}>
					<ActionIcon size='md' mr='sm' variant='default' onClick={() => useDamageStore.setState({ maxValue: 0 })}>
						<IconReload />
					</ActionIcon>
				</Tooltip>
			)}
		/>
	)
}

function Modifiers() {
	return (
		<Group miw={335} justify='center'>
			<Modifier type='confused' description='When rolling for damage, use the smallest number(s)' />
			<Modifier type='dodge' description='Roll one less attack dice when being attacked' />
			<Modifier type='encouraged' description='Roll one more attack dice instead of two' />
		</Group>
	)
}

type ModifierProps = ModifierChipProps & {
	description: string
}

function Modifier({ type, description }: ModifierProps) {
	return (
		<Tooltip label={description} {...tooltipProps}>
			<ModifierChip type={type} />
		</Tooltip>
	)
}

type ModifierChipProps = {
	type: keyof DamageStore['modifiers']
}

const ModifierChip = forwardRef<HTMLDivElement, ModifierChipProps>(function TestComponent({ type }, ref) {
	const checked = useDamageStore(state => state.modifiers[type])

	return (
		<Chip
			rootRef={ref}
			tt='capitalize'
			checked={checked}
			onChange={() => useDamageStore.setState({
				modifiers: {
					...useDamageStore.getState().modifiers,
					[type]: !checked
				}
			})}
		>
			{type}
		</Chip>
	)
})
