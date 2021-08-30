import './LandingPage.css';
import './LandingPageQueries.css';
import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Aos from 'aos';
import 'aos/dist/aos.css';
import { 
    IoPowerSharp, 
    IoChevronDownOutline, 
    IoLogoTwitter, 
    IoLogoInstagram, 
    IoLogoFacebook, 
    IoCartSharp, 
    IoPersonSharp
} from 'react-icons/io5';
import { FaAppleAlt } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import Customer from './customer.svg';
import Customer2 from './customer2.svg';

const LandingPage = () => {
    const [usersCount, setUsersCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);
    const [productsCount, setProductsCount] = useState(0);
    const history = useHistory();
    const nav = useRef(null);
    const axios = require('axios');

    useEffect(() => {
        window.addEventListener('scroll', () => { // Toggle sticky nav
            nav.current && nav.current.classList.toggle('sticky', window.scrollY > 0);
        });
    }, [nav]);

    useEffect(() => { // Fetch app statistics
        (async () => {
            try {
                const res = await axios.get('http://localhost:3001/statistics');

                setUsersCount(res.data.users);
                setOrdersCount(res.data.orders);
                setProductsCount(res.data.products);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [axios]);

    useEffect(() => { // Trigger AOS library
        Aos.init({duration: 2000, offset: 250});
    }, []);

    return (
        <div className='landing-page-container'>
            <nav ref={nav}>
                <ul>
                    <li>
                        <h1><span>Mazon</span> <span><IoPowerSharp className='power-icon' />nline</span></h1>
                    </li>

                    <li>
                        <button onClick={() => history.push('/i/login')}>
                        <span><FiUser /></span> <span>Log in</span>
                        </button>

                        <button onClick={() => history.push('/i/signup')}>
                            Sign up
                        </button>
                    </li>
                </ul>
            </nav>

            <div className='landing-page-header'>
                <div>
                    <h2>
                        <span>BROWSE THROUGH</span>  
                        <span>THOUSANDS OF PRODUCTS</span>
                        <span>ENJOY PROMPT DELIVERY</span>
                    </h2>
                    <h3>AND MAKE BETTER USE OF YOUR TIME!</h3>

                    <a href='#content' className='scroll-btn'>
                        <IoChevronDownOutline />
                    </a>
                </div>
            </div>

            <div className='landing-page-wraper' id='content' >
                <div 
                    className='statistics-box' 
                    data-aos='fade-up'
                >
                    <ul>
                        <li>
                            <IoPersonSharp className='statistics-icon' />
                            <h3>{usersCount}</h3>
                            <p>Members</p>
                        </li>
                        <li>
                            <IoCartSharp className='statistics-icon' />
                            <h3>{ordersCount}</h3>
                            <p>Orders</p>
                        </li>
                        <li>
                            <FaAppleAlt className='statistics-icon' />
                            <h3>{productsCount}</h3>
                            <p>Products</p>
                        </li>
                    </ul>

                </div>
                <div className='landing-page-content' data-aos='fade-right'>
                    <div>
                        <h2><span>So who we are?</span></h2>
                        <p>We are a supermarket online service that deliver your orders to your home!</p>

                        <p><span>How we do it?</span></p>
                        <p>We carefully selected and cooperated with a variety of supermarkets, which are located in city centers across the country, in order to be as close as possible to our customers, and provide to our customers the freshest and fastest delivery, while maintaining the highest level of service and quality.</p>
                    </div>

                    <figure>
                        <img src={Customer2} alt='Illustration' />
                    </figure>
                </div>

                <div className='vision-content' data-aos='fade-left'>
                    <figure>
                        <img src={Customer} alt='Illustration' />
                    </figure>
                    
                    <div>
                        <h2><span>Our vision</span></h2>
                        <p>Our vision is to provide to our customers the best service: Comfortable, Fast, Affordable, Accessible, Efficient and Advanced, and help our customers make better use of their time.</p>
                    </div>
                </div>
            </div>

            <footer>
                <div className='footer-navigation'>
                    <div>
                        <h2><span>Mazon</span> <span><IoPowerSharp className='power-icon' />nline</span></h2>
                    </div>

                    <div>
                        <ul>
                            <li>
                                <button>About Us</button>
                            </li>
                            <li>
                                <button>Jobs</button>
                            </li>
                            <li>
                                <button>Press</button>
                            </li>
                            <li>
                                <button>Blog</button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul>
                            <li>
                                <button>Contact Us</button>
                            </li>
                            <li>
                                <button>Terms</button>
                            </li>
                            <li>
                                <button>Privacy</button>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <ul className='social-nav'>
                            <li>
                                <button><IoLogoFacebook /></button>
                            </li>
                            <li>
                                <button><IoLogoTwitter /></button>
                            </li>
                            <li>
                                <button><IoLogoInstagram /></button>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='copyright-box'>
                    <p>Developed by <a href='https://github.com/itamarrosenblum' target='_blank'>Itamar Rosenblum</a></p>
                </div>
            </footer>
        </div>
    );
}

export default LandingPage;