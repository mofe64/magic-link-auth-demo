const notificationMarkUp = `<div aria-live="assertive"
class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 notification-bar"
>
<div class="flex w-full flex-col items-center space-y-4 sm:items-end">
 
    <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div class="p-4">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#16a34a" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium text-gray-900">
              Sign In link generated successfully
            </p>
            <p class="mt-1 text-sm text-gray-500">
              Check your email for your sign in link
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

const showNotification = () => {
  hideNotification();
  document
    .querySelector("body")
    .insertAdjacentHTML("afterbegin", notificationMarkUp);
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
        showNotification();
      }
    }
  } catch (err) {
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
