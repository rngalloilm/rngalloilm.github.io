import React from 'react'
import {getByText, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import IngredientComponent from '../components/IngredientComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('IngredientTestInvalidName', async () => {
  //Renders component
  const { container } = render(<IngredientComponent />);
  //Input invalid name
  const boxes = await container.getElementsByClassName('form-control')
  await expect(boxes.length).toBe(2)
  await userEvent.type(boxes[0], '   ');
  await userEvent.type(boxes[1], '10');
  await expect(boxes[1]).toHaveValue('10')
  //Generates errors
  await userEvent.click(screen.getByRole("button"))
  const { getByText } = await within(container.getElementsByClassName('invalid-feedback')[0])
  await expect(getByText("Name is required.")).toBeInTheDocument()
  //Clears errors
  await userEvent.clear(boxes[0])
  await userEvent.clear(boxes[1])
  await expect(getByText("Name is required.")).toBeInTheDocument();

  
})

