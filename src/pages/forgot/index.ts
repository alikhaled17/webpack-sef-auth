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

const main = () => {
  // form validation checker
  for (const input of FormInputs) {
    input.ActivateEvent("focus", () => input.focusInput());
    input.ActivateEvent("blur", () => {
      input.checkInputChange();
      input.blurInput();
    });
  }
  const ForgotForm = new FormValidator("forgot");
  ForgotForm.ActivateEvent("change");

  ForgotForm.submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const LoaderImage: HTMLImageElement =
      ForgotForm.submitBtn.parentElement.querySelector(".loader")!;
    ForgotForm.submitBtn.disabled = true;
    ForgotForm.submitBtn.value = "";
    LoaderImage.classList.add("isLoading");

    setTimeout(() => {
      ForgotForm.submitBtn.disabled = false;
      ForgotForm.submitBtn.value = "Submit";
      LoaderImage.classList.remove("isLoading");
    }, 300);
  });

  // back button handler
  const backPopUp = new Modal("back_modal");
  document.querySelector("#back_btn").addEventListener("click", () => {
    ForgotForm.form.isChanged ? backPopUp.show() : window.history.back();
  });
  backPopUp.Popup.querySelector("#cancel").addEventListener("click", () => {
    backPopUp.hide();
  });
  backPopUp.Popup.querySelector("#confirm").addEventListener("click", () => {
    window.history.back();
  });
};

main();
