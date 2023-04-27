import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (

    <Typography variant="body2" color="text.secondary" align="center" padding={5} >
      {'Copyright © '}
      <Link color="inherit" href="" sx={{ letterSpacing: '0.08em' }}>
        BCoC
      </Link>{', Inc '}
      {new Date().getFullYear()}
      {'. All Rights Reserved'}
    </Typography>

  );
};

export default Footer;
