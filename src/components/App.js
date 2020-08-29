import React, { Component } from 'react';
import '../css/App.css';
import '../css/index.css';
import AddAppointments from './AddAppointments.js';
import ListAppointments from './ListAppointments';
import SearchAppointments from './SearchAppointments';
import {without, findIndex} from 'lodash';

class App extends Component {
  constructor(){
    super();
    this.state = {
      myAppointments : [],
      formDisplay: false,
      orderBy: "petName",
      queryText: "",
      orderDir: "asc",

      lastIndex : 0
    }
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  deleteAppointment(apt){
    let tempAptsList = this.state.myAppointments;
    // without is a method from lodash which removes apt from tempAptsList array
    tempAptsList = without (tempAptsList, apt );
    this.setState({
      myAppointments: tempAptsList
    })

  }

  toggleForm(){
    this.setState({formDisplay: !this.state.formDisplay});
  }

  addAppointment(apt){
    let tempAptsList = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    // https://www.w3schools.com/jsref/jsref_valueof_array.asp
    tempAptsList.unshift(apt);
    this.setState({
      myAppointments: tempAptsList,
      lastIndex : this.state.lastIndex +1
    } );
  }

  changeOrder(order, dir){
    this.setState({
      orderBy: order,
      orderDir: dir});
  }

  componentDidMount(){
    fetch('./data.json')
    .then(response => response.json())
    .then(result => {
      const apts = result.map(item => {
        // creating a new variable called aptId and adding it to the data
        item.aptId = this.state.lastIndex;
        this.setState({lastIndex: this.state.lastIndex+1})
        return item;
      });
      this.setState({
        myAppointments : apts
      })
    })
  }

  searchApts(query){
    this.setState({ queryText:query});

  }

  updateInfo(name, value, id){
    let tempAptsList = this.state.myAppointments;
    // findIndex is part of the lodash library
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId : id
    });
    // console.log(aptIndex, name, tempAptsList);
    tempAptsList[aptIndex][name] = value;
    this.setState({
      myAppointments : tempAptsList
    });

  }

  render() {
    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === "asc"){
      order = 1;
    } 
    else {
      order = -1;
    }

    // https://www.w3schools.com/jsref/jsref_sort.asp
    filteredApts = filteredApts
      .sort((a,b) => {
      if(a[this.state.orderBy].toLowerCase() <
        b[this.state.orderBy].toLowerCase()){
          return -1 * order;
        }
      else{
        return 1 * order;
      }
    })
    .filter(eachItem => {
      return (
        eachItem["petName"]
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem["ownerName"]
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase()) ||
        eachItem["aptNotes"]
          .toLowerCase()
          .includes(this.state.queryText.toLowerCase())
        
      );
    });

    
    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments 
                formDisplay = {this.state.formDisplay}
                toggleForm = {this.toggleForm}
                addAppointment = {this.addAppointment}/>
                <SearchAppointments 
                  orderBy = {this.state.orderBy}
                  orderDir = {this.state.orderDir}
                  changeOrder = {this.changeOrder}
                  searchApts = {this.searchApts}/>
                <ListAppointments 
                  appointments = {filteredApts}
                  deleteAppointmentL = {this.deleteAppointment}
                  updateInfo = {this.updateInfo}  />
              </div>
            </div>
          </div>
        </div>
      </main>
  );
  }
  
}

export default App;
