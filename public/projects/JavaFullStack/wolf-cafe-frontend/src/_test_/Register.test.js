import React from 'react'
import {render, screen, getByText} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import RegisterComponent from '../components/RegisterComponent'

//Allows for 'potential' navigation on frontend
const mockUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUsedNavigate,
}));

test('MenuTest', async () => {
  //Renders component
  const { container } = render(<RegisterComponent />);
  //Expects correct values
  expect(screen.getByText("Username")).toBeInTheDocument()
  expect(screen.getByText("Name")).toBeInTheDocument()
  expect(screen.getByText("Email")).toBeInTheDocument()
  expect(screen.getByText("Password")).toBeInTheDocument()
  expect(screen.getByText("Confirm Password")).toBeInTheDocument()

  const boxes = container.getElementsByClassName('form-control')
  expect(boxes.length).toBe(5)

  //Ensures we can input into the document
  await userEvent.type(boxes[0], "Melvin")
  await userEvent.type(boxes[1], "Melvster")
  await userEvent.type(boxes[2], "Mel@vin.rooles")
  await userEvent.type(boxes[3], "hunter2")
  await userEvent.type(boxes[4], "hunter2")

  //Ensures input is recorded
   expect(boxes[0]).toHaveValue("Melvin")
   expect(boxes[1]).toHaveValue("Melvster")
   expect(boxes[2]).toHaveValue("Mel@vin.rooles")
   expect(boxes[3]).toHaveValue("hunter2")
   expect(boxes[4]).toHaveValue("hunter2")

  userEvent.click(screen.getByRole("button"))

})

test('MenuTestBlanks', async () => {
    //Renders component
    const { container } = render(<RegisterComponent />);
    //Expects correct values
    expect(screen.getByText("Username")).toBeInTheDocument()
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Email")).toBeInTheDocument()
    expect(screen.getByText("Password")).toBeInTheDocument()
    expect(screen.getByText("Confirm Password")).toBeInTheDocument()
  
    const boxes = container.getElementsByClassName('form-control')
    expect(boxes.length).toBe(5)
  
    //Ensures we can input into the document
    await userEvent.type(boxes[1], "Melvster")
    await userEvent.type(boxes[2], "Mel@vin.rooles")
    await userEvent.type(boxes[3], "hunter2")
    await userEvent.type(boxes[4], "hunter2")
 
    //Ensures input is recorded
    expect(boxes[1]).toHaveValue("Melvster")
    expect(boxes[2]).toHaveValue("Mel@vin.rooles")
    expect(boxes[3]).toHaveValue("hunter2")
    expect(boxes[4]).toHaveValue("hunter2")

    userEvent.click(screen.getByRole("button"))
    

  })