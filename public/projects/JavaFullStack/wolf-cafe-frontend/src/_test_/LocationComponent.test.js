import React from 'react'
import {render, screen, prettyDOM} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LocationsComponent from '../components/LocationComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ItemsTestValid', async () => {
  //Renders component
  const { container } = render(<LocationsComponent />);
  //Expects correct values
  expect(screen.getByText("ID")).toBeInTheDocument()
  expect(screen.getByText("Name")).toBeInTheDocument()
  expect(screen.getByText("Address")).toBeInTheDocument()
  expect(screen.getByText("Tax Rate")).toBeInTheDocument()
  expect(screen.getByText("Actions")).toBeInTheDocument()
})