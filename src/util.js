import {
    either,
    anyPass,
    curry,
    __
} from 'ramda';

const isIcon = (type) => type === 'GraphicIcon';

const isText = (type) => type === 'Text';

const isCloned = (name) => name.indexOf('Cloned') !== -1;

const isClonedText = ({ type, name }) => isText(type) && isCloned(name);

const isClonedIcon = ({ type, name }) => isIcon(type) && isCloned(name);

const isUserAddedIcon = ({ name }) => name.match(/User Added Graphic/);

const isDesignerAddedIcon = ({ name }) => name.match(/Designer Added Icon [0-9]+/);

const isUserOrDesignerAddedIcon = (feature) => either(isUserAddedIcon, isDesignerAddedIcon)(feature);

const isUserAddedText = ({ name }) => name.match(/User Added Text/);

const isDesignerAddedText = ({ name }) => name.match(/Designer Added Text [0-9]+/);

const getFeatureName = (f, counter) => {
    if (either(isUserOrDesignerAddedIcon, isClonedIcon)(f)) {
        return `Designer Added Icon ${counter[f.positionName]['icon']++}`;
    }

    if (anyPass([isUserAddedText, isDesignerAddedText, isClonedText])(f)) {
        return `Designer Added Text ${counter[f.positionName]['text']++}`;
    }
    return f.name;
};

const getDesignerAddedFeatureName = (features) => {
    // keeps count of designer added features added to each position
    // for naming purposes, e.g. Designer Added Icon #
    const designerAddedCounter = features
        .map(({ positionName }) => positionName)
        .reduce((acc, positionName) =>
            Object.assign({}, acc, { [positionName]: { icon: 1, text: 1 } }), {}
        );

    return curry(getFeatureName)(__, designerAddedCounter);
};

const isBackgroundFeature = ({ name }) => name === 'Background';

const isDesignerAddedFeature = ({ name }) => name.startsWith('Designer Added');

const obtainUpdatedBackgroundAndDesignerFeatures = (features) => {
    const backgroundFeatures = features
        .filter(isBackgroundFeature)
        .map((feature) =>
            Object.assign({}, feature, { linked: false, user_specific_information: true })
        );
    const designerAddedFeatures = features
        .filter(isDesignerAddedFeature)
        .map((feature) =>
            Object.assign({}, feature, { linked: false, user_specific_information: false })
        );
    const remainingFeatures = features
        .filter((feature) =>
            !isBackgroundFeature(feature) && !(isDesignerAddedFeature(feature))
        )
        .map((feature) =>
            Object.assign({}, feature, { linked: true, user_specific_information: true })
        );

    return backgroundFeatures.concat(designerAddedFeatures, remainingFeatures);
};

const downloadObjectAsFile = (JSObject, fileName) => {
    // We will use a Blob here with objectURL as the data URL limit is 2MB, object URL limit is 500MB
    const JSONString = JSON.stringify(JSObject, null, 2);

    const themeFileBlob = new File([JSONString], fileName, { type: 'application/json' });

    const themeObjectURL = URL.createObjectURL(themeFileBlob);

    const themeSaveLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');

    themeSaveLink.href = themeObjectURL;
    themeSaveLink.download = fileName;

    themeSaveLink.dispatchEvent(new MouseEvent('click'));
};

export {
    getDesignerAddedFeatureName,
    obtainUpdatedBackgroundAndDesignerFeatures,
    downloadObjectAsFile
};
