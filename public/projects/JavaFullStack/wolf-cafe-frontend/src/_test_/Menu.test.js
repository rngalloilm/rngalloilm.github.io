import React from 'react'
import {render, screen, getByText} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import MenuComponent from '../components/MenuComponent'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('MenuTest', async () => {
  //Renders component
  const { container } = render(<MenuComponent />);
  //Expects correct values
  expect(screen.getByText("Menu")).toBeInTheDocument()
  expect(screen.getByText("Ingredients")).toBeInTheDocument()
})