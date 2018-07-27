import React  from 'react';



class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username:"", password:""};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRegisterClick = this.handleRegisterClick.bind(this);
        this.callForLogin = this.callForLogin.bind(this);
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;

        let partialState = {};
        partialState[name] = value;
        this.setState(partialState);
        console.log(this.state);

    }

    handleRegisterClick() {
        this.props.setNeedToRegister(true);
    }

    componentDidMount() {
        this.callForLogin();
    }

    callForLogin(){
        console.log("SessionStoragefirst token: "+window.sessionStorage.token);
        const body = JSON.stringify({ username: this.state.username, password: this.state.password, token:window.sessionStorage.token });
        fetch(`http://localhost:8080/user/find`, {
            method:'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body
        })
            .then(response => response.json())
            .then(response => {
                this.setState({ response });
                if(this.state.response.token)
                {
                    window.sessionStorage.token = this.state.response.token;
                }
                if(this.state.response.auth)
                {
                    console.log(`auth: ${this.state.response.auth}`);
                    this.props.setLoggedIn(true);
                }
                console.log("SessionStorage token: "+window.sessionStorage.token);
            })
            .catch(err => console.error('Caught error: ', err));
        //console.log(this.state.data);
    }

    handleSubmit(event){
        event.preventDefault();
        this.callForLogin();
    }

    render() {
        return(
            <div>
        <form onSubmit={this.handleSubmit}  >
            Username:<input name="username" type="text" value={this.state.username} onChange={this.handleChange}/>
            <p>Password:<input name="password" type="text" value={this.state.password} onChange={this.handleChange}/></p>
            <button type="submit" value="Submit">Login</button>
        </form>
                Not registered yet?<button onClick={this.handleRegisterClick} >Register</button>
            </div>

    );
    }
}

export default Form;

