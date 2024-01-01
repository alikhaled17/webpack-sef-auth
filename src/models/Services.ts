export class Modal {
  private popup: HTMLDivElement;
  constructor(popId: string) {
    this.popup = document.getElementById(`${popId}`)! as HTMLDivElement;
  }

  public show(): void {
    this.popup.style.display = "block";
  }
  public hide(): void {
    this.popup.style.display = "none";
  }

  get Popup(): HTMLDivElement {
    return this.popup;
  }
}
