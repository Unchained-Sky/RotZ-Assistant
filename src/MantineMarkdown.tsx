/* eslint-disable react/prop-types */
import { List, Stack, Title } from '@mantine/core'
import Markdown from 'react-markdown'

type MantineMarkdownProps = {
	markdown: string
}

export default function MantineMarkdown({ markdown }: MantineMarkdownProps) {
	return (
		<Stack gap='sm'>
			<Markdown
				components={{
					h1(props) {
						return <Title order={1}>{props.children}</Title>
					},
					h2(props) {
						return <Title order={2}>{props.children}</Title>
					},
					h3(props) {
						return <Title order={3}>{props.children}</Title>
					},
					ul(props) {
						return <List withPadding>{props.children}</List>
					},
					li(props) {
						const text = props.children
						if (typeof text !== 'string' || !text.includes(':')) return <List.Item>{text}</List.Item>
						const [title, desc] = text.split(':')
						return (
							<List.Item>
								<strong>{title}:</strong>
								{desc}
							</List.Item>
						)
					}
				}}
			>{markdown}
			</Markdown>
		</Stack>
	)
}
