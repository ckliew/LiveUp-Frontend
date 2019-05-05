import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import '../../App.css';
import { Form, Button } from 'react-bootstrap';
import * as actions from '../../actions';
import 'materialize-css/dist/css/materialize.min.css'
import 'materialize-css/dist/js/materialize.min.js'
import 'bootstrap/dist/css/bootstrap.css'


class Signup extends Component {
  onSubmit = formProps => {
    this.props.signup(formProps, () => {
      this.props.history.push('/dashboard');
    });
  };

  render() {
    const { handleSubmit } = this.props;

    return (
      <div className="Signup">
        <div className="row">
          <div className="col-lg-4"></div>
          <div className="col-lg-4 myform">
            <Form onSubmit={handleSubmit(this.onSubmit)}>
              <div className="form-header">
                Signup
              </div>
              <Form.Group controlId="username">
                <Field name="username" type="text" component="input" autoComplete="none" placeholder="Username"/>
              </Form.Group>
              <Form.Group controlId="password">
                <Field name="password" type="password" component="input" autoComplete="none" placeholder="Password"/>
              </Form.Group>
              <Form.Group controlId="FullName">
                <Field name="fullname" type="text" component="input" autoComplete="none" placeholder="FullName"/>
              </Form.Group>
              <Form.Group controlId="country">
                <Field name="country" type="text" component="input" autoComplete="none" placeholder="Country"/>
              </Form.Group>
              <div className="row">
                <div className="col-lg-4">
                  <Link to="/signin">
                    <Button variant="success" className="text-capitalize">LOGIN</Button>
                  </Link>
                </div>
                <div className="col-lg-4"></div>
                <div className="col-lg-4">
                <Button variant="danger" type='submit'>Signup</Button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.errorMessage };
}

export default compose(
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
)(Signup)