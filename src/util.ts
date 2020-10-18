import { parse } from 'himalaya';

export function hasAttribute(tag: any, key: string, value?: string): boolean {
    if (!tag.attributes || !tag.attributes.length) {
        return false;
    }
    return tag.attributes.find((attr: any) => {
        if (attr.key !== key) {
            return false;
        }
        if (value && attr.value !== value) {
            return false;
        }
        return true;
    }) !== undefined;
}

export function attributeValue(tag: any, key: string): string {
    const attribute = tag.attributes.find((attr: any) => attr.key === key);
    if (!attribute) {
        throw new Error(`Couldn't find the attribute ${key}`);
    }
    return attribute.value;
}

export function isTagType(tag: any, type: string, name?: string): boolean {
    if (tag.type !== type) {
        return false;
    }
    if (name && tag.tagName !== name) {
        return false;
    }
    return true;
}

export function flattenText(children: Array<any>): string {
    let text = "";
    for (const child of children) {
        if (child.type === 'text') {
            text += child.content;
        } else if (child.children) {
            text += flattenText(child.children);
        }
    }
    return text;
}

export function extractComponentData(htmlString: string): any {
    const html = parse(htmlString).find((element: any) => isTagType(element, 'element', 'html'));
    const body = html.children.find((element: any) => isTagType(element, 'element', 'body'));
    if (!body) {
        throw new Error('Cannot find the body tag. SpanishDict API might have changed');
    }
    const dataComponentFindFn = (element: any): any => {
      for (const child of element.children ?? []) {
        if (isTagType(child, 'element', 'script') && child.children?.length) {
          const grandResult = dataComponentFindFn(child);
          if (grandResult) {  // find it
            return grandResult;
          }
        }
        if (child.type === 'text' && child.content.includes('SD_COMPONENT_DATA')) {
          return child;
        }
      }
    };
    const resultTag = dataComponentFindFn(body);
    if (!resultTag) {
        throw new Error('Cannot find the tag with results. SpanishDict API might have changed');
    }
    const resultsLine = resultTag.content.split('\n').find((line: string) => line.includes('SD_COMPONENT_DATA'));
    return JSON.parse(resultsLine.substring(resultsLine.indexOf('=') + 1,
                                            resultsLine.length - 1));
}
