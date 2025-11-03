import React, { Component } from 'react';
import './DatabaseDemo.css';

// ✅ Backend endpoints (try both Node IPs if backend-service DNS fails)
const BACKEND_URLS = [
  process.env.REACT_APP_BACKEND_URL || 'http://backend-service:4000/api',
  'http://13.201.77.49:31000/api',
  'http://65.1.12.5:31000/api'
];

async function getWorkingBackendURL() {
  for (const url of BACKEND_URLS) {
    try {
      const response = await fetch(`${url}/health`, { method: 'GET' });
      if (response.ok) {
        console.log(`✅ Using backend: ${url}`);
        return url;
      }
    } catch (error) {
      console.warn(`❌ Failed to connect to ${url}`);
    }
  }
  throw new Error("All backend URLs are unreachable!");
}

class DatabaseDemo extends Component {

  constructor(props) {
    super(props);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleButtonClick = this.handleButtonClick.bind(this);
    this.handleButtonClickDel = this.handleButtonClickDel.bind(this);
    this.state = {
      transactions: [],
      text_amt: "",
      text_desc: "",
      backendURL: BACKEND_URLS[0] // default fallback
    };
  }

  async componentDidMount() {
    try {
      const workingURL = await getWorkingBackendURL();
      this.setState({ backendURL: workingURL }, () => {
        this.populateData();
      });
    } catch (err) {
      console.error("❌ No working backend found:", err);
    }
  }

  populateData() {
    this.fetch_retry(`${this.state.backendURL}/transaction`, 3)
      .then(res => res.json())
      .then((data) => {
        this.setState({ transactions: data.result });
        console.log("✅ Transactions fetched successfully");
      })
      .catch(console.log);
  }

  async fetch_retry(url, n) {
    try {
      return await fetch(url);
    } catch (err) {
      if (n === 1) throw err;
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await this.fetch_retry(url, n - 1);
    }
  }

  renderTableData() {
    return this.state.transactions.map((transaction, index) => {
      const { id, amount, description } = transaction;
      return (
        <tr key={id}>
          <td>{id}</td>
          <td>{amount}</td>
          <td>{description}</td>
        </tr>
      );
    });
  }

  handleButtonClickDel() {
    const requestOptions = {
      method: 'DELETE'
    };
    fetch(`${this.state.backendURL}/transaction`, requestOptions)
      .then(response => response.json())
      .then(() => this.populateData());

    this.setState({ text_amt: "", text_desc: "", transactions: [] });
  }

  handleButtonClick() {
    console.log(this.state.text_amt, this.state.text_desc);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: this.state.text_amt,
        desc: this.state.text_desc
      })
    };

    fetch(`${this.state.backendURL}/transaction`, requestOptions)
      .then(response => response.json())
      .then(() => this.populateData());

    this.setState({ text_amt: "", text_desc: "" });
  }

  handleTextChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    return (
      <div>
        <h1 id='title' style={{ paddingRight: "1em" }}>
          Aurora Database Demo Page
        </h1>
        <input
          style={{ float: "right", marginBottom: "1em" }}
          type="button"
          value="DEL"
          onClick={this.handleButtonClickDel}
        />
        <table id='transactions'>
          <tbody>
            <tr>
              <td>ID</td>
              <td>AMOUNT</td>
              <td>DESC</td>
            </tr>
            <tr>
              <td><input type="button" value="ADD" onClick={this.handleButtonClick} /></td>
              <td><input type="text" name="text_amt" value={this.state.text_amt} onChange={this.handleTextChange} /></td>
              <td><input type="text" name="text_desc" value={this.state.text_desc} onChange={this.handleTextChange} /></td>
            </tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default DatabaseDemo;

