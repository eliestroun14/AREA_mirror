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

export default function CreateAppletsPage() {
  const router = useRouter()
  const params = useParams()
  const zapId = params.id as string
  const [searchTerm, setSearchTerm] = useState("")
  const [services, setServices] = useState<ServiceDTO[]>([])
  const [loading, setLoading] = useState(true)

  const handleBackClick = () => {
    router.push(`/create/${zapId}`)
  }

  const handleServiceClick = (serviceId: number) => {
    router.push(`/create/${zapId}/triggers/${serviceId}`)
  }

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getServiceColor = (service: ServiceDTO) => {
    return service.services_color || '#4A4A4A'
  }

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        const data = await apiService.getAllServices()
        setServices(data)
      } catch (err) {
        console.error('Error fetching services:', err)
        setServices([])
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
            Choose a service
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
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }
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
              md: `repeat(${Math.min(filteredServices.length, 5)}, 1fr)` 
            },
            gap: 0,
            maxWidth: filteredServices.length < 5 ? `${filteredServices.length * 200}px` : 1000,
            mx: 'auto',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          {filteredServices.map((service) => {
            const serviceColor = getServiceColor(service)
            const iconUrl = service.icon_url
            
            return (
              <Card
                key={service.id}
                sx={{
                  borderRadius: 0,
                  boxShadow: 'none',
                  border: 'none',
                  bgcolor: serviceColor,
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
                        width: 48,
                        height: 48,
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
                      {iconUrl ? (
                        <Box
                          component="img"
                          src={iconUrl}
                          alt={service.name}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            p: 1
                          }}
                          onError={(e) => {
                            const target = e.target as HTMLElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <Typography 
                          variant="h5" 
                          sx={{ 
                            color: serviceColor,
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
                        fontSize: '1rem'
                      }}
                    >
                      {service.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            )
          })}
        </Box>

        {filteredServices.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No services found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search filter
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  )
}
