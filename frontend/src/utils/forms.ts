export function validateDemoForm(form: HTMLFormElement): boolean {
  for (const field of Array.from(form.elements)) {
    if (!(
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    ))
      continue;
    field.setCustomValidity(
      field.required && !field.value.trim()
        ? "Please enter a value, not only spaces."
        : "",
    );
  }
  return form.reportValidity();
}
export function clearFormValidation(form: HTMLFormElement) {
  for (const field of Array.from(form.elements)) {
    if (
      field instanceof HTMLInputElement ||
      field instanceof HTMLTextAreaElement ||
      field instanceof HTMLSelectElement
    )
      field.setCustomValidity("");
  }
}
