import {
  EyeHandler,
  FormInput,
  PasswordValidatorStratgy,
  Regex,
  TextValidatorStratgy,
} from "../../models/FormValidator";
import "../../styles/index.css";

import intlTelInput from "intl-tel-input";

const textValidator = new TextValidatorStratgy();
const passwordValidator = new PasswordValidatorStratgy();
const LoginInputs: FormInput[] = [
  new FormInput("first_name", textValidator, [
    {
      condition: (value: string) => Regex.notEmpty.test(value.trim()),
      msg: "Please enter your first name.",
    },
    {
      condition: (value: string) => Regex.onlyCharacters.test(value.trim()),
      msg: "First name can only contain letters.",
    },
    {
      condition: (value: string) => value.trim().length <= 50,
      msg: "First name must be at least 50 characters long.",
    },
  ]),
  new FormInput("last_name", textValidator, [
    {
      condition: (value: string) => Regex.notEmpty.test(value.trim()),
      msg: "Please enter your last name.",
    },
    {
      condition: (value: string) => Regex.onlyCharacters.test(value.trim()),
      msg: "Last name can only contain letters.",
    },
    {
      condition: (value: string) => value.trim().length <= 50,
      msg: "Last name must be at least 50 characters long.",
    },
  ]),
  new FormInput("phone_number", textValidator, [
    {
      condition: (value: string) =>
        Regex.phoneNumbers.test(value.trim()) && value.trim().length >= 10,
      msg: "Phone numbers must start with country code and must be at least 10 digits long.",
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

const main = () => {
  for (const input of LoginInputs) {
    input.ActivateEvent("keyup");
    input.ActivateEvent("focus");
    input.ActivateEvent("blur");
  }

  document.querySelector("#password_eye").addEventListener("click", EyeHandler);

  const phoneInput: HTMLInputElement = document.querySelector("#phone_number");
  const iti = intlTelInput(phoneInput, {
    initialCountry: "auto",
    geoIpLookup: (callback: Function) => {
      callback("sa");
    },
  });
  phoneInput.addEventListener("countrychange", () => {
    if (iti.getSelectedCountryData().dialCode) {
      phoneInput.value = `+${iti.getSelectedCountryData().dialCode}`;
      if (
        !phoneInput.value.indexOf(`+${iti.getSelectedCountryData().dialCode}`)
      ) {
        return;
      }
    }
  });
};

main();
