import React from 'react'
import {getByText, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ListIngredientsComponent from '../components/ListIngredientsComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ListIngredientTest', async () => {
  const {getByText} = render(<ListIngredientsComponent />);

  //Expects all headers to be in the document
  await expect(getByText("Actions")).toBeInTheDocument();
  await expect(getByText("Ingredient Name")).toBeInTheDocument();
  await expect(getByText("List of Ingredients")).toBeInTheDocument();
  await expect(getByText("Add Ingredient")).toBeInTheDocument();
})
