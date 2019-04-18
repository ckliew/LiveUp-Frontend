import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import 'bootstrap/dist/css/bootstrap.css';
import { Form,Button } from 'react-bootstrap';
import '../../App.css';
import { Link } from 'react-router-dom'


class Login extends Component {

  render() {
    return (
      <div className="Login">
        <div class="row">
          <div class="col-lg-4"></div>
          <div class="col-lg-4 myform">
            <Form>
              <div class="form-header">
             
              </div>
              <Form.Group controlId="loginType">
                <div class="form-header">
                Login
                </div>
                <Form.Control as="select">
                  <option>---LoginType---</option>
                  <option>Admin</option>
                  <option>User</option>
                </Form.Control>
              </Form.Group>
              <Form.Group controlI="username">
                <Form.Control type="text" placeholder="Username" />
              </Form.Group>
              <Form.Group controlI="password">
                <Form.Control type="password" placeholder="Password" />
              </Form.Group>
              <div class="row">
                <div class="col-lg-4">
                  <Link to="/signup">
                    <Button variant="success" className="text-capitalize">Signup</Button>
                  </Link>
                </div>
                <div class="col-lg-4"></div>
                <div class="col-lg-4">
                  <Link to="/dashboard">
                    <Button  variant="danger" type="submit" className="text-capitalize">Login</Button>
                  </Link>
                </div>
              </div>
            </Form>
          </div>
        <div class="col-lg-4"></div>
      </div>
    </div>
  );}
}

export default Login;
