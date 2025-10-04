"use client"

import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { useRouter } from 'next/navigation'
import database from '@/data/database.json'

export default function CreateAppletsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All services")

  const handleBackClick = () => {
    router.push('/create')
  }

  const handleServiceClick = (serviceName: string) => {
    router.push(`/create/triggers/${encodeURIComponent(serviceName)}`)
  }

  const filteredServices = database.services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const serviceColors = [
    '#FF8A00', '#4A4A4A', '#1877F2', '#4285F4', '#FF6600',
    '#1DB954', '#333333', '#1DA1F2', '#000000', '#FF0000'
  ]

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 4,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              color: 'black',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              borderRadius: 6,
              px: 3,
              py: 1,
              border: '2px solid black',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            Back
          </Button>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: 'black',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Choose a service
          </Typography>

          <Button
            sx={{
              minWidth: 44,
              height: 44,
              borderRadius: '50%',
              color: 'black',
              border: '2px solid white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <HelpOutlineIcon />
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'center' }}>
          <TextField
            placeholder="Search services"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              width: 300,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': {
                  borderColor: '#e0e0e0',
                  borderWidth: 2
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Services Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { 
              xs: 'repeat(2, 1fr)', 
              sm: 'repeat(3, 1fr)', 
              md: 'repeat(5, 1fr)' 
            },
            gap: 0,
            maxWidth: 1000,
            mx: 'auto',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {filteredServices.slice(0, 10).map((service, index) => (
            <Card
              key={service.id}
              sx={{
                borderRadius: 0,
                boxShadow: 'none',
                border: 'none',
                bgcolor: serviceColors[index % serviceColors.length],
                aspectRatio: '1',
                '&:hover': {
                  transform: 'scale(1.05)',
                  zIndex: 1,
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                  borderRadius: 2
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardActionArea
                onClick={() => handleServiceClick(service.name)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 0 }}>
                  {/* Service Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: 'white',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto'
                    }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        color: serviceColors[index % serviceColors.length],
                        fontWeight: 700 
                      }}
                    >
                      {service.name.charAt(0)}
                    </Typography>
                  </Box>
                  
                  {/* Service Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem'
                    }}
                  >
                    {service.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  )
}
