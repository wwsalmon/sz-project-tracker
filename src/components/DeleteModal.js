import React, { useState, useRef } from "react";
import "./DeleteModal.css"

class DeleteModal extends React.Component {
  state = { show: false }

  showModal = () => {
    this.setState({ show: true });
  }

  hideModal = () => {
    this.setState({ show: false });
  }

  render() {
    return (
      <main>
        <h1>React Modal</h1>
        <Modal show={this.state.show} handleClose={this.hideModal} >

        </Modal>

        <button className="button ~critical !low"
          type="button"
          style={{ transition: "all .15s ease" }} onClick={this.showModal}>Delete</button>
      </main>
    )
  }
}

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? 'modal display-block' : 'modal display-none';

  return (
    <div className={showHideClassName}>
      <section className='flex items-center justify-center fixed inset-0 z-50'>
        <div className="relative card bg-white">
          <button className="" onClick={handleClose}>
            <span className="opacity-5 outline-none focus:outline-none">×</span>
          </button>
          <p className="my-4">
            Are you sure you want to delete project <b></b>?
         </p>
          {children}
          <button
            className="button ~critical !high"
            onClick={handleClose}
          >Delete
          </button>
        </div>
      </section>
    </div>
  );
};

export default DeleteModal;
