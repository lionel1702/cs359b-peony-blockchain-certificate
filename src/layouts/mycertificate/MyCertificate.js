import React, { Component } from 'react'
import { AccountData, ContractData, ContractForm } from 'drizzle-react-components'
import { Card, Col, Row, Layout, Alert, message, Button, Menu } from 'antd';
const { Content, Sider, Header } = Layout;
import PropTypes from 'prop-types'
import badget from '../../../public/img/MSFTBadge.png'
import defaultBadget from '../../../public/img/Peony.jpg'
import CertBackground from '../../../public/img/CertBackGround.jpg'
class MyCertificate extends Component {
  constructor(props, context) {
    super(props)
    this.contracts = context.drizzle.contracts;
    this.state = {
      mode: 'default'
    }
  }

  onSelectTab = ({key}) => {
    this.setState({
      mode: key
    });
  }

  lockDownAccount = () => {
    this.contracts.PeonyCertificate.methods.lockAccount().send({from: this.props.accounts[0]});
  }

  renderContent = () => {
    const { mode, tokenURIs } = this.state;
    var d = new Date();
    if (mode != 'default') {
      // var sp = tokenURIs.split(", ");
      // var tokenId = tokenIds.split(", ");
      var obj = JSON.parse(this.state.tokenURIs[mode]);
      var stub_signerName = ['John Biden', 'Bush George', 'JinYian', 'Hans', 'Andy'];
      var stub_signerSignature = ['John', 'BG', 'JYian', 'H', 'A'];
      var stub_signerAddr = ['0x012312432235325','0x0412325325454','0x124143534643', '0x0123122412412','0x012312312412412'];
      var signerNames = [];
      var signerSignartures = [];
      var signerAddrs = [];
      stub_signerName.forEach(function(c, i){
        signerNames.push(<td>{c}</td>);
      });
      stub_signerSignature.forEach(function(c){
        signerSignartures.push(<td><i>{c}</i></td>);
      });
      return( 
                <div>
                <div>Token Id: {this.state.tokenIds[mode]}</div>
                <div>Recipient Address: {obj.address}</div>
                <div>Recipient Name: {obj.recipientName}</div>
                <div>Certificate Title: {obj.title}</div>
                <div>Certificate Content: {obj.body}</div>
                <div>Background Image Url: {obj.bckgrdImg}</div>
                <div>Badge Image Url: {obj.bdgImg}</div>
                <div>Issuer Address: <ContractData contract="PeonyCertificate" method="GetIssuerAddressByTokenId" methodArgs={this.state.tokenIds[mode]}/></div>
                <div hidden={this.state.tokensExpTime[mode] == 0} >Expiration Time: {this.state.tokensExpTime[mode]}</div>
                <h3 hidden={this.state.tokensExpTime[mode] == 0 || Date.now() <= this.state.tokensExpTime[mode]} style={{color: 'red'}}>This Certificate Is Expired!!</h3>
                <div>Is the Certificate Valid: <ContractData contract="PeonyCertificate" method="isCertificateValid" methodArgs={this.state.tokenIds[mode]}/></div>                 
                <br/>
                <br/>
                <div id="Certificate Shot" style={{width:'800px',height:'566px',padding: "30px 30px 30px 30px",backgroundImage: `url(${CertBackground})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' }}>
                    <div id="Certificate Paper" style={{padding: "50px 50px 50px 50px", horizontalAlign: "middle", verticalAlign: "middle"}}>
                    <table style={{width: '700', height: '466px' , horizontalAlign: "middle"}}>
                      <tr>
                        <table style={{width: '500px', verticalAlign: "top"}} id="Top">
                          <th><img src={obj.bdgImg} width="150px" style={{padding: "10px 10px 10px 10px", display: 'inline-block'}} onError={(e)=>{e.target.src=defaultBadget}}/></th>
                          <th style={{align: 'top'}} >
                            <div style={{align: 'top'}}>
                            <div>{obj.title}</div>
                            <div>Receiptient: {obj.recipientName}  (Address: {obj.address})</div>
                            <div>Issuer: Stanford (Address:<ContractData contract="PeonyCertificate" method="GetIssuerAddressByTokenId" methodArgs={this.state.tokenIds[mode]}/>)</div>
                            </div>
                          </th>
                        </table>
                      </tr>
                      <tr></tr>
                      <tr>
                        <td>
                          {obj.body}
                        </td>
                      </tr>
                      <tr>
                        <br/>
                        <br/>
                        <br/>
                      </tr>
                      <tr>
                        <table style={{width: '500px'}} id="Top">
                        <tr>
                           {signerSignartures}
                        </tr>
                        <tr>
                           {signerNames}
                        </tr>
                        </table>
                      </tr>
                    </table>
                    </div>
                 </div>
                </div>
            );
            // this doens't work right now
            // <div>Is the Certificate Valid:</div>
            // <div>Is the Certificate Valid: <ContractData contract="PeonyCertificate" method="isCertificateValid" methodArgs={this.state.tokenIds[mode]}/></div>
    } else {
      return (<div>Click contarct id to view its name here...</div>);
    }

  }

  render() {
    const { account, payroll, web3 } = this.props;

    var self = this;
    var tokenIds = [];
    var tokenURIs = [];
    var menuItems = [];
    // console.log("!");
    // var temp;
    
    // temp = this.contracts.PeonyCertificate.methods.debug().call().then(function(err, accs) {
    //   temp = accs;
    // });
    // console.log(temp);
    // console.log("@");
    this.contracts.PeonyCertificate.methods.balanceOf(self.props.accounts[0]).call().then(function(balance){
        
        var promises = [];
        for (var i = 0 ; i < balance ; i++) {
           promises.push( self.contracts.PeonyCertificate.methods.tokenOfOwnerByIndex(self.props.accounts[0], i).call());
        }
        var promisesURI = [];
        var promisesExpTime = [];
        Promise.all(promises).then(function(values) {
          // console.log(values);
          values.forEach(function(v) {
            // console.log(v+"called");
            promisesURI.push( self.contracts.PeonyCertificate.methods.tokenURI(v).call());
            promisesExpTime.push(self.contracts.PeonyCertificate.methods.GetExpirationTimeByTokenId(v).call());
          });
          Promise.all(promisesURI).then(function(uris){
              // console.log(tokenURIs);
              // console.log(uris);
              self.state.tokenIds = values;
              self.state.tokenURIs = uris;
              // generate data for menu
              for (var i = 0; i < balance; i++) {
                
                menuItems.push(<Menu.Item key={i}>{values[i]}</Menu.Item>);
              }
              self.state.menuItems = menuItems;
           });

           Promise.all(promisesExpTime).then(function(expTimes){
              self.state.tokensExpTime = expTimes;
           });
        });
    }); 
    this.contracts.PeonyCertificate.methods.isAccountLocked().call().then(function(locked){
      self.state.isAccountLocked = locked;
    });
    return (
      <Layout style={{ padding: '24px 24px', background: '#fff' }}>
                 
        <Content style={{ padding: '0 50px', minHeight: 280 }}>
          <div className="pure-u-1-1">
            <h2>My Peony</h2>
            <p>You have 
            <strong></strong> <ContractData contract="PeonyCertificate" method="balanceOf"  methodArgs={[this.props.accounts[0]]} /> certificate. (for now showing contract id)</p>
            <div>
              <Button type="danger"
                onClick={this.lockDownAccount}
                disabled={this.state.isAccountLocked}
              > Lock Account!!!</Button>
              <h3 hidden={!this.state.isAccountLocked} style={{color: 'red'}}>This Account Has Been Locked!!</h3>
            </div>
          </div>
          {<Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['fund']}
              style={{ height: '100%' }}
              onSelect={this.onSelectTab}
            >
              {self.state.menuItems}
              {/* <Menu.Item key="fund">Contract 1</Menu.Item>
              <Menu.Item key="employees">Contract 2</Menu.Item> */}
            </Menu>
          </Sider>}
          
        </Content>
        
        
        <Content style={{ padding: '50px 24px', minHeight: 280 }}>
            {this.renderContent()}
        </Content>
        {/* {<div className="pure-u-1-1">
          <h2>My Peony</h2>
          <p>You have 
          <strong></strong> <ContractData contract="PeonyCertificate" method="balanceOf"  methodArgs={[this.props.accounts[0]]} /> certificate.</p>
          <br/><br/>
          <p>
          <strong>Details</strong>
          <br/><br/>
          {this.state.tokenIds}
          {this.state.tokenURIs}
          </p>
          <br/><br/>
        </div> } */}
      </Layout >
    );
  }
}

MyCertificate.contextTypes = {
  drizzle: PropTypes.object
}

export default MyCertificate