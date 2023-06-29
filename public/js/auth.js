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

const hideNotification = () => {
  const element = document.querySelector(".notification-bar");
  if (element) element.parentElement.removeChild(element);
};

const showNotification = (header, text, error) => {
  hideNotification();
  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", notificationMarkUp(header, text, error));
  window.setTimeout(hideNotification, 5000);
};

const attemptLogin = async (email) => {
  try {
    const res = await fetch("/api/v1/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      const data = await res.json();
      console.log(data);
      if (data.success) {
        showNotification(
          "Sign In link generated successfully",
          "Check your email for your sign in link",
          false
        );
      }
    } else {
      const data = await res.json();
      const error = data.error;
      const message = error
        ? error.message
        : "Something went wrong, please try again";
      showNotification("Error", message, true);
    }
  } catch (err) {
    showNotification("Something went wrong", "Please try again", true);
    console.log("err");
    console.log(err);
  }
};

const form = document.querySelector(".login-form");
if (form) {
  form.addEventListener("submit", (e) => {
    console.log("e is --->", e);
    e.preventDefault();
    const email = document.getElementById("email").value;
    console.log("email is --> ", email);
    attemptLogin(email);
    form.reset();
  });
}

const logout = async () => {
  console.log("attempting logout");
  try {
    const res = await fetch("/api/v1/auth/logout", {
      method: "GET",
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      location.reload(true);
    } else {
      const data = await res.json();
      const error = data.error;
      const message = error
        ? error.message
        : "Something went wrong, please try again";
      showNotification("Error", message, true);
    }
  } catch (error) {
    console.log(error.response);
  }
};

const logoutbtn = document.querySelector(".logout");
if (logoutbtn) {
  logoutbtn.addEventListener("click", logout);
}
