const URL = "https://randomuser.me/api/?results=15";
var users;

const debounce = (fn, ms) => {
	let timeout;
	return function() {
		const fnCall = () => {fn.apply(this, arguments)};
		clearTimeout(timeout);
		timeout = setTimeout(fnCall, ms);
	}
}

function getInformation(url) {
	return fetch(url).then(response => {
		return response.json();
	})
}

function showAllInformation(info) {
	document.querySelector("tbody").textContent = "";
	for (let user of info) {
		createTableRows(user);
	}
	makeEventOnImg();
	let preloader = document.getElementById("preloader");
	preloader.style.display = "none";
}

function formatDate(date) {
	let month = date.getMonth() + 1;
	let newMonth;
	let day = date.getDate();
	let newDay;
	if (month <= 9) {
		month = '0' + month;
	}
	if (day <= 9) {
		day = '0' + day;
	}
	return {"day": day, "month": month, "year": date.getFullYear()};
}

function showCurrentInformation(info, nameOfUser) {
	let numberOfFoundUsers = 0;
	document.querySelector("tbody").textContent = "";
	for (let user of info) {
		if (`${user.name.first} ${user.name.last}`.toLowerCase().indexOf(nameOfUser.trim().toLowerCase()) == 0) {
			createTableRows(user);
			numberOfFoundUsers++;
		}
	}
	makeEventOnImg();
	if (numberOfFoundUsers == 0 && nameOfUser != "") {
		createErrorMessage();
	}
	if (nameOfUser == "") {
		showAllInformation(users);
	}
}

function createTableRows(user) {
	let date = formatDate(new Date(user.registered.date));
	let row = document.createElement("tr");
	row.innerHTML = `<td>${user.name.first} ${user.name.last}</td>
					<td><img src="${user.picture.thumbnail}"></td>
					<td>${user.location.state}, ${user.location.city}</td>
					<td>${user.email}</td>
					<td>${user.phone}</td>
					<td>${date.day}.${date.month}.${date.year}</td>`; 
	document.querySelector("tbody").append(row);
}

function createErrorMessage() {
	let message = document.createElement("div");
	message.classList.add("message");
	message.textContent = "Such user was not found!";
	document.getElementById("cancelButton").after(message);
	setTimeout(() => {
		document.getElementsByClassName("message")[0].remove();
	}, 1000)
}

function onCancelClick() {
	document.getElementById("search").value = "";
	document.querySelector("tbody").textContent = "";
	showAllInformation(users);
}

function onChange(e) {
	showCurrentInformation(users, e.target.value);
}

function showLargerPicture(event) {
	let largePicture = document.getElementsByClassName("largePicture")[0];
	for (let user of users) {
		if (user.picture.thumbnail == event.currentTarget.src) {
			let img = document.createElement("img");
			img.classList.add("largePicture__item");
			img.src = user.picture.large;
			let thumbnailCoords = event.currentTarget.getBoundingClientRect();
			largePicture.style.left = thumbnailCoords.left + event.currentTarget.clientWidth + "px";
			largePicture.style.top = thumbnailCoords.top + "px";
			largePicture.append(img);
			largePicture.style.display = "block";
			break;
		}
	}
}

function hideLargerPicture(event) {
	document.getElementsByClassName("largePicture__item")[0].remove();
	document.getElementsByClassName("largePicture")[0].style.display = "none";
}


function makeEventOnImg() {
	let arrOfPictures = document.getElementsByTagName("img");
	for (let item of arrOfPictures) {
		item.addEventListener("mouseover", showLargerPicture);
		item.addEventListener("mouseout", hideLargerPicture);
	}
}

getInformation(URL)
.then(data => {
	users = data.results;
	showAllInformation(users);
})
.catch(error => console.log(error));

window.onload = () => {
	document.getElementById("search").addEventListener("keyup", debounce(onChange, 500));
	document.getElementById("cancelButton").addEventListener("click", onCancelClick);
}