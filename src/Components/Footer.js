import React from 'react'
import Logo from "../Assets/logo.png"
import "../Styles/footer.css"
import Apple from "../Assets/Apple store.png"
import Playstore from "../Assets/play_store.png"
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <div className='footer-container'>
      <div className="footer-section row">
        <div className="kitchly-logo-section col-md-4" style={{ width: '20rem' }}>
          <div className="logo_box">
            <img className='logo' src={Logo} alt="" />
          </div>
          <p className='footer-text'>
            Order your favorite food to your doorstep from kitchens in you neighborhood with the Kitchly service.
          </p>
          <div className="">
            <div className="download-app-btn">
              <div className="apple_playstore">
                <img src={Apple} alt="" />
              </div>
              <div className="apple_playstore">
                <img src={Playstore} alt="" />
              </div>
            </div>
          </div>
        </div>


        <div className="cook-earn-section col-md-4 text-left" style={{ width: '20rem' }}>
          <h4><b>Company</b></h4>
          <p> <Link to="/about" className='text-dark'> About Us </Link> </p>
          <p> <Link to="/BecomeaCook" className='text-dark'> Becaome A Cook  </Link> </p>
          <p> <Link to="/privacy" className='text-dark'>Privacy Policy </Link></p>
        </div>

        <div className="cook-earn-section col-md-4 text-left" style={{ width: '20rem' }}>
          <h4><b>Support</b></h4>
          <p> <a href="tel:+2347068171104" className='text-dark'>+234 706 8171 104</a></p>
          <p> <a href="mailto:app.reworktechnologies@gmail.com" className='text-dark'>app.reworktechnologies@gmail.com</a></p>
          <p>
            <a className='text-dark' href="https://web.facebook.com/kitchly.kitchens" target='_blank'><i class="bi bi-facebook"></i></a>
            &nbsp; &nbsp;
            <a className='text-dark' href="https://www.instagram.com/kitchly.kitchens/" target='_blank'><i class="bi bi-instagram"></i></a>

          </p>
        </div>

        <div className="cook-earn-section col-md-4 " style={{ width: '20rem' }}>
          <h4><b>Cook And Earn Now!</b></h4>
          <p>Use the link below to see how to open your kitchen account</p>
          <br />

          <a className='submit-button btn btn-success px-1 py-3' target='_blank' href="https://kitchly.co/kitchen/download">List Your Kitchen</a>


        </div>
      </div>
    </div>
  )
}

export default Footer