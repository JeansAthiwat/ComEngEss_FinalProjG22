const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventDescription = document.querySelector(".event-description "),
  addEventSubject = document.querySelector(".event-subject "),
  addEventSubmit = document.querySelector(".add-event-btn ");

const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const userProfile = document.getElementById("user-profile");
const backendIPAddress = "127.0.0.1:3000";

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// const eventsArr = [
//   {
//     day: 13,
//     month: 11,
//     year: 2022,
//     events: [
//       {
//         id: "22504",
//         title: "Event 1 lorem ipsun dolar sit genfa tersd dsad ",
//         time: "10:00 AM - 10:00 AM",
//         description: "hello you need to do this and that bro",
//         subject: "E22101225",
//         status: 0
//       },
//       {
//         id: "sdfsad156384s2df65",
//         title: "Event 2 what sub bero",
//         time: "10:00 AM - 10:00 AM",
//         description: "hello you need to do this and that brofdssdfsd",
//         subject: "E221055",
//         status: 1
//       },
//     ],
//   },
// ];

const eventsArr = [];
const assignment_id_finished = new Set();
var current_id = "";
initCalendar();

//function to add days in days with class day and prev-date next-date on previous month and next month days and active on today
function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }

  for (let i = 1; i <= lastDate; i++) {
    //check if event is present on that day
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      if (event) {
        days += `<div class="day today active event">${i}</div>`;
      } else {
        days += `<div class="day today active">${i}</div>`;
      }
    } else {
      if (event) {
        days += `<div class="day event">${i}</div>`;
      } else {
        days += `<div class="day ">${i}</div>`;
      }
    }
  }

  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

//function to add month and year on prev and next button
function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

//function to add active on day
function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      //remove active
      days.forEach((day) => {
        day.classList.remove("active");
      });
      //if clicked prev-date or next-date switch to that month
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        //add active to clicked day afte month is change
        setTimeout(() => {
          //add active where no prev-date or next-date
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("prev-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        //add active to clicked day after month is changed
        setTimeout(() => {
          const days = document.querySelectorAll(".day");
          days.forEach((day) => {
            if (
              !day.classList.contains("next-date") &&
              day.innerHTML === e.target.innerHTML
            ) {
              day.classList.add("active");
            }
          });
        }, 100);
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
  if (e.inputType === "deleteContentBackward") {
    if (dateInput.value.length === 3) {
      dateInput.value = dateInput.value.slice(0, 2);
    }
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  //console.log("here");
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Invalid Date");
}

//function get active day day name and date and update eventday eventdate
function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//function update events when a day is active
function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle">-</i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">Time:${event.time}</span>
            </div>
            <div class="event-time">
              <span class="event-time">Desc:${event.description}</span>
            </div>
            <div class="event-time">
              <span class="event-time">Subj:${event.subject}</span>
            </div>
            <div class="event-time">
              <span class="event-time">${event.id}</span> 
            </div>
        </div>`; // ----------------------------check this line if shit goes wrong
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>No Events</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  //
}

//function to add event
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

//allow 50 chars in eventtitle
addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

addEventDescription.addEventListener("input", (e) => {
  addEventDescription.value = addEventDescription.value.slice(0, 70);
});

//allow only time in eventtime from and to
addEventFrom.addEventListener("input", (e) => {
  addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
  if (addEventFrom.value.length === 2) {
    addEventFrom.value += ":";
  }
  if (addEventFrom.value.length > 5) {
    addEventFrom.value = addEventFrom.value.slice(0, 5);
  }
});

addEventTo.addEventListener("input", (e) => {
  addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
  if (addEventTo.value.length === 2) {
    addEventTo.value += ":";
  }
  if (addEventTo.value.length > 5) {
    addEventTo.value = addEventTo.value.slice(0, 5);
  }
});

//function to add event to eventsArr ------------------------------------check this funcirton if shit goes wrong
addEventSubmit.addEventListener("click", () => {
  const eventID = Date.now().toString();
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  const eventDescription = addEventDescription.value;
  const eventSubject = addEventSubject.value;
  const eventStatus = 1;

  if (
    eventTitle === "" ||
    eventTimeFrom === "" ||
    eventTimeTo === "" ||
    eventDescription === "" ||
    eventSubject === ""
  ) {
    alert("Please fill all the fields");
    return;
  }

  //check correct time format 24 hour
  const timeFromArr = eventTimeFrom.split(":");
  const timeToArr = eventTimeTo.split(":");
  if (
    timeFromArr.length !== 2 ||
    timeToArr.length !== 2 ||
    timeFromArr[0] > 23 ||
    timeFromArr[1] > 59 ||
    timeToArr[0] > 23 ||
    timeToArr[1] > 59 ||
    timeFromArr[0] * 100 + timeFromArr[1] > timeToArr[0] * 100 + timeToArr[1]
  ) {
    alert("Invalid Time Format");
    return;
  }

  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);

  //check if event is already added
  let eventExist = false;
  eventsArr.forEach((event) => {
    if (
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
    ) {
      event.events.forEach((event) => {
        if (event.title === eventTitle) {
          eventExist = true;
        }
      });
    }
  });
  if (eventExist) {
    alert("Event already added");
    return;
  }
  const newEvent = {
    id: eventID,
    title: eventTitle,
    time: timeFrom + " - " + timeTo,
    description: eventDescription,
    subject: eventSubject,
    status: eventStatus,
  };
  console.log(newEvent);
  console.log(activeDay);
  let eventAdded = false;
  if (eventsArr.length > 0) {
    eventsArr.forEach((item) => {
      if (
        item.day === activeDay &&
        item.month === month + 1 &&
        item.year === year
      ) {
        item.events.push(newEvent);
        eventAdded = true;
      }
    });
  }

  if (!eventAdded) {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  console.log(eventsArr);
  // console.log(JSON.stringify(eventsArr));
  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);
  saveEvents();
  //select active day and add event class if not added
  const activeDayEl = document.querySelector(".day.active");
  if (!activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

//function to delete event when clicked on event  -- see function updateEvents(date) for more detail of understanding na
eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Are you sure you want to delete this event?")) {
      const eventID = e.target.children[4].children[0].innerHTML;
      // console.log(eventID);
      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events.forEach((item, index) => {
            if (item.id === eventID) {
              event.events.splice(index, 1);
              assignment_id_finished.add(eventID);
              console.log("assignment_id_finished", assignment_id_finished);
            }
          });
          //if no events left in a day then remove that day from eventsArr
          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            //remove event class from day
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl.classList.contains("event")) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });
      updateEvents(activeDay);
      saveEvents();
    }
  }
});

//function to save events in local storage
function saveEvents() {
  updateAssignmentIdToDB(current_id).then(() => updateEventsIdToDB(current_id));
}

//function to get events from local storage
async function getEvents() {
  //check if events are already saved in local storage then return event else nothing
  await getEventsTableFromDB(current_id).then((res) => {
    const eventsList = res[0];
    const assignmentIdList = res[1];
    // console.log("res", res);
    eventsArr.push(...eventsList);
    assignmentIdList.forEach((assignmentId) => {
      assignment_id_finished.add(assignmentId);
    });
    console.log("geteventeventsArr", eventsArr);
    console.log("assignment_id_finished", assignment_id_finished);
  });
}

function convertTime(time) {
  //convert time to 24 hour format
  let timeArr = time.split(":");
  let timeHour = timeArr[0];
  let timeMin = timeArr[1];
  let timeFormat = timeHour >= 12 ? "PM" : "AM";
  timeHour = timeHour % 12 || 12;
  time = timeHour + ":" + timeMin + " " + timeFormat;
  return time;
}

async function getEventsTableFromDB(current_id) {
  const eventsList = new Array();
  const assignmentIdList = [];
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/events/${current_id}`, options)
    .then((response) => response.json())
    .then((data) => {
      console.log("data", data);
      data.Item.assignment_id_finished.forEach((assignmentId) => {
        assignmentIdList.push(assignmentId);
      });

      data.Item.events_list.map((event_list) => {
        eventsList.push({
          day: event_list.day,
          month: event_list.month,
          year: event_list.year,
          events: event_list.events,
        });
      });
      // console.log("eventsList", eventsList);
    })
    .catch((error) => console.error(error));
  return [eventsList, assignmentIdList];
}

async function updateAssignmentIdToDB(current_id) {
  // PUT request using fetch with async/await
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(Array.from(assignment_id_finished)),
  };
  const response = await fetch(
    `http://${backendIPAddress}/events/assignment/${current_id}`,
    options
  );
  console.log("updateAssignmentIdToDB", response);
}

const cleanUp = (eventsArr) => {
  const eventsArrToDB = [];
  eventsArr.map((eventwithdate) => {
    const temp_events = [];
    eventwithdate.events.map((event) => {
      if (event.status == 0 || event.status == null) {
        return;
      }
      temp_events.push(event);
    });
    if (temp_events.length > 0) {
      eventsArrToDB.push({
        day: eventwithdate.day,
        month: eventwithdate.month,
        year: eventwithdate.year,
        events: temp_events,
      });
    }
  });
  return eventsArrToDB;
};

async function updateEventsIdToDB(current_id) {
  const options = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(cleanUp(eventsArr)),
  };
  // console.log("updateEventsIdToDB", JSON.stringify(eventsArr));
  const response = await fetch(
    `http://${backendIPAddress}/events/event/${current_id}`,
    options
  );
  console.log("updateEventsIdToDB", response);
}

async function buttonVisibility() {
  if (current_id == "") {
    logoutBtn.style.visibility = "hidden";
    logoutBtn.style.display = "none";
    loginBtn.style.visibility = "visible";
    loginBtn.style.display = "inline-block";
  } else {
    logoutBtn.style.visibility = "visible";
    logoutBtn.style.display = "inline-block";
    loginBtn.style.visibility = "hidden";
    loginBtn.style.display = "none";
  }
}

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
  // console.log("current_id", current_id);
  document.getElementById("eng-name-info").innerHTML = "";
};

loginBtn.addEventListener("click", () => {
  //handle login
  authorizeApplication();
  // Assume login is successful and user data is retrieved
  initData();
});

const initData = async () => {
  await getUserProfile().then(() => {
    getEventsTableFromDB(current_id)
      .then((res) => {
        res[1].forEach((assignmentId) => {
          assignment_id_finished.add(assignmentId);
        });
        console.log("pass here");
      })
      .then(() => {
        convertAssignmentToEventsArr();
      })
      .then(() => {
        getEvents();
      })
      .then(() => {
        console.log("calender inited through initdata");
        
      })
      .catch((error) => {
        console.log("u aint logged in", error);
      });
      buttonVisibility();
  });
};
// Add click event listener to logout button
logoutBtn.addEventListener("click", () => {
  //handle logout
  userProfile.innerHTML = "";
  current_id = "";
  logout();
  
  // Hide user profile
  
  
  // logoutBtn.style.display = "none";
  // loginBtn.style.display = "block";
});

const getUserProfile = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_profile_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      // console.log("data", data);
      const studentInfo = data.data.student;
      current_id = studentInfo.id;
      console.log("current_id", current_id);
      console.log("getUserProfile", studentInfo);
      document.getElementById(
        "eng-name-info"
      ).innerHTML = `${studentInfo.firstname_en} ${studentInfo.lastname_en}`;
    })
    .catch((error) => console.error(error));
};

const getUserCourse = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  const res = await fetch(
    `http://${backendIPAddress}/courseville/get_courses`,
    options
  );
  const data = await res.json();
  console.log(data);
  const courses = await data.data.student;

  const coursesArr = [];
  courses.map((course) => {
    const courseData = {
      cv_cid: course.cv_cid,
      title: course.title,
      course_no: course.course_no,
    };
    coursesArr.push(courseData);
  });
  return coursesArr;
  // [
  //   { cv_cid: 29667,
  // title: "Compudatcourse.title",
  // course_no: "2100111"
  // },
  // ]
};

const getUserAssignment = async (cv_cid) => {
  const assignmentsArr = [];
  const options = {
    method: "GET",
    credentials: "include",
  };
  const res = await fetch(
    `http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}&detail=1`,
    options
  );

  const assignments = (await res.json()).data;
  // console.log("assignments",assignments);
  assignments.map((assignment) => {
    assignmentsArr.push({
      itemid: assignment.itemid,
      title: assignment.title,
      duedate: assignment.duedate,
      duetime: assignment.duetime,
    });
  });
  // console.log("assignmentsArr",assignmentsArr);
  return assignmentsArr;
};

const convertAssignmentToEventsArr = async () => {
  const coursesAssignmentsList = [];
  await getUserCourse().then((coursesArr) => {
    coursesArr.map((course) => {
      const current_cv_cid = course.cv_cid;
      const current_course_title = course.title;
      const current_course_no = course.course_no;
      getUserAssignment(current_cv_cid).then((assignmentsArr) => {
        assignmentsArr.map((assignment) => {
          const current_itemid = assignment.itemid.toString();
          const current_assignment_title = assignment.title;
          const current_assignment_duetime = assignment.duetime;
          if (assignment.duedate === null || assignment.duedate === "") {
            return;
          }
          const current_assignment_duedate_day = Number(
            assignment.duedate.slice(8, 10)
          );
          const current_assignment_duedate_month = Number(
            assignment.duedate.slice(5, 7)
          );
          const current_assignment_duedate_year = Number(
            assignment.duedate.slice(0, 4)
          );

          const eventID = current_itemid;
          const eventTitle = current_assignment_title.slice(0, 60);
          const eventDescription = `${current_course_title}`;
          const eventSubject = current_course_no;
          const eventStatus = 0;
          // console.log("eventID", assignment_id_finished,eventID);
          // console.log(assignment_id_finished.has(eventID));
          if (assignment_id_finished.has(eventID)) {
            // console.log("Assignment already done", eventID);
            return;
          }
          const newEvent = {
            id: eventID,
            title: eventTitle,
            time: '"Due Today"',
            description: eventDescription,
            subject: eventSubject,
            status: eventStatus,
          };
          // console.log("newEvent",newEvent);
          // console.log(activeDay);
          let eventAdded = false;
          if (eventsArr.length > 0) {
            eventsArr.forEach((item) => {
              if (
                item.day === current_assignment_duedate_day &&
                item.month === current_assignment_duedate_month &&
                item.year === current_assignment_duedate_year
              ) {
                item.events.push(newEvent);
                eventAdded = true;
              }
              // console.log("eventsArr",eventsArr);
            });
          }

          if (!eventAdded) {
            eventsArr.push({
              day: current_assignment_duedate_day,
              month: current_assignment_duedate_month,
              year: current_assignment_duedate_year,
              events: [newEvent],
            });
          }
          initCalendar();
        });
      });
    });
  });
  // console.log("convertAssignmentToEventsArr", eventsArr);
};


