"use client"
import Button from '@mui/material/Button'

interface Props {
  children: React.ReactNode
  onClick?: () => void
  fullWidth?: boolean
}

export default function MyButton({ children, onClick, fullWidth }: Props) {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  )
}
