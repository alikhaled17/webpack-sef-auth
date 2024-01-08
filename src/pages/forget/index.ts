import {
  EyeHandler,
  FormInput,
  Regex,
  TextValidatorStratgy,
} from "../../models/FormValidator";

import { FormValidator } from "../../models/FormValidator";
import { Modal } from "../../models/Services";

const textValidator = new TextValidatorStratgy();

const FormInputs: FormInput[] = [
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
];

// window.addEventListener("beforeunload", (e) => {
//   console.log("asas");
//   alert("asas");
// });

const main = () => {
  // form validation checker
  for (const input of FormInputs) {
    input.ActivateEvent("focus", () => input.focusInput());
    input.ActivateEvent("keyup", () => input.checkInputChange());
    input.ActivateEvent("blur", () => {
      input.checkInputChange();
      input.blurInput();
    });
  }
  const SignInForm = new FormValidator("forget");
  SignInForm.ActivateEvent("keyup");

  // back button handler
  const backPopUp = new Modal("back_modal");
  document.querySelector("#back_btn").addEventListener("click", () => {
    SignInForm.form.isChanged ? backPopUp.show() : window.history.back();
  });
  backPopUp.Popup.querySelector("#cancel").addEventListener("click", () => {
    backPopUp.hide();
  });
  backPopUp.Popup.querySelector("#confirm").addEventListener("click", () => {
    window.history.back();
  });
};

main();
