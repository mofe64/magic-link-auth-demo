// util fucntion that inserts a custom header and text into the markup for our notificaton
const notificationMarkUp = (header, text, error) => `<div aria-live="assertive"
class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 notification-bar"
>
<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
 
    <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
      
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              ${header}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              ${text}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span class="sr-only">Close</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              
            </button>
          </div>
        </div>
      </div>
    </div>

</div>
</div> `;

// util function to hide the notifcation bar
const hideNotification = () => {
  // find the notifcation bar element in dom
  const element = document.querySelector(".notification-bar");
  // if found, then remove the element from its parent
  if (element) element.parentElement.removeChild(element);
};

// util function to show the notifcation bar
const showNotification = (header, text, error) => {
  // if notification bar is currently visible hide it
  hideNotification();
  // insert our notification markup intp the body tag of the page
  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", notificationMarkUp(header, text, error));
  // after 5 seconds hide the notification
  window.setTimeout(hideNotification, 5000);
};

// method to attempt to start the login process for user
const attemptLogin = async (email) => {
  try {
    // send get request to login endpoint with email passed in body
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    // if response is ok (200)
    if (res.ok) {
      // decode reponse
      const data = await res.json();
      console.log(data);
      // if response success flag is true
      if (data.success) {
        // show success notification
        showNotification(
          "Sign In link generated successfully",
          "Check your email for your sign in link",
          false
        );
      }
    } else {
      // if response success flag is not true
      // decode reponse
      const data = await res.json();
      // extract error from response
      const error = data.error;
      // extract error message from error if present else
      // we use a generic error message
      const message = error
        ? error.message
        : "Something went wrong, please try again";
      // show error notification
      showNotification("Error", message, true);
    }
  } catch (err) {
    // if an error was thrown, then show error notification and log error
    showNotification("Something went wrong", "Please try again", true);
    console.log("err");
    console.log(err);
  }
};

// select login form and add event listener on the submit event
const form = document.querySelector(".login-form");
if (form) {
  // on submit, we call the attempt login method and reset the form
  form.addEventListener("submit", (e) => {
    console.log("e is --->", e);
    e.preventDefault();
    const email = document.getElementById("email").value;
    console.log("email is --> ", email);
    attemptLogin(email);
    form.reset();
  });
}

// method to logout the user
const logout = async () => {
  console.log("attempting logout");
  // send get request to the logout endpoint
  try {
    const res = await fetch("/api/v1/auth/logout", {
      method: "GET",
    });
    // decode response
    const data = await res.json();
    console.log(data);
    // if successful, then reload the page, which will redirect to
    // login since user is logged out
    if (data.success) {
      location.reload(true);
    } else {
      // else extract error message and display error notification
      const data = await res.json();
      const error = data.error;
      const message = error
        ? error.message
        : "Something went wrong, please try again";
      showNotification("Error", message, true);
    }
  } catch (error) {
    // if an error was thrown, then show error notification and log error
    console.log(error.response);
  }
};

// add event listener to the logout btn for the click event
const logoutbtn = document.querySelector(".logout");
if (logoutbtn) {
  // on click we call the logout method
  logoutbtn.addEventListener("click", logout);
}
