import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import LensBlurIcon from '@mui/icons-material/LensBlur';
import avtimg from '../../static/images/avatar/2.jpg';
import { useNavigate } from 'react-router-dom';

const interviewerPage = (navigate) => () => {
  navigate('/interviewer');
};

const resourcePage = (navigate) => () => {
  navigate('/resources');
};

const homePage = (navigate) => () => {
  navigate('/');
};

const pages = [
  { name: 'Interviewer', function: interviewerPage },
  { name: 'Resources', function: resourcePage },
];

function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" sx={{ bgcolor: '#2a2392' }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
        >
          <LensBlurIcon
            sx={{
              display: { xs: 'none', md: 'flex', color: 'white' },
              mr: 1,
              fontSize: '40px',
            }}
          />

<Typography
  variant="h6"
  noWrap
  onClick={homePage(navigate)}
  sx={{
    mr: 2,
    display: { xs: 'none', md: 'flex' },
    fontFamily: 'monospace',
    fontWeight: 700,
    letterSpacing: '.1rem',
    color: 'white',
    textDecoration: 'none',
    cursor: 'pointer',
    ":hover": { scale: '105%' },
    transition: 'transform 0.3s ease',
  }}
>
  AI Interviewer
</Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Typography
              sx={{ my: 3, mr: 3, ml: 3, color: 'white', display: 'block', transition: 'color 0.3s ease' }}
            >
              |
            </Typography>
            {pages.map((page) => (
              <>
                <Button
                  key={page.name}
                  sx={{
                    my: 2,
                    fontFamily:'revert-layer',
                    color: 'white',
                    display: 'block',
                    ":hover": { color: '#0057c8', background: 'white', fontWeight:'bold' },
                    transition: 'color 0.5s ease, background 0.5s ease',
                  }}
                  onClick={page.function(navigate)}
                >
                  {page.name}
                </Button>
                <Typography
                  sx={{ my: 3, mr: 3, ml: 3, color: 'white', display: 'block', transition: 'color 0.3s ease' }}
                >
                  |
                </Typography>
              </>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton sx={{ p: 0 }}>
              <Avatar src={avtimg} />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
