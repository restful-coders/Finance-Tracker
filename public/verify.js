document.addEventListener('DOMContentLoaded', function () {
    const verifyForm = document.getElementById('verifyForm');
  
    verifyForm.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const enteredOTP = document.getElementById('enteredOTP').value;
  
      // Send entered OTP to the server for verification
      fetch('/veriify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${localStorage.getItem('email')}&enteredOTP=${enteredOTP}`,
      })
      .then(response => response.text())
      .then(message => {
        Swal.fire({
          icon: 'success',
          title: 'Verification Successful!',
          text: message,
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Verification Failed',
          text: error.message,
        });
      });
    });
  });
  