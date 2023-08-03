import Swal from "sweetalert2";

export default function formValidate() {
    const getDomain = domain || window.location.href;
  document.addEventListener('DOMContentLoaded', function () {
    const submitButtons = document.querySelectorAll('.fe-submit');
    submitButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        const form = document.querySelector(
          this.getAttribute('data-form')
        );
        const action = form.getAttribute('data-action');

        const formSelect = form;
        const checkValidation = formSelect.checkValidity();

        if (checkValidation) {
          const hiddenInput = document.createElement('input');
          hiddenInput.type = 'hidden';
          hiddenInput.name = action;
          hiddenInput.value = '1';
          form.appendChild(hiddenInput);

          const xhr = new XMLHttpRequest();
          xhr.open('POST', getDomain || + 'isle.php');
          xhr.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded'
          );
          xhr.onload = function () {
            const data = JSON.parse(xhr.responseText);
            if (data.durum === 'success') {
              formSelect.reset();
            }
            Swal.fire({
              icon: data.durum,
              text: data.bildirim,
              showConfirmButton: false,
            });
          };
          xhr.onerror = function () {
            Swal.fire({
              icon: 'error',
              text: 'An error occurred while processing the request.',
            });
          };
          xhr.send(new URLSearchParams(new FormData(form)));
        } else {
          validateOptions(new FormData(form), form, true);
        }
      });
    });
  });

  function validateOptions(formData, form, show = false) {
    formData.forEach(function (value, name) {
      const element = form.querySelector('[name="' + name + '"]');
      const errorStatus = element.checkValidity();
      const errorMessage = element.validationMessage;
      if (!errorStatus) {
        form.reportValidity();
        console.log('Form Validation Error Check Error Message! \n', {
          Status: errorStatus,
          Message: errorMessage,
          Element: element,
        });
      } else {
        element.setCustomValidity('');
      }
    });
  }
}
