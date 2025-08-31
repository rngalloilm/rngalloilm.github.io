import React from 'react'
import {getByText, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import RecipeComponent from '../components/RecipeComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('RecipeTestValid', async () => {
  //Renders component
  const { container } = render(<RecipeComponent />);
  //Inputs valid quantitys
  const boxes = await container.getElementsByClassName('form-control')
  expect(boxes.length).toBe(2)
  await userEvent.type(boxes[0], 'Burger');
  await userEvent.type(boxes[1], '500');
  expect(boxes[0]).toHaveValue('Burger')
  expect(boxes[1]).toHaveValue('500')
  //Finds button to press
  await userEvent.click(screen.getAllByRole("button")[2])
  const { getByText } = await within(container.getElementsByClassName('p-3 mb-2 bg-danger text-white')[0])
  expect(getByText("At least one ingredient is required.")).toBeInTheDocument()

})

test('RecipeTestInvalidName', async () => {
    //Renders component
    const { container } = render(<RecipeComponent />);
    //Inputs valid quantitys
    const boxes = await container.getElementsByClassName('form-control')
    expect(boxes.length).toBe(2)
    await userEvent.type(boxes[0], '    ');
    await userEvent.type(boxes[1], '500');
    expect(boxes[0]).toHaveValue('    ')
    expect(boxes[1]).toHaveValue('500')
    //Finds button to press
    await userEvent.click(screen.getAllByRole("button")[2])
    const { getByText } = await within(container.getElementsByClassName('invalid-feedback')[0])
    expect(getByText("Name is required.")).toBeInTheDocument()

    userEvent.clear(boxes[0])
    userEvent.clear(boxes[1])
    expect(getByText("Name is required.")).toBeInTheDocument()
  
  })

  test('RecipeTestInvalidPrice', async () => {
    //Renders component
    const { container } = render(<RecipeComponent />);
    //Inputs valid quantitys
    const boxes = await container.getElementsByClassName('form-control')
    expect(boxes.length).toBe(2)
    await userEvent.type(boxes[0], 'Burger');
    await userEvent.type(boxes[1], '-10');
    expect(boxes[0]).toHaveValue('Burger')
    expect(boxes[1]).toHaveValue('-10')
    //Finds button to press
    await userEvent.click(screen.getAllByRole("button")[2])
    const { getByText } = await within(container.getElementsByClassName('p-3 mb-2 bg-danger text-white')[0]) //Needs to appear under price textbox, not above
    expect(getByText("At least one ingredient is required.")).toBeInTheDocument()

    userEvent.clear(boxes[0])
    userEvent.clear(boxes[1])
    expect(getByText("At least one ingredient is required.")).toBeInTheDocument()
  })

  test('ExtraIngredientTest', async () => {
    //Renders component
    const { container } = render(<RecipeComponent />);
    //Inputs valid quantitys
    const boxes = await container.getElementsByClassName('form-control')
    expect(boxes.length).toBe(2)
    //Finds button to press
    await userEvent.click(screen.getAllByRole("button")[0])
    const boxes2 = await container.getElementsByClassName('form-control')
    expect(boxes2.length).toBe(2)
  })