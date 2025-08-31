import React from 'react'
import {getByText, render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import OrderHistoryComponent from '../components/OrderHistoryComponent';

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ListRecipesTest', async () => {
  const {getByText} = render(<OrderHistoryComponent />);

  //Ensures all headers are in the document
  expect(getByText("Order History")).toBeInTheDocument();
})