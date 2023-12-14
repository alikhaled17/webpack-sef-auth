import {
  EyeHandler,
  FormInput,
  Regex,
  TextValidatorStratgy,
} from "../../models/FormValidator";
import "../../styles/font.css";
import "../../styles/index.css";

const textValidator = new TextValidatorStratgy();

const LoginInputs: FormInput[] = [
  new FormInput("email", textValidator, [
    {
      condition: (value: string) => Regex.notEmpty.test(value.trim()),
      msg: "Please enter your email or phone number.",
    },
    {
      condition: (value: string) =>
        Regex.email.test(value.trim()) || Regex.phoneNumbers.test(value.trim()),
      msg: "Invalid email or phone number format. Please check and try again.",
    },
  ]),
  new FormInput("password", textValidator, [
    {
      condition: (value: string) => Regex.notEmpty.test(value),
      msg: "Please enter your password.",
    },
    {
      condition: (value: string) => Regex.passwordRegex.test(value),
      msg: "Incorrect password. Please check and try again.",
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
};

main();
