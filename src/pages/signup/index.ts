import {
  EyeHandler,
  FormInput,
  FormValidator,
  PasswordValidatorStratgy,
  PhoneNumberValidatorStratgy,
  Regex,
  TextValidatorStratgy,
} from "../../models/FormValidator";
import intlTelInput from "intl-tel-input";

const textValidator = new TextValidatorStratgy();
const passwordValidator = new PasswordValidatorStratgy();
const phoneValidator = new PhoneNumberValidatorStratgy();

const LoginInputs: FormInput[] = [
  new FormInput(
    "first_name",
    textValidator,
    [
      {
        condition: (value: string) => Regex.notEmpty.test(value.trim()),
        msg: "Please enter your first name.",
      },
      {
        condition: (value: string) => value.trim().length <= 25,
        msg: "First name must be at least 25 characters long.",
      },
    ],
    false
  ),
  new FormInput("last_name", textValidator, [
    {
      condition: (value: string) => value.trim().length <= 25,
      msg: "Last name must be at least 25 characters long.",
    },
  ]),
  new FormInput("phone_number", phoneValidator, [
    {
      condition: (value: string) =>
        Regex.phoneNumbers.test(value.trim()) &&
        value.trim()?.length >= 8 &&
        value.trim()?.length <= 16,
      msg: "Phone numbers must be at least 10 digits long.",
    },
  ]),
  new FormInput("email", textValidator, [
    {
      condition: (value: string) => Regex.notEmpty.test(value.trim()),
      msg: "Please enter your email.",
    },
    {
      condition: (value: string) => Regex.email.test(value.trim()),
      msg: "Invalid email. Please check and try again.",
    },
  ]),
  new FormInput("password", passwordValidator, [
    {
      condition: (value: string) => value.trim().length >= 8,
      msg: "Minimum Length : 8 characters",
    },
    {
      condition: (value: string) => Regex.hasOneNumber.test(value),
      msg: "Numbers",
    },
    {
      condition: (value: string) => Regex.hasOneUpperCase.test(value),
      msg: "Uppercase Letters",
    },
    {
      condition: (value: string) => Regex.hasOneLowerCase.test(value),
      msg: "Lowercase Letters",
    },
    {
      condition: (value: string) => Regex.hasOneSpecialChar.test(value),
      msg: "Special Characters : e.g (.,!,@,#)",
    },
  ]),
];

const addingDialCode = (code: string): void => {
  if (document.querySelector(".dial-code-box")) {
    document.querySelector(".dial-code-box").innerHTML = code;
    return;
  }
  const flagContainer: HTMLElement = document.querySelector(
    ".iti__selected-flag"
  );
  let dialCode: HTMLElement = document.createElement("span");
  dialCode.style.padding = `0 5px `;
  dialCode.innerHTML = code;
  dialCode.classList.add("dial-code-box");
  flagContainer.style.width = "90px";
  flagContainer.appendChild(dialCode);
};

const main = () => {
  // form validation checker
  for (const input of LoginInputs) {
    input.ActivateEvent("focus", () => input.focusInput());
    if (input.tId === "password") {
      input.ActivateEvent("blur", () => input.blurInput());
      input.ActivateEvent("keyup", () => input.checkInputChange());
    } else {
      input.ActivateEvent("blur", () => {
        input.focusInput();
        input.checkInputChange();
      });
    }
  }
  const SignUpForm = new FormValidator("signup");
  SignUpForm.ActivateEvent("change");

  // phone number input handler
  const phoneInput: HTMLInputElement = document.querySelector("#phone_number");
  const iti = intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: (callback: Function) => {
      callback("sa");
    },
  });
  phoneInput.addEventListener("countrychange", () => {
    if (iti.getSelectedCountryData().dialCode) {
      addingDialCode(`+${iti.getSelectedCountryData().dialCode}`);
    }
  });
  phoneInput.addEventListener("input", () => {
    const filteredValue = phoneInput.value.replace(/[^0-9]/g, "");
    phoneInput.value = filteredValue;
  });

  // password eye handler
  document.querySelector("#password_eye").addEventListener("click", EyeHandler);
};

main();
