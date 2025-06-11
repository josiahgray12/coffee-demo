import React, { useRef, useState } from "react";
import {
  PublicSquareProvider, 
  usePublicSquare,
  CardElement
} from "@publicsquare/elements-react";
import './App.css';
import SpaceAlert from './SpaceAlert';

export default function App() {
  const apiKey = "pk_test_BwEXSco1M2q8LivxQpgsKD";
  const [cardId, setCardId] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  const closeAlert = () => {
    setAlertMessage(null);
  };

  return (
    <PublicSquareProvider apiKey={apiKey}>
      <div className="container">
        <h1>Space Payment Portal</h1>
        <MyForm setCardId={setCardId} setFirstName={setFirstName} setLastName={setLastName} setAlertMessage={setAlertMessage} />
        <RunPaymentButton cardId={cardId} firstName={firstName} lastName={lastName} setAlertMessage={setAlertMessage} />
      </div>
      {alertMessage && <SpaceAlert message={alertMessage} onClose={closeAlert} />}
    </PublicSquareProvider>
  );
};

const MyForm = ({ setCardId, setFirstName, setLastName, setAlertMessage }) => {
  const { publicsquare } = usePublicSquare();
  // Refs to get access to the Elements instance
  const cardholderNameRef = useRef(null);
  const cardRef = useRef(null);

  const submit = async () => {
    try {
      const card = await publicsquare.cards.create({
        cardholder_name: cardholderNameRef.current.value,
        card: cardRef.current,
      });
      // store card.id in your database
      console.log(card);
      console.log(card.id);
      setCardId(card.id);
      if (card.cardholder_name.split(' ').length != 2) {
        // tell user they need a first and last name separated by a space
        setAlertMessage('Please enter a first and last name separated by a space');
        return;
      }
      const firstName = card.cardholder_name.split(' ')[0];
      const lastName = card.cardholder_name.split(' ')[1];
      setFirstName(firstName);
      setLastName(lastName);
      setAlertMessage('Card created successfully');
    } catch (error) {
      console.error(error);
      setAlertMessage('An error occurred while creating the card');
    }
  }

  return (
    <>
      <input
        type="text"
        id="cardholderName"
        placeholder="Cardholder name"
        ref={cardholderNameRef}
      />

      <div className="card-element">
        <CardElement id="card" ref={cardRef} />
      </div>
      <button onClick={submit}>Submit</button>
    </>
  );
};

const RunPaymentButton = ({ cardId, firstName, lastName, setAlertMessage }) => {
  const runPaymentScript = async () => {
    try {
      const response = await fetch(`http://localhost:3001/run-payment?cardId=${cardId}&firstName=${firstName}&lastName=${lastName}`);
      const result = await response.text();
      console.log(result);
      setAlertMessage("You've successfully processed a payment!");
    } catch (error) {
      console.error('Error running payment script:', error);
      setAlertMessage('An error occurred while processing the payment');
    }
  };

  return (
    <button onClick={runPaymentScript} disabled={!cardId || !firstName || !lastName}>Process Payment</button>
  );
};