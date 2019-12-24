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

