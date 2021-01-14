import { Pipe, PipeTransform } from '@angular/core'

//string ubacuje u div i tako prevodi unicode karaktere zaobilazeci safety create a pipe that parses HTML entities
@Pipe({name: "decodeHtmlString"})
export class DecodeHtmlString implements PipeTransform {
    transform(value: string) {
        const tempElement = document.createElement("div")
        tempElement.innerHTML = value
        return tempElement.innerText
    }
}