(function () {
    "use strict";


    const days_sequential = ["one", "two", "three", "four", "five", "six", "seven"];
    const days_names = ["saturday", "sunday", "monday", "tuesday", "wednesday", "thursday", "friday"];
    let daySwitched = true;
    const addButtons = document.getElementsByClassName("btn-add-row");
    const foods = [
        {name: "Bacon", weight: 25, calories: 142},
        {name: "Beef", weight: 100, calories: 140},
        {name: "Chicken", weight: 100, calories: 235},
        {name: "Egg white", weight: 30, calories: 13},
        {name: "Lobster", weight: 100, calories: 84},
        {name: "Fried Fish", weight: 120, calories: 436},
        {name: "Turkey", weight: 80, calories: 124},
        {name: "Salmon", weight: 100, calories: 211}
    ];

    // const printHello = (message) => console.log("print : "+message);
    // const printHello = (message) => console.log(`print : ${message}`);

    const printHello = function (){
        console.log("hello");
    }
    function printHello1(){
        console.log("hello");
    }

    const printHello2 = (message, type) => console.log("hello: "+ message + " type "+ type);

    printHello2();


    for (let i = 0; i < addButtons.length; i++)
        addButtons[i].onclick = () => addRow(this, i + 1);

    const {href} = window.location;
    console.log(`window.location.href : ${href}`)
    window.location.href;


    /* add new row */
    const addRow = (_this, num) => {
        console.log(`day number : ${num}`);

        let tbody = document.getElementById(`tab_${num}`).getElementsByTagName("tbody")[0];

        const tableRow = document.createElement("tr");
        const foodSelect = foods.map(({name}) => `<option value="${name}">${name}</option>`)
        const rowContent = `
                <td>
                    <button type="button" class="btn btn-outline-danger btn-sm btn-remove-row">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-minus"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                </td>
                <td>
                    <select name="items[${num}][%%INDEX%%][meal_id]" id="" class="form-control form-control-sm" style="width:100%" required>
                        <option value="" disabled selected>- Choose -</option>
                        <option value="breakfst">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="snack">Snack</option>
                        <option value="dinner">Dinner</option>
                    </select>
                </td>
                <td>
                    <select name="items[${num}][%%INDEX%%][nutrition_id]" id="" class="form-control form-control-sm nutrition" required>
                        <option value="" disabled selected>- Choose -</option>
                        
                        ${foodSelect}
                   
                    </select>
                </td>
                <td>
                    <input type="number" class="form-control form-control-sm gram" name="items[${num}][%%INDEX%%][gram]" autocomplete="off" required>
                </td>
                <td>
                    <input type="text" class="form-control form-control-sm calorie" name="items[${num}][%%INDEX%%][calorie]" readonly>
                </td>
        `;
        tableRow.innerHTML = rowContent;
        tbody.appendChild(tableRow);

        const innerRemoveButton = tableRow.getElementsByClassName("btn-remove-row")[0];
        const innerFoodSelect = tableRow.querySelector("select.nutrition");
        const innerWeightInput = tableRow.querySelector("input.gram");

        innerFoodSelect.addEventListener("change", calculateCalorie, false);
        innerWeightInput.addEventListener("change", calculateCalorie, false);
        innerRemoveButton.addEventListener("click", removeRow, false);
    }


    /* row event listeners */
    const removeRow = (event) => {
        event.target.closest('tr').remove();
    }

    const calculateCalorie = (event) => {

        const tr = event.target.closest("tr");
        const foodSelect = tr.querySelector("select.nutrition");
        const weightInput = tr.querySelector("input.gram");
        const calorieInput = tr.querySelector("input.calorie");

        const {weight, calories} = foods.filter(({name}) => name === foodSelect.value)[0];

        console.log(`weight : ${weight} , calories : ${calories}`);

        const caloriePerGram = calories / (weight * 1.0);
        calorieInput.value = (caloriePerGram * (weightInput.value === '' ? 1 : weightInput.value)).toFixed(2);
    }


    /* switch titles */
    document.getElementById("day_type_switch").onchange = () => {

        const links = [...document.getElementsByClassName("nav-link")];

        links.forEach((link, index) => {
            link.innerText = daySwitched ? `day ${days_sequential[index]}` : days_names[index];
        });

        daySwitched = !daySwitched;

        document.getElementsByName("day_type")[0].setAttribute("value", daySwitched);
    }


    document.getElementById("program_form").onsubmit = (e) => {
        e.preventDefault();
        reindex();
        createProgram();
    }

    const reindex = () => {
        const form = document.getElementById("program_form");
        const formTables = [...form.getElementsByTagName("table") ];

        const resultDOM = document.getElementById("result");
        resultDOM.innerHTML="";

        formTables.forEach((table, table_index) => {

            const header2 = document.createElement("h2");
            header2.innerText = !daySwitched ? `day ${days_sequential[table_index]}` : days_names[table_index];

            const dayList = document.createElement("ul");
            dayList.className = "result-list";

            [...table.getElementsByTagName("tbody")[0].getElementsByTagName("tr")].forEach((row, row_index) => {

                let csvItems ="";
                const dayItem = document.createElement("li");

                [...row.getElementsByClassName("form-control") ].forEach((elem, elem_index) => {

                    elem.name = elem.name.replace("%%INDEX%%", row_index);

                    if (elem_index<2){
                        csvItems += `${elem.value},  `;
                    }else if (elem_index===2){
                        csvItems += `${elem.value==='' ? 1 : elem.value} Gr`;
                    }
                });
                dayItem.innerText = csvItems;
                dayList.appendChild(dayItem);
            });
            if (dayList.children.length> 0){
                resultDOM.appendChild(header2);
                resultDOM.appendChild(dayList);
            }
        });
    }

    const createProgram = () => {
        // const form = document.getElementById("program_form");

        const items = [...document.getElementsByName("items[][][]")];
        console.log(`items count : ${items}`);
    }

}());