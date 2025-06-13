import React from 'react';
import styled from 'styled-components';

const Unaccess= () => {
  return (
    <Wrapper>
      <Message>
        <h1>403 - Access Denied</h1>
        <BackButton href="/">Go to Homepage</BackButton>
      </Message>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color:rgb(157, 17, 17);
`;

const Message = styled.div`
  text-align: center;
  background-color: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const BackButton = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  font-size: 16px;
  font-weight: bold;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
`;

export default Unaccess;
