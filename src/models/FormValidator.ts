export const Regex = {
  notEmpty: /\S/,
  noSpace: /^\S*$/,
  hasOneUpperCase: /[A-Z]+/,
  hasOneLowerCase: /[a-z]+/,
  hasOneSpecialChar: /.*[.,!?@#$%^&*()_+\-={}\[\]\|:;'<,>.\\\/]+.*/,
  hasOneNumber: /\d+/,
  email:
    /^(?=.{1,150}$)([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
  onlyCharacters: /^[ \u0600-\u06FF\u0750-\u077F\p{L}]+$/u,
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
  exceptSpaceMaxTitle:
    /^[\u0621-\u064AA-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\x{0,50}]+$/g,
  exceptArMaxTitle: /^[A-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,50}]+$/g,
  exceptArMaxShortTitle: /^[A-Za-z0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,15}]+$/g,
  exceptEnMaxShortTitle:
    /^[\u0621-\u064A0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,15}]+$/g,
  exceptEnMaxTitle: /^[\u0621-\u064A0-9.&!@#%=_*+-?^~/${}()|[\]\\ x{0,50}]+$/g,
  charNumbers: /^[\u0621-\u064AA-Za-z0-9\s]+$/,
  uppercaseEnLetters: /^[A-Z]+$/,
  enNumberMaxShortTitle: /^[A-Za-z0-9 x{0,15}]+$/,
  arNumberMaxShortTitle: /^[\u0621-\u064A0-9 x{0,15}]+$/,
  twoDecimalPlaces: /(^\d{1,13})+(\.\d{0,2})?$/,
  phoneNumbers: /^\+(?:[0-9] ?){6,14}(?:[- ]?[0-9]+){0,2}$/,
  url: /^(http|https):\/\/[\S]+(\.[\S]+)+[/#?]?.*$/,
};

export interface TIdInput extends HTMLInputElement {
  isValid?: boolean;
  tId?: string;
}

export class HtmlEl {
  private element: HTMLElement;
  constructor(
    tagName: keyof HTMLElementTagNameMap,
    textContent: string,
    classes: string[] = []
  ) {
    const el = document.createElement(tagName);
    el.classList.add(...classes);
    el.textContent = textContent;
    this.element = el;
  }

  get Element(): HTMLElement {
    return this.element;
  }
}

export interface IValidatorStratgy {
  getErrorElements(
    validators: Validator[],
    value: string,
    inputElement?: TIdInput
  ): HTMLElement[];
}

export class PasswordValidatorStratgy implements IValidatorStratgy {
  getErrorElements(
    validators: Validator[],
    value: string,
    inputElement?: TIdInput
  ): HTMLElement[] {
    let isPasswordValid: boolean = false;
    ((): void => {
      for (let i = 0; i < validators.length; i++) {
        const condition = validators[i].condition(value);
        if (!condition) {
          isPasswordValid = false;
          return;
        }
        isPasswordValid = true;
      }
    })();

    const arr = [];
    for (const validator of validators) {
      const condition = validator.condition(value);
      arr.push(
        new HtmlEl("small", validator.msg, [
          "col-span-1",
          "last-of-type:col-span-2",
          `${condition ? "succes_check" : "fail_check"}`,
        ]).Element
      );
    }
    inputElement.isValid = isPasswordValid;
    return arr;
  }
}

export class TextValidatorStratgy implements IValidatorStratgy {
  getErrorElements(
    validators: Validator[],
    value: string,
    inputElement?: TIdInput
  ): HTMLElement[] {
    for (const validator of validators) {
      const condition = validator.condition(value);
      if (!condition) {
        inputElement.isValid = false;
        return [new HtmlEl("small", validator.msg, ["text-[#FF8C67]"]).Element];
      }
      inputElement.isValid = true;
    }
  }
}

export class PhoneNumberValidatorStratgy implements IValidatorStratgy {
  getErrorElements(
    validators: Validator[],
    value: string,
    inputElement: TIdInput
  ): HTMLElement[] {
    const dialCodeBoxValue: string = document
      .querySelector(".dial-code-box")
      .innerHTML.trim();
    inputElement.value = value.replace(dialCodeBoxValue, "");

    for (const validator of validators) {
      const condition = validator.condition(
        `${dialCodeBoxValue}${value.replace(dialCodeBoxValue, "")}`
      );
      if (!condition) {
        inputElement.isValid = false;
        return [new HtmlEl("small", validator.msg, ["text-[#FF8C67]"]).Element];
      }
      inputElement.isValid = true;
    }
  }
}

export type Validator = {
  condition: Function;
  msg: string;
};

export class FormInput {
  private element: TIdInput;
  private inputInfoElement: HTMLElement;
  private elementContainer: HTMLElement;
  private placeHolderValue: string;

  constructor(
    public tId: string,
    private validatorType: IValidatorStratgy,
    private validators: Validator[],
    private isRequired: boolean = true
  ) {
    this.element = document.querySelector(`[tid="${tId}"]`);
    this.inputInfoElement = document.querySelector(
      `[tid="${tId}"]~div.input_info`
    )!;
    this.elementContainer = document.querySelector(
      `[tid="${tId}"]`
    ).parentElement!;
    this.placeHolderValue = document
      .querySelector(`[tid="${tId}"]`)
      .parentElement.querySelector(`label[for="${tId}"]`)
      .textContent.trim()
      .replace(/\s+/g, " ")
      .replace(/\n|\r/g, "")
      .trim();

    this.element.isValid = !isRequired;

    if (!this.element) throw new Error("Invalid element");
  }

  public AddValidator(validator: Validator): void {
    this.validators.push(validator);
  }

  public checkInputChange(): void {
    let InfoElements: HTMLElement[] = [];
    InfoElements = this.validatorType.getErrorElements(
      this.validators,
      this.element.value,
      this.element
    );

    Helpers.ShowErrorMessage(InfoElements, this.inputInfoElement);
  }

  public focusInput(): void {
    if (this.elementContainer.classList.contains("active")) {
      return;
    }
    this.elementContainer.classList.add("active");
    this.element.placeholder = "";
  }

  public blurInput(): void {
    if (this.element.value.trim()) {
      return;
    }
    this.element.value = "";
    this.elementContainer.classList.remove("active");
    this.element.placeholder = this.placeHolderValue;
  }

  public ActivateEvent(
    event: keyof HTMLElementEventMap,
    metohde: Function
  ): void {
    this.element.addEventListener(event, () => {
      metohde();
      // // if (event === "keyup");
      // if (event === "focus") this.focusInput();
      // if (event === "blur") {
      //   this.blurInput();
      //   this.checkInputChange();
      // }
    });
  }
}

export class Helpers {
  public static ShowErrorMessage(
    infoElements: HTMLElement[],
    infoElementsContainer: HTMLElement
  ) {
    infoElementsContainer.innerHTML = "";
    for (const el of infoElements) {
      infoElementsContainer.appendChild(el);
    }
  }
}

export const EyeHandler = () => {
  let passwordInput = document.querySelector(`[tid="password"]`)!;
  let eyeIcon = passwordInput.parentElement.querySelector("img");
  if (passwordInput.getAttribute("type") === "password") {
    passwordInput.setAttribute("type", "text");
    eyeIcon.src = eyeIcon.src.replace("openEye.svg", "closeEye.svg");
  } else {
    passwordInput.setAttribute("type", "password");
    eyeIcon.src = eyeIcon.src.replace("closeEye.svg", "openEye.svg");
  }
};

export class FormValidator {
  private form: HTMLFormElement;
  private inputs: TIdInput[] = [];
  private submitBtn: HTMLInputElement;

  constructor(formId: string) {
    this.form = document.querySelector(`[formId="${formId}"]`)!;
    this.form
      .querySelectorAll(`input:not([type="submit"]):not([type="checkbox"])`)!
      .forEach((input: TIdInput) => {
        this.inputs.push(input as TIdInput);
      });
    this.submitBtn = this.form.querySelector(`input[type="submit"]`)!;
  }

  private CheckFormValidation = (): void => {
    setTimeout(() => {
      for (let i = 0; i < this.inputs.length; i++) {
        const input: TIdInput = this.inputs[i];
        if (!input.isValid) {
          this.submitBtn.disabled = true;
          return;
        }
        this.submitBtn.disabled = false;
      }
    }, 50);
  };

  public ActivateEvent(event: keyof HTMLElementEventMap): void {
    this.form.addEventListener(event, () => {
      this.CheckFormValidation();
    });
  }
}
