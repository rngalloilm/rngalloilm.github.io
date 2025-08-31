import React from 'react'
import {getByLabelText, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import LoginComponent from '../components/LoginComponent'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));


test('LogInTest', async () => {
  global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))
  const { getByRole } = render(<LoginComponent />);

  //Ensures we can easily input into fields with no problems
	await userEvent.type(document.getElementsByName("usernameOrEmail").item(0), "Melvin");
	await userEvent.type(document.getElementsByName("password").item(0), "Melvin2");
  expect( document.getElementsByName("usernameOrEmail").item(0)).toHaveValue('Melvin');
  expect( document.getElementsByName("password").item(0)).toHaveValue('Melvin2');
  await userEvent.click(screen.getByRole("button"))
  

})