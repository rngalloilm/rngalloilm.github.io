import React from 'react'
import {getByText, render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import ItemComponent from '../components/ItemComponent.jsx'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('ItemsTestValid', async () => {
  //Renders component
    const { container } = render(<ItemComponent />);

  //Grabs all input boxes
  const boxes = await container.getElementsByClassName('form-control')
  expect(boxes.length).toBe(4)

  //Checks to see that we can really input
  await userEvent.type(boxes[0], 'Dr. Pepper');
  await userEvent.type(boxes[1], 'A cool Dr. Pepper for our sophisticated customers');
  await userEvent.type(boxes[2], '350');
  await userEvent.type(boxes[3], '100');

  //Expects correct values
  expect(boxes[0]).toHaveValue('Dr. Pepper')
  expect(boxes[1]).toHaveValue('A cool Dr. Pepper for our sophisticated customers')
  expect(boxes[2]).toHaveValue('350')
  expect(boxes[3]).toHaveValue('100')

  await userEvent.click(screen.getByRole("button"))



})

test('ItemsTestInalidName', async () => {
  //Renders component
  const { container } = render(<ItemComponent />);

  //Grabs input boxes
  const boxes = await container.getElementsByClassName('form-control')
  expect(boxes.length).toBe(4)

  //Types invalid name into first box
  await userEvent.type(boxes[0], '   ');
  await userEvent.type(boxes[1], 'A cool Dr. Pepper for our sophisticated customers');
  await userEvent.type(boxes[2], '350');
  await userEvent.type(boxes[3], '100');

  //Creates errors
  await userEvent.click(screen.getByRole("button"))
  const { getByText } = within(container.getElementsByClassName('text-danger')[0])
  expect(getByText("Name is required.")).toBeInTheDocument()

  //Clears errors
  userEvent.clear(boxes[0])
  userEvent.clear(boxes[1])
  userEvent.clear(boxes[2])
  expect(getByText("Name is required.")).toBeInTheDocument();

  


})

test('ItemsTestInalidDescription', async () => {
  //Renders component
  const { container } = render(<ItemComponent />);

  //Grabs text boxes
  const boxes = await container.getElementsByClassName('form-control')
  expect(boxes.length).toBe(4)

  //Inputs invalid description
  await userEvent.type(boxes[0], 'Dr. Pepper');
  await userEvent.type(boxes[1], '   ');
  await userEvent.type(boxes[2], '350');
  await userEvent.type(boxes[3], '100');

  //Generates errors
  await userEvent.click(screen.getByRole("button"))
  const { getByText } = await within(container.getElementsByClassName('text-danger')[0])
  expect(getByText("Description is required.")).toBeInTheDocument()

  //Clears errors
  userEvent.clear(boxes[0])
  userEvent.clear(boxes[1])
  userEvent.clear(boxes[2])
  userEvent.clear(boxes[3])
  expect(getByText("Description is required.")).toBeInTheDocument();
})

test('ItemsTestInvalidDescription', async () => {
  //Renders component
  const { container } = render(<ItemComponent />);

  //Grabs text boxes
  const boxes = await container.getElementsByClassName('form-control')
  expect(boxes.length).toBe(4)

  //Inputs invalid description
  await userEvent.type(boxes[0], 'Dr. Pepper');
  await userEvent.type(boxes[1], 'Mmmmmm dr. pepper');
  await userEvent.type(boxes[2], '350');
  await userEvent.type(boxes[3], '-10');

  //Generates errors
  await userEvent.click(screen.getByRole("button"))
  const { getByText } = await within(container.getElementsByClassName('invalid-feedback')[0])
  expect(getByText("Amount must be valid integer.")).toBeInTheDocument()

  //Clears errors
  userEvent.clear(boxes[0])
  userEvent.clear(boxes[1])
  userEvent.clear(boxes[2])
  userEvent.clear(boxes[3])
  expect(getByText("Amount must be valid integer.")).toBeInTheDocument();
})

