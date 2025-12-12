export function validateInputs(form: HTMLDivElement): boolean {
    for(const child of form.children) {
        if (child.classList.contains("input") || child.classList.contains("file-input")) {
            if(!(child as HTMLInputElement).reportValidity()) {
                return false;
            }
        }
    }

    return true;
}