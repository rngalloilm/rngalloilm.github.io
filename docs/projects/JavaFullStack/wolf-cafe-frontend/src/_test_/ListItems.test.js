import React from 'react'
import {getByText, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ListItemsComponent from '../components/ListItemsComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ListItemsTest', async () => {
  const {getByText} = render(<ListItemsComponent />);

  //Ensures all headers are in the document.
  expect(getByText("Actions")).toBeInTheDocument();
  expect(getByText("Item Name")).toBeInTheDocument();
  expect(getByText("Description")).toBeInTheDocument();
  expect(getByText("Price")).toBeInTheDocument();
  expect(getByText("Add Item")).toBeInTheDocument();
  expect(getByText("Items")).toBeInTheDocument();
})