let result;
let day = "FRIDAY";
let section;
const dayArray = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
let holiday = true;

const readExcel = async () => {
    try {
        const response = await fetch('./FAST School of Computing - Fall 2024 TimeTable V1.xlsx'); // Ensure this path is correct
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetNames = workbook.SheetNames;

        result = {};

        sheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            result[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        });

        let xc = 0;
        let totalSlots = result[day][1].length - 1;
        let theory = 0;
        let lab = 0;
        let location;
        let timetableDiv = document.getElementById('timetable');

      
        if (!document.querySelector(`.day-heading-${day}`)) {
            let dayHeading = document.createElement('h2');
            dayHeading.textContent = `${day} Timetable`;
            dayHeading.className = `day-heading day-heading-${day}`; 
            timetableDiv.appendChild(dayHeading); 
        }

        const newDiv = document.createElement('div');
        newDiv.className = `timetable-container timetable-container-${day}`;  

        for (let i = 4; i <= result[day].length; i++) {
            if (result[day][i] !== undefined && result[day][i][0] !== undefined) {
                location = result[day][i][0];
            }

            for (let s = 1; s <= totalSlots; s++) {
                if (result[day][i] !== undefined) {
                    let box = result[day][i][s];
                    if (box !== undefined) {
                        let popo = box.trim().split(/\s+/);

                        if (popo[1] === `${section}`) {
                            console.log(box, s, location);
                            xc++;
                            theory = 0;

                            let infoDiv = document.createElement('div');
                            infoDiv.className = 'info-box';
                            infoDiv.textContent = `Theory Class: ${box} - Slot ${s} - Location: ${location}`;
                            newDiv.appendChild(infoDiv);
                        } else {
                            theory = -1;
                        }

                        if (popo[2] === `${section}`) {
                            console.log(box, s, s + 1, s + 2, location);
                            xc++;
                            lab = 0;

                            let infoDiv = document.createElement('div');
                            infoDiv.className = 'info-box';
                            infoDiv.textContent = `Lab: ${box} - Slots ${s}, ${s + 1}, ${s + 2} - Location: ${location}`;
                            newDiv.appendChild(infoDiv);
                        } else {
                            lab = -1;
                        }
                    }
                }
            }
        }

        if (xc === 0 && lab === -1 && theory === -1) {
            console.log('Holiday');
            let holidayDiv = document.createElement('div');
            holidayDiv.className = 'holiday-box';
            holidayDiv.textContent = `${day} is a holiday.`;
            newDiv.appendChild(holidayDiv);
        }

        timetableDiv.appendChild(newDiv);

    } catch (error) {
        console.error("Error reading Excel file:", error);
    }
};


const setDay = async (selectedDay) => {
    const timetableDiv = document.getElementById('timetable');
    timetableDiv.classList.remove('hidden');  

    if (selectedDay === "ALL") {
        deleteExistingDivs(); 

        let count = 0;
        let interval = setInterval(function () {
            day = dayArray[count];
            console.log(day);
            filterTimetable(); 
            count++;
            if (count > dayArray.length - 1) {
                clearInterval(interval);
            }
        }, 500);
    } else {
        deleteExistingDivs(); 
        day = selectedDay;
        filterTimetable();
    }
};




const filterTimetable = () => {
    section = document.getElementById('section').value.trim().toUpperCase();
    readExcel();
};

const deleteExistingDivs = () => {
    const divsToDelete = document.querySelectorAll('.timetable-item, .timetable-container, .day-heading');
    divsToDelete.forEach(div => div.remove());
};
