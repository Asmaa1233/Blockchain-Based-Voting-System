// initial contract test. 

const ChainOfCustodyContract = artifacts.require("ChainOfCustody");

contract("ChainOfCustody", (accounts) => {
  let contractInstance;

  before(async () => {
    contractInstance = await ChainOfCustodyContract.deployed();
  });

  it("should create a new evidence item", async () => {
evidenceId = await contractInstance.createEvidence(
      "Case Number",
      "Evidence Item",
      "Description",
      "Location",
      "Submitting Officer",
      14
    );
    console.log("Evidence ID:", evidenceId.toString());
    assert(evidenceId.toString(), "0" , "Evidence ID is incorrect");
  });

  it("should get the evidence item by ID", async () => {
videnceObj = await contractInstance.createEvidence(
      "Evidence Item",
      "Description",
      "Location",
      "Submitting Officer",
      14
    );
    const evidenceId = "0";
    console.log("Evidence ID:", evidenceId);
    const evidence = await contractInstance.getEvidence(evidenceId);
    console.log("Evidence:", evidence);
    assert(evidence.evidenceItem, "Case Number", "Case Number is incorrect");
    assert(evidence.evidenceItem, "Evidence Item", "Evidence item is incorrect");
    assert(evidence.evidenceDescription, "Description", "Evidence description is incorrect");
    assert(evidence.locationOfSeizure, "Location", "Location of seizure is incorrect");
    assert(evidence.submittingOfficer, "Submitting Officer", "Submitting officer is incorrect");
  });

  it("should add a new chain to an evidence item", async () => {
   await contractInstance.createEvidence(
      "Evidence Item",
      "Description",
      "Location",
      "Submitting Officer",
      14
    );
    const evidenceId = "0";
    await contractInstance.addChain(
      evidenceId,
      1,
      "Signature",
      "Comment"
    );
    const evidence = await contractInstance.getEvidence(evidenceId);
    console.log("Evidence:", evidence);
    assert(evidence.chain.length, 1, "Chain length is incorrect");
    const chain = await contractInstance.getChain(evidenceId);
    console.log("Chain:", chain);
    assert(chain.length, 1, "Chain length is incorrect");
    assert(chain[0].transferId, 1, "Transfer ID is incorrect");
    assert(chain[0].transferSignature, "Signature", "Transfer signature is incorrect");
    assert(chain[0].transferComment, "Comment", "Transfer comment is incorrect");
  });

  it("should get the chain of an evidence item by ID", async () => {
  await contractInstance.createEvidence(
      "Evidence Item",
      "Description",
      "Location",
      "Submitting Officer",
      14
    );
    const evidenceId = "0";
    await contractInstance.addChain(
      evidenceId,
      1,
      "Signature",
      "Comment"
    );
    const chain = await contractInstance.getChain(evidenceId);
    console.log("Chain:", chain);
    assert(chain.length, 1, "Chain length is incorrect");
    assert(chain[0].transferId, 1, "Transfer ID is incorrect");
    assert(chain[0].transferSignature, "Signature", "Transfer signature is incorrect");
    assert(chain[0].transferComment, "Comment", "Transfer comment is incorrect");
  });
});
