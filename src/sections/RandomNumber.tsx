import { Badge, Button, Card, Group, NumberInput, SimpleGrid, Stack, Title } from '@mantine/core'
import { IconCheck, IconClock, IconPercentage, IconX } from '@tabler/icons-react'
import { useState } from 'react'

export default function RandomNumber() {
	return (
		<SimpleGrid cols={2}>
			<RandomRange />
			<RandomPercentage />
		</SimpleGrid>
	)
}

function RandomRange() {
	const [min, setMin] = useState<string | number>('')
	const [max, setMax] = useState<string | number>('')
	const [result, setResult] = useState<'~' | number>('~')

	async function roll() {
		setResult('~')
		const roll = Math.floor(Math.random() * ((+max) - (+min) + 1) + (+min))
		await new Promise(resolve => setTimeout(resolve, 500))
		setResult(roll)
	}

	return (
		<Card component={Stack}>
			<Title order={2}>Random Range</Title>
			<Group>
				<Badge color='dark.4' miw={36}>{result}</Badge>
				<NumberInput
					flex={1}
					allowDecimal={false}
					allowNegative={false}
					stepHoldDelay={500}
					stepHoldInterval={t => Math.max(1000 / t ** 2, 25)}
					value={min}
					onChange={setMin}
				/>
				<NumberInput
					flex={1}
					allowDecimal={false}
					allowNegative={false}
					stepHoldDelay={500}
					stepHoldInterval={t => Math.max(1000 / t ** 2, 25)}
					value={max}
					onChange={setMax}
				/>
				<Button onClick={() => void roll()}>Roll</Button>
			</Group>
		</Card>
	)
}

function RandomPercentage() {
	const [percentage, setPercentage] = useState<string | number>('')
	const [shownIcon, setShownIcon] = useState(<IconPercentage />)

	async function roll() {
		setShownIcon(<IconClock />)
		const roll = Math.round(Math.random() * 100) <= (+percentage)
		await new Promise(resolve => setTimeout(resolve, 500))
		setShownIcon(roll ? <IconCheck color='green' /> : <IconX color='red' />)
	}

	return (
		<Card component={Stack}>
			<Title order={2}>Random Percentage</Title>
			<Group>
				{shownIcon}
				<NumberInput
					flex={1}
					max={100}
					allowDecimal={false}
					allowNegative={false}
					stepHoldDelay={500}
					stepHoldInterval={t => Math.max(1000 / t ** 2, 25)}
					suffix='%'
					value={percentage}
					onChange={setPercentage}
				/>
				<Button onClick={() => void roll()}>Roll</Button>
			</Group>
		</Card>
	)
}
