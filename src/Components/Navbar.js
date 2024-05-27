import React from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Logo from "../Assets/logo.png"
import "../Styles/navbar.css"
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
const NavigationBar = () => {
    return (
        <div>
            <Navbar collapseOnSelect expand="lg" className="backg" fixed="top">
                <Container className='me-auto'>
                    <Link to="/">  
                    <Navbar.Brand href="#home">
                        <img className='Logo' src={Logo} alt='' />
                    </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle className='menu-toggle' aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            {/* <Nav.Link href="#features">Features</Nav.Link>
                            <Nav.Link href="#pricing">Pricing</Nav.Link>
                            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown> */}
                        </Nav>
                        <Nav className='links'>
                            <Link to="/About">  <Nav.Link className='bold' href="#deets">About Us</Nav.Link></Link>
                            {/* <Nav.Link className='bold' href="#deets">Vendor</Nav.Link> */}
                            <Link to="/BecomeaCook"><Button className='become_a_cook-button' variant="success">Become a Cook</Button></Link>
                            {/* <button className='become_a_cook-button'>Become a cook</button> */}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    )
}

export default NavigationBar