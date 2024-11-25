import { Box, Link, Typography, TextField, Button, IconButton, MenuItem, Select } from '@mui/material';
import { Facebook, Twitter, YouTube } from '@mui/icons-material';
import Grid from "@mui/material/Grid2";
import Image from 'next/image';

export default function Footer() {
    return (
        <Box sx={{ bgcolor: '#f8f9fa', p: 8, mt: 4 }}>
            <Grid container spacing={4}>
                <Grid xs={12} md={3}>
                    <Typography variant="h6" component="div" gutterBottom>
                        <Box
                            sx={{
                                borderRadius: 50,
                                overflow: "hidden",
                                width: 100,
                                height: 100
                            }}
                        >
                            <Image src="/cine.webp" alt="logo" width={100} height={100} />
                        </Box>
                    </Typography>
                </Grid>

                <Grid xs={6} md={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        About Us
                    </Typography>
                    <Link href="#" variant="body2" display="block" color="textSecondary">Our Mission</Link>
                    <Link href="#" variant="body2" display="block" color="textSecondary">How It Works</Link>
                    <Link href="#" variant="body2" display="block" color="textSecondary">Contact Us</Link>
                </Grid>

                <Grid xs={6} md={3} sx={{mr:50}}>
                    <Typography variant="subtitle1" gutterBottom>
                        Discover
                    </Typography>
                    <Link href="#" variant="body2" display="block" color="textSecondary">Top Rated Movies</Link>
                    <Link href="#" variant="body2" display="block" color="textSecondary">Latest Releases</Link>
                    <Link href="#" variant="body2" display="block" color="textSecondary">Personalized Recommendations</Link>
                </Grid>

                <Grid xs={12} md={3}>
                    <Typography variant="subtitle1" gutterBottom>
                        Stay Updated
                    </Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                        Subscribe for movie news and updates
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                            variant="outlined"
                            placeholder="Your email"
                            size="small"
                            sx={{ mr: 1, flexGrow: 1 }}
                        />
                        <Button variant="contained" color="primary" sx={{
                            "&:hover": {
                                backgroundColor: "#e3f2fd",
                                color: "#1DA1F2",
                                transform: "scale(1.2)",
                                transition: "transform 0.3s ease-in-out",
                            },
                        }}>Subscribe</Button>
                    </Box>
                </Grid>

                {/* Sección de atribución de TMDB */}
                <Grid xs={12} sx={{ textAlign: 'center', mt: 4 }}>
                    <Typography variant="body1" color="textSecondary" gutterBottom>
                        Data provided by
                    </Typography>
                    <Link
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Image
                            src="TMDB.svg" // Reemplaza con la ruta al logo de TMDB
                            alt="TMDB Logo"
                            width={100}
                            height={50}
                        />
                    </Link>
                </Grid>
            </Grid>

            <Box sx={{ borderTop: 1, borderColor: '#e0e0e0', mt: 4, pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Select defaultValue="English" size="small" sx={{ minWidth: 100 }}>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                </Select>
                <Typography variant="body2" color="textSecondary">
                    © 2024 Movie Recommender, Inc. • <Link href="#">Privacy</Link> • <Link href="#">Terms</Link> • <Link href="#">Sitemap</Link>
                </Typography>
                <Box>
                    <IconButton
                        href="#"
                        color="inherit"
                        sx={{
                            "&:hover": {
                                backgroundColor: "#e3f2fd",
                                color: "#1DA1F2",
                                transform: "scale(1.2)",
                                transition: "transform 0.3s ease-in-out",
                            },
                        }}
                    >
                        <Twitter />
                    </IconButton>
                    <IconButton
                        href="#"
                        color="inherit"
                        sx={{
                            "&:hover": {
                                backgroundColor: "#e3f2fd",
                                color: "#1DA1F2",
                                transform: "scale(1.2)",
                                transition: "transform 0.3s ease-in-out",
                            },
                        }}
                    >
                        <Facebook />
                    </IconButton>
                    <IconButton
                        href="#"
                        color="inherit"
                        sx={{
                            "&:hover": {
                                backgroundColor: "#e3f2fd",
                                color: "#FF0000",
                                transform: "scale(1.2)",
                                transition: "transform 0.3s ease-in-out",
                            },
                        }}
                    >
                        <YouTube />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}
