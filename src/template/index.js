const popupsArr = {{popupsArr}};
function loadCSS(callback) {
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = "https://krugs-test-bucket.s3.amazonaws.com/index.css";
    document.head.appendChild(link);
    link.onload = callback; // Set the callback to be executed after CSS loads
}

function createPopupElement(popupData, index) {
  const popup_container = document.createElement("div");
  const popup_internal_container = document.createElement("div");
  const img = document.createElement("img");
  const text_container = document.createElement("div");
  const headers = document.createElement("div");
  const title = document.createElement("div");
  const time = document.createElement("div");
  const description = document.createElement("p");

  popup_container.classList.add("popup_container");
  popup_container.classList.add(`popup_${index}`);
  popup_internal_container.classList.add("popup_internal_container");
  img.classList.add("img");
  text_container.classList.add("text_container");
  headers.classList.add("headers");
  time.classList.add("time");
  title.classList.add("title");
  description.classList.add("description");

  img.src = popupData.image;

  popup_container.appendChild(popup_internal_container);
  popup_internal_container.appendChild(img);
  popup_internal_container.appendChild(text_container);
  text_container.appendChild(headers);
  headers.appendChild(title);
  headers.appendChild(time);
  text_container.appendChild(description);

  title.innerText = popupData.title; 
  time.innerText = popupData.time; 
  description.innerText = popupData.description; 

  if (popupData.cta) {
    addCTA(text_container, popupData.cta);
  }

  return popup_container;
}

function addCTA(parentNode, cta) {
  const button = document.createElement("button");
  button.classList.add("cta");
  button.innerText = cta.text;
  if (cta.style) {
    button.style.backgroundColor = cta.style.backgroundColor;
    button.style.color = cta.style.textColor;
  }
  //open in new tab
  button.onclick = () => {
    window.open(cta.url, '_blank');
  };

  parentNode.appendChild(button);

}



function initializePopup() {
  const popups = [];
  const popupList = document.createElement("div");
  popupList.classList.add("popup_list");
  for (let i = 0; i < popupsArr.length; i++) {
    const currentPopup = popupsArr[i];
    const popup_container = createPopupElement(currentPopup, i); // I want to replace with dynamic text
    popups.push(popup_container);
    popupList.appendChild(popup_container);
  }


  document.body.appendChild(popupList);
  let delay = 0; // Initialize the delay

  popups.forEach((popup, index) => {
    // Increase the delay for each popup
    setTimeout(() => {
      // popup.style.top = index * 5 + "%";
      document.getElementsByClassName(`popup_${index}`)[0].style.display = "flex";
      hidePopup(index, popups);

    }, delay);

    // Increment delay for the next popup
    delay += 2000;
  });


}

function hidePopup(index, popups) {
  const currentPopupData= popupsArr[index];
  const duration = isNaN(parseInt(currentPopupData?.duration)) ? 5000 :  parseInt(currentPopupData?.duration);
  setTimeout(() => {
    const popupElement = document.getElementsByClassName(`popup_${index}`)[0];
    //delete the element when animation ends
    popupElement.addEventListener("animationend", () => {
      deleteElementByClassName(`popup_${index}`);
      popupsArr.splice(index, 1);
      if (popupsArr.length == 0) {
        deleteElementByClassName(`popup_list`);
      }
    });
    popupElement.style.animation = "slide-right 1s ease-in-out";

  }, duration);
}

function deleteElementByClassName(className) {
  // Get the elements by class name
  const elements = document.getElementsByClassName(className);

  // Loop through the elements and remove each one from the document
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

// Load CSS and initialize the popup after it has loaded
loadCSS( initializePopup);
