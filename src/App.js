import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import styles from './App.module.css'


const arrayChunk = (array,part) =>{
  let result = [];
  let chunk = [];
  let count = 0;
  for(let i=0; i < array.length; i++){
      let last;
      if(count < part) {
          if(array[i + 1] == undefined) {
            last = array[i];
          }
          chunk.push(array[i])
          count++
      }
      
      if(count === part) {
          result.push(chunk)
         count = 0;
         chunk = [];
      }
      
      if(last && count !== part) {
         if(chunk.length) {
          result.push(chunk)
         }
        }
    
    }
    return result
}


 class App extends Component {
  state = {
    users: null,
   // total: null,
    per_page: 2,
    current_page: 1
  }
  componentDidMount() {
    this.makeHttpRequestWithPage(1)
  }
  makeHttpRequestWithPage = async pageNumber => {
    let response = await fetch(`https://reqres.in/api/users?page=${pageNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    this.setState({
      users: data.data,
      total: data.data.length,
      current_page: data.page,
    });
  }


  render() {
        let users;
        let renderPageNumbers;
        const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(this.state.total / this.state.per_page); i++) {
    pageNumbers.push(i);
    }


    renderPageNumbers = pageNumbers.map(number => {
      let classes = this.state.current_page === number ? styles.active : '';

      return (
        <span key={number} className={classes} onClick={() =>{this.setState({current_page:number})}}>{number}</span>
      );
    });
  

    if (this.state.users !== null) {
      let count;
      let user = [...this.state.users];
      let usersChunk = arrayChunk(user,2);
  
      users = usersChunk.map((users,index) =>{  
      let active = this.state.current_page === index+1 ? 'active' : ''
        
        return(
          <div className={`row ${active}`} id={index+1} >
             {
               users.map((user) => {
                return (
                  <div className="inner">
                    <span>{user.id}</span>
                    <span>{user.first_name}</span>
                    <span>{user.last_name}</span>
                </div>
                )
              })
             }
          </div>
        )
      
      })
    }
    return (
      <div className={styles.app}>
          
          <div className="table">
              <div className="head">
                <span>S/N</span>
                <span>First Name</span>
                <span>Last Name</span>
              </div>
            <div className="body">
                {users}
            </div>
          </div>
          <div className={styles.pagination}>
          <span onClick={() => this.setState({current_page:1})}>&laquo;</span>
          {renderPageNumbers}
          <span onClick={() => {this.setState({current_page:renderPageNumbers.length})}}>&raquo;</span>
        </div>
  
        </div>
    );
  }

}

export default App;
