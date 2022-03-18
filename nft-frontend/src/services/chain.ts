import { inject, HttpClient } from "aurelia";
import { ITokenContract } from "../interfaces/ITokenContract";
import { Toastr } from "./toastr";
import Web3 from "web3";
import { INft } from "../interfaces/INft";

const CHAIN_ID = 4;
const CHAIN_ID_HEX = "0x4";
const MINT_COST = 0.0001;
const NFT_CONTRACT_ABI: any = [{ "inputs": [{ "internalType": "address", "name": "_teamAddress", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Paused", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "previousAdminRole", "type": "bytes32" }, { "indexed": true, "internalType": "bytes32", "name": "newAdminRole", "type": "bytes32" }], "name": "RoleAdminChanged", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleGranted", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "indexed": true, "internalType": "address", "name": "account", "type": "address" }, { "indexed": true, "internalType": "address", "name": "sender", "type": "address" }], "name": "RoleRevoked", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": false, "internalType": "address", "name": "account", "type": "address" }], "name": "Unpaused", "type": "event" }, { "inputs": [], "name": "DEFAULT_ADMIN_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAX_MINT_PER_ADDRESS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MAX_TOKENS", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "MINTER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PAUSER_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "WITHDRAWAL_ROLE", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "baseUri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }], "name": "getRoleAdmin", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "grantRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "hasRole", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "mintCost", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nextTokenId", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "pause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "paused", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "renounceRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "role", "type": "bytes32" }, { "internalType": "address", "name": "account", "type": "address" }], "name": "revokeRole", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_baseUri", "type": "string" }], "name": "setBaseUri", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "teamAddress", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "uint256", "name": "index", "type": "uint256" }], "name": "tokenOfOwnerByIndex", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }], "name": "tokensOfOwner", "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "unpause", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "payable", "type": "function" }];

@inject(HttpClient, Toastr)
export class Chain {
    public currentAccount: string;
    public ethereum: any;
    public isConnected: boolean;
    public maxMintPerAddress: number = 0;
    public maxTokens: string = "-";
    public mintCost: number = 0;
    public nextTokenId: string = "-";
    public nftContract: ITokenContract;
    public nftContractAddress = "0xfddafDA8ED53d96FFe5d030d009C5067571C5209";
    public nftContractPaused: boolean = false;
    public nfts: INft[] = [];
    public tokenBalance: number = 0;
    public tokensOfOwner: string[] = [];

    constructor(
        public http: HttpClient,
        public toastr: Toastr
    ) {
        this.currentAccount = "";
        this.isConnected = false;
        this.ethereum = (window as any).ethereum;
        this.nftContract = {
            abi: [],
            address: "",
            currentSupply: 0,
            totalSupply: 0
        };
    }

    connect() {
        let self = this;
        this.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then((accounts) => {
                if (accounts.length === 0) {
                    // MetaMask is locked or the user has not connected any accounts
                    this.toastr.error("Please create an account in Metamask", "Error");
                } else if (accounts[0] !== self.currentAccount) {
                    self.currentAccount = accounts[0];
                    self.isConnected = true;
                    if (self.ethereum.networkVersion != CHAIN_ID) {
                        self.ethereum
                            .request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID_HEX }] });
                    }
                    self.ethereum.on('chainChanged', () => window.location.reload());
                    self.ethereum.on('accountsChanged', () => window.location.reload());
                    self.getData();
                }
            })
            .catch((err) => {
                self.isConnected = false;
            });

    }

    getData() {
        if (!this.isConnected) return;

        let self = this;
        let web3 = new Web3(this.ethereum);
        let instance = new web3.eth.Contract(NFT_CONTRACT_ABI, this.nftContractAddress);

        let queries = [];

        queries.push(instance.methods.MAX_TOKENS().call());
        queries.push(instance.methods.nextTokenId().call());
        queries.push(instance.methods.mintCost().call());
        queries.push(instance.methods.MAX_MINT_PER_ADDRESS().call());
        queries.push(instance.methods.balanceOf(this.currentAccount).call());
        queries.push(instance.methods.tokensOfOwner(this.currentAccount).call());
        queries.push(instance.methods.paused().call());

        Promise.all(queries)
            .then(response => {
                self.maxTokens = response[0];
                self.nextTokenId = response[1];
                self.mintCost = parseInt(response[2]);
                self.maxMintPerAddress = parseInt(response[3]);
                self.tokenBalance = parseInt(response[4]);
                self.tokensOfOwner = response[5];
                self.nftContractPaused = response[6] == "true";

                self.loadTokenData();
            });
    }

    loadTokenData() {
        let self = this;
        let web3 = new Web3(this.ethereum);
        let instance = new web3.eth.Contract(NFT_CONTRACT_ABI, this.nftContractAddress);

        this.nfts = [];
        for (let x = 0; x < this.tokensOfOwner.length; x++) {
            instance.methods.tokenURI(this.tokensOfOwner[x]).call()
                .then(response => {
                    self.http.fetch(response)
                        .then((json: any) => {
                            json.json().then(result => {
                                let token: INft = {
                                    description: result.description,
                                    image: result.image,
                                    name: result.name,
                                    tokenId: parseInt(this.tokensOfOwner[x]),
                                    attributes: result.attributes
                                };

                                this.nfts.push(token);
                            });
                        });
                });

        }
    }

    mintNft(amount: number) {
        let self = this;
        let web3 = new Web3(this.ethereum);
        let instance = new web3.eth.Contract(NFT_CONTRACT_ABI, this.nftContractAddress);
        let value: number = MINT_COST * 10 ** 18;

        instance.methods.mint(amount).send({ from: this.currentAccount, value: value })
            .then(() => {
                this.toastr.clear();
                this.toastr.success("Your NFT(s) are minted and should be in your wallet shortly", "Congratulations");
                self.getData();
            })
            .catch((err) => {
                this.toastr.clear();
            });
        this.toastr.infoLong("Busy minting your NFT...", "Please wait");
    }
}