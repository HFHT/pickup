import { XCircle } from "../assets"

export const handleBrokenImage = (element: any, classes?: string) => {
    if (element.target.classList.contains('svgBroken')) return;
    element.target.src = XCircle;
    element.target.classList.add('svgBroken');
    classes && element.target.classList.add(classes);
    element.target.title = 'Broken link to image!';
}