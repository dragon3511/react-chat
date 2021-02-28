import React, { Component } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import './Home.css';
// import Images from '../ProjectImages/ProjectImages';
import { Link } from 'react-router-dom';

export default class Home extends Component {
    render() {
        return (
            <>
                <Header />
                <div className="splash-container">
                    <div className="splash">
                        <h1 className="splash-head">React-Chat</h1>
                        <p className="splash-subhead">Let's talk!!</p>

                        <div id="custom-button-wrapper">
                            <Link to='/login'>
                                <a className="my-super-cool-btn">
                                    <div className="dots-container">
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                        <div className="dot"></div>
                                    </div>
                                    <span className="buttoncooltext">Get Started</span>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>



                <div className="content-wrapper">
                    <div className="content">
                        <h2 className="content-head is-center">Features of this App</h2>


                    </div>
                    <Footer />
                </div>
                
            </>
        )
    }
}