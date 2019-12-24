import { attributeValue, hasAttribute, isTagType } from '../util';

const dummyTag1 = {
    attributes: [
        {
            key: 'text',
            value: 'some text'
        }
    ],
    type: 'dummyTag',
    tagName: 'dummy'
};

const dummyTag2 = {
    attributes: [
        {
            key: 'text',
            value: 'some text'
        }
    ]
};

test('hasAttribute', () => {
    expect(hasAttribute(dummyTag1, 'text')).toBeTruthy();
    expect(hasAttribute(dummyTag1, 'text', 'some text')).toBeTruthy();
    
    expect(hasAttribute(dummyTag1, 'fancy key')).toBeFalsy();
    expect(hasAttribute(dummyTag1, 'text', 'wrong value')).toBeFalsy();
});

test('attributeValue', () => {
    expect(attributeValue(dummyTag1, 'text')).toBe('some text');

    expect(() => {
        attributeValue(dummyTag1, 'fancy key');
    }).toThrow();
});

test('isTagType', () => {
    expect(isTagType(dummyTag1, 'dummyTag')).toBeTruthy();
    expect(isTagType(dummyTag1, 'dummyTag', 'dummy')).toBeTruthy();
    expect(isTagType(dummyTag1, 'smartTag')).toBeFalsy();
    expect(isTagType(dummyTag1, 'dummyTag', 'smart')).toBeFalsy();
    expect(isTagType(dummyTag2, 'dummyTag')).toBeFalsy();
});

