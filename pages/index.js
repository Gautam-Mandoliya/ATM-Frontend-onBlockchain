import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState(undefined);
  const [withdrawalAmount, setWithdrawalAmount] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm && depositAmount > 0) {
      let tx = await atm.deposit(depositAmount);
      await tx.wait();
      getBalance();
      setDepositAmount(0);
    }
  };

  const withdraw = async () => {
    if (atm && withdrawalAmount > 0) {
      let tx = await atm.withdraw(withdrawalAmount);
      await tx.wait();
      getBalance();
      setWithdrawalAmount(0);
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p style={{ color: 'red' }}>ERROR!! Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <div className="conn-box">
          <button className="conn" onClick={connectAccount} style={{ fontSize: "36px" }}>
            Connect your Metamask wallet </button>
        </div>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <main >

        <div className="ab">
          <div className="a-b">
            <p className="acc"><span className="acc1">Your Account :</span></p> <p> <span className="acc2">{account}</span></p>
            <p className="bal"><span className="bal1">Balance :</span> <span className="bal2">{balance}</span></p>
          </div>
        </div>

        <div className="d-w">
          <div className="depo">
            <div className="inp1">
            <input className="depo-ph" type="number" value={depositAmount} onChange={(e) => setDepositAmount(parseInt(e.target.value))}
              placeholder="Enter amount to deposit" />
            </div>
            <button className="depo-b" onClick={deposit}>DEPOSIT</button>
          </div>
          <div className="with">
            <div className="inp2">
            <input className="with-ph" type="number" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(parseInt(e.target.value))}
              placeholder="Enter withdrawal amount" />
              </div>
            <span > <button className="with-b" onClick={withdraw}>WITHDRAW</button></span>
          </div>
          <div class="fox-box">
            <img src="https://media.giphy.com/media/xsE65jaPsUKUo/giphy.gif" alt="Fox saying HI!" class="fox" />
          </div>
        </div>
      </main>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <div className="wlcm">
        <header className="heading">
          <h1 className="text">Welcome to my Assessment</h1>
        </header>
      </div>
      {initUser()}
      <style jsx global>{`
    
        @import url("https://fonts.googleapis.com/css?family=Gruppo");
        .heading{
          padding: 50px 0px 50px;
          display: inline-block;
          padding: 0.25em 0;
          border-radius: 25px;
          background:url("https://media4.giphy.com/media/l3vRnoppYtfEbemBO/giphy.gif?cid=ecf05e470dmgbwfbsh69kqxdcjjvr0c1nmqr5qnxfeaqt7ii&ep=v1_gifs_search&rid=giphy.gif&ct=g");
        
        }
        .container .wlcm {
          background:url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8R1L7cM1EQpV1pyfKrEr4KPlskgM-KMo5XVOgYss68i1vXDJvTXzBds56m34tfpiGVzQ&usqp=CAU");
          text-align: center;
          padding: 40px;
        }
        .text {
          font-family: "Gruppo", sans-serif;
          font-size: 36px;
          color: white;
          padding: 0px 20px;
        }
        .conn {
          font-family: "Gruppo", sans-serif;
          text-align: center;
          border-radius: 28px;
          padding: 5px 10px;
        }
        .conn:hover {
          background: red;
          background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-p79t8mwMXpZhoMUfYJVHzE1dJulv8PpdDw&usqp=CAU");
          background-position: center;
          background-size: cover;
        }
        .conn-box {
          text-align: center;
          margin-top: 200px;
        }
        .fox-box{
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          pointer-events: none;
          z-index: -1;
        }
        .fox {
          max-width: 40%;
        }
        .ab{
          position:relative;
          margin-top:50px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .a-b{
        text-align:   center;
        background:   url('https://cdn.shopify.com/s/files/1/0311/0387/7259/products/10_4ac6da2c-11bd-438f-b763-7a859d8da147_800x.jpg?v=1620914358');
        border-radius:50px;
        width: 500px;
        height:180px;
        color:white;
        padding:20px 0px;
        }
        .acc1{
          color:orange;
          font-family: "Gruppo", sans-serif;
          font-weight: bold;
          font-size:30px;
        }
        .bal1{
          color:orange;
          font-family: "Gruppo", sans-serif;
          font-weight: bold;
          font-size:30px;
        }
        .acc2{
          font-family: 'Cinzel Decorative', cursive;
        }
        .bal2{
          font-size:25px;
          
          font-family: 'Cinzel Decorative', cursive;
          font-weight: bold;
          box-shadow: 0 0 0 1px orange;
          text-align:center;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 120px; 
          height: 30px;
          margin-top:10px;
          margin-left:190px;
        }
        .d-w {
          margin-top:50px;
          display: flex;
          justify-content: space-between;
        }
        .depo{
          background:url('https://i.pinimg.com/736x/45/32/a7/4532a7801d447f2b027689fb43d3f617.jpg');
          box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
          background-repeat:repeat;
          width:250px;
          height:150px;
          margin-left:200px;
          border-radius:40px;
          text-align:center;
          
        }
        .inp1{
          padding-bottom:20px;
          margin-top:30px;
        }
        .depo-ph {  
          height:20px;
          width:160px; 
        }
        
      .depo-b{
        width:120px;
        height:45px;
        font-family: 'Cinzel Decorative', cursive;
        font-size:20px;  
      }
      .depo-b:hover{
        background-color: rgba(94, 205, 94, 0.3);
      }
      .inp2{
        padding-bottom:20px;
        margin-top:30px;
      }
      .with{
        background:url('https://i.pinimg.com/736x/45/32/a7/4532a7801d447f2b027689fb43d3f617.jpg');
          box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
          background-repeat:repeat;
          width:250px;
          height:150px;
          border-radius:40px;
          text-align:center;
          margin-right:200px;
      }
      .with-ph {  
        height:20px;
          width:160px; 
      }
      .with-b{
        width:150px;
        height:45px;
        font-family: 'Cinzel Decorative', cursive;
        font-size:20px;
      }
      .with-b:hover{
        background-color: rgba(251, 82, 82, 0.3);
      }

      `}</style>
    </main>
  );
}
