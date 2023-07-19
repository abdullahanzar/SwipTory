import React, { useState } from 'react'
import ReactModal from 'react-modal';
import { Form } from 'react-router-dom';

export default function SignUpForm() {
    const [modal, setModal] = useState(true);
    const [isLogIn, setIsLogIn] = useState(true);
    const [isSignUp, setIsSignUp] = useState(false);
  return (
    <div>
        <ReactModal
        isOpen={modal}
        onRequestClose={() => {
          setModal(false);
          setIsLogIn(false);
          setIsSignUp(false);
        }}
        className="modal"
        overlayClassName={"modalOverlay"}
      >
        <Form
          isSignUp={isSignUp}
          isLogIn={isLogIn}
          setIsLogIn={setIsLogIn}
        ></Form>
      </ReactModal>
    </div>
  )
}
