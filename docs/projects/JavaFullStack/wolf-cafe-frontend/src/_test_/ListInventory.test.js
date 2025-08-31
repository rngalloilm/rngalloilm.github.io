import React from 'react'
import {getByText, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import InventoryComponent from '../components/InventoryComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ListIngredientTest', async () => {
  const {getByText} = render(<InventoryComponent />);

  //Ensures our fields are present
  expect(getByText("Inventory")).toBeInTheDocument();
  expect(getByText("Update Inventory")).toBeInTheDocument();
})