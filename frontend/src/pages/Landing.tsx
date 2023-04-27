import { Button, Container, Grid } from "@mui/material";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const Landing = () => {
  return (
    <div className="root">
      <Container maxWidth="md">
        <Grid container alignItems="center">
          <Grid item xs={12} md={6}>
            <img src="/logo.jpg" alt="BCoC" className="image" />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography className="title" variant="h2">
              BCoC
            </Typography>
            <Typography className="bodytext" variant="body1">
              The future of CoC is here - embrace the digital transformation
              with blockchain-powered custody forms.
            </Typography>
            <Button className="landBtn" variant="contained" component={Link} to="/login" >
              Login
            </Button>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Landing;
