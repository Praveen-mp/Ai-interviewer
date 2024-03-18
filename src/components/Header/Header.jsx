import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LensBlurIcon from '@mui/icons-material/LensBlur';
import avtimg from '../../static/images/avatar/2.jpg';
import { useNavigate } from 'react-router-dom';

const aboutPage = (navigate) => () => {
  navigate('/about');
};

const interviewerPage = (navigate) => () => {
  navigate('/interviewer');
};

const feedbackPage = (navigate) => () => {
  navigate('/feedback');
};

const homePage = (navigate) => () => {
  navigate('/');
};

const pages = [
  { name: 'About', function: aboutPage },
  { name: 'Interviewer', function: interviewerPage },
  { name: 'Feedback', function: feedbackPage },
];
const settings = ['Profile', 'Dashboard'];

function Header() {
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: '#F7DC6F' }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
        >
          <LensBlurIcon
            sx={{
              display: { xs: 'none', md: 'flex', color: 'black' },
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
    color: 'black',
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
              sx={{ my: 3, mr: 3, ml: 3, color: 'black', display: 'block', transition: 'color 0.3s ease' }}
            >
              |
            </Typography>
            {pages.map((page) => (
              <>
                <Button
                  key={page.name}
                  sx={{
                    my: 2,
                    color: 'black',
                    display: 'block',
                    ":hover": { color: '#F7DC6F', background: 'black' },
                    transition: 'color 0.5s ease, background 0.5s ease',
                  }}
                  onClick={page.function(navigate)}
                >
                  {page.name}
                </Button>
                <Typography
                  sx={{ my: 3, mr: 3, ml: 3, color: 'black', display: 'block', transition: 'color 0.3s ease' }}
                >
                  |
                </Typography>
              </>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar src={avtimg} />
            </IconButton>
            <Menu
              sx={{
                mt: '45px',
                transition: 'transform 0.3s ease',
              }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={handleCloseUserMenu}
                  sx={{ transition: 'color 0.3s ease' }}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
