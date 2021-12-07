import React, {Component} from 'react';
import { Button, Form, FormControl,InputGroup } from 'react-bootstrap';
import Web3 from 'web3';
import {tokenABI} from './config' 
import { MDBDataTableV5 } from 'mdbreact';

 const web3                 = new Web3(new Web3.providers.HttpProvider('https://songbird.towolabs.com/rpc'));
class Display extends Component {
    constructor(props) {
        super(props)
        this.state = {
           tokenAddress : '',
           tokenID      : '',
           tokenName    : '',
           ownerAddress : '',
           description  : '',
           tokenImgURI  : '',
           attributte   : [],
           img          : ''
        }
    }
    async display(){
        this.setState({
            tokenName    : '',
            ownerAddress : '',
            description  : '',
            tokenImgURI  : '',
            attributte   : [],
            img          : ''
        })
        if(this.state.tokenAddress == ""|| this.state.tokenID == ""){
            alert("please check address or tokenID")
            return
        } 
        else {
            let  tokenContract
            let  ownerAddress
            let  tokenURI
            try{ 
                let tokenAddress = web3.utils.toChecksumAddress(this.state.tokenAddress)

                this.setState({
                    tokenAddress : tokenAddress
                })
                tokenContract = new web3.eth.Contract(tokenABI,this.state.tokenAddress)
                ownerAddress = await tokenContract.methods.ownerOf(this.state.tokenID).call();
                tokenURI = await tokenContract.methods.tokenURI(this.state.tokenID).call();
                this.setState({
                    ownerAddress: ownerAddress
                })


            }catch(err){
                alert("Please check token address or token ID, It is possible Token Id is invalid number")
                return
            }
            if (tokenURI == ""){
                return
            } 
            else {

                //=========================IPFS==================================
                if(tokenURI.includes("ipfs")){
                    tokenURI = "https://ipfs.io/ipfs/" + tokenURI.slice(7, tokenURI.length)
                    console.log("tokenURI", tokenURI)
                    let response = await fetch(tokenURI)
                    let responseJson = await response.text()
                    let res
                    try{
                        res = JSON.parse(responseJson);
                        try{
                            this.setState({
                                tokenName : res.name
                            })
                        }catch(err){
                            this.setState({
                                tokenName : "none"
                            })
                        }

                        try{
                            this.setState({
                                description : res.description
                            })
                        }catch(err){
                            this.setState({
                                description : "none"
                            })
                        }

                        try{
                            this.setState({
                                tokenImgURI : res.image
                            })
                        }catch(err){
                            try {
                                this.setState({
                                    tokenImgURI : res.animation_url
                                })
                            }catch(err){
                                this.setState({
                                    tokenImgURI : ""
                                })
                            }
                        }

                        try{
                            this.setState({
                                attributte : res.attributes
                            })
                        }catch(err){
                            this.setState({
                                attributte : "none"
                            })
                        }

                    }catch(err){
                        console.log(responseJson)
                        responseJson =  responseJson.slice(0,186).concat("}")
                        res = JSON.parse(responseJson);
                        try{
                            this.setState({
                                tokenName : res.name
                            })
                        }catch(err){
                            this.setState({
                                tokenName : "none"
                            })
                        }
                        try{
                            this.setState({
                                description : res.description
                            })
                        }catch(err){
                            this.setState({
                                description : "none"
                            })
                        }

                        try{
                            this.setState({
                                tokenImgURI : res.image
                            })
                        }catch(err){
                            try {
                                this.setState({
                                    tokenImgURI : res.animation_url
                                })
                            }catch(err){
                                this.setState({
                                    tokenImgURI : ""
                                })
                            }
                        }

                        try{
                            this.setState({
                                attributte : res.attributes
                            })
                        }catch(err){
                            this.setState({
                                attributte : "none"
                            })
                        }
                    }
                    try{
                        if(this.state.tokenImgURI.includes("ipfs")){
                            let imgURI = "https://ipfs.io/ipfs/" + this.state.tokenImgURI.slice(7, this.state.tokenImgURI.length)
                            this.setState({
                                img : imgURI
                            }) 
                        }
                    }catch(err){

                    }
                   
    
                }
                //========================nomarl token uri 
                else {
                    try{
                        
                        await fetch(tokenURI)
                        .then(res => res.json())
                        .then(


                        async (res) => {
                            console.log(res)
                            this.setState ({
                                tokenName : res.name,
                                description : res.description,
                                tokenImgURI : res.image,
                                attributte : res.attributes
                            })  
                        })
                        if(this.state.tokenImgURI.includes("ipfs")){
                            return
                        }
                        else {
                            this.setState({
                                img : this.state.tokenImgURI
                            })
                        }
    
                    }catch(err){
                       
                    }
                }
            }
        }
    }


    render () {


        const datatable = {
            columns : [
              {
                  label : 'Trait',
                  field : 'trait_type',
              },
              {
                  label : 'value',
                  field : 'value',
              },
            ],
            rows : this.state.attributte,
          }
        const handleTokenAddress =  (e) => {
            let addLabel  = e.target.value
            this.setState({
                tokenAddress : addLabel
            }) 
        }   

        const handleTokenID =  (e) => {
            let addLabel  = e.target.value
            this.setState({
                tokenID : addLabel
            }) 
        }    

        return (
            <div>
                <br/><br/>
                <h2>Display NFT Token information</h2><hr/>
                <Form><br/>
				    <h3>Input</h3><br/>
					<InputGroup className="mb-3">
                            <InputGroup.Text>Token address</InputGroup.Text>
                            <FormControl aria-label="Dollar amount (with dot and two decimal places)" type="text" placeholder="Please input token address" onChange={handleTokenAddress} defaultValue={this.state.tokenAddress}/>
                    </InputGroup><br/><br/>
                    <InputGroup>
                            <InputGroup.Text>Token ID</InputGroup.Text>
                            <FormControl aria-label="Dollar amount (with dot and two decimal places)" type="text" placeholder="please input token Id"       onChange={handleTokenID} defaultValue={this.state.tokenID}/>
                    </InputGroup><br/><br/>
                    <Button variant="primary" onClick={() => this.display()} > Display   </Button><hr/>

                    <div className= "row">
                        
                        <div className = "col-8">
                             <h4><b>Token   Name</b> &nbsp;&nbsp;&nbsp;&nbsp;: {this.state.tokenName}</h4><br/>
                             <h4><b>OwnerAddress </b>: {this.state.ownerAddress}</h4><br/>
                             <h4><b>Description &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> : {this.state.description}</h4><br/>
                             <h4><b>Atrribute  &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> </h4><br/>
                             <MDBDataTableV5 hover entriesOptions={[10,20,50,100,200,500,1000]} entries={50} pagesAmount={10} data={datatable} materialSearch/><br/><br/>
                        </div>
                        <div className = "col-4">
                              <h4><b>Token   Image</b> &nbsp;&nbsp;&nbsp;&nbsp;: </h4><br/>
                              <img src={this.state.img} width={100+ "%"} />
                        </div>
                    </div>
                </Form>
            </div>
        );

    }
}
export default Display;