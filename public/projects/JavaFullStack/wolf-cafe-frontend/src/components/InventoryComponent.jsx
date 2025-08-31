import { useEffect, useState } from 'react';
import { getInventory, updateInventory } from '../services/InventoryService';
import { useNavigate } from 'react-router-dom';
import { getLocationId } from '../services/AuthService';

/**
 * Front-end component for inventory; allows the user to add inventory
 * to ingredients and items already in the system.
 */
const InventoryComponent = () => {
    const [ingredients, setIngredients] = useState([]);
    const [items, setItems] = useState([]);
    const [errors, setErrors] = useState({
        general: "",
        amounts: {},
    });

    const navigate = useNavigate();
    const locationId = getLocationId(); // Get the location ID from AuthService

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = () => {
        getInventory(locationId) // Pass location ID to getInventory
            .then((response) => {
                const fetchedItems = response.data.items;

                // Separate ingredients and items
                const fetchedIngredients = fetchedItems.filter((entry) => entry.ingredient !== null);
                const fetchedItemsOnly = fetchedItems.filter((entry) => entry.item !== null);

                setIngredients(fetchedIngredients);
                setItems(fetchedItemsOnly);
            })
            .catch((error) => {
                console.error(error);
                setErrors({ general: "Failed to fetch inventory" });
            });
    };

    const validateForm = () => {
        let valid = true;
        const errorsCopy = { ...errors, amounts: {} };

        const validateEntries = (entries, type) => {
            entries.forEach((entry) => {
                if (!entry.amount && entry.amount !== 0) {
                    errorsCopy.amounts[`${type}-${entry[type].name}`] = "Amount is required.";
                    valid = false;
                } else if (entry.amount < 0 || isNaN(entry.amount)) {
                    errorsCopy.amounts[`${type}-${entry[type].name}`] = `${entry[type].name} must be a positive integer.`;
                    valid = false;
                } else {
                    errorsCopy.amounts[`${type}-${entry[type].name}`] = "";
                }
            });
        };

        validateEntries(ingredients, "ingredient");
        validateEntries(items, "item");

        setErrors(errorsCopy);
        return valid;
    };

    const modifyInventory = (e) => {
        e.preventDefault();
        setErrors({ general: "", amounts: {} });

        if (validateForm()) {
            const inventoryDto = {
                id: 1,
                items: [...ingredients, ...items],
            };

            updateInventory(locationId, inventoryDto)
                .then(() => {
                    fetchInventory();
					alert("Successfully updated inventory!");
                    navigate("/inventory");
                })
                .catch((error) => {
                    setErrors({ general: "Failed to update inventory" });
                    console.error(error);
                });
        }
    };

    const handleInputChange = (index, newAmount, type) => {
        const amount = parseInt(newAmount, 10);

        const updateEntries = (entries, setEntries) => {
            const updatedEntries = [...entries];
            updatedEntries[index].amount = isNaN(amount) || amount < 0 ? null : amount;
            setEntries(updatedEntries);

            const newErrors = { ...errors };
            if (!isNaN(amount) && amount >= 0) {
                delete newErrors.amounts[`${type}-${entries[index][type].name}`];
            } else {
                newErrors.amounts[`${type}-${entries[index][type].name}`] = `${entries[index][type].name} must be a positive integer.`;
            }
            setErrors(newErrors);
        };

        if (type === "ingredient") {
            updateEntries(ingredients, setIngredients);
        } else if (type === "item") {
            updateEntries(items, setItems);
        }
    };

    const getGeneralErrors = () => {
        if (errors.general) {
            return <div className="p-3 mb-2 bg-danger text-white">{errors.general}</div>;
        }
    };

	const renderEntries = (entries, type) => {
	    if (entries.length === 0) {
	        return <p className="text-muted">{`No ${type === "ingredient" ? "ingredients" : "items"} available.`}</p>;
	    }

	    return entries.map((entry, index) => (
	        <div className="form-group mb-2" key={entry[type].id}>
	            <label className="form-label">{`Amount of ${entry[type].name}`}</label>
	            <input
	                type="number"
	                name={entry[type].name}
	                placeholder={`Enter amount for ${entry[type].name}`}
	                value={entry.amount || ""}
	                onChange={(e) => handleInputChange(index, e.target.value, type)}
	                className={`form-control ${
	                    errors.amounts[`${type}-${entry[type].name}`] ? "is-invalid" : ""
	                }`}
	            />
	            {errors.amounts[`${type}-${entry[type].name}`] && (
	                <div className="invalid-feedback">
	                    {errors.amounts[`${type}-${entry[type].name}`]}
	                </div>
	            )}
	        </div>
	    ));
	};
    return (
        <div className="container mt-3">
            <br />
            <br />
            <div className="row">
                <div className="card col-md-6 offset-md-3">
                    <h2 className="text-center">Inventory</h2>
                    <div className="card-body">
                        {getGeneralErrors()}
                        <form onSubmit={modifyInventory}>
                            <h4>Ingredients</h4>
                            {renderEntries(ingredients, "ingredient")}
                            <h4>Items</h4>
                            {renderEntries(items, "item")}
                            <button className="btn btn-success" type="submit">
                                Update Inventory
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryComponent;