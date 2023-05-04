
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Contract } from 'web3-eth-contract';
import Web3 from "web3";
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import { getEvidenceData } from './Dashboard';
import { AuthContext } from "../../contexts/Auth";
import axios from "../../axios";
import { getWeb3, getContract } from '../../web3';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Paper, Typography } from '@mui/material';
import { Spin, Card, Input, Button, Form } from 'antd';




type EvidenceInfo = {
  caseNumber: string;
  evidenceItem: string;
  evidenceDescription: string;
  latitude: string;
  longitude: string;
  submittingOfficer: string;
  datetimeSeized: string;
  locationOfSeizure: string;
}



//////////// Displaying Evidence Details  ///////////////////////
export const Display = ({ evidenceId, contract }: { evidenceId: number; contract: Contract }) => {
  const [evidenceInfo, setEvidenceInfo] = useState<EvidenceInfo | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);


// fetching evidence data 
  useEffect(() => {
    const getEvidenceInfo = async () => {
      const info = await getEvidenceData(evidenceId, contract);
      setEvidenceInfo(info);

    };
    getEvidenceInfo();
  }, [evidenceId, contract]);


  // turning the stored map cordinates into numbers
  const position = {
    lat: evidenceInfo ? parseFloat(evidenceInfo.latitude) : 0,
    lng: evidenceInfo ? parseFloat(evidenceInfo.longitude) : 0,

  };

// map styling
  const containerStyle = {
    height: "500px",
    display: "flex",
    alignItems: "center",
  };


  return (

    <div>

      <>
        <h1 className='detailsHeadings'>Evidence Seizure Details</h1>
        {evidenceInfo && (
          <Grid container alignItems="center" spacing={2}>

            <Grid item className="details" xs={12} sm >
              <img src="/cardRed.png" alt="evidence card" />

              <div className='EVDText'>

                <Typography variant="body2">
                  <b>Case Number: </b> {evidenceInfo.caseNumber}
                </Typography>

                <Typography variant="body2">
                  <b>Evidence ID: </b> {`EVD-${evidenceId}`}
                </Typography>

                <Typography variant="body2">
                  <b>Evidence Item:</b> {evidenceInfo.evidenceItem}
                </Typography>

                <Typography variant="body2">
                  <b>Evidence Description:</b> {evidenceInfo.evidenceDescription}
                </Typography>

                <Typography variant="body2">
                  <b>Seized By: </b> {evidenceInfo.submittingOfficer}
                </Typography>

                <Typography variant="body2">
                  <b>Date and Time Seized: </b> {evidenceInfo.datetimeSeized}
                </Typography>

                <Typography variant="body2">
                  <b>Location of Seizure: </b> {evidenceInfo.locationOfSeizure}
                </Typography>
              </div>

            </Grid>

          </Grid>
        )}

        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <Alert variant="filled" severity="info">
              Please report any inconsistent information to BCoC. Necessary mesures will be taken upon reciving reports.
            </Alert>
          </Grid>
        </Grid>


        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <h1 className='detailsHeadings'>Location Cordinates </h1>

            {evidenceInfo?.latitude && evidenceInfo?.longitude ? (
              <Spin spinning={!mapLoaded}>
                <LoadScript googleMapsApiKey="AIzaSyBnE5apKgSAa9eb0DfZhaksIHj94xscmpI" onLoad={() => setMapLoaded(true)}>
                  <GoogleMap center={position} zoom={14} mapContainerStyle={containerStyle}>
                    <MarkerF position={position} />
                  </GoogleMap>
                </LoadScript>
              </Spin>
            ) : (
              <Alert variant="filled" severity="info">
                Location not available
              </Alert>
            )}
          </Grid>
        </Grid>
      </>

    </div>

  );
};




type ChainInfo = {
  releaserId: string;
  receiverId: string;
  datetimeReleased: string;
  transferSignature: boolean;
  transferComment: string;
  submitterRole: string

};
/////////////////////////// Displaying transfer Form and Transfer Details ///////////////////////
const Details = () => {
  const [transferComment, setTransferComment] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [datetimeReleased, setDatetimeReleased] = useState("");
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [contract, setContract] = useState<any | null>(null);
  const [chainData, setChainData] = useState<ChainInfo[]>([]);
  const authContext = useContext(AuthContext);
  const [isDisabled, setIsDisabled] = useState<boolean>(false); 
  const [evidenceInfo, setEvidenceInfo] = useState<EvidenceInfo | null>(null);


  // getting the current date and time 
  useEffect(() => {
    const now = new Date();
    const datetimeString = now.toLocaleString('en-US', { hour12: false });
    setDatetimeReleased(datetimeString);
  }, []);


  // initializing the smart contract
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

  useEffect(() => {
    init();
  }, []);



// fetching evidence record 
  useEffect(() => {
    const getEvidenceInfo = async () => {
      if (contract) {
        const info = await getEvidenceData(Number(evidenceId), contract);
        setEvidenceInfo(info);
      }
    };

    getEvidenceInfo();
  }, [evidenceId, contract]);



// restricting access to the form inputs based on reciver value. 
  useEffect(() => {
    const checkLastChainData = () => {
      const lastChainData = chainData[chainData.length - 1];
      // Set the 'isDisabled' state variable to false if the fetched receiverId  match the current user id and the reciver have signed the previous transfer.
      if (lastChainData && lastChainData.receiverId === authContext.id && lastChainData.transferSignature== true ) {
        setIsDisabled(false);
      }
      // Set the 'isDisabled' state variable to false if there is no transfers  and the submitting officer is the current user
      else if (!lastChainData && evidenceInfo && evidenceInfo.submittingOfficer === authContext.id) {
        setIsDisabled(false);
      }
      // if none of the conditions were met, set isDisabled to true
      else {
        setIsDisabled(true);
      }
    };

    checkLastChainData();
  });



//calling auth/validid endpoint to verify user id.
  const validateId = (id: any) => {
    return new Promise<void>((resolve, reject) => {
      axios.post("/auth/validid", { id })
        .then(response => {
          if (response.data.id) {
            resolve();
          } else {
            reject(`${id} does not exist!`);
          }
        })
        .catch(error => {
          reject(`${id} does not exist!`);
        });
    });
  };



  //checking if receiver id matches releaser id and passing the parameter to validateid function
  const validateReceiverId = (rule: any, value: any) => {
    if (value === authContext.id) {
      return Promise.reject('Receiver ID must be different from Releaser ID');
    }
    return validateId(value);
  };



  //checking if all the input fileds meets the setted rules. 
  const validateFields = async () => {
    try {
      await form.validateFields();
      return true;
    } catch (error) {
      console.error(error);
      window.alert("Please complete required information");
      return false;
    }
  };



// storing chain data in the blockchain
  const handleAddChain = async () => {
    if (!web3) {
      console.error("Web3 is null");
      return;
    }
    // handle the case when the variables are null 
    if (!evidenceId || !receiverId || !datetimeReleased || !transferComment) {
      console.error("Required fields are null");
      window.alert("Please complete required information");
      return;
    }

    try {
      const accounts = await web3.eth.getAccounts();
      if (!accounts.length) {
        //handle the case when no account is added to the wallet
        console.error("No available account in the wallet");
        window.alert("Please add an account to your wallet");
        return;
      }

      // check if the form is valid 
      const valid = await validateFields();
      if (!valid) {
        console.error("Form validation failed");
        return;
      }

      //estimating gas price 
      const gasLimit = await contract.methods
        .addChain(evidenceId, authContext.id, receiverId, "undefined", datetimeReleased, transferComment)
        .estimateGas({ from: accounts[0] });
      
      //running the transaction
      await contract.methods
        .addChain(evidenceId, authContext.id, receiverId, "undefined", datetimeReleased, transferComment)
        .send({ from: accounts[0], gas: gasLimit });

      // reload the page once the transaction is completed
      window.location.reload();

    } catch (error: Error | any) {
      //handle the case when the user reject the transaction 
      if (error.code === 4001) {
        console.error("User rejected the transaction");
        window.alert("You rejected the transaction. Please try again.");
      } else {
        console.error(error);
        //handle the case when an error occures throughout the transaction. 
        window.alert("An error occurred while creating the chain. Please try again.");
      }
    }
  };


// fetching chain Data
  useEffect(() => {
    const getChainInfo = async () => {
      if (!evidenceId || !contract) {
        return;
      }
      const chain = await contract.methods.getChain(evidenceId).call();
      setChainData(chain);
    };
    getChainInfo();
  }, [evidenceId, contract]);



  // sining the transfer initiated by the releaser. 
  const handleSign = async (chainLength: number, receiverId: string) => {

    //only the receiver can invoke this function 
    if (receiverId === authContext.id) {
    }

    if (!web3) {
      // handle the error when web3 is null
      console.error("Web3 is null");
      return;
    }

    try {
      // estimating gas before perfoming the transaction
      const gasLimit = await contract.methods.signChain(evidenceId, chainLength).estimateGas({ from: (await web3.eth.getAccounts())[0] });
      
      //running the transaction
      await contract.methods.signChain(evidenceId, chainLength).send({ from: (await web3.eth.getAccounts())[0], gas: gasLimit });
      
      //updating chain data with the new chain
      const chain = await contract.methods.getChain(evidenceId).call();
      setChainData(chain);

    } catch (error: Error | any) {
      //handle the case when the user reject the transaction 
      if (error.code === 4001) {
        console.error("User rejected the transaction");
        window.alert("You rejected the transaction. Please try again.");
      } else {
        console.error(error);
        //handle the case when an error occures throughout the transaction
        window.alert("An error occurred while creating the evidence. Please try again.");
      }
    }
  };


// handling transfer table change

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);};

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);};



const [form] = Form.useForm();

  return (

    <div>{contract && <Display evidenceId={Number(evidenceId)} contract={contract} />} <div>

        <h1 className="detailsHeadings"> Transfer Form </h1>

        <Card className="transferForm">
          <Form form={form}>
            <Grid container spacing={2}>

              <Grid item xs={6}>
                <Form.Item
                  name="receiverId"
                  label="Receiver ID"
                  rules={[
                    {required: true, message: 'Please input Relaser ID!',},
                    { pattern: /^\d+$/, message: 'Please input numbers only!', },
                    {validator: validateReceiverId,},]}>
                  <Input disabled={isDisabled} value={receiverId} onChange={(e) => setReceiverId(e.target.value)} />
                </Form.Item>
              </Grid>

            </Grid>

            <Form.Item
              name="transferComment"
              label="Comment"
              rules={[
              { required: true, message: 'Please input Comment!' }, 
              { pattern: /^[a-zA-Z0-9,.()\\/"' ]*$/, message: 'Invalid characters' }]}>
              <Input.TextArea disabled={isDisabled}
                style={{ marginRight: '30px' }}
                value={transferComment}
                onChange={(e) => setTransferComment(e.target.value)}/>
            </Form.Item>

            <Form.Item>
              <Button disabled={isDisabled} className="transferBtn" onClick={handleAddChain}>
                Submit
              </Button>
            </Form.Item>

          </Form>
        </Card>
      </div>
      <>

     <h1 className='detailsHeadings'> Transfer Details</h1>

        <TableContainer className="table" component={Paper}>
          <Table>
            <TableHead>

              <TableRow >
                <TableCell className='transferTableHeaders' >Realeser ID</TableCell>
                <TableCell className='transferTableHeaders'>Realased Date</TableCell>
                <TableCell className='transferTableHeaders'>Receiver ID</TableCell>
                <TableCell className='transferTableHeaders'>Realeser Comment</TableCell>
                <TableCell className='transferTableHeaders'>Status</TableCell>
              </TableRow>

            </TableHead>

            <TableBody>
              {chainData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  let status = "";
                  let cellContent = null;
                  let statusClass = "";
                  // show signed status if transferSignature is true
                  if (row.transferSignature) {
                    status = "Signed";
                    statusClass = "status-green";
                  } else if (row.receiverId === authContext.id) {
                    if (row.transferSignature) {
                      status = "Signed";
                      statusClass = "status-green";
                      cellContent = status;

                  // show a sign button if reciverID equals the current user id and transferSignature is equal to false
                    } else {
                      const chainLength = (page * rowsPerPage) + index;
                      cellContent = (
                        <Button className="statusBtn" onClick={() => handleSign(chainLength, row.receiverId)}>
                          Sign
                        </Button>
                      );}

                  // show a pending status if none of the conditions achived.
                  } else {
                    status = "Pending";
                    statusClass = "status-yellow";
                  }

                  return (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">{row.releaserId}</TableCell>
                      <TableCell>{row.datetimeReleased}</TableCell>
                      <TableCell>{row.receiverId}</TableCell>
                      <TableCell>{row.transferComment}</TableCell>
                      <TableCell > <div className={statusClass}>{cellContent || status}</div></TableCell>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={chainData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </>
    </div>
  );
};

export default Details;
