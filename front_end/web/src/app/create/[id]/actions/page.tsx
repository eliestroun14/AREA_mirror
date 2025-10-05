"use client"

import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Container from '@mui/material/Container'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { useRouter, useParams } from 'next/navigation'
import CircularProgress from '@mui/material/CircularProgress'
import { apiService } from '@/services/api'
import { ServiceDTO } from '@/types/api'

export default function ActionsPage() {
  const router = useRouter()
  const params = useParams()
  const zapId = params.id as string
  const [searchTerm, setSearchTerm] = useState("")
  const [services, setServices] = useState<ServiceDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBackClick = () => {
    router.push(`/create/${zapId}`)
  }

  const handleServiceClick = (serviceId: number) => {
    router.push(`/create/${zapId}/actions/${serviceId}`)
  }

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all services from API
        const servicesData = await apiService.getAllServices()
        setServices(servicesData)
        
      } catch (err) {
        console.error('Error fetching services:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4
        }}
      >
        <Typography variant="h4" sx={{ color: 'black', mb: 2, textAlign: 'center' }}>
          Error loading services
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, textAlign: 'center' }}>
          {error}
        </Typography>
        <Button
          onClick={handleBackClick}
          variant="contained"
          sx={{ bgcolor: 'black', color: 'white' }}
        >
          Go Back
        </Button>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 4,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        {/* Header */}
        <Box sx={{ position: 'relative', mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackClick}
            sx={{
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
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
              fontSize: { xs: '2rem', md: '3rem' },
              textAlign: 'center'
            }}
          >
            Choose an action service
          </Typography>
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
              md: 'repeat(4, 1fr)',
              lg: 'repeat(5, 1fr)'
            },
            gap: 3,
            maxWidth: 1200,
            mx: 'auto'
          }}
        >
          {filteredServices.map((service) => (
            <Card
              key={service.id}
              sx={{
                borderRadius: 3,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                bgcolor: service.services_color,
                aspectRatio: '1',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              <CardActionArea
                onClick={() => handleServiceClick(service.id)}
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
                      width: 64,
                      height: 64,
                      bgcolor: 'white',
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      mx: 'auto',
                      overflow: 'hidden'
                    }}
                  >
                    {service.icon_url ? (
                      <Box
                        component="img"
                        src={service.icon_url}
                        alt={service.name}
                        sx={{
                          width: 48,
                          height: 48,
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <Typography 
                        variant="h4" 
                        sx={{ 
                          color: service.services_color,
                          fontWeight: 700 
                        }}
                      >
                        {service.name.charAt(0)}
                      </Typography>
                    )}
                  </Box>
                  
                  {/* Service Name */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '1rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {service.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Box>

        {filteredServices.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}
