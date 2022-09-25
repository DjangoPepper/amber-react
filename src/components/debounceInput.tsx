import React from "react";
import {Form} from "react-bootstrap";

export default function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                           ...props
                        }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number,
    size?: any
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <Form.Control {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}