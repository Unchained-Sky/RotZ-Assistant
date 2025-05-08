import { ActionIcon, Card, Group, Progress, Stack, Title, Tooltip } from '@mantine/core'
import { IconReload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { tooltipProps } from '../utils/tooltipProps'
import { useDamageStore } from '../utils/useDamageStore'

const RESULT_TIME = 8e2
const ROLL_INTERVAL = 1e2

export default function LastResult() {
	const result = useDamageStore(state => state.result)

	return (
		<Card component={Stack}>
			<ResultTitle />

			{
				result.rolls.map((roll, i) => {
					return (
						<RollBar
							key={i}
							roll={roll}
							index={i}
						/>
					)
				})
			}
		</Card>
	)
}

function ResultTitle() {
	const result = useDamageStore(state => state.result)

	const [resultText, setResultText] = useState('')

	useEffect(() => {
		setResultText('')
		if (!result.rolls.length) return
		let text = result.crit ? ' - CRIT ' : ' - '
		text += result.damage.toString()
		const timeout = setTimeout(() => setResultText(text), RESULT_TIME + ROLL_INTERVAL)
		return () => clearTimeout(timeout)
	}, [result])

	return (
		<Group justify='space-between'>
			<Title order={2}>Last Result{resultText}</Title>
			<Tooltip label='Reset Last Result' {...tooltipProps}>
				<ActionIcon
					variant='default'
					onClick={() => {
						const initialValues = useDamageStore.getInitialState().result
						useDamageStore.setState({ result: initialValues })
					}}
				>
					<IconReload />
				</ActionIcon>
			</Tooltip>
		</Group>
	)
}

type RollBarProps = {
	roll: number
	index: number
}

function RollBar({ roll, index }: RollBarProps) {
	const [barPercentage, setBarPercentage] = useState(0)
	const [barLabel, setBarLabel] = useState(0)

	const diceSides = useDamageStore(state => state.result.diceSides)
	const minDamage = useDamageStore(state => state.result.minDamage)

	useEffect(() => {
		const interval = setInterval(() => {
			const roll = Math.round(Math.random() * diceSides)
			setBarPercentage(~~(roll * 100 / diceSides))
			setBarLabel(roll)
		}, ROLL_INTERVAL)

		const timeout = setTimeout(() => {
			clearInterval(interval)
			setBarPercentage(~~(roll * 100 / diceSides))
			setBarLabel(roll)
		}, RESULT_TIME)

		return () => {
			clearInterval(interval)
			clearTimeout(timeout)
		}
	}, [diceSides, index, roll])

	return (
		<Progress.Root transitionDuration={150} size={20}>
			<Progress.Section value={barPercentage}>
				<Progress.Label>{Math.round(barLabel * 100) / 100}</Progress.Label>
			</Progress.Section>
			{
				barLabel < minDamage && !useDamageStore.getState().modifiers.confused && (
					<Progress.Section value={~~(minDamage * 100 / diceSides) - barPercentage} color='green'>
						<Progress.Label>{minDamage - barLabel}</Progress.Label>
					</Progress.Section>
				)
			}
		</Progress.Root>
	)
}
