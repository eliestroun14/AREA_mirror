"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ActionAreaCard from "@/components/ActionAreaCard";

export default function HomePage() {
  const cardsData = [
    { title: "LinkedIn", image: "/assets/linkedin.png", link: "https://linkedin.com" },
    { title: "YouTube", image: "/assets/youtube.jpg", link: "https://youtube.com" },
    { title: "See more", image: "", link: "" }, /* link to Explore page */
  ];

  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <Box sx={{ p: 4, bgcolor: "#f5ffff", minHeight: "100vh" }}>
      <Typography variant="h3" align="center" color="black" gutterBottom>
        AREA
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          justifyContent: 'center',
          alignItems: 'flex-start'
        }}
      >
        {cardsData.map((card, index) => (
          <Box
            key={index}
            sx={{
              width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
              maxWidth: 345
            }}
          >
            <ActionAreaCard
              title={card.title}
              image={card.image}
              link={card.link}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
