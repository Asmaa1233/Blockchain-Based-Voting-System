import React, { useState, useEffect, useContext } from "react";
import { getWeb3, getContract } from "../../web3";
import { Contract } from "web3-eth-contract";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/Auth";

import { Card } from "antd";
import { CardMedia, Grid } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Person } from "@mui/icons-material";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import EastRoundedIcon from "@mui/icons-material/EastRounded";
import AddIcon from "@mui/icons-material/Add";


interface EvidenceInfo {
  caseNumber: string;
  evidenceItem: string;
  submittingOfficer: string;
}

////////////////////////////// Fetch evidence ////////////////////////////// 
export const getEvidenceData = async ( evidenceId: number,contract: Contract) => {
  const info = await contract.methods.getEvidence(evidenceId).call();
  return info;
};



///////////////////////////// Evidence card component //////////////////////////////////

const EvidenceCard = ({ evidenceId,contract,}: { evidenceId: number; contract: Contract }) => {
  const [evidenceInfo, setEvidenceInfo] = useState<EvidenceInfo | null>(null);

useEffect(() => {
  const getEvidenceInfo = async () => {
    const info = await getEvidenceData(evidenceId, contract);
    setEvidenceInfo(info); };

    getEvidenceInfo();
  }, [evidenceId, contract]);
  
  return (
    <Card
      style={{
        minHeight: 300,
        maxHeight: 400,
        overflow: "auto",
        background: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "10px",
        boxShadow: "0px 2px 53px -32px #808080",
        textAlign: "center",
      }}>

      <CardMedia
        component="img"
        image="card.png"
        style={{
          objectFit: "cover",
          borderRadius: "50px",
          width: "100px",
          height: "100px",
          margin: "auto",
          padding: "30px",
          background: "#2b1717",
        }}/>

      {evidenceInfo && (
        <>
          <p className="EVD">{`EVD-${evidenceId}`}</p>
          <p><span style={{ verticalAlign: "middle" }}> <Person fontSize="small" /></span> {evidenceInfo.submittingOfficer}</p>
        </>
      )}

      <CardActions>
        <Link to={`/details/${evidenceId}`}> Show Details <EastRoundedIcon /></Link>
      </CardActions>

    </Card>
  );
};


///////////////////////////// Loading evidence cards  //////////////////////////////////

const EvidenceList = ({ contract }: { contract: Contract }) => {
  const [lastEvidenceId, setLastEvidenceId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchId, setSearchId] = useState<string | null>(null);
  const authContext = useContext(AuthContext);


  // fetching last evidence id
  useEffect(() => {
    const getLastEvidenceId = async () => {
      const id = await contract.methods.getLastEvidenceId().call();
      setLastEvidenceId(parseInt(id));
    };
    getLastEvidenceId();
  }, [contract]);


  
// 12 cards per page 
  const perPage = 12;

// rendering evidence cards //change it to search be case.
  const renderEvidenceCards = () => {
    const cards = [];
    if (searchId !== null) {
      const matches = searchId.match(/^EVD-(\d+)$/);
      if (matches !== null) {
        const evidenceId = parseInt(matches[1]);
        if (lastEvidenceId !== null &&  evidenceId >= 1000 && evidenceId <= lastEvidenceId) {
          cards.push(
            <Grid key={evidenceId}item xs={12} sm={4} md={4} lg={4} sx={{ padding: "10px" }} >
              <EvidenceCard evidenceId={evidenceId} contract={contract} />
            </Grid>
          );
        }
      }
    } else {
      const startIndex = (currentPage - 1) * perPage + 1000;
      //return the smallest value among them.
      const endIndex = Math.min(startIndex + perPage, lastEvidenceId! + 1);
      for (let i = startIndex; i < endIndex; i++) {
        cards.push(
          <Grid key={i} item xs={12} sm={4} md={4} lg={2}  sx={{ padding: "10px" }} >
            <EvidenceCard evidenceId={i} contract={contract} />
          </Grid>
        );
      }
    }
    return cards;
  };



  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    setSearchId(null);
};

  return (
    <div>
      <Grid container spacing={2} justifyContent="space-between" alignItems="flex-start" >
        {/* Add Evidence button */}
        {authContext.role === "CSI" && (
          <Grid item>
            <Button className="EVDbutton" variant="contained" startIcon={<AddIcon />} sx={{ bgcolor: "#2b1717" }} component={Link} to="/">
              Add Evidence
            </Button>
          </Grid>
        )}

        {/* Search */}
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <TextField className="serach" variant="outlined" fullWidth
            onChange={(e) => setSearchId(e.target.value)}
            InputProps={{ startAdornment: ( <InputAdornment position="start"> <SearchIcon /> </InputAdornment>
              ),}}/>
        </Grid>

        {/* Evidence Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2} justifyContent="center">
            {lastEvidenceId && renderEvidenceCards()}
          </Grid>
        </Grid>

        {/* Pagination */}
        <Grid item xs={12} sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
          //round the number up to the nearest integer greater than or equal to the given number.
            count={Math.ceil((lastEvidenceId! - 999) / perPage)}
            page={currentPage}
            onChange={handlePageChange}
            size="large" />
        </Grid>
      </Grid>
    </div>
  );
};

////////////////////// Dashboard Page ///////////////////////////

const Dashboard = () => {
  const [contractInstance, setContractInstance] = useState<Contract | null>( null);
  
  const init = async () => {
    try {
      const web3Instance = await getWeb3();
      const networkId = await web3Instance.eth.net.getId();
      const contractInstance = await getContract(web3Instance, networkId);
      setContractInstance(contractInstance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    init();
  }, []);

  return (
    <div>
      {contractInstance && <EvidenceList contract={contractInstance} />}
    </div>
  );
};

export default Dashboard;
