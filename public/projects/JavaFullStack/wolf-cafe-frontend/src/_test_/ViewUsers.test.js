import React from 'react'
import {getByText, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ViewUserComponent from '../components/ViewUserComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ViewUserTest', async () => {
  //Renders component
  const {getByText} = render(<ViewUserComponent />);

  //Ensures headers are present
  expect(getByText("List of Users")).toBeInTheDocument()
  expect(getByText("View All")).toBeInTheDocument()
  expect(getByText("View Staff")).toBeInTheDocument()
  expect(getByText("View Customers")).toBeInTheDocument()
})