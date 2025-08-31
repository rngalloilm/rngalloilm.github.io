import {useState} from 'react'
import {createIngredient} from '../services/IngredientService.js'
import {useNavigate} from 'react-router-dom'
import { getLocationId } from '../services/AuthService.js'
import { isNumber } from 'chart.js/helpers'

/** Form to create a new recipe. */
const IngredientComponent = () => {
	/** used to store all the ingredient information: name and amount of ingredient  */
    const [name, setIngredientName] = useState("")
    const [amount, setAmount] = useState("")

    const navigator = useNavigate()
	/**
	 * basic layout of the ingredient: name and amount
	 */
    const [errors, setErrors] = useState({
        general: "",
        name: "",
        amount: ""
    })

/** errors checks to see if the inventory input are valid and if not then an error displays */
    function validateForm() {
        let valid = true

        const errorsCopy = {...errors}

        if (name.trim()) {
            errorsCopy.name = ""
        } else {
            errorsCopy.name = "Name is required."
            valid = false
        }

        if (valid) {
            if (amount.length >= 1 && isNumber(amount)) {
                try {
                    let parsedAmount = parseInt(amount);
                    if(parsedAmount <= -1) {
                        errorsCopy.amount = "Invalid amount to add to the inventory (must be positive integer)"
                        valid = false
                    }
                } catch (e) {
                    errorsCopy.amonut = "Inventory instantiation parsing error"
                    valid = false;
                }
            } else {
                errorsCopy.amount = "Amount is required"
                valid = false;
            }
        }

        setErrors(errorsCopy)

        return valid
    }
	/** displays if there a general error with the ingredient class 
	 * @return the error message 
	*/
    function getGeneralErrors() {
        if (errors.general) {
            return <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>
        }
    }
	/**
	 * functons to save the new ingredient to the system 
	 * @param e the object being added to the system 
	 * @return appropriate actions to reflect the updated ingredient list with the 
	 * new ingredient
	 */
    function saveIngredient(e) {
        e.preventDefault();
        if (validateForm()) {
            const ingredientDto = {name};
			const locationId = parseInt(getLocationId())
            const initialAmount = parseInt(amount);
            const ingredient = {ingredientDto, initialAmount, locationId}
            console.log(ingredientDto);
            console.log(initialAmount);
            console.log(ingredient);

            createIngredient(ingredient).then((response) => {
                const parsedResponse = response.data;
                if (parsedResponse && parsedResponse.id) {
                    console.log(`Response contains id: ${parsedResponse.id}`);
                    navigator("/ingredients")
                } else {
                    const errorsCopy = {...errors}
                    errorsCopy.name = parsedResponse;
                    setErrors(errorsCopy);
                    console.log(errors)
                }
            }).catch(error => {
                console.error(error)
                const errorsCopy = {...errors}
                errorsCopy.general = error.response.data.error;
                setErrors(errorsCopy);
            })
        }
    }

	//renders the ingredient content
    return (
        <div className="container mt-3">
            <br/><br/>
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h2 className="text-center">Add Ingredient</h2>

                    <div className="card-body">
                        {getGeneralErrors()}
                        <form>
                            <div className="form-group mb-2">
                                <label className="form-label">Ingredient Name</label>
                                <input
                                    type="text"
                                    name="ingredientName"
                                    placeholder="Enter Ingredient Name"
                                    value={name}
                                    onChange={(e) => setIngredientName(e.target.value)}
                                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                                >
                                </input>
                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                            </div>

                            <div className="form-group mb-2">
                                <label className="form-label">Amount</label>
                                <input
                                    type="text"
                                    name="amount"
                                    placeholder="Enter Amount (as an integer)"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className={`form-control ${errors.amount ? "is-invalid" : ""}`}
                                >
                                </input>
                                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                            </div>


                            <button className="btn btn-success" onClick={(e) => saveIngredient(e)}>Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default IngredientComponent