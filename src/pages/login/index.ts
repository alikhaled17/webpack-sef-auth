import {
  EyeHandler,
  FormInput,
  Regex,
  TextValidatorStratgy,
} from "../../models/FormValidator";

import { FormValidator } from "../../models/FormValidator";
import { Modal } from "../../models/Services";

const textValidator = new TextValidatorStratgy();

const LoginInputs: FormInput[] = [
  new FormInput("email", textValidator, [
    {
      condition: (value: string) => Regex.notEmpty.test(value.trim()),
      msg: "Please enter your email.",
    },
    {
      condition: (value: string) =>
        Regex.email.test(value.trim()) || Regex.phoneNumbers.test(value.trim()),
      msg: "Invalid email format. Please check and try again.",
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

// window.addEventListener("beforeunload", (e) => {
//   console.log("asas");
//   alert("asas");
// });

const main = () => {
  // form validation checker
  for (const input of LoginInputs) {
    input.ActivateEvent("focus", () => input.focusInput());
    input.ActivateEvent("blur", () => {
      input.checkInputChange();
      input.blurInput();
    });
  }
  const SignInForm = new FormValidator("signin");
  SignInForm.ActivateEvent("change");

  // password eye handler
  document.querySelector("#password_eye").addEventListener("click", EyeHandler);

  // back button handler
  const backPopUp = new Modal("back_modal");
  document.querySelector("#back_btn").addEventListener("click", () => {
    backPopUp.show();
  });
  backPopUp.Popup.querySelector("#cancel").addEventListener("click", () => {
    backPopUp.hide();
  });
  backPopUp.Popup.querySelector("#confirm").addEventListener("click", () => {
    window.history.back();
  });
};

main();
