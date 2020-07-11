import React from 'react';
import { Link } from 'react-router-dom'

const navbar=()=> {
    return (
        <>
            <nav>
                <div className="nav-wrapper">
                <Link to="/" className="brand-logo">newchat</Link>
                <Link to="#!" data-target="mobile-demo" className="sidenav-trigger">
                    <i className="material-icons">menu</i>
                </Link>
                <ul className="right hide-on-med-and-down">
                    <li><Link to="/login">Sign In</Link></li>
                    <li><Link to="/sign-up">Sign Up</Link></li>
                    <li><Link to="/">Log out</Link></li>
                    <li><Link to="/home/contacts">Contacts</Link></li>
                    <li><Link to="/home/arena">Arena</Link></li>
                </ul>
                </div>
            </nav>

            <ul className="sidenav" id="mobile-demo">
                <li><Link to="/sign-in">Sign In</Link></li>
                <li><Link to="/sign-up">Sign Up</Link></li>
                <li><Link to="/">Log out</Link></li>
                <li><Link to="/home/contacts">Contacts</Link></li>
                <li><Link to="/home/arena">Arena</Link></li>
            </ul>
        </>
    )
}

export default navbar
