import { nanoid } from "nanoid";
import { CarouselRubricResourceCard, CriteriaTemplateSegment, ToastType, ToastWithId } from "../types";
import { Rubric } from "../types/rubric";
import { classList } from "react-common/components/util";
import { CatalogCriteria } from "../types/criteria";

export function makeToast(type: ToastType, text: string, timeoutMs: number = 5000): ToastWithId {
    return {
        id: nanoid(),
        type,
        text,
        timeoutMs,
    };
}

// example: embedUrl for arcade is: https://arcade.makecode.com/
export const getEditorUrl = (embedUrl: string) => {
    if (!pxt.webConfig && (window as any).pxtConfig) pxt.setupWebConfig((window as any).pxtConfig);
    // relprefix is something like: "/--"
    if (pxt.webConfig?.targetUrl && pxt.webConfig?.relprefix) {
        return pxt.webConfig.targetUrl + pxt.webConfig.relprefix.substr(0, pxt.webConfig.relprefix.length - 3);
    }
    // if  there is something at the end of the url, that is what path would be set to
    // example: https://arcade.makecode.com/abc123 and this would get returned
    const path = /\/([\da-zA-Z\.]+)(?:--)?/i.exec(window.location.pathname);
    return `${embedUrl.replace(/\/$/, "")}/${path?.[1] || ""}`;
};

export function classes(css: { [name: string]: string }, ...names: string[]) {
    return classList(...names.map(n => css[n]));
}

export function makeRubric(): Rubric {
    return {
        name: "",
        criteria: [],
    };
}

export const isRubricResourceCard = (card: any): card is CarouselRubricResourceCard => {
    return typeof card === "object" && card.cardType === "rubric-resource";
};

export function getProjectLink(inputText: string): string {
    const hasMakeCode = inputText?.indexOf("makecode") !== -1;
    return hasMakeCode ? inputText : `https://makecode.com/${inputText}`;
}

export function splitCriteriaTemplate(template: string): CriteriaTemplateSegment[] {
    // Split by the regex, which will give us an array where every other element is a parameter.
    // If the template starts with a parameter, the first element will be an empty string.
    const paramRegex = /\$\{([\w\s]+)\}/g;
    const parts = template.split(paramRegex);

    const segments: CriteriaTemplateSegment[] = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        if (part) {
            if (i % 2 === 0) {
                segments.push({ type: "plain-text", content: part.trim() });
            } else {
                segments.push({ type: "param", content: part.toLocaleLowerCase().trim() });
            }
        }
    }

    return segments;
}

export function getReadableCriteriaTemplate(criteria: CatalogCriteria): string {
    return criteria.template.replaceAll("${", "").replaceAll("}", "");
}
