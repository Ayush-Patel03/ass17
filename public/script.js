const getCars = async() => {
    try {
        return (await fetch("api/cars/")).json();
    } catch (error) {
        console.log(error);
    }
};

const showCars = async() => {
    let cars = await getCars();
    let carDiv = document.getElementById("car-list");
    carDiv.innerHTML = "";
    cars.forEach((car) => {
        const section = document.createElement("section");
        section.classList.add("car");
        carDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        const h3 = document.createElement("h3");
        h3.innerHTML = car.name;
        a.append(h3);

        
    });
};

const populateEditForm = (car) => {};

const addEditCar = async(e) => {
    e.preventDefault();
    const form = document.getElementById("add-edit-car-form");
    const formData = new FormData(form);
    let response;
    //trying to add a new recipe
    if (form._id.value == -1) {
        formData.delete("_id");

        console.log(...formData);

        response = await fetch("/api/cars", {
            method: "POST",
            body: formData
        });
    }

    //successfully got data from server
    if (response.status != 200) {
        console.log("Error posting data");
    }

    response = await response.json();
    form.reset();
    document.querySelector(".dialog").classList.add("transparent");
    showCars();
};


window.onload = () => {
    showCars();
    document.getElementById("add-edit-car-form").onsubmit = addEditCar;
}