
import React, { useState, useContext, useEffect } from "react";
import { getWeb3, getContract } from "../../web3";
import Web3 from "web3";
import { AuthContext } from "../../contexts/Auth";

import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';


////////////////////////////////// Evidence Sizure Form ///////////////////////////////
export default function Forms() {

const [web3, setWeb3] = useState<Web3 | null>(null);
const authContext = useContext(AuthContext);
const [contract, setContract] = useState<any | null>(null);
const [caseNumber, setCaseNumber] = useState("");
const [evidenceItem, setEvidenceItem] =  useState('');
const [evidenceDescription, setEvidenceDescription] =  useState('');
const [locationOfSeizure, setlocationOfSeizure] =  useState('');
const [datetimeSeized, setDatetimeSeized] = useState('');
const [submitted, setSubmitted] = useState(false);
const [EvidenceID, setEvidenceID] = useState("");
const [confirmed, setConfirmed] = useState(false);
const [activeStep, setActiveStep] = useState(0);



//getting current date and time  
useEffect(() => {
  const now = new Date();
  const datetimeString = now.toLocaleString('en-US', { hour12: false });
  setDatetimeSeized(datetimeString);
}, []);

//getting current location 
const getPosition = async (): Promise<GeolocationCoordinates | null> => {

  if (!navigator.geolocation) {
    console.error("Geolocation is not available");
    alert("Geolocation is not supported by your browser.");
    return null;
  }

  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) =>
      navigator.geolocation.getCurrentPosition(resolve, reject)
    );
    return position.coords;
  } catch (error) {
    console.error(error);
    alert("Failed to get current location. Please enable location services and try again.");
    throw new Error("Failed to get user's position");
  }
};

// view location on google map using the current location.
const navigateToMaps = async () => {
  const position = await getPosition();

  if (position) {
    const longitude = position.longitude ;
    const latitude = position.latitude ;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(mapsUrl, '_blank');
  } 
};

// Creating an Evidence object and storing it in the blockchain.
const handleCreateEvidence = async () => {
  if (contract && web3 && evidenceItem && evidenceDescription) {
    try {
      const accounts = await web3.eth.getAccounts();
      //handle empty wallet with no accounts setted yet.
      if (!accounts || accounts.length === 0) {
        console.error("No accounts in the wallet");
        alert("Please add an account to your wallet and try again.");
        return;
      }

      const position = await getPosition();
      if (position) {
        const latitude = position.latitude.toString(); 
        const longitude = position.longitude.toString(); 
        const submittingOfficer = authContext.id;

        // estimating gas price 
        const gasLimit = await contract.methods.createEvidence( caseNumber, evidenceItem, evidenceDescription, longitude, latitude, submittingOfficer, datetimeSeized, locationOfSeizure)
        .estimateGas({ from: accounts[0] });

        // storing evidence data in the blockchain 
        await contract.methods.createEvidence(caseNumber, evidenceItem, evidenceDescription, longitude, latitude, submittingOfficer, datetimeSeized, locationOfSeizure )
        .send({ from: accounts[0], gasLimit });

        setSubmitted(true)
        const EvidenceID = await contract.methods.getLastEvidenceId().call();
        setEvidenceID(EvidenceID)

      } else {
        // handle unenabled location services
        console.error("Failed to get user's position");
        alert("Failed to get current location. Please enable location services and try again.");
      }

    } catch (error: Error | any) {

      // handle transaction rejection
      if (error.code === 4001) {
        console.error("User rejected the transaction");
        alert("You rejected the transaction. Please try again.");
      } else {

      // handle transaction error
        console.error(error);
        alert("An error occurred while creating the evidence. Please try again.");
      }
    }
    
  } else {

  // handle unfilled inputs
    alert("Please fill in all required fields and try again.");
  }
};

//initializing the smart contract 
const init = async () => {
try {
  const web3Instance = await getWeb3();
  setWeb3(web3Instance);
  const networkId = await web3Instance.eth.net.getId();
  const contractInstance = await getContract(web3Instance, networkId);
  setContract(contractInstance); // set the contract instance
} catch (error) {
  
  console.error(error);
}
};

React.useEffect(() => {
init();
}, []);


//handle change functions 

const handleCaseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setCaseNumber(event.target.value);
};

const handleItemChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setEvidenceItem(event.target.value);
};

const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setEvidenceDescription(event.target.value);
};

const handlelocationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setlocationOfSeizure(event.target.value);
};

const handleConfirmedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setConfirmed(event.target.checked);
};


// function to handle inputs validation
const specialCharsRegex = /^[a-zA-Z0-9,.()\-\\/"' ]*$/;

const isFormValid = () => {
  if ( !caseNumber.trim() || !evidenceDescription.trim()  || !evidenceItem.trim()  || !locationOfSeizure.trim()  || !confirmed) {
    window.alert("Please complete required information");
    return false;
  }

  if ( !specialCharsRegex.test(caseNumber) || !specialCharsRegex.test(evidenceDescription) || !specialCharsRegex.test(evidenceItem) || !specialCharsRegex.test(locationOfSeizure)){
    return false;
  }

  return true;
}


// form navigation functions 

const handleNext = () => {
  if (activeStep === steps.length - 1) {
    handleCreateEvidence();
  // don't navigate to the next page unless the form is valid
  } else if (isFormValid()){
      setActiveStep(activeStep + 1);
    }
  
};

const handleBack = () => {
  setActiveStep(activeStep - 1);
};

// Form 
const steps = ['Seizing details', 'Confirm Seizing details'];

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return (
      <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Evidence Seizure Details
      </Typography>
      <Grid container spacing={3}>

      <Grid item xs={12}>
          <TextField
            required
            id="Case"
            name="Case"
            label="Case Number"
            fullWidth
            autoComplete="Case Number"
            variant="standard"
            onChange={handleCaseChange}
            error={!specialCharsRegex.test(caseNumber)}
            helperText={!specialCharsRegex.test(caseNumber) ? "Invalid input" : ""}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="item"
            name="item"
            label="Evidence item"
            fullWidth
            autoComplete="Evidenc item"
            variant="standard"
            onChange={handleItemChange}
            error={!specialCharsRegex.test(evidenceItem)}
            helperText={!specialCharsRegex.test(evidenceItem) ? "Invalid input" : ""}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="Evidence Description"
            name="Evidence Description"
            label="Evidence Description"
            fullWidth
            autoComplete="Evidence Description"
            variant="standard"
            onChange={handleDescriptionChange}
            error={!specialCharsRegex.test(evidenceDescription)}
            helperText={!specialCharsRegex.test(evidenceDescription) ? "Invalid input" : ""}/>
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            id="Location"
            name="Location"
            label="Location"
            fullWidth
            autoComplete="Location"
            variant="standard"
            onChange={handlelocationChange}
            error={!specialCharsRegex.test(locationOfSeizure)}
            helperText={!specialCharsRegex.test(locationOfSeizure) ? "Invalid input" : ""}/>
        </Grid>

        <Grid item xs={12}>
        <FormControlLabel
          control={<Checkbox color="secondary" required name="saveAddress" value="yes" checked={confirmed} onChange={handleConfirmedChange} />}
          label="I confirm that all the information provided is correct." />
        </Grid>

      </Grid>
    </React.Fragment>
      )


    case 1:
      return (  
          
      <React.Fragment>
        <Typography variant="h6" gutterBottom>
          Review Evidence Details
        </Typography>

        <List disablePadding>
          <ListItem>
            <ListItemText primary="Case Number" secondary={caseNumber} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Officer Id" secondary={authContext.id} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Location" secondary={locationOfSeizure} />
            <Button onClick={navigateToMaps} sx={{ mt: 3, ml: 1 }}>
            show location
            </Button>
          </ListItem>

          <ListItem>
            <ListItemText primary="Date and time siezed" secondary={datetimeSeized} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Evidence item" secondary={evidenceItem} />
          </ListItem>

          <ListItem>
            <ListItemText primary="Evidence description" secondary={evidenceDescription} />
          </ListItem>
        </List>

      </React.Fragment>)
    default:
      throw new Error('Unknown step');
  }
}


const theme = createTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
          <Typography component="h1" variant="h4" align="center">
            Chain Of Custody Form 
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {submitted ? (
            <React.Fragment>
              <Typography variant="h6" sx={{ marginBottom: '20px', color: '#2d2403' }} gutterBottom>
              {evidenceItem.charAt(0).toUpperCase() + evidenceItem.slice(1)} evidence item have been submitted successfully.
              </Typography>
              <Typography variant="subtitle2">
                Assigned Evidnce Number is <strong>EVD-{EvidenceID}</strong>. Make sure to deliver the evidence to the closest police station as soon as possible for further processing.
              </Typography>
            </React.Fragment>

          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                
                <Button variant="contained" onClick={handleNext} sx={{ mt: 3, ml: 1 }}>
                  {activeStep === steps.length - 1 ? 'Confirm Evidence' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}

        </Paper>
      </Container>
    </ThemeProvider>
  );
}