import React from "react";
import { Button, Modal } from "react-bootstrap";

class PopModal extends React.Component {
  render() {
    const { showModal, handleClose, data } = this.props;
    if (data) {
      return (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{data.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>File Name: {data.name}</p>
            <p>Created At: {data.created_at}</p>
            <p>Updated At: {data.updated_at}</p>
            <p>Data Types:</p>
            <ul>
              {Object.entries(data.dtypes).map(([key, value]) => (
                <li key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  }
}

export default PopModal;
