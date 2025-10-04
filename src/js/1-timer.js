import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

iziToast.settings({
  timeout: 2000,
  theme: 'dark',
  displayMode: 'once',
  position: 'topRight',
  resetOnHover: true,
  transitionIn: 'flipInX',
  transitionOut: 'flipOutX',
});

const timer = {
  intervalID: null,
  userDate: null,
  elements: {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
    button: document.querySelector('[data-start]'),
    input: document.querySelector('#datetime-picker'),
  },
  isFutureDate() {
    if (this.userDate - Date.now() > 0) return true;
    this.showMessage('Please choose a date in the future!');
    this.disableInterface(false);
    return false;
  },
  setTimer() {
    if (!this.isFutureDate()) return;
    this.startCountDown();
    this.disableInterface();
  },
  startCountDown() {
    this.intervalID = setInterval(() => {
      const left = this.userDate - Date.now();

      if (left <= 0) {
        this.stopTimer();
        return;
      }

      const time = this.convertMs(left);

      this.elements.days.textContent = this.pad(time.days);
      this.elements.hours.textContent = this.pad(time.hours);
      this.elements.minutes.textContent = this.pad(time.minutes);
      this.elements.seconds.textContent = this.pad(time.seconds);
    }, 1000);
  },
  stopTimer() {
    clearInterval(this.intervalID);
    this.enableInterface();
  },
  convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  },
  pad(value) {
    return String(value).padStart(2, '0');
  },
  disableInterface(all = true) {
    if (all) this.elements.input.setAttribute('disabled', '');
    this.elements.button.setAttribute('disabled', '');
  },
  enableInterface(all = false) {
    if (all) this.elements.button.removeAttribute('disabled');
    this.elements.input.removeAttribute('disabled');
  },
  showMessage(message) {
    iziToast.show({ message: [message] });
  },
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    timer.userDate = selectedDates[0];
    if (timer.isFutureDate()) timer.enableInterface(true);
  },
};

flatpickr('#datetime-picker', options);

timer.elements.button.addEventListener('click', timer.setTimer.bind(timer));
