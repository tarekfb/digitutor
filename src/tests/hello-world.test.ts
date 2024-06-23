import { render, screen } from '@testing-library/svelte'
import { expect, test } from 'vitest'
import AlertMessage from 'src/lib/components/atoms/alert-message.svelte'
// import userEvent from '@testing-library/user-event'
// import { setupServer } from "msw/node";
// import { http } from "msw";

test('hello world testing', () => {
    render(AlertMessage, { title: 'World', description: "Hello" })

    const title = screen.getByText('World')
    const greeting = screen.queryByText('Hello')

    expect(title).toBeInTheDocument()
    expect(greeting).toBeInTheDocument()
})
