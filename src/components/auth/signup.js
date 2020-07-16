import React, { Component } from 'react';
import Cover from './CoverSignup';
import { Link } from 'react-router-dom'

class SignUp extends Component {
    state={
        name:"",
        email:"",
        password:"",
        cnfPassword:"",
    }
    handleChange=(e)=>{
        e.preventDefault();
        this.setState({
            [e.target.id]:e.target.value,
        })
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        console.log(this.state);
    }
    render() {
        return (
            <div>
                <Cover />
                <div className="row signing">
                    <div className="col s12 l5 offset-l6">
                        <div className="card-panel" style={{
                            borderRadius:"24px 0 0 0",
                            zIndex: 8,
                        }}            
                        >
                        <h4>
                            Sign In to join the party!
                        </h4>
                        </div>
                    </div>
                    <div className="col s12 l5 offset-l6">
                        <div className="card" style={{
                        borderRadius:"0 0 0 24px"
                        }}>
                        <div className="card-content">

                            <form onSubmit={ this.handleSubmit }>

                            <div className="input-field">
                                <label htmlFor="name">Name</label>
                                <input type="text" id="name" name="name" 
                                onChange = { this.handleChange } required
                                />
                            </div>
                           
                            <div className="input-field">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" name="email" 
                                onChange = { this.handleChange } required
                                />
                            </div>

                            <div className="input-field">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" name="password" 
                                onChange = { this.handleChange } required
                                />
                            </div>
                            <div className="input-field">
                                <label htmlFor="cnfPassword">Confirm Password</label>
                                <input type="password" id="cnfPassword" name="cnfPassword" 
                                onChange = { this.handleChange } required
                                />
                            </div>
                            <div className="input-field">
                                <button className="btn waves-effect waves-light" 
                                type="submit" name="action">Register
                                <i className="material-icons right">person</i>
                                </button> 
                            </div>
                            </form>
                        </div>
                        <div className="card-action" style={{
                            borderRadius:"0 0 0 24px"
                        }}>
                            <div className="switcher">
                            <Link to='/login'>
                                Already have an account?
                            </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
            </div>
        )
    }
}

export default SignUp
