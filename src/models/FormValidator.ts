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
  getErrorElements(validators: Validator[], value: string): HTMLElement[];
}

export class PasswordValidatorStratgy implements IValidatorStratgy {
  getErrorElements(validators: Validator[], value: string): HTMLElement[] {
    const arr = [];
    for (const validator of validators) {
      const condition = validator.condition(value);
      arr.push(
        new HtmlEl("small", validator.msg, [
          "col-span-1",
          `${condition ? "succes_check" : "fail_check"}`,
        ]).Element
      );
    }
    return arr;
  }
}

export class TextValidatorStratgy implements IValidatorStratgy {
  getErrorElements(validators: Validator[], value: string): HTMLElement[] {
    for (const validator of validators) {
      const condition = validator.condition(value);
      if (!condition)
        return [new HtmlEl("small", validator.msg, ["text-[#FF8C67]"]).Element];
    }
  }
}

export type Validator = {
  condition: Function;
  msg: string;
};

export class FormInput {
  private element: HTMLInputElement;
  private inputInfoElement: HTMLElement;
  private elementContainer: HTMLElement;
  private placeHolderValue: string;

  constructor(
    tId: string,
    private validatorType: IValidatorStratgy,
    private validators: Validator[]
  ) {
    this.element = document.querySelector(`[tid="${tId}"]`)!;
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

    if (!this.element) throw new Error("Invalid element");
  }

  public AddValidator(validator: Validator): void {
    this.validators.push(validator);
  }

  private checkInputChange(): void {
    console.log("Hello", this.element.value);

    let InfoElements: HTMLElement[] = [];

    InfoElements = this.validatorType.getErrorElements(
      this.validators,
      this.element.value
    );
    Helpers.ShowErrorMessage(InfoElements, this.element, this.inputInfoElement);
  }

  private focusInput(): void {
    if (this.elementContainer.classList.contains("active")) {
      return;
    }
    this.elementContainer.classList.add("active");
    this.element.placeholder = "";
  }

  private blurInput(): void {
    if (this.element.value.trim()) {
      return;
    }
    this.element.value = "";
    this.elementContainer.classList.remove("active");
    this.element.placeholder = this.placeHolderValue;
  }

  public ActivateEvent(event: keyof HTMLElementEventMap): void {
    this.element.addEventListener(event, () => {
      if (event === "keyup") this.checkInputChange();
      if (event === "focus") this.focusInput();
      if (event === "blur") this.blurInput();
    });
  }
}

export class Helpers {
  public static ShowErrorMessage(
    infoElements: HTMLElement[],
    element: HTMLInputElement,
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
